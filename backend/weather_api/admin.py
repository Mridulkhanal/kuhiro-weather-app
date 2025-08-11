from django.contrib import admin
from .models import Feedback

@admin.register(Feedback)
class FeedbackAdmin(admin.ModelAdmin):
    list_display = ('name', 'email', 'message', 'submitted_at')
    search_fields = ('name', 'email', 'message')
    list_filter = ('submitted_at',)
    ordering = ('-submitted_at',)
    actions = ['delete_selected']

    def has_delete_permission(self, request, obj=None):
        return True