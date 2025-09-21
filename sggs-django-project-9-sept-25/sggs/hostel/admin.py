from django.contrib import admin
from .models import hostel

class hostelAdmin(admin.ModelAdmin):
    # show all columns
    list_display = ['regno','hostelName']   # make text fields searchable
    search_fields = ['regno','hostelName'] 

    # allow sorting by any column
    ordering = ("id",)

    list_per_page = 3

admin.site.register(hostel, hostelAdmin)
