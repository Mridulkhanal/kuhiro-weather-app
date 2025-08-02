from django.urls import path
from .views import current_weather, forecast_weather

urlpatterns = [
    path('weather/', current_weather),
    path('forecast/', forecast_weather),
]