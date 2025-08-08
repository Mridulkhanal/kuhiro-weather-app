from django.urls import path
from .views import current_weather, forecast_weather
from .views import FeedbackListCreateAPIView

urlpatterns = [
    path('weather/', current_weather),
    path('forecast/', forecast_weather),
     path("feedback/", FeedbackListCreateAPIView.as_view(), name="feedback-api"),
]