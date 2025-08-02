from django.urls import path
from .views import current_weather

urlpatterns = [
    path('weather/', current_weather),
]
