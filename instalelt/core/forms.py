from django import forms
from core.models import Challenge, Issue, User
from django.db import models
from random import choices


class NewChallengeForm(forms.Form):
    class DifficultyLevels(models.TextChoices):
        EASY = 'Easy', 'Fácil'
        MEDIUM = 'Medium', 'Médio'
        HARD = 'Hard', 'Difícil'
    number_of_questions = forms.IntegerField(initial=5)
    difficulty_level = forms.ChoiceField(choices=DifficultyLevels.choices, initial=DifficultyLevels.EASY)

    def save(self, user=None):
        issues = Issue.objects.all()
        selected_issues = issues
        if issues.count():
            selected_issues = choices(self.cleaned_data['number_of_questions'], Issue.objects.all())
        obj = Challenge.objects.create(user=user)
        obj.save()
        print("here")


class UserRegistrationForm(forms.ModelForm):
    password = forms.CharField(label='Password', widget=forms.PasswordInput)
    confirm_password = forms.CharField(label='Confirm Password', widget=forms.PasswordInput)

    class Meta:
        model = User
        fields = ['username', 'password', 'confirm_password']

    def __init__(self, *args, **kwargs):
        super(forms.ModelForm, self).__init__(*args, **kwargs)
        for field in self.fields.keys():
            self.fields[field].widget.attrs.update({"class": "form-control"})
        self.fields['username'].label = 'Nome de Jogador'
        self.fields['password'].label = 'Senha'
        self.fields['confirm_password'].label = 'Confirmação de Senha'
        self.fields['username'].help_text = ''


    def clean_confirm_password(self):
        password = self.cleaned_data.get('password')
        confirm_password = self.cleaned_data.get('confirm_password')
        if password and confirm_password and password != confirm_password:
            raise forms.ValidationError("As senhas devem ser iguais!")
        return confirm_password

