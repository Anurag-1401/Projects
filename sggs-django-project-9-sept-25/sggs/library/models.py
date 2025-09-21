from django.db import models
from django.utils.translation import gettext_lazy as _


class library(models.Model):
    regno = models.CharField(max_length=20, unique=True)
    bookName = models.CharField(max_length=100)
    date = models.DateField(_('Date'))

    def __str__(self):
        return f"{self.regno} - {self.bookName}"
