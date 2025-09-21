from django.db import models
from django.utils import timezone
from django.contrib.auth.models import User

# Create your models here.
class account(models.Model):
    APP_TYPE = [
        ('ht', 'height'),
        ('wt', 'weight'),
    ]

    regno = models.CharField(max_length=50, unique=True)  # registration number
    fees_type = models.CharField(max_length=50)  # e.g., Monthly, Yearly
    amount = models.DecimalField(max_digits=10, decimal_places=2)  # fee amount

    def __str__(self):
        return f"{self.regno} - {self.regno}"
