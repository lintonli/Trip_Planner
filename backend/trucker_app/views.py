from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from .models import Trip, DailyLog, LogEntry
from .serializers import (
    TripSerializer, TripCreateSerializer, TripDetailSerializer,
    DailyLogSerializer
)
from .services.route_service import RouteService
from .services.hos_service import HOSComplianceService
from datetime import datetime
import logging

logger = logging.getLogger(__name__)

@api_view(['POST'])
def plan_trip(request):
    """
    Plan a trip with route calculation and HOS compliance
    """
    serializer = TripCreateSerializer(data=request.data)
    if not serializer.is_valid():
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    # Create trip instance
    trip = serializer.save()
    
    try:
        # Initialize services
        route_service = RouteService()
        hos_service = HOSComplianceService()
        
        # Geocode locations
        current_coords = route_service.geocode_location(trip.current_location)
        pickup_coords = route_service.geocode_location(trip.pickup_location)
        dropoff_coords = route_service.geocode_location(trip.dropoff_location)
        
        # Check which locations failed geocoding
        failed_locations = []
        if not current_coords:
            failed_locations.append(f"current location '{trip.current_location}'")
        if not pickup_coords:
            failed_locations.append(f"pickup location '{trip.pickup_location}'")
        if not dropoff_coords:
            failed_locations.append(f"dropoff location '{trip.dropoff_location}'")
            
        if failed_locations:
            error_msg = f"Could not geocode: {', '.join(failed_locations)}. Please use specific city and state format (e.g., 'Los Angeles, CA')"
            return Response(
                {'error': error_msg}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Calculate routes
        route_to_pickup = route_service.calculate_route(current_coords, pickup_coords)
        route_to_dropoff = route_service.calculate_route(pickup_coords, dropoff_coords)
        
        if not route_to_pickup or not route_to_dropoff:
            return Response(
                {'error': 'Could not calculate route between the specified locations'}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Combine route data
        total_distance = route_to_pickup['distance'] + route_to_dropoff['distance']
        total_drive_time = route_to_pickup['duration'] + route_to_dropoff['duration']
        
        # Update trip with calculated values
        trip.total_distance = total_distance
        trip.estimated_drive_time = total_drive_time
        trip.save()
        
        # Calculate HOS compliant schedule
        route_data = {
            'distance': total_distance,
            'duration': total_drive_time,
            'geometry': {
                'to_pickup': route_to_pickup['geometry'],
                'to_dropoff': route_to_dropoff['geometry']
            }
        }
        
        schedule = hos_service.calculate_trip_schedule(trip, route_data)
        
        # Create daily logs
        create_daily_logs_from_schedule(trip, schedule)
        
        # Prepare response
        trip_serializer = TripDetailSerializer(trip)
        
        response_data = {
            'trip': trip_serializer.data,
            'route': {
                'total_distance': total_distance,
                'total_drive_time': total_drive_time,
                'to_pickup': route_to_pickup,
                'to_dropoff': route_to_dropoff,
                'coordinates': {
                    'current': current_coords,
                    'pickup': pickup_coords,
                    'dropoff': dropoff_coords
                }
            },
            'schedule': schedule,
            'hos_compliance': {
                'violations': hos_service.validate_hos_compliance(schedule),
                'is_compliant': len(hos_service.validate_hos_compliance(schedule)) == 0
            }
        }
        
        return Response(response_data, status=status.HTTP_201_CREATED)
        
    except Exception as e:
        # Clean up trip if there was an error
        trip.delete()
        return Response(
            {'error': f'Error planning trip: {str(e)}'}, 
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )

@api_view(['GET'])
def get_trip(request, trip_id):
    """
    Get trip details with route and schedule information
    """
    trip = get_object_or_404(Trip, id=trip_id)
    serializer = TripDetailSerializer(trip)
    return Response(serializer.data)

@api_view(['GET'])
def list_trips(request):
    """
    List all trips
    """
    trips = Trip.objects.all()
    serializer = TripSerializer(trips, many=True)
    return Response(serializer.data)

@api_view(['GET'])
def get_daily_log_pdf(request, trip_id, log_date):
    """
    Generate and return PDF for daily log
    """
    from django.http import HttpResponse
    from .utils.pdf_generator import generate_daily_log_pdf
    
    trip = get_object_or_404(Trip, id=trip_id)
    try:
        log_date_obj = datetime.strptime(log_date, '%Y-%m-%d').date()
        daily_log = get_object_or_404(DailyLog, trip=trip, date=log_date_obj)
        
        pdf_buffer = generate_daily_log_pdf(daily_log)
        
        response = HttpResponse(pdf_buffer.getvalue(), content_type='application/pdf')
        response['Content-Disposition'] = f'attachment; filename="daily_log_{log_date}.pdf"'
        
        return response
        
    except ValueError:
        return Response(
            {'error': 'Invalid date format. Use YYYY-MM-DD'}, 
            status=status.HTTP_400_BAD_REQUEST
        )

def create_daily_logs_from_schedule(trip, schedule):
    """
    Create DailyLog and LogEntry instances from the calculated schedule
    """
    for i, daily_log_data in enumerate(schedule['daily_logs']):
        # Create daily log
        daily_log = DailyLog.objects.create(
            trip=trip,
            date=daily_log_data['date'],
            log_order=daily_log_data['day_number'],
            total_miles=daily_log_data['totals'].get('total_miles', 0),
            total_hours_off_duty=daily_log_data['totals']['off_duty'],
            total_hours_sleeper_berth=daily_log_data['totals']['sleeper_berth'],
            total_hours_driving=daily_log_data['totals']['driving'],
            total_hours_on_duty_not_driving=daily_log_data['totals']['on_duty_not_driving'],
        )
        
        # Create log entries
        for entry_data in daily_log_data['entries']:
            LogEntry.objects.create(
                daily_log=daily_log,
                duty_status=entry_data['duty_status'],
                start_time=entry_data['start_time'],
                end_time=entry_data['end_time'],
                location=entry_data['location'],
                remarks=entry_data['remarks']
            )
