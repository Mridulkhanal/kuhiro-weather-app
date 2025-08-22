from rest_framework import serializers
from .models import Feedback
from .models import QuizScore

class FeedbackSerializer(serializers.ModelSerializer):
    class Meta:
        model = Feedback
        fields = '__all__'
    
class QuizScoreSerializer(serializers.ModelSerializer):
    class Meta:
        model = QuizScore
        fields = ["id", "player", "level", "score", "created_at"]