import React from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import { Icon } from 'leaflet';
import type { LatLngTuple } from 'leaflet';
import { Paper, Typography, Box, Chip } from '@mui/material';
import { LocalGasStation, LocationOn, Flag, RestaurantMenu } from '@mui/icons-material';
import 'leaflet/dist/leaflet.css';

// Fix for default markers in react-leaflet
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

delete (Icon.Default.prototype as any)._getIconUrl;
Icon.Default.mergeOptions({
  iconUrl: markerIcon,
  iconRetinaUrl: markerIcon2x,
  shadowUrl: markerShadow,
});

interface RouteMapProps {
  route: {
    coordinates: {
      current: [number, number];
      pickup: [number, number];
      dropoff: [number, number];
    };
    to_pickup: {
      geometry: any;
    };
    to_dropoff: {
      geometry: any;
    };
  };
  schedule: {
    trip_summary: {
      total_distance: number;
      fuel_stops_count: number;
      number_of_days: number;
    };
  };
}

const RouteMap: React.FC<RouteMapProps> = ({ route, schedule }) => {
  // Create custom icons
  const currentLocationIcon = new Icon({
    iconUrl: 'data:image/svg+xml;base64,' + btoa(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#2196F3" width="32" height="32">
        <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
      </svg>
    `),
    iconSize: [32, 32],
    iconAnchor: [16, 32],
  });

  const pickupIcon = new Icon({
    iconUrl: 'data:image/svg+xml;base64,' + btoa(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#FF9800" width="32" height="32">
        <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
      </svg>
    `),
    iconSize: [32, 32],
    iconAnchor: [16, 32],
  });

  const dropoffIcon = new Icon({
    iconUrl: 'data:image/svg+xml;base64,' + btoa(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#4CAF50" width="32" height="32">
        <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
      </svg>
    `),
    iconSize: [32, 32],
    iconAnchor: [16, 32],
  });

  const fuelIcon = new Icon({
    iconUrl: 'data:image/svg+xml;base64,' + btoa(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#F44336" width="24" height="24">
        <path d="M19.77 7.23l.01-.01-3.72-3.72L15 4.56l2.11 2.11c-.94.36-1.61 1.26-1.61 2.33 0 1.38 1.12 2.5 2.5 2.5.36 0 .69-.08 1-.21v7.21c0 .55-.45 1-1 1s-1-.45-1-1V14c0-1.1-.9-2-2-2h-1V5c0-1.1-.9-2-2-2H6c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h6c1.1 0 2-.9 2-2v-3h1v5.5c0 1.38 1.12 2.5 2.5 2.5s2.5-1.12 2.5-2.5v-9.5c0-.69-.28-1.32-.73-1.77zM12 10H6V5h6v5z"/>
      </svg>
    `),
    iconSize: [24, 24],
    iconAnchor: [12, 24],
  });

  // Convert route geometry to coordinates for polyline
  const getRouteCoordinates = (geometry: any): LatLngTuple[] => {
    if (!geometry || !geometry.coordinates) return [];
    return geometry.coordinates.map((coord: [number, number]) => [coord[1], coord[0]] as LatLngTuple);
  };

  const routeToPickup = getRouteCoordinates(route.to_pickup.geometry);
  const routeToDropoff = getRouteCoordinates(route.to_dropoff.geometry);

  // Calculate center point for map
  const allCoords = [route.coordinates.current, route.coordinates.pickup, route.coordinates.dropoff];
  const centerLat = allCoords.reduce((sum, coord) => sum + coord[0], 0) / allCoords.length;
  const centerLng = allCoords.reduce((sum, coord) => sum + coord[1], 0) / allCoords.length;

  // Generate fuel stop markers (simplified - in real app would come from backend)
  const generateFuelStops = () => {
    const fuelStops: LatLngTuple[] = [];
    const totalStops = schedule.trip_summary.fuel_stops_count;
    
    // Distribute fuel stops along the route
    for (let i = 1; i <= totalStops; i++) {
      const ratio = i / (totalStops + 1);
      const lat = route.coordinates.pickup[0] + 
                  (route.coordinates.dropoff[0] - route.coordinates.pickup[0]) * ratio;
      const lng = route.coordinates.pickup[1] + 
                  (route.coordinates.dropoff[1] - route.coordinates.pickup[1]) * ratio;
      fuelStops.push([lat, lng]);
    }
    
    return fuelStops;
  };

  const fuelStops = generateFuelStops();

  return (
    <Paper elevation={3} sx={{ p: 3 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h6" color="primary" fontWeight="bold">
          Route Overview
        </Typography>
        <Box display="flex" gap={1}>
          <Chip 
            icon={<Flag />} 
            label={`${schedule.trip_summary.total_distance.toFixed(0)} miles`} 
            color="primary" 
            size="small" 
          />
          <Chip 
            icon={<LocalGasStation />} 
            label={`${schedule.trip_summary.fuel_stops_count} fuel stops`} 
            color="secondary" 
            size="small" 
          />
          <Chip 
            icon={<RestaurantMenu />} 
            label={`${schedule.trip_summary.number_of_days} days`} 
            color="success" 
            size="small" 
          />
        </Box>
      </Box>

      <Box sx={{ height: 500, borderRadius: 2, overflow: 'hidden' }}>
        <MapContainer
          center={[centerLat, centerLng]}
          zoom={6}
          style={{ height: '100%', width: '100%' }}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          
          {/* Route lines */}
          {routeToPickup.length > 0 && (
            <Polyline
              positions={routeToPickup}
              pathOptions={{ color: '#FF9800', weight: 4, opacity: 0.8 }}
            />
          )}
          
          {routeToDropoff.length > 0 && (
            <Polyline
              positions={routeToDropoff}
              pathOptions={{ color: '#4CAF50', weight: 4, opacity: 0.8 }}
            />
          )}

          {/* Location markers */}
          <Marker position={route.coordinates.current} icon={currentLocationIcon}>
            <Popup>
              <strong>Current Location</strong><br />
              Starting point of your trip
            </Popup>
          </Marker>

          <Marker position={route.coordinates.pickup} icon={pickupIcon}>
            <Popup>
              <strong>Pickup Location</strong><br />
              Load pickup point<br />
              <em>Estimated time: 1 hour</em>
            </Popup>
          </Marker>

          <Marker position={route.coordinates.dropoff} icon={dropoffIcon}>
            <Popup>
              <strong>Dropoff Location</strong><br />
              Final destination<br />
              <em>Estimated time: 1 hour</em>
            </Popup>
          </Marker>

          {/* Fuel stop markers */}
          {fuelStops.map((stop, index) => (
            <Marker key={`fuel-${index}`} position={stop} icon={fuelIcon}>
              <Popup>
                <strong>Fuel Stop {index + 1}</strong><br />
                Required fuel stop<br />
                <em>Estimated time: 1 hour</em>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </Box>

      <Box mt={2} p={2} sx={{ backgroundColor: 'background.default', borderRadius: 1 }}>
        <Typography variant="body2" color="text.secondary">
          <LocationOn sx={{ fontSize: 16, mr: 1, verticalAlign: 'middle', color: '#2196F3' }} />
          <strong>Blue:</strong> Current Location &nbsp;&nbsp;
          <LocationOn sx={{ fontSize: 16, mr: 1, verticalAlign: 'middle', color: '#FF9800' }} />
          <strong>Orange:</strong> Pickup Location &nbsp;&nbsp;
          <LocationOn sx={{ fontSize: 16, mr: 1, verticalAlign: 'middle', color: '#4CAF50' }} />
          <strong>Green:</strong> Dropoff Location &nbsp;&nbsp;
          <LocalGasStation sx={{ fontSize: 16, mr: 1, verticalAlign: 'middle', color: '#F44336' }} />
          <strong>Red:</strong> Fuel Stops
        </Typography>
      </Box>
    </Paper>
  );
};

export default RouteMap;
