from django.contrib import admin
from .models import account

class accountAdmin(admin.ModelAdmin):
    # show all columns
    list_display = ['regno','fees_type','amount'] # make text fields searchable
    search_fields = ['regno','fees_type','amount']

    # allow sorting by any column
    ordering = ("id",)

    list_per_page = 3

admin.site.register(account, accountAdmin)
