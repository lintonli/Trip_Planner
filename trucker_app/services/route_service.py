import requests
import json
from typing import List, Dict, Tuple, Optional
from datetime import datetime, timedelta
from django.conf import settings

class RouteService:
    """Service for calculating routes using OpenRouteService API"""
    
    def __init__(self):
        self.api_key = settings.OPENROUTE_API_KEY or "5b3ce3597851110001cf6248a5c9a9a8c1054a2fb54e05b9db6de02f"  # Demo key
        self.base_url = "https://api.openrouteservice.org"
    
    def geocode_location(self, location: str) -> Optional[Tuple[float, float]]:
        """Geocode a location string to coordinates"""
        url = f"{self.base_url}/geocode/search"
        headers = {'Authorization': self.api_key}
        params = {
            'api_key': self.api_key,
            'text': location,
            'size': 1
        }
        
        try:
            response = requests.get(url, headers=headers, params=params)
            if response.status_code == 200:
                data = response.json()
                if data['features']:
                    coordinates = data['features'][0]['geometry']['coordinates']
                    return coordinates[1], coordinates[0]  # lat, lon
        except Exception as e:
            print(f"Geocoding error: {e}")
        
        return None
    
    def calculate_route(self, start_coords: Tuple[float, float], end_coords: Tuple[float, float]) -> Optional[Dict]:
        """Calculate route between two coordinates"""
        url = f"{self.base_url}/v2/directions/driving-hgv"
        headers = {
            'Authorization': self.api_key,
            'Content-Type': 'application/json'
        }
        
        body = {
            "coordinates": [
                [start_coords[1], start_coords[0]],  # lon, lat
                [end_coords[1], end_coords[0]]
            ],
            "format": "geojson",
            "units": "mi",
            "instructions": True,
            "maneuvers": True
        }
        
        try:
            response = requests.post(url, headers=headers, json=body)
            if response.status_code == 200:
                data = response.json()
                if data['features']:
                    route = data['features'][0]
                    distance = route['properties']['summary']['distance']  # in miles
                    duration = route['properties']['summary']['duration'] / 3600  # convert to hours
                    
                    return {
                        'distance': distance,
                        'duration': duration,
                        'geometry': route['geometry'],
                        'instructions': route['properties'].get('segments', [])
                    }
        except Exception as e:
            print(f"Routing error: {e}")
        
        return None
    
    def find_fuel_stops(self, route_coords: List[Tuple[float, float]], max_distance: float = 1000) -> List[Dict]:
        """Find fuel stops along the route every max_distance miles"""
        fuel_stops = []
        cumulative_distance = 0
        
        # For simplicity, we'll add fuel stops at approximately every 1000 miles
        # In a real implementation, you'd use POI search API
        for i, coord in enumerate(route_coords):
            if cumulative_distance >= max_distance and cumulative_distance % max_distance < 100:
                fuel_stops.append({
                    'latitude': coord[0],
                    'longitude': coord[1],
                    'location': f"Fuel Stop {len(fuel_stops) + 1}",
                    'distance_from_start': cumulative_distance
                })
            
            if i < len(route_coords) - 1:
                # Estimate distance between consecutive points (rough calculation)
                cumulative_distance += self._haversine_distance(coord, route_coords[i + 1])
        
        return fuel_stops
    
    def _haversine_distance(self, coord1: Tuple[float, float], coord2: Tuple[float, float]) -> float:
        """Calculate approximate distance between two coordinates in miles"""
        from math import radians, sin, cos, sqrt, atan2
        
        R = 3959  # Earth's radius in miles
        
        lat1, lon1 = radians(coord1[0]), radians(coord1[1])
        lat2, lon2 = radians(coord2[0]), radians(coord2[1])
        
        dlat = lat2 - lat1
        dlon = lon2 - lon1
        
        a = sin(dlat/2)**2 + cos(lat1) * cos(lat2) * sin(dlon/2)**2
        c = 2 * atan2(sqrt(a), sqrt(1-a))
        
        return R * c
