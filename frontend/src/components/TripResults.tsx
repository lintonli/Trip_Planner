import React from 'react';
import {
  Paper,
  Typography,
  Card,
  CardContent,
  Chip,
  Alert,
  Button,
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
        <Paper elevation={3} sx={{ p: 3, mb: 4, background: 'linear-gradient(135deg, #4CAF50 0%, #45a049 100%)', color: 'white' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <Typography variant="h4" fontWeight="bold" gutterBottom>
                Trip Plan Complete
              </Typography>
              <Typography variant="h6">
                {trip.pickup_location} → {trip.dropoff_location}
              </Typography>
            </div>
            <Button 
              variant="outlined" 
              onClick={onBack}
              sx={{ color: 'white', borderColor: 'white', '&:hover': { borderColor: 'white', backgroundColor: 'rgba(255,255,255,0.1)' } }}
            >
              Plan New Trip
            </Button>
          </div>
        </Paper>

      {/* HOS Compliance Status */}
      <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '16px' }}>
          {hos_compliance.is_compliant ? (
            <CheckCircle sx={{ color: 'success.main', mr: 2, fontSize: 30 }} />
          ) : (
            <Warning sx={{ color: 'warning.main', mr: 2, fontSize: 30 }} />
          )}
          <Typography variant="h5" fontWeight="bold">
            HOS Compliance Status
          </Typography>
        </div>

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
          <div>
            <Typography variant="h6" gutterBottom>Violations:</Typography>
            {hos_compliance.violations.map((violation, index) => (
              <Alert key={index} severity="error" sx={{ mb: 1 }}>
                {violation}
              </Alert>
            ))}
          </div>
        )}

        {schedule.warnings.length > 0 && (
          <div style={{ marginTop: '16px' }}>
            <Typography variant="h6" gutterBottom>Warnings:</Typography>
            {schedule.warnings.map((warning, index) => (
              <Alert key={index} severity="warning" sx={{ mb: 1 }}>
                {warning}
              </Alert>
            ))}
          </div>
        )}
      </Paper>

      {/* Trip Summary */}
      <div className="mb-4">
        <Card elevation={3}>
          <CardContent>
            <Typography variant="h6" gutterBottom fontWeight="bold" color="primary">
              <Route sx={{ mr: 1, verticalAlign: 'middle' }} />
              Trip Summary
            </Typography>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Speed sx={{ color: 'primary.main' }} />
                <div>
                  <Typography variant="body2" color="text.secondary">Total Distance</Typography>
                  <Typography variant="h6" fontWeight="bold">{route.total_distance.toFixed(1)} miles</Typography>
                </div>
              </div>
              
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Timer sx={{ color: 'primary.main' }} />
                <div>
                  <Typography variant="body2" color="text.secondary">Drive Time</Typography>
                  <Typography variant="h6" fontWeight="bold">{formatTime(route.total_drive_time)}</Typography>
                </div>
              </div>
              
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Schedule sx={{ color: 'primary.main' }} />
                <div>
                  <Typography variant="body2" color="text.secondary">Total Trip Time</Typography>
                  <Typography variant="h6" fontWeight="bold">{formatTime(schedule.trip_summary.estimated_total_time)}</Typography>
                </div>
              </div>
              
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <RestaurantMenu sx={{ color: 'primary.main' }} />
                <div>
                  <Typography variant="body2" color="text.secondary">Trip Duration</Typography>
                  <Typography variant="h6" fontWeight="bold">{schedule.trip_summary.number_of_days} days</Typography>
                </div>
              </div>
              
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <LocalGasStation sx={{ color: 'primary.main' }} />
                <div>
                  <Typography variant="body2" color="text.secondary">Fuel Stops</Typography>
                  <Typography variant="h6" fontWeight="bold">{schedule.trip_summary.fuel_stops_count} stops</Typography>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Daily Logs */}
      <div className="mb-4">
        <Card elevation={3}>
          <CardContent>
            <Typography variant="h6" gutterBottom fontWeight="bold" color="primary">
              <Schedule sx={{ mr: 1, verticalAlign: 'middle' }} />
              Daily Logs
            </Typography>
            
            {schedule.daily_logs && schedule.daily_logs.length > 0 ? (
              <div style={{ 
                display: 'grid', 
                gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', 
                gap: '16px'
              }}>
                {schedule.daily_logs.map((log, index) => (
                  <Paper key={index} variant="outlined" sx={{ p: 2 }}>
                    <div className="flex-between mb-2">
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
                    </div>
                    
                    <div className="grid-container grid-2-col gap-1">
                      <div>
                        <Typography variant="body2" color="text.secondary">Driving</Typography>
                        <Chip 
                          label={formatTime(log.totals.driving)} 
                          color="primary" 
                          size="small" 
                        />
                      </div>
                      <div>
                        <Typography variant="body2" color="text.secondary">On Duty</Typography>
                        <Chip 
                          label={formatTime(log.totals.on_duty_not_driving)} 
                          color="secondary" 
                          size="small" 
                        />
                      </div>
                      <div>
                        <Typography variant="body2" color="text.secondary">Off Duty</Typography>
                        <Chip 
                          label={formatTime(log.totals.off_duty)} 
                          color="success" 
                          size="small" 
                        />
                      </div>
                      <div>
                        <Typography variant="body2" color="text.secondary">Sleeper</Typography>
                        <Chip 
                          label={formatTime(log.totals.sleeper_berth)} 
                          color="info" 
                          size="small" 
                        />
                      </div>
                    </div>
                  </Paper>
                ))}
              </div>
            ) : (
              <Typography color="text.secondary">
                No daily logs generated for this trip.
              </Typography>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Route Map */}
      <div className="mb-4">
        <RouteMap route={route} schedule={schedule} />
      </div>

      {/* Route Details */}
      <Paper elevation={3} sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom fontWeight="bold" color="primary" mb={3}>
          Route Breakdown
        </Typography>
        
        <div className="grid-container grid-2-col" style={{ gap: '24px' }}>
          <Card variant="outlined" sx={{ height: 'fit-content' }}>
            <CardContent>
              <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                Current → Pickup
              </Typography>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                {trip.current_location} → {trip.pickup_location}
              </Typography>
              <div style={{ display: 'flex', gap: '8px', marginTop: '16px', flexWrap: 'wrap' }}>
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
              </div>
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
              <div style={{ display: 'flex', gap: '8px', marginTop: '16px', flexWrap: 'wrap' }}>
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
              </div>
            </CardContent>
          </Card>
        </div>
      </Paper>
      </div>
    </div>
  );
};

export default TripResults;
