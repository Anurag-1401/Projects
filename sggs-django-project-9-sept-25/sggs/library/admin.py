from django.contrib import admin
from .models import library

class libraryAdmin(admin.ModelAdmin):
    # show all columns
    list_display = ['regno','bookName','date']   # make text fields searchable
    search_fields = ['regno','bookName','date'] 

    # allow sorting by any column
    ordering = ("id",)

    list_per_page = 3

admin.site.register(library,libraryAdmin)
