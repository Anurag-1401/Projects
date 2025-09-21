from django.db import models

class hostel(models.Model):
    regno = models.CharField(max_length=20, unique=True)   # Registration number
    hostelName = models.CharField(max_length=100)

    def __str__(self):
        return f"{self.regno} - {self.hostelName}"
