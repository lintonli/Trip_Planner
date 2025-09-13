import requests
import json
from typing import List, Dict, Tuple, Optional
from datetime import datetime, timedelta
from django.conf import settings
import logging

logger = logging.getLogger(__name__)

class RouteService:
    """Service for calculating routes using OpenRouteService API"""
    
    def __init__(self):
        self.api_key = settings.OPENROUTE_API_KEY or "5b3ce3597851110001cf6248a5c9a9a8c1054a2fb54e05b9db6de02f"  # Demo key
        self.base_url = "https://api.openrouteservice.org"
    
    def geocode_location(self, location: str) -> Optional[Tuple[float, float]]:
        """Geocode a location string to coordinates with fallback options"""
        # First try OpenRouteService
        coords = self._geocode_with_openroute(location)
        if coords:
            return coords
            
        # Fallback to manual city/state parsing for common US locations
        coords = self._geocode_fallback(location)
        if coords:
            return coords
            
        logger.error(f"Could not geocode location: {location}")
        return None
    
    def _geocode_with_openroute(self, location: str) -> Optional[Tuple[float, float]]:
        """Geocode using OpenRouteService API"""
        url = f"{self.base_url}/geocode/search"
        headers = {'Authorization': self.api_key}
        params = {
            'text': location,
            'size': 1,
            'boundary.country': 'US'  # Focus on US locations
        }
        
        try:
            response = requests.get(url, headers=headers, params=params, timeout=10)
            logger.info(f"Geocoding response status: {response.status_code}")
            
            if response.status_code == 200:
                data = response.json()
                if data.get('features') and len(data['features']) > 0:
                    coordinates = data['features'][0]['geometry']['coordinates']
                    lat, lon = coordinates[1], coordinates[0]  # OpenRoute returns [lon, lat]
                    logger.info(f"Successfully geocoded '{location}' to ({lat}, {lon})")
                    return lat, lon
                else:
                    logger.warning(f"No geocoding results for: {location}")
            else:
                logger.error(f"Geocoding API error {response.status_code}: {response.text}")
                
        except requests.exceptions.Timeout:
            logger.error(f"Geocoding timeout for: {location}")
        except Exception as e:
            logger.error(f"Geocoding error for '{location}': {e}")
        
        return None
    
    def _geocode_fallback(self, location: str) -> Optional[Tuple[float, float]]:
        """Fallback geocoding for common US cities"""
        # Comprehensive city coordinates as fallback - matching frontend locations.ts
        fallback_cities = {
            # Alabama
            'birmingham, al': (33.5207, -86.8025),
            'huntsville, al': (34.7304, -86.5861),
            'mobile, al': (30.6954, -88.0399),
            'montgomery, al': (32.3668, -86.3000),
            
            # Arizona
            'phoenix, az': (33.4484, -112.0740),
            'tucson, az': (32.2217, -110.9265),
            'mesa, az': (33.4152, -111.8315),
            'chandler, az': (33.3062, -111.8413),
            'scottsdale, az': (33.4942, -111.9261),
            'flagstaff, az': (35.1983, -111.6513),
            
            # Arkansas
            'little rock, ar': (34.7465, -92.2896),
            'fayetteville, ar': (36.0625, -94.1574),
            'fort smith, ar': (35.3859, -94.3985),
            
            # California
            'los angeles, ca': (34.0522, -118.2437),
            'san francisco, ca': (37.7749, -122.4194),
            'san diego, ca': (32.7157, -117.1611),
            'sacramento, ca': (38.5816, -121.4944),
            'san jose, ca': (37.3382, -121.8863),
            'fresno, ca': (36.7378, -119.7871),
            'long beach, ca': (33.7701, -118.1937),
            'oakland, ca': (37.8044, -122.2712),
            'bakersfield, ca': (35.3733, -119.0187),
            
            # Colorado
            'denver, co': (39.7392, -104.9903),
            'colorado springs, co': (38.8339, -104.8214),
            'aurora, co': (39.7294, -104.8319),
            'fort collins, co': (40.5853, -105.0844),
            
            # Connecticut
            'hartford, ct': (41.7658, -72.6734),
            'bridgeport, ct': (41.1865, -73.1952),
            'new haven, ct': (41.3083, -72.9279),
            
            # Florida
            'miami, fl': (25.7617, -80.1918),
            'tampa, fl': (27.9506, -82.4572),
            'orlando, fl': (28.5383, -81.3792),
            'jacksonville, fl': (30.3322, -81.6557),
            'fort lauderdale, fl': (26.1224, -80.1373),
            'tallahassee, fl': (30.4518, -84.2807),
            'pensacola, fl': (30.4213, -87.2169),
            
            # Georgia
            'atlanta, ga': (33.7490, -84.3880),
            'savannah, ga': (32.0835, -81.0998),
            'augusta, ga': (33.4735, -82.0105),
            'columbus, ga': (32.4610, -84.9877),
            
            # Illinois
            'chicago, il': (41.8781, -87.6298),
            'aurora, il': (41.7606, -88.3201),
            'peoria, il': (40.6936, -89.5890),
            'springfield, il': (39.7817, -89.6501),
            
            # Indiana
            'indianapolis, in': (39.7684, -86.1581),
            'fort wayne, in': (41.0793, -85.1394),
            'evansville, in': (37.9716, -87.5710),
            
            # Iowa
            'des moines, ia': (41.5868, -93.6250),
            'cedar rapids, ia': (41.9778, -91.6656),
            'davenport, ia': (41.5236, -90.5776),
            
            # Kansas
            'wichita, ks': (37.6872, -97.3301),
            'topeka, ks': (39.0473, -95.6890),
            'kansas city, ks': (39.1142, -94.6275),
            
            # Kentucky
            'louisville, ky': (38.2527, -85.7585),
            'lexington, ky': (38.0406, -84.5037),
            'bowling green, ky': (36.9685, -86.4808),
            
            # Louisiana
            'new orleans, la': (29.9511, -90.0715),
            'baton rouge, la': (30.4515, -91.1871),
            'shreveport, la': (32.5252, -93.7502),
            
            # Maine
            'portland, me': (43.6591, -70.2568),
            'bangor, me': (44.8016, -68.7712),
            
            # Maryland
            'baltimore, md': (39.2904, -76.6122),
            'annapolis, md': (38.9784, -76.4951),
            
            # Massachusetts
            'boston, ma': (42.3601, -71.0589),
            'worcester, ma': (42.2626, -71.8023),
            'springfield, ma': (42.1015, -72.5898),
            
            # Michigan
            'detroit, mi': (42.3314, -83.0458),
            'grand rapids, mi': (42.9634, -85.6681),
            'warren, mi': (42.5145, -83.0146),
            'lansing, mi': (42.3540, -84.5467),
            
            # Minnesota
            'minneapolis, mn': (44.9778, -93.2650),
            'saint paul, mn': (44.9537, -93.0900),
            'rochester, mn': (44.0121, -92.4802),
            'duluth, mn': (46.7867, -92.1005),
            
            # Mississippi
            'jackson, ms': (32.2988, -90.1848),
            'gulfport, ms': (30.3674, -89.0928),
            'hattiesburg, ms': (31.3271, -89.2903),
            
            # Missouri
            'kansas city, mo': (39.0997, -94.5786),
            'saint louis, mo': (38.6270, -90.1994),
            'springfield, mo': (37.2153, -93.2982),
            'columbia, mo': (38.9517, -92.3341),
            
            # Montana
            'billings, mt': (45.7833, -108.5007),
            'missoula, mt': (46.8721, -113.9940),
            'great falls, mt': (47.4941, -111.2833),
            
            # Nebraska
            'omaha, ne': (41.2565, -95.9345),
            'lincoln, ne': (40.8136, -96.7026),
            
            # Nevada
            'las vegas, nv': (36.1699, -115.1398),
            'reno, nv': (39.5296, -119.8138),
            'henderson, nv': (36.0395, -114.9817),
            
            # New Hampshire
            'manchester, nh': (42.9956, -71.4548),
            'nashua, nh': (42.7654, -71.4676),
            
            # New Jersey
            'newark, nj': (40.7357, -74.1724),
            'jersey city, nj': (40.7178, -74.0431),
            'paterson, nj': (40.9168, -74.1718),
            'trenton, nj': (40.2206, -74.7565),
            
            # New Mexico
            'albuquerque, nm': (35.0844, -106.6504),
            'las cruces, nm': (32.3199, -106.7637),
            'santa fe, nm': (35.6870, -105.9378),
            
            # New York
            'new york, ny': (40.7128, -74.0060),
            'buffalo, ny': (42.8864, -78.8784),
            'rochester, ny': (43.1566, -77.6088),
            'yonkers, ny': (40.9312, -73.8988),
            'syracuse, ny': (43.0481, -76.1474),
            'albany, ny': (42.6526, -73.7562),
            
            # North Carolina
            'charlotte, nc': (35.2271, -80.8431),
            'raleigh, nc': (35.7796, -78.6382),
            'greensboro, nc': (36.0726, -79.7920),
            'durham, nc': (35.9940, -78.8986),
            'winston-salem, nc': (36.0999, -80.2442),
            'asheville, nc': (35.5951, -82.5515),
            
            # North Dakota
            'fargo, nd': (46.8772, -96.7898),
            'bismarck, nd': (46.8083, -100.7837),
            
            # Ohio
            'columbus, oh': (39.9612, -82.9988),
            'cleveland, oh': (41.4993, -81.6944),
            'cincinnati, oh': (39.1031, -84.5120),
            'toledo, oh': (41.6528, -83.5379),
            'akron, oh': (41.0814, -81.5190),
            'dayton, oh': (39.7589, -84.1916),
            
            # Oklahoma
            'oklahoma city, ok': (35.4676, -97.5164),
            'tulsa, ok': (36.1540, -95.9928),
            'norman, ok': (35.2226, -97.4395),
            
            # Oregon
            'portland, or': (45.5152, -122.6784),
            'salem, or': (44.9429, -123.0351),
            'eugene, or': (44.0521, -123.0868),
            'gresham, or': (45.5001, -122.4302),
            
            # Pennsylvania
            'philadelphia, pa': (39.9526, -75.1652),
            'pittsburgh, pa': (40.4406, -79.9959),
            'allentown, pa': (40.6084, -75.4902),
            'erie, pa': (42.1292, -80.0851),
            'reading, pa': (40.3356, -75.9269),
            'scranton, pa': (41.4090, -75.6624),
            
            # Rhode Island
            'providence, ri': (41.8240, -71.4128),
            'warwick, ri': (41.7001, -71.4162),
            
            # South Carolina
            'charleston, sc': (32.7765, -79.9311),
            'columbia, sc': (34.0007, -81.0348),
            'greenville, sc': (34.8526, -82.3940),
            
            # South Dakota
            'sioux falls, sd': (43.5446, -96.7311),
            'rapid city, sd': (44.0805, -103.2310),
            
            # Tennessee
            'nashville, tn': (36.1627, -86.7816),
            'memphis, tn': (35.1495, -90.0490),
            'knoxville, tn': (35.9606, -83.9207),
            'chattanooga, tn': (35.0456, -85.3097),
            
            # Texas
            'houston, tx': (29.7604, -95.3698),
            'san antonio, tx': (29.4241, -98.4936),
            'dallas, tx': (32.7767, -96.7970),
            'austin, tx': (30.2672, -97.7431),
            'fort worth, tx': (32.7555, -97.3308),
            'el paso, tx': (31.7619, -106.4850),
            'arlington, tx': (32.7357, -97.1081),
            'corpus christi, tx': (27.8006, -97.3964),
            'plano, tx': (33.0198, -96.6989),
            'lubbock, tx': (33.5779, -101.8552),
            'laredo, tx': (27.5306, -99.4803),
            'amarillo, tx': (35.2220, -101.8313),
            
            # Utah
            'salt lake city, ut': (40.7608, -111.8910),
            'west valley city, ut': (40.6916, -112.0010),
            'provo, ut': (40.2338, -111.6585),
            'ogden, ut': (41.2230, -111.9738),
            
            # Vermont
            'burlington, vt': (44.4759, -73.2121),
            'montpelier, vt': (44.2601, -72.5806),
            
            # Virginia
            'virginia beach, va': (36.8529, -75.9780),
            'norfolk, va': (36.8468, -76.2852),
            'chesapeake, va': (36.7682, -76.2875),
            'richmond, va': (37.5407, -77.4360),
            'newport news, va': (37.0871, -76.4730),
            'alexandria, va': (38.8048, -77.0469),
            
            # Washington
            'seattle, wa': (47.6062, -122.3321),
            'spokane, wa': (47.6587, -117.4260),
            'tacoma, wa': (47.2529, -122.4443),
            'vancouver, wa': (45.6387, -122.6615),
            'bellevue, wa': (47.6101, -122.2015),
            'everett, wa': (47.9790, -122.2021),
            
            # West Virginia
            'charleston, wv': (38.3498, -81.6326),
            'huntington, wv': (38.4192, -82.4452),
            
            # Wisconsin
            'milwaukee, wi': (43.0389, -87.9065),
            'madison, wi': (43.0731, -89.4012),
            'green bay, wi': (44.5133, -88.0133),
            'kenosha, wi': (42.5847, -87.8212),
            
            # Wyoming
            'cheyenne, wy': (41.1400, -104.8197),
            'casper, wy': (42.8666, -106.3131),
            
            # Washington D.C.
            'washington, dc': (38.9072, -77.0369),
            
            # Alternative formats without state abbreviations
            'los angeles': (34.0522, -118.2437),
            'san francisco': (37.7749, -122.4194),
            'san diego': (32.7157, -117.1611),
            'phoenix': (33.4484, -112.0740),
            'denver': (39.7392, -104.9903),
            'chicago': (41.8781, -87.6298),
            'new york': (40.7128, -74.0060),
            'atlanta': (33.7490, -84.3880),
            'dallas': (32.7767, -96.7970),
            'miami': (25.7617, -80.1918),
            'seattle': (47.6062, -122.3321),
            'las vegas': (36.1699, -115.1398),
            'boston': (42.3601, -71.0589),
            'detroit': (42.3314, -83.0458),
            'houston': (29.7604, -95.3698),
            'philadelphia': (39.9526, -75.1652),
        }
        
        location_lower = location.lower().strip()
        if location_lower in fallback_cities:
            coords = fallback_cities[location_lower]
            logger.info(f"Using fallback coordinates for '{location}': {coords}")
            return coords
            
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
            logger.info(f"Calculating route from {start_coords} to {end_coords}")
            response = requests.post(url, headers=headers, json=body, timeout=15)
            
            if response.status_code == 200:
                data = response.json()
                if data.get('features') and len(data['features']) > 0:
                    route = data['features'][0]
                    properties = route['properties']
                    summary = properties.get('summary', {})
                    
                    distance = summary.get('distance', 0)  # in miles
                    duration = summary.get('duration', 0) / 3600  # convert to hours
                    
                    result = {
                        'distance': distance,
                        'duration': duration,
                        'geometry': route['geometry'],
                        'instructions': properties.get('segments', [])
                    }
                    
                    logger.info(f"Route calculated: {distance:.1f} miles, {duration:.1f} hours")
                    return result
                else:
                    logger.error("No route found in API response")
            else:
                logger.error(f"Route calculation failed {response.status_code}: {response.text}")
                
        except requests.exceptions.Timeout:
            logger.error("Route calculation timeout")
        except Exception as e:
            logger.error(f"Route calculation error: {e}")
        
        # Fallback calculation using straight-line distance
        return self._calculate_fallback_route(start_coords, end_coords)
    
    def _calculate_fallback_route(self, start_coords: Tuple[float, float], end_coords: Tuple[float, float]) -> Dict:
        """Calculate a fallback route using straight-line distance"""
        distance = self._haversine_distance(start_coords, end_coords)
        # Estimate driving time: assume average 55 mph + 20% for realistic routing
        duration = (distance * 1.2) / 55
        
        logger.info(f"Using fallback route calculation: {distance:.1f} miles, {duration:.1f} hours")
        
        return {
            'distance': distance,
            'duration': duration,
            'geometry': {
                'type': 'LineString',
                'coordinates': [
                    [start_coords[1], start_coords[0]],  # lon, lat
                    [end_coords[1], end_coords[0]]
                ]
            },
            'instructions': [{
                'instruction': f"Drive approximately {distance:.0f} miles to destination",
                'distance': distance,
                'duration': duration * 3600  # convert back to seconds
            }]
        }
