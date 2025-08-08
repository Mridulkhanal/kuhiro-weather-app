import requests
from django.http import JsonResponse
from django.conf import settings
from rest_framework import generics
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import Feedback
from .serializers import FeedbackSerializer

class FeedbackView(APIView):
    def get(self, request):
        feedbacks = Feedback.objects.all().order_by("-created_at")
        serializer = FeedbackSerializer(feedbacks, many=True)
        return Response(serializer.data)

    def post(self, request):
        serializer = FeedbackSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({"message": "Feedback submitted successfully!"}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class FeedbackListCreateAPIView(generics.ListCreateAPIView):
    queryset = Feedback.objects.order_by('-submitted_at')
    serializer_class = FeedbackSerializer

OPENWEATHERMAP_API_KEY = settings.OPENWEATHERMAP_API_KEY


def current_weather(request):
    city = request.GET.get("city", "Kathmandu")
    unit = request.GET.get("unit", "metric")  # NEW

    url = (
        f"https://api.openweathermap.org/data/2.5/weather?"
        f"q={city}&appid={OPENWEATHERMAP_API_KEY}&units={unit}"
    )

    try:
        response = requests.get(url)
        response.raise_for_status()
        return JsonResponse(response.json())
    except requests.RequestException as e:
        return JsonResponse({"error": "Failed to fetch weather data"}, status=500)


def forecast_weather(request):
    city = request.GET.get("city", "Kathmandu")
    unit = request.GET.get("unit", "metric")  # NEW

    url = (
        f"https://api.openweathermap.org/data/2.5/forecast?"
        f"q={city}&appid={OPENWEATHERMAP_API_KEY}&units={unit}"
    )

    try:
        response = requests.get(url)
        response.raise_for_status()
        return JsonResponse(response.json())
    except requests.RequestException as e:
        return JsonResponse({"error": "Failed to fetch forecast data"}, status=500)