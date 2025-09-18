from django.urls import path
from . import views

urlpatterns = [
    path('',views.studentView,name='studentView'),
    path('<int:id>/',views.stuView,name='stuView'),
    # path('all_stores/',views.all_store,name='store'),

]