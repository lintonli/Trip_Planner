from datetime import datetime, timedelta, time
from typing import List, Dict, Tuple
from ..models import Trip, Stop, DailyLog, LogEntry

class HOSComplianceService:
    """Service for Hours of Service compliance calculations"""
    
    # HOS Limits (Property-carrying drivers, 70hrs/8days)
    MAX_DRIVING_HOURS_PER_DAY = 11
    MAX_DUTY_HOURS_WINDOW = 14
    MAX_CYCLE_HOURS = 70  # 70 hours in 8 days
    MANDATORY_BREAK_HOURS = 0.5  # 30-minute break after 8 hours of driving
    MANDATORY_BREAK_AFTER_HOURS = 8
    MIN_OFF_DUTY_HOURS = 10
    
    def __init__(self):
        pass
    
    def calculate_trip_schedule(self, trip: Trip, route_data: Dict) -> Dict:
        """
        Calculate complete trip schedule with HOS compliance
        Returns schedule with daily logs, stops, and rest periods
        """
        total_distance = route_data['distance']
        total_drive_time = route_data['duration']
        
        # Calculate required stops
        fuel_stops = self._calculate_fuel_stops(total_distance)
        mandatory_breaks = self._calculate_mandatory_breaks(total_drive_time)
        daily_rest_periods = self._calculate_daily_rest_periods(total_drive_time, trip.current_cycle_used)
        
        # Generate schedule
        schedule = self._generate_schedule(
            trip, total_distance, total_drive_time, 
            fuel_stops, mandatory_breaks, daily_rest_periods
        )
        
        return schedule
    
    def _calculate_fuel_stops(self, total_distance: float) -> List[Dict]:
        """Calculate fuel stops every 1000 miles"""
        fuel_stops = []
        miles_per_fuel_stop = 1000
        
        num_fuel_stops = int(total_distance // miles_per_fuel_stop)
        
        for i in range(num_fuel_stops):
            distance_from_start = (i + 1) * miles_per_fuel_stop
            fuel_stops.append({
                'type': 'fuel',
                'distance_from_start': distance_from_start,
                'duration': 1.0,  # 1 hour for fueling
                'description': f'Fuel Stop at {distance_from_start} miles'
            })
        
        return fuel_stops
    
    def _calculate_mandatory_breaks(self, total_drive_time: float) -> List[Dict]:
        """Calculate mandatory 30-minute breaks every 8 hours of driving"""
        breaks = []
        cumulative_drive_time = 0
        
        while cumulative_drive_time + self.MANDATORY_BREAK_AFTER_HOURS < total_drive_time:
            cumulative_drive_time += self.MANDATORY_BREAK_AFTER_HOURS
            breaks.append({
                'type': 'mandatory_break',
                'after_drive_hours': cumulative_drive_time,
                'duration': self.MANDATORY_BREAK_HOURS,
                'description': f'Mandatory 30-min break after {cumulative_drive_time} hours driving'
            })
        
        return breaks
    
    def _calculate_daily_rest_periods(self, total_drive_time: float, current_cycle_used: float) -> List[Dict]:
        """Calculate required daily rest periods"""
        rest_periods = []
        cumulative_hours = current_cycle_used
        day = 1
        
        # Simulate daily driving schedule
        remaining_drive_time = total_drive_time
        
        while remaining_drive_time > 0:
            # Calculate how much we can drive today considering HOS limits
            hours_available_in_cycle = max(0, self.MAX_CYCLE_HOURS - cumulative_hours)
            max_duty_today = min(self.MAX_DUTY_HOURS_WINDOW, hours_available_in_cycle)
            max_drive_today = min(self.MAX_DRIVING_HOURS_PER_DAY, remaining_drive_time)
            
            # Account for breaks and other duties (pickup/delivery time, fuel stops)
            estimated_non_drive_time = 2  # Base time for inspections, breaks, etc.
            
            if max_duty_today <= estimated_non_drive_time:
                # Need rest before continuing
                rest_periods.append({
                    'type': 'daily_rest',
                    'day': day,
                    'duration': self.MIN_OFF_DUTY_HOURS,
                    'reason': 'Daily rest period - HOS compliance',
                    'cumulative_cycle_hours': cumulative_hours
                })
                cumulative_hours = max(0, cumulative_hours - 24)  # Hours drop off after 8 days
                day += 1
                continue
            
            # Calculate actual drive time for today
            actual_drive_today = min(max_drive_today, max_duty_today - estimated_non_drive_time)
            actual_duty_today = actual_drive_today + estimated_non_drive_time
            
            remaining_drive_time -= actual_drive_today
            cumulative_hours += actual_duty_today
            
            if remaining_drive_time > 0:
                # Need daily rest
                rest_periods.append({
                    'type': 'daily_rest',
                    'day': day,
                    'duration': self.MIN_OFF_DUTY_HOURS,
                    'drive_time_today': actual_drive_today,
                    'duty_time_today': actual_duty_today,
                    'cumulative_cycle_hours': cumulative_hours
                })
            
            day += 1
        
        return rest_periods
    
    def _generate_schedule(self, trip: Trip, total_distance: float, total_drive_time: float,
                          fuel_stops: List[Dict], mandatory_breaks: List[Dict], 
                          daily_rest_periods: List[Dict]) -> Dict:
        """Generate complete trip schedule"""
        
        # Start time (current time for simplicity)
        current_time = datetime.now()
        
        schedule = {
            'trip_summary': {
                'total_distance': total_distance,
                'total_drive_time': total_drive_time,
                'estimated_total_time': total_drive_time + sum(stop['duration'] for stop in fuel_stops) + 
                                      sum(break_['duration'] for break_ in mandatory_breaks) +
                                      sum(rest['duration'] for rest in daily_rest_periods),
                'number_of_days': len(daily_rest_periods) + 1,
                'fuel_stops_count': len(fuel_stops),
                'mandatory_breaks_count': len(mandatory_breaks)
            },
            'daily_logs': [],
            'stops': [],
            'warnings': []
        }
        
        # Check cycle hours compliance
        final_cycle_hours = trip.current_cycle_used + schedule['trip_summary']['estimated_total_time']
        if final_cycle_hours > self.MAX_CYCLE_HOURS:
            schedule['warnings'].append(
                f"Trip may exceed 70-hour cycle limit. Current: {trip.current_cycle_used:.1f}h, "
                f"Estimated additional: {schedule['trip_summary']['estimated_total_time']:.1f}h"
            )
        
        # Generate daily logs
        self._generate_daily_logs(schedule, daily_rest_periods, current_time)
        
        return schedule
    
    def _generate_daily_logs(self, schedule: Dict, daily_rest_periods: List[Dict], start_time: datetime):
        """Generate daily log entries for the trip"""
        current_time = start_time
        
        for i, rest_period in enumerate(daily_rest_periods):
            day_number = i + 1
            
            # Calculate drive time and duty time for this day
            drive_time = rest_period.get('drive_time_today', 0)
            duty_time = rest_period.get('duty_time_today', 0)
            
            daily_log = {
                'date': current_time.date(),
                'day_number': day_number,
                'entries': [],
                'totals': {
                    'off_duty': rest_period['duration'],
                    'sleeper_berth': 0,
                    'driving': drive_time,
                    'on_duty_not_driving': duty_time - drive_time,
                    'total_miles': 0  # Would be calculated based on route segments
                }
            }
            
            # Add log entries for the day
            day_start = current_time.replace(hour=6, minute=0, second=0, microsecond=0)
            
            # Off duty period (previous night's rest)
            if i > 0:
                daily_log['entries'].append({
                    'duty_status': 'off_duty',
                    'start_time': time(0, 0),
                    'end_time': time(6, 0),
                    'location': 'Rest Area',
                    'remarks': 'Daily rest period'
                })
            
            # On duty and driving periods
            if drive_time > 0:
                driving_start = 6.0  # 6:00 AM
                driving_end = driving_start + drive_time
                
                daily_log['entries'].append({
                    'duty_status': 'driving',
                    'start_time': time(int(driving_start), int((driving_start % 1) * 60)),
                    'end_time': time(int(driving_end), int((driving_end % 1) * 60)),
                    'location': 'En Route',
                    'remarks': 'Driving to destination'
                })
            
            schedule['daily_logs'].append(daily_log)
            current_time += timedelta(days=1)
    
    def validate_hos_compliance(self, schedule: Dict) -> List[str]:
        """Validate the schedule against HOS regulations"""
        violations = []
        
        for daily_log in schedule['daily_logs']:
            # Check 11-hour driving limit
            if daily_log['totals']['driving'] > self.MAX_DRIVING_HOURS_PER_DAY:
                violations.append(
                    f"Day {daily_log['day_number']}: Exceeds 11-hour driving limit "
                    f"({daily_log['totals']['driving']:.1f} hours)"
                )
            
            # Check 14-hour duty window
            total_duty = (daily_log['totals']['driving'] + 
                         daily_log['totals']['on_duty_not_driving'])
            if total_duty > self.MAX_DUTY_HOURS_WINDOW:
                violations.append(
                    f"Day {daily_log['day_number']}: Exceeds 14-hour duty window "
                    f"({total_duty:.1f} hours)"
                )
        
        return violations
