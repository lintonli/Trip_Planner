from django.urls import path
from . import views

urlpatterns = [
    path('trips/', views.list_trips, name='list_trips'),
    path('trips/plan/', views.plan_trip, name='plan_trip'),
    path('trips/<uuid:trip_id>/', views.get_trip, name='get_trip'),
    path('trips/<uuid:trip_id>/logs/<str:log_date>/pdf/', views.get_daily_log_pdf, name='daily_log_pdf'),
]
