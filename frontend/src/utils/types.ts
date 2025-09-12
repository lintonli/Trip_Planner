// API Types and Interfaces

// Trip request interface for API calls
export interface TripRequest {
  current_location: string;
  pickup_location: string;
  dropoff_location: string;
  current_cycle_used: number;
}

// Trip response interface from API
export interface TripResponse {
  trip: {
    id: string;
    current_location: string;
    pickup_location: string;
    dropoff_location: string;
    current_cycle_used: number;
    total_distance: number;
    estimated_drive_time: number;
    created_at: string;
  };
  route: {
    total_distance: number;
    total_drive_time: number;
    to_pickup: {
      distance: number;
      duration: number;
      geometry: any;
      instructions: any[];
    };
    to_dropoff: {
      distance: number;
      duration: number;
      geometry: any;
      instructions: any[];
    };
    coordinates: {
      current: [number, number];
      pickup: [number, number];
      dropoff: [number, number];
    };
  };
  schedule: {
    trip_summary: {
      total_distance: number;
      total_drive_time: number;
      estimated_total_time: number;
      number_of_days: number;
      fuel_stops_count: number;
      mandatory_breaks_count: number;
    };
    daily_logs: any[];
    stops: any[];
    warnings: string[];
  };
  hos_compliance: {
    violations: string[];
    is_compliant: boolean;
  };
}

// Additional utility types for better type safety
export type TripStatus = 'planning' | 'in-progress' | 'completed' | 'cancelled';

export type HOSViolationType = 
  | 'driving_limit_exceeded'
  | 'duty_limit_exceeded' 
  | 'break_required'
  | 'rest_required'
  | 'cycle_limit_exceeded';

export interface Location {
  latitude: number;
  longitude: number;
  address: string;
}

export interface RouteSegment {
  distance: number;
  duration: number;
  geometry: any;
  instructions: any[];
}
