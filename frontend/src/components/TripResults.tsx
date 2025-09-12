import React from 'react';
import {
  Paper,
  Typography,
  Box,
  Card,
  CardContent,
  Chip,
  Alert,
  Button,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Container,
} from '@mui/material';
import {
  Route,
  Schedule,
  Warning,
  CheckCircle,
  LocalGasStation,
  RestaurantMenu,
  Timer,
  Speed,
  Download,
} from '@mui/icons-material';
import type { TripResponse } from '../utils/types';
import { truckerAPI } from '../services';
import RouteMap from './RouteMap';

interface TripResultsProps {
  tripData: TripResponse;
  onBack: () => void;
}

const TripResults: React.FC<TripResultsProps> = ({ tripData, onBack }) => {
  const { trip, route, schedule, hos_compliance } = tripData;

  const formatTime = (hours: number): string => {
    const h = Math.floor(hours);
    const m = Math.round((hours - h) * 60);
    return `${h}h ${m}m`;
  };

  const handleDownloadPDF = async (date: string) => {
    try {
      const blob = await truckerAPI.getDailyLogPDF(trip.id, date);
      
      // Create a URL for the blob
      const url = window.URL.createObjectURL(blob);
      
      // Create a temporary anchor element and trigger download
      const link = document.createElement('a');
      link.href = url;
      link.download = `daily-log-${date}.pdf`;
      document.body.appendChild(link);
      link.click();
      
      // Clean up
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error downloading PDF:', error);
      alert('Failed to download PDF. Please try again.');
    }
  };

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
        <Paper elevation={3} sx={{ p: 3, mb: 4, background: 'linear-gradient(135deg, #4CAF50 0%, #45a049 100%)', color: 'white' }}>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Box>
              <Typography variant="h4" fontWeight="bold" gutterBottom>
                Trip Plan Complete
              </Typography>
              <Typography variant="h6">
                {trip.pickup_location} → {trip.dropoff_location}
              </Typography>
            </Box>
            <Button 
              variant="outlined" 
              onClick={onBack}
              sx={{ color: 'white', borderColor: 'white', '&:hover': { borderColor: 'white', backgroundColor: 'rgba(255,255,255,0.1)' } }}
            >
              Plan New Trip
            </Button>
          </Box>
        </Paper>

      {/* HOS Compliance Status */}
      <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
        <Box display="flex" alignItems="center" mb={2}>
          {hos_compliance.is_compliant ? (
            <CheckCircle sx={{ color: 'success.main', mr: 2, fontSize: 30 }} />
          ) : (
            <Warning sx={{ color: 'warning.main', mr: 2, fontSize: 30 }} />
          )}
          <Typography variant="h5" fontWeight="bold">
            HOS Compliance Status
          </Typography>
        </Box>

        {hos_compliance.is_compliant ? (
          <Alert severity="success" sx={{ mb: 2 }}>
             Trip is fully compliant with FMCSA Hours of Service regulations
          </Alert>
        ) : (
          <Alert severity="warning" sx={{ mb: 2 }}>
            ⚠️ HOS violations detected - review schedule adjustments needed
          </Alert>
        )}

        {hos_compliance.violations.length > 0 && (
          <Box>
            <Typography variant="h6" gutterBottom>Violations:</Typography>
            {hos_compliance.violations.map((violation, index) => (
              <Alert key={index} severity="error" sx={{ mb: 1 }}>
                {violation}
              </Alert>
            ))}
          </Box>
        )}

        {schedule.warnings.length > 0 && (
          <Box mt={2}>
            <Typography variant="h6" gutterBottom>Warnings:</Typography>
            {schedule.warnings.map((warning, index) => (
              <Alert key={index} severity="warning" sx={{ mb: 1 }}>
                {warning}
              </Alert>
            ))}
          </Box>
        )}
      </Paper>

      {/* Trip Summary and Daily Logs */}
      <Box display="flex" flexDirection={{ xs: 'column', lg: 'row' }} gap={4} mb={4}>
        {/* Trip Summary */}
        <Box flex={{ xs: '1', lg: '0 0 400px' }} width={{ xs: '100%', lg: '400px' }}>
          <Card elevation={3} sx={{ height: 'fit-content' }}>
            <CardContent>
              <Typography variant="h6" gutterBottom fontWeight="bold" color="primary">
                <Route sx={{ mr: 1, verticalAlign: 'middle' }} />
                Trip Summary
              </Typography>
              
              <List dense>
                <ListItem>
                  <ListItemIcon><Speed /></ListItemIcon>
                  <ListItemText 
                    primary="Total Distance" 
                    secondary={`${route.total_distance.toFixed(1)} miles`} 
                  />
                </ListItem>
                
                <ListItem>
                  <ListItemIcon><Timer /></ListItemIcon>
                  <ListItemText 
                    primary="Drive Time" 
                    secondary={formatTime(route.total_drive_time)} 
                  />
                </ListItem>
                
                <ListItem>
                  <ListItemIcon><Schedule /></ListItemIcon>
                  <ListItemText 
                    primary="Total Trip Time" 
                    secondary={formatTime(schedule.trip_summary.estimated_total_time)} 
                  />
                </ListItem>
                
                <ListItem>
                  <ListItemIcon><RestaurantMenu /></ListItemIcon>
                  <ListItemText 
                    primary="Trip Duration" 
                    secondary={`${schedule.trip_summary.number_of_days} days`} 
                  />
                </ListItem>
                
                <ListItem>
                  <ListItemIcon><LocalGasStation /></ListItemIcon>
                  <ListItemText 
                    primary="Fuel Stops" 
                    secondary={`${schedule.trip_summary.fuel_stops_count} stops`} 
                  />
                </ListItem>
              </List>
            </CardContent>
          </Card>
        </Box>

        {/* Daily Logs */}
        <Box flex="1">
          <Card elevation={3}>
            <CardContent>
              <Typography variant="h6" gutterBottom fontWeight="bold" color="primary">
                <Schedule sx={{ mr: 1, verticalAlign: 'middle' }} />
                Daily Logs
              </Typography>
              
              {schedule.daily_logs && schedule.daily_logs.length > 0 ? (
                <Box 
                  display="grid" 
                  gridTemplateColumns={{ 
                    xs: '1fr', 
                    sm: 'repeat(auto-fit, minmax(400px, 1fr))' 
                  }} 
                  gap={2}
                >
                  {schedule.daily_logs.map((log, index) => (
                    <Paper key={index} variant="outlined" sx={{ p: 2 }}>
                      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                        <Typography variant="subtitle1" fontWeight="bold">
                          Day {log.day_number} - {new Date(log.date).toLocaleDateString()}
                        </Typography>
                        <Button
                          size="small"
                          startIcon={<Download />}
                          onClick={() => handleDownloadPDF(log.date)}
                          variant="outlined"
                        >
                          Download PDF
                        </Button>
                      </Box>
                      
                      <Box display="grid" gridTemplateColumns="repeat(2, 1fr)" gap={1}>
                        <Box>
                          <Typography variant="body2" color="text.secondary">Driving</Typography>
                          <Chip 
                            label={formatTime(log.totals.driving)} 
                            color="primary" 
                            size="small" 
                          />
                        </Box>
                        <Box>
                          <Typography variant="body2" color="text.secondary">On Duty</Typography>
                          <Chip 
                            label={formatTime(log.totals.on_duty_not_driving)} 
                            color="secondary" 
                            size="small" 
                          />
                        </Box>
                        <Box>
                          <Typography variant="body2" color="text.secondary">Off Duty</Typography>
                          <Chip 
                            label={formatTime(log.totals.off_duty)} 
                            color="success" 
                            size="small" 
                          />
                        </Box>
                        <Box>
                          <Typography variant="body2" color="text.secondary">Sleeper</Typography>
                          <Chip 
                            label={formatTime(log.totals.sleeper_berth)} 
                            color="info" 
                            size="small" 
                          />
                        </Box>
                      </Box>
                    </Paper>
                  ))}
                </Box>
              ) : (
                <Typography color="text.secondary">
                  No daily logs generated for this trip.
                </Typography>
              )}
            </CardContent>
          </Card>
        </Box>
      </Box>

      {/* Route Map */}
      <Box mb={4}>
        <RouteMap route={route} schedule={schedule} />
      </Box>

      {/* Route Details */}
      <Paper elevation={3} sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom fontWeight="bold" color="primary" mb={3}>
          Route Breakdown
        </Typography>
        
        <Box 
          display="grid" 
          gridTemplateColumns={{ 
            xs: '1fr', 
            md: 'repeat(2, 1fr)',
            lg: 'repeat(2, 1fr)'
          }} 
          gap={3}
        >
          <Card variant="outlined" sx={{ height: 'fit-content' }}>
            <CardContent>
              <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                Current → Pickup
              </Typography>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                {trip.current_location} → {trip.pickup_location}
              </Typography>
              <Box display="flex" gap={1} mt={2} flexWrap="wrap">
                <Chip 
                  label={`${route.to_pickup.distance.toFixed(1)} miles`} 
                  size="small" 
                  color="primary" 
                />
                <Chip 
                  label={formatTime(route.to_pickup.duration)} 
                  size="small" 
                  color="secondary" 
                />
              </Box>
            </CardContent>
          </Card>
          
          <Card variant="outlined" sx={{ height: 'fit-content' }}>
            <CardContent>
              <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                Pickup → Dropoff
              </Typography>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                {trip.pickup_location} → {trip.dropoff_location}
              </Typography>
              <Box display="flex" gap={1} mt={2} flexWrap="wrap">
                <Chip 
                  label={`${route.to_dropoff.distance.toFixed(1)} miles`} 
                  size="small" 
                  color="primary" 
                />
                <Chip 
                  label={formatTime(route.to_dropoff.duration)} 
                  size="small" 
                  color="secondary" 
                />
              </Box>
            </CardContent>
          </Card>
        </Box>
      </Paper>
      </Container>
    </Box>
  );
};

export default TripResults;
