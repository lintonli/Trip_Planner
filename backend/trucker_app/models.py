from django.db import models
from django.utils import timezone
import uuid

class Trip(models.Model):
    """Model for storing trip information"""
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    current_location = models.CharField(max_length=255)
    pickup_location = models.CharField(max_length=255)
    dropoff_location = models.CharField(max_length=255)
    current_cycle_used = models.FloatField(default=0.0)  # Hours already used in current 8-day cycle
    created_at = models.DateTimeField(default=timezone.now)
    
    # Calculated fields
    total_distance = models.FloatField(null=True, blank=True)  # Total trip distance in miles
    estimated_drive_time = models.FloatField(null=True, blank=True)  # In hours
    
    class Meta:
        ordering = ['-created_at']
    
    def __str__(self):
        return f"Trip from {self.pickup_location} to {self.dropoff_location}"

class RouteSegment(models.Model):
    """Model for storing route segments"""
    trip = models.ForeignKey(Trip, on_delete=models.CASCADE, related_name='route_segments')
    segment_order = models.IntegerField()
    start_location = models.CharField(max_length=255)
    end_location = models.CharField(max_length=255)
    distance = models.FloatField()  # Distance in miles
    duration = models.FloatField()  # Duration in hours
    geometry = models.JSONField(null=True, blank=True)  # GeoJSON for route visualization
    
    class Meta:
        ordering = ['segment_order']
    
    def __str__(self):
        return f"Segment {self.segment_order}: {self.start_location} to {self.end_location}"

class Stop(models.Model):
    """Model for stops along the route (fuel, rest, pickup, delivery)"""
    STOP_TYPES = [
        ('pickup', 'Pickup'),
        ('delivery', 'Delivery'),
        ('fuel', 'Fuel Stop'),
        ('rest', 'Rest Break'),
        ('mandatory_break', 'Mandatory Break'),
    ]
    
    trip = models.ForeignKey(Trip, on_delete=models.CASCADE, related_name='stops')
    stop_type = models.CharField(max_length=20, choices=STOP_TYPES)
    location = models.CharField(max_length=255)
    latitude = models.FloatField(null=True, blank=True)
    longitude = models.FloatField(null=True, blank=True)
    stop_order = models.IntegerField()
    duration = models.FloatField()  # Duration in hours
    arrival_time = models.DateTimeField(null=True, blank=True)
    departure_time = models.DateTimeField(null=True, blank=True)
    distance_from_start = models.FloatField(default=0.0)  # Cumulative distance from trip start
    
    class Meta:
        ordering = ['stop_order']
    
    def __str__(self):
        return f"{self.get_stop_type_display()} at {self.location}"

class DailyLog(models.Model):
    """Model for daily log sheets following FMCSA requirements"""
    trip = models.ForeignKey(Trip, on_delete=models.CASCADE, related_name='daily_logs')
    date = models.DateField()
    log_order = models.IntegerField()  # Order of logs for multi-day trips
    
    # Driver information
    driver_name = models.CharField(max_length=100, default="Driver Name")
    co_driver_name = models.CharField(max_length=100, blank=True)
    carrier_name = models.CharField(max_length=100, default="Trucking Company")
    main_office_address = models.CharField(max_length=255, default="Main Office Address")
    vehicle_number = models.CharField(max_length=50, default="Vehicle #123")
    
    # Daily totals
    total_miles = models.FloatField(default=0.0)
    total_hours_off_duty = models.FloatField(default=0.0)
    total_hours_sleeper_berth = models.FloatField(default=0.0)
    total_hours_driving = models.FloatField(default=0.0)
    total_hours_on_duty_not_driving = models.FloatField(default=0.0)
    
    # Shipping information
    shipping_document = models.CharField(max_length=100, blank=True)
    shipper_commodity = models.CharField(max_length=255, blank=True)
    
    created_at = models.DateTimeField(default=timezone.now)
    
    class Meta:
        ordering = ['date', 'log_order']
        unique_together = ['trip', 'date']
    
    def __str__(self):
        return f"Daily Log for {self.date} - Trip {self.trip.id}"

class LogEntry(models.Model):
    """Model for individual duty status entries within a daily log"""
    DUTY_STATUS_CHOICES = [
        ('off_duty', 'Off Duty'),
        ('sleeper_berth', 'Sleeper Berth'),
        ('driving', 'Driving'),
        ('on_duty_not_driving', 'On Duty (Not Driving)'),
    ]
    
    daily_log = models.ForeignKey(DailyLog, on_delete=models.CASCADE, related_name='log_entries')
    duty_status = models.CharField(max_length=20, choices=DUTY_STATUS_CHOICES)
    start_time = models.TimeField()
    end_time = models.TimeField()
    location = models.CharField(max_length=255)
    remarks = models.TextField(blank=True)
    
    class Meta:
        ordering = ['start_time']
    
    def __str__(self):
        return f"{self.get_duty_status_display()}: {self.start_time} - {self.end_time}"
    
    @property
    def duration_hours(self):
        """Calculate duration in hours"""
        import datetime
        start = datetime.datetime.combine(datetime.date.today(), self.start_time)
        end = datetime.datetime.combine(datetime.date.today(), self.end_time)
        
        # Handle overnight entries
        if end < start:
            end += datetime.timedelta(days=1)
        
        delta = end - start
        return delta.total_seconds() / 3600
