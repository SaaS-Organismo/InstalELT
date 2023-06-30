# Generated by Django 4.2 on 2023-06-29 19:43

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('core', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='Issue',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('created_at', models.DateField(auto_now_add=True, verbose_name='Created')),
                ('updated_at', models.DateField(auto_now=True, verbose_name='Updated')),
                ('is_active', models.BooleanField(default=True, verbose_name='Active')),
                ('statement', models.CharField(max_length=500, verbose_name='Statement')),
                ('image', models.ImageField(height_field=124, upload_to='issues_images', width_field=124)),
            ],
            options={
                'abstract': False,
            },
        ),
        migrations.AlterField(
            model_name='user',
            name='email',
            field=models.EmailField(blank=True, max_length=254, null=True),
        ),
        migrations.CreateModel(
            name='Challenge',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('created_at', models.DateField(auto_now_add=True, verbose_name='Created')),
                ('updated_at', models.DateField(auto_now=True, verbose_name='Updated')),
                ('is_active', models.BooleanField(default=True, verbose_name='Active')),
                ('issues', models.ManyToManyField(blank=True, null=True, to='core.issue')),
                ('user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
            ],
            options={
                'abstract': False,
            },
        ),
    ]