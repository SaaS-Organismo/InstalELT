from django.urls import path
from core import views
from django.contrib.auth import views as auth_views

app_name = 'core'

urlpatterns = [
    path('', views.home, name='home'),
    path('inicio/', views.onboarding, name='onboarding'),
    path('novo-desafio/', views.new_challenge, name="new-challenge"),
    path('desafio/<int:challenge_id>', views.challenge_detail, name="challenge-detail"),
    path('desafio/<int:challenge_id>/resultado', views.challenge_result, name="challenge-result"),
    path('novo-jogador/', views.new_player, name="register"),
    path('entrar/', auth_views.LoginView.as_view(template_name='core/pages/login.html'), name='login'),
    path('sair/', auth_views.LogoutView.as_view(), name='logout'),
    path('ranking/', views.ranking, name='ranking'),

]
