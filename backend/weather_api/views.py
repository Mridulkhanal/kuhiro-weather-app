import os
import requests
from rest_framework.decorators import api_view
from rest_framework.response import Response

@api_view(['GET'])
def current_weather(request):
    city = request.GET.get('city', 'Kathmandu')  # default to Kathmandu
    api_key = os.getenv("OPENWEATHERMAP_API_KEY")
    
    if not api_key:
        return Response({"error": "API key not found."}, status=500)

    url = f"http://api.openweathermap.org/data/2.5/weather?q={city}&appid={api_key}&units=metric"
    
    try:
        response = requests.get(url)
        data = response.json()
        return Response(data)
    except Exception as e:
        return Response({"error": str(e)}, status=500)
