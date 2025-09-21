from django.contrib import admin
from .models import student

class studentAdmin(admin.ModelAdmin):
    # show all columns
    list_display = ['regno','name','branch','year']   # make text fields searchable
    search_fields = ['regno','name','branch','year'] 

    # allow sorting by any column
    ordering = ("id",)

    list_per_page = 3

admin.site.register(student, studentAdmin)
