from django.db import models
from django.contrib.auth.models import AbstractUser
#from django.contrib.postgres.fields import ArrayField


class Base(models.Model):
    created_at = models.DateField('Created', auto_now_add=True)
    updated_at = models.DateField('Updated', auto_now=True)
    is_active = models.BooleanField('Active', default=True)

    class Meta:
        abstract = True


class Challenge(Base):
    user = models.ForeignKey('User', on_delete=models.CASCADE)
    issues = models.ManyToManyField("Issue", null=True, blank=True)

class Issue(Base):
    statement = models.CharField('Statement', max_length=500)
    image = models.ImageField(upload_to="issues_images", height_field=124, width_field=124)


class User(AbstractUser):
    email = models.EmailField(null=True, blank=True)
    pass


class Attempt(models.Model):
    nickname = models.CharField('Statement', max_length=128, null=True, blank=True)
    score = models.IntegerField('Score', null=True, blank=True)
