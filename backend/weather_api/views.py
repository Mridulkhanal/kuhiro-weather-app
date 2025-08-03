import requests
from django.http import JsonResponse
from django.conf import settings

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