from django.shortcuts import render, redirect, reverse

# Create your views here.


def home(request):
    return render(request, 'core/pages/home.html')


def new_challenge(request):
    if request.method == "POST":
        print(request.POST)
        nickname = request.POST.get("nickname", None)
        return redirect(reverse("core:challenge-detail", kwargs={"challenge_id": 1}))

    elif request.method == "GET":
        return render(request, 'core/pages/new-challenge.html')


def challenge_detail(request, challenge_id=None):
    question = int(request.GET.get("question", 1))
    ctx = {
        "current_question": question,
        "previous_question": question - 1,
        "next_question": question + 1,
    }
    print(ctx)
    return render(request, 'core/pages/challenge-detail.html', ctx)


def challenge_result(request, pk):
    return render(request, 'core/pages/challenge-result.html')
