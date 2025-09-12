from rest_framework import serializers
from .models import Trip, RouteSegment, Stop, DailyLog, LogEntry

class TripSerializer(serializers.ModelSerializer):
    class Meta:
        model = Trip
        fields = '__all__'
        read_only_fields = ('id', 'created_at', 'total_distance', 'estimated_drive_time')

class TripCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Trip
        fields = ['current_location', 'pickup_location', 'dropoff_location', 'current_cycle_used']

class RouteSegmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = RouteSegment
        fields = '__all__'

class StopSerializer(serializers.ModelSerializer):
    class Meta:
        model = Stop
        fields = '__all__'

class LogEntrySerializer(serializers.ModelSerializer):
    duration_hours = serializers.ReadOnlyField()
    
    class Meta:
        model = LogEntry
        fields = '__all__'

class DailyLogSerializer(serializers.ModelSerializer):
    log_entries = LogEntrySerializer(many=True, read_only=True)
    
    class Meta:
        model = DailyLog
        fields = '__all__'

class TripDetailSerializer(serializers.ModelSerializer):
    route_segments = RouteSegmentSerializer(many=True, read_only=True)
    stops = StopSerializer(many=True, read_only=True)
    daily_logs = DailyLogSerializer(many=True, read_only=True)
    
    class Meta:
        model = Trip
        fields = '__all__'
