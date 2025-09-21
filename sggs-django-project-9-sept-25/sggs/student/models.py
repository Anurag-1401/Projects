from django.db import models

class student(models.Model):
    regno = models.CharField(max_length=20, unique=True)   # Registration number
    name = models.CharField(max_length=100)                # Student name
    branch = models.CharField(max_length=50)               # e.g., CSE, ECE
    year = models.IntegerField()                           # e.g., 1, 2, 3, 4
    cet = models.DecimalField(max_digits=5, decimal_places=2)  # CET score

    def __str__(self):
        return f"{self.regno} - {self.name}"
