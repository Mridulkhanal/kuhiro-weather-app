from django.urls import path
from .views import current_weather, forecast_weather
from .views import FeedbackListCreateAPIView
from . import views

urlpatterns = [
    path('weather/', current_weather),
    path('forecast/', forecast_weather),
    path("feedback/", views.FeedbackView.as_view(), name="feedback"),
]