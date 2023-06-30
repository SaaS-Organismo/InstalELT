from django.contrib import admin
from core.models import User, Challenge, Issue, Attempt
# Register your models here.


@admin.register(User)
class UserAdmin(admin.ModelAdmin):
    pass

@admin.register(Challenge)
class ChallengeAdmin(admin.ModelAdmin):
    pass

@admin.register(Issue)
class IssueAdmin(admin.ModelAdmin):
    pass

@admin.register(Attempt)
class AttemptAdmin(admin.ModelAdmin):
    pass
