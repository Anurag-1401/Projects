from django.urls import path
from . import views

urlpatterns = [
    path('',views.hostelView,name='hostelView'),
    path('<int:id>/',views.hostView,name='hostView'),
    # path('all_stores/',views.all_store,name='store'),

]