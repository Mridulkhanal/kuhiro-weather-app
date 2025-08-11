import requests
from django.http import JsonResponse
from django.conf import settings
from rest_framework import generics
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import Feedback
from .serializers import FeedbackSerializer
from rest_framework.pagination import PageNumberPagination
from django.core.mail import EmailMultiAlternatives

class FeedbackPagination(PageNumberPagination):
    page_size = 5  # Load 5 feedback entries at a time
    page_size_query_param = 'page_size'
    max_page_size = 20

class FeedbackView(generics.ListCreateAPIView):
    queryset = Feedback.objects.all().order_by('-submitted_at')
    serializer_class = FeedbackSerializer
    pagination_class = FeedbackPagination
    
    def perform_create(self, serializer):
        feedback = serializer.save()

         # Email to admin (HTML)
        subject_admin = f"New Feedback from {feedback.name}"
        text_content_admin = f"Name: {feedback.name}\nEmail: {feedback.email}\n\nMessage:\n{feedback.message}"
        html_content_admin = f"""
        <html>
        <body style="font-family: Arial, sans-serif; color: #333;">
            <h2 style="color: #1a73e8;">New Feedback Received</h2>
            <p><strong>Name:</strong> {feedback.name}</p>
            <p><strong>Email:</strong> {feedback.email}</p>
            <p><strong>Message:</strong></p>
            <blockquote style="background:#f5f5f5;padding:10px;border-left:4px solid #1a73e8;">
                {feedback.message}
            </blockquote>
        </body>
        </html>
        """
        msg_admin = EmailMultiAlternatives(subject_admin, text_content_admin, settings.DEFAULT_FROM_EMAIL, [settings.DEFAULT_FROM_EMAIL])
        msg_admin.attach_alternative(html_content_admin, "text/html")
        msg_admin.send()

        # Email to user (HTML)
        subject_user = "Thanks for your feedback - Kuhiro"
        text_content_user = f"""Hi {feedback.name},

Thanks for sending your feedback to Kuhiro. 
We have received your message and will get back to you soon.

Best regards,
Kuhiro Team
"""
        html_content_user = f"""
        <html>
        <body style="font-family: Arial, sans-serif; color: #333;">
            <h2 style="color: #1a73e8;">Hello {feedback.name},</h2>
            <p>Thank you for sharing your feedback with <strong>Kuhiro</strong>! We truly appreciate it.</p>
            <p>We have received your message and will respond if needed.</p>
            <hr>
            <p style="font-size:14px;color:#777;">This is an automated confirmation. Please do not reply.</p>
            <p style="color: #1a73e8; font-weight: bold;">Kuhiro Weather Team</p>
        </body>
        </html>
        """
        msg_user = EmailMultiAlternatives(subject_user, text_content_user, settings.DEFAULT_FROM_EMAIL, [feedback.email])
        msg_user.attach_alternative(html_content_user, "text/html")
        msg_user.send()
        
class FeedbackView(APIView):
    def get(self, request):
        feedbacks = Feedback.objects.all().order_by("-submitted_at")
        serializer = FeedbackSerializer(feedbacks, many=True)
        return Response(serializer.data)
    def post(self, request):
        serializer = FeedbackSerializer(data=request.data)
        if serializer.is_valid():
            feedback = serializer.save()

            # Email to admin (HTML)
            subject_admin = f"New Feedback from {feedback.name}"
            text_content_admin = f"Name: {feedback.name}\nEmail: {feedback.email}\n\nMessage:\n{feedback.message}"
            html_content_admin = f"""
            <html>
            <body style="font-family: Arial, sans-serif; color: #333;">
                <h2 style="color: #1a73e8;">New Feedback Received</h2>
                <p><strong>Name:</strong> {feedback.name}</p>
                <p><strong>Email:</strong> {feedback.email}</p>
                <p><strong>Message:</strong></p>
                <blockquote style="background:#f5f5f5;padding:10px;border-left:4px solid #1a73e8;">
                    {feedback.message}
                </blockquote>
            </body>
            </html>
            """
            msg_admin = EmailMultiAlternatives(subject_admin, text_content_admin, settings.DEFAULT_FROM_EMAIL, [settings.EMAIL_HOST_USER])
            msg_admin.attach_alternative(html_content_admin, "text/html")
            msg_admin.send()

            # Email to user (HTML)
            subject_user = "Thank you for your feedback - Kuhiro"
            text_content_user = f"""Hi {feedback.name},

Thank you for your valuable feedback.
We appreciate your time and effort in helping us improve Kuhiro.

Best regards,
Kuhiro Team
"""
            html_content_user = f"""
            <html>
            <body style="font-family: Arial, sans-serif; color: #333;">
                <h2 style="color: #1a73e8;">Hello {feedback.name},</h2>
                <p>Thank you for sharing your feedback with <strong>Kuhiro</strong>! We truly appreciate it.</p>
                <p>We have received your message and will respond if needed.</p>
                <hr>
                <p style="font-size:14px;color:#777;">This is an automated confirmation. Please do not reply.</p>
                <p style="color: #1a73e8; font-weight: bold;">Kuhiro Team</p>
            </body>
            </html>
            """
            msg_user = EmailMultiAlternatives(subject_user, text_content_user, settings.DEFAULT_FROM_EMAIL, [feedback.email])
            msg_user.attach_alternative(html_content_user, "text/html")
            msg_user.send()

            return Response(serializer.data, status=status.HTTP_201_CREATED)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class FeedbackListCreateAPIView(generics.ListCreateAPIView):
    queryset = Feedback.objects.order_by('-submitted_at')
    serializer_class = FeedbackSerializer

OPENWEATHERMAP_API_KEY = settings.OPENWEATHERMAP_API_KEY


def current_weather(request):
    city = request.GET.get("city", "Kathmandu")
    unit = request.GET.get("unit", "metric") 

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
    unit = request.GET.get("unit", "metric")

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