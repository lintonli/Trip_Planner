import React, { useState } from 'react';
import {
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Box,
  Alert,
  CircularProgress,
  Stepper,
  Step,
  StepLabel,
  Card,
  CardContent,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import { LocalShipping, Route, Speed, Schedule, Security } from '@mui/icons-material';
import { truckerAPI } from '../services';
import type { TripRequest, TripResponse } from '../utils/types';
import { SORTED_LOCATIONS } from '../utils/locations';

interface TripPlannerProps {
  onTripPlanned: (tripResponse: TripResponse) => void;
}

const TripPlanner: React.FC<TripPlannerProps> = ({ onTripPlanned }) => {
  const [formData, setFormData] = useState<TripRequest>({
    current_location: '',
    pickup_location: '',
    dropoff_location: '',
    current_cycle_used: 0,
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeStep, setActiveStep] = useState(0);

  const steps = [
    'Validating locations',
    'Calculating optimal route',
    'Checking HOS compliance',
    'Generating daily logs',
    'Finalizing trip plan'
  ];

  const handleLocationChange = (field: keyof Pick<TripRequest, 'current_location' | 'pickup_location' | 'dropoff_location'>) => (
    event: any
  ) => {
    const value = event.target.value;
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleInputChange = (field: keyof TripRequest) => (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = field === 'current_cycle_used' ? 
      parseFloat(event.target.value) || 0 : 
      event.target.value;
    
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setError(null);
    setActiveStep(0);

    try {
      // Simulate step progression
      const stepInterval = setInterval(() => {
        setActiveStep(prev => {
          if (prev < steps.length - 1) {
            return prev + 1;
          }
          clearInterval(stepInterval);
          return prev;
        });
      }, 1000);

      const response = await truckerAPI.planTrip(formData);
      clearInterval(stepInterval);
      setActiveStep(steps.length - 1);
      
      setTimeout(() => {
        onTripPlanned(response);
      }, 500);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to plan trip');
      setActiveStep(0);
    } finally {
      setLoading(false);
    }
  };

  const features = [
    {
      icon: <Route color="primary" />,
      title: 'Smart Routing',
      description: 'Optimized routes for commercial vehicles'
    },
    {
      icon: <Schedule color="primary" />,
      title: 'HOS Compliance',
      description: 'Automatic Hours of Service validation'
    },
    {
      icon: <Security color="primary" />,
      title: 'FMCSA Compliant',
      description: 'Meets all federal regulations'
    },
    {
      icon: <Speed color="primary" />,
      title: 'Real-time Updates',
      description: 'Live traffic and route optimization'
    }
  ];

  return (
    <Box sx={{ 
      minHeight: '100vh',
      width: '100%',
      bgcolor: 'background.default',
      py: 2,
    }}>
      <Container 
        maxWidth={false} 
        sx={{ 
          px: { xs: 2, sm: 3, md: 4, lg: 5, xl: 6 },
          width: '100%',
          mx: 0
        }}
      >
        {/* Header */}
        <Paper elevation={2} sx={{ p: 4, mb: 4, background: 'linear-gradient(135deg, #1976d2 0%, #42a5f5 100%)', color: 'white' }}>
          <Box display="flex" alignItems="center" mb={2}>
            <LocalShipping sx={{ fontSize: 40, mr: 2 }} />
            <Typography variant="h3" fontWeight="bold">
              ELD Trip Planner
            </Typography>
          </Box>
          <Typography variant="h6" sx={{ opacity: 0.9 }}>
            Professional trip planning with HOS compliance for commercial drivers
          </Typography>
        </Paper>

        <Box display="flex" gap={4} flexDirection={{ xs: 'column', lg: 'row' }}>
        {/* Main Form */}
        <Box flex={{ xs: 1, lg: 2 }}>
          <Paper elevation={3} sx={{ p: 4 }}>
            <Typography variant="h5" gutterBottom color="primary" fontWeight="bold">
              Plan Your Trip
            </Typography>

            {loading && (
              <Box mb={3}>
                <Stepper activeStep={activeStep} alternativeLabel>
                  {steps.map((label) => (
                    <Step key={label}>
                      <StepLabel>{label}</StepLabel>
                    </Step>
                  ))}
                </Stepper>
                <Box display="flex" justifyContent="center" mt={3}>
                  <CircularProgress size={40} />
                  <Typography ml={2} variant="body1" color="text.secondary">
                    {steps[activeStep]}...
                  </Typography>
                </Box>
              </Box>
            )}

            {error && (
              <Alert severity="error" sx={{ mb: 3 }}>
                {error}
              </Alert>
            )}

            <form onSubmit={handleSubmit}>
              <Box display="flex" flexDirection="column" gap={3}>
                <FormControl fullWidth required disabled={loading}>
                  <InputLabel id="current-location-label">Current Location</InputLabel>
                  <Select
                    labelId="current-location-label"
                    value={formData.current_location}
                    label="Current Location"
                    onChange={handleLocationChange('current_location')}
                  >
                    {SORTED_LOCATIONS.map((location) => (
                      <MenuItem key={location.value} value={location.label}>
                        {location.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>

                <Box display="flex" gap={2} flexDirection={{ xs: 'column', md: 'row' }}>
                  <FormControl fullWidth required disabled={loading}>
                    <InputLabel id="pickup-location-label">Pickup Location</InputLabel>
                    <Select
                      labelId="pickup-location-label"
                      value={formData.pickup_location}
                      label="Pickup Location"
                      onChange={handleLocationChange('pickup_location')}
                    >
                      {SORTED_LOCATIONS.map((location) => (
                        <MenuItem key={location.value} value={location.label}>
                          {location.label}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>

                  <FormControl fullWidth required disabled={loading}>
                    <InputLabel id="dropoff-location-label">Dropoff Location</InputLabel>
                    <Select
                      labelId="dropoff-location-label"
                      value={formData.dropoff_location}
                      label="Dropoff Location"
                      onChange={handleLocationChange('dropoff_location')}
                    >
                      {SORTED_LOCATIONS.map((location) => (
                        <MenuItem key={location.value} value={location.label}>
                          {location.label}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Box>

                <TextField
                  fullWidth
                  type="number"
                  label="Current Cycle Hours Used"
                  value={formData.current_cycle_used}
                  onChange={handleInputChange('current_cycle_used')}
                  placeholder="0"
                  helperText="Hours already used in your current 70-hour/8-day cycle"
                  inputProps={{ min: 0, max: 70, step: 0.5 }}
                  disabled={loading}
                />

                <Button
                  type="submit"
                  variant="contained"
                  size="large"
                  disabled={loading}
                  sx={{ 
                    py: 1.5,
                    fontSize: '1.1rem',
                    fontWeight: 'bold'
                  }}
                >
                  {loading ? 'Planning Trip...' : 'Plan Trip'}
                </Button>
              </Box>
            </form>
          </Paper>
        </Box>

        {/* Features Panel */}
        <Box flex={{ xs: 1, lg: 1 }}>
          <Box display="flex" flexDirection="column" gap={3}>
            <Typography variant="h6" fontWeight="bold" color="primary">
              Key Features
            </Typography>
            
            {features.map((feature, index) => (
              <Card key={index} elevation={2}>
                <CardContent>
                  <Box display="flex" alignItems="center" mb={1}>
                    {feature.icon}
                    <Typography variant="h6" ml={1} fontWeight="bold">
                      {feature.title}
                    </Typography>
                  </Box>
                  <Typography variant="body2" color="text.secondary">
                    {feature.description}
                  </Typography>
                </CardContent>
              </Card>
            ))}

            <Card elevation={2} sx={{ background: 'linear-gradient(135deg, #f5f5f5 0%, #e0e0e0 100%)' }}>
              <CardContent>
                <Typography variant="h6" fontWeight="bold" gutterBottom>
                  HOS Compliance Check
                </Typography>
                <Typography variant="body2" paragraph>
                  Our system automatically validates your trip against FMCSA Hours of Service regulations:
                </Typography>
                <Box component="ul" sx={{ pl: 2, m: 0 }}>
                  <Typography component="li" variant="body2">11-hour driving limit</Typography>
                  <Typography component="li" variant="body2">14-hour duty limit</Typography>
                  <Typography component="li" variant="body2">30-minute break requirements</Typography>
                  <Typography component="li" variant="body2">70-hour/8-day cycle limits</Typography>
                </Box>
              </CardContent>
            </Card>
          </Box>
        </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default TripPlanner;
