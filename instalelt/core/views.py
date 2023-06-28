from django.shortcuts import render, redirect, reverse
from core.models import Challenge, Issue, User
from core.forms import NewChallengeForm, UserRegistrationForm
from django.contrib.auth import authenticate, login
import json
# Create your views here.


def home(request):
    return render(request, 'core/pages/home.html')


def onboarding(request):
    if request.user.is_authenticated:
        return redirect('core:new-challenge')
    return render(request, 'core/pages/onboarding.html')


def new_challenge(request):
    ctx = {
        "user": request.user
    }
    if request.method == "POST":
        new_challenge_form = NewChallengeForm(request.POST)
        if new_challenge_form.is_valid():
            new_challenge_form.save(request.user)
        return redirect(reverse("core:challenge-detail", kwargs={"challenge_id": 1}))

    elif request.method == "GET":
        return render(request, 'core/pages/new-challenge.html', ctx)


def challenge_detail(request, challenge_id=None):
    question = int(request.GET.get("question", 1))
    challenge = Challenge.objects.get(id=challenge_id)
    ctx = {
        "current_question": question,
        "previous_question": question - 1,
        "next_question": question + 1,
    }
    if request.method == "GET":
        print(ctx)
    elif request.method == "POST":
        payload = json.loads(request.POST.get("payload", {}))
        challenge.schema = payload
        challenge.save()
        print(payload)
    return render(request, 'core/pages/challenge-detail.html', ctx)


def challenge_result(request, challenge_id=None):
    return render(request, 'core/pages/challenge-result.html')


def new_player(request):
    if request.method == 'POST':
        form = UserRegistrationForm(request.POST)
        if form.is_valid():
            username = form.cleaned_data['username']
            password = form.cleaned_data['password']
            User.objects.create_user(username=username, password=password)
            user = authenticate(request, username=username, password=password)
            login(request, user)
            return redirect('core:home')  # Redirect to home page after successful registration
    else:
        form = UserRegistrationForm()
    return render(request, 'core/pages/new-player.html', {'form': form})


def ranking(request):
    return render(request, 'core/pages/ranking.html')
