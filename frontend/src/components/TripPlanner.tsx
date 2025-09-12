import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Paper,
  Typography,
  TextField,
  Button,
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
import type { TripRequest } from '../utils/types';
import { SORTED_LOCATIONS } from '../utils/locations';

const TripPlanner: React.FC = () => {
  const navigate = useNavigate();
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
      
      // Store trip data in localStorage for the results page
      localStorage.setItem('tripData', JSON.stringify(response));
      
      setTimeout(() => {
        // Navigate to results page with trip ID
        navigate(`/results/${response.trip.id}`);
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
    <div style={{ 
      minHeight: '100vh',
      width: '100vw',
      backgroundColor: '#f5f5f5',
      padding: '16px 0',
    }}>
      <div style={{ 
        padding: '0 16px',
        width: '98%',
        margin: 0,
      }} className="responsive-container">
        {/* Header */}
        <Paper elevation={2} sx={{ p: 4, mb: 4, background: 'linear-gradient(135deg, #1976d2 0%, #42a5f5 100%)', color: 'white' }}>
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '16px' }}>
            <LocalShipping sx={{ fontSize: 40, mr: 2 }} />
            <Typography variant="h3" fontWeight="bold">
              ELD Trip Planner
            </Typography>
          </div>
          <Typography variant="h6" sx={{ opacity: 0.9 }}>
            Professional trip planning with HOS compliance for commercial drivers
          </Typography>
        </Paper>

        {/* Main Form */}
        <div className="mb-4">
          <Paper elevation={3} sx={{ p: 4 }}>
            <Typography variant="h5" gutterBottom color="primary" fontWeight="bold">
              Plan Your Trip
            </Typography>

            {loading && (
              <div style={{ marginBottom: '24px' }}>
                <Stepper activeStep={activeStep} alternativeLabel>
                  {steps.map((label) => (
                    <Step key={label}>
                      <StepLabel>{label}</StepLabel>
                    </Step>
                  ))}
                </Stepper>
                <div style={{ display: 'flex', justifyContent: 'center', marginTop: '24px' }}>
                  <CircularProgress size={40} />
                  <Typography ml={2} variant="body1" color="text.secondary">
                    {steps[activeStep]}...
                  </Typography>
                </div>
              </div>
            )}

            {error && (
              <Alert severity="error" sx={{ mb: 3 }}>
                {error}
              </Alert>
            )}

            <form onSubmit={handleSubmit}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
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

                <div className="form-row">
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
                </div>

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
              </div>
            </form>
          </Paper>
        </div>

        {/* Key Features - 4 columns below the form */}
        <div className="mb-4">
          <Typography variant="h6" fontWeight="bold" color="primary" gutterBottom>
            Key Features
          </Typography>
          
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
            gap: '16px',
            marginBottom: '24px'
          }}>
            {features.map((feature, index) => (
              <Card key={index} elevation={2}>
                <CardContent>
                  <div style={{ display: 'flex', alignItems: 'center', marginBottom: '8px' }}>
                    {feature.icon}
                    <Typography variant="h6" ml={1} fontWeight="bold">
                      {feature.title}
                    </Typography>
                  </div>
                  <Typography variant="body2" color="text.secondary">
                    {feature.description}
                  </Typography>
                </CardContent>
              </Card>
            ))}
          </div>

          <Card elevation={2} sx={{ background: 'linear-gradient(135deg, #f5f5f5 0%, #e0e0e0 100%)' }}>
            <CardContent>
              <Typography variant="h6" fontWeight="bold" gutterBottom>
                HOS Compliance Check
              </Typography>
              <Typography variant="body2" paragraph>
                Our system automatically validates your trip against FMCSA Hours of Service regulations:
              </Typography>
              <ul style={{ paddingLeft: '16px', margin: 0 }}>
                <Typography component="li" variant="body2">11-hour driving limit</Typography>
                <Typography component="li" variant="body2">14-hour duty limit</Typography>
                <Typography component="li" variant="body2">30-minute break requirements</Typography>
                <Typography component="li" variant="body2">70-hour/8-day cycle limits</Typography>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default TripPlanner;
