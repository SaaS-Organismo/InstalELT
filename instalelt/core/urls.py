from django.urls import path
from core import views

app_name = 'core'

urlpatterns = [
    path('', views.home, name='home'),
    path('novo-desafio', views.new_challenge, name="new-challenge"),
    path('desafio/<int:challenge_id>', views.challenge_detail, name="challenge-detail")

]
