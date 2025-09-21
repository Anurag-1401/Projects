from django.urls import path
from . import views

urlpatterns = [
    path('',views.accountView,name='accountView'),
    path('<int:id>/',views.accView,name='accView'),
    # path('all_stores/',views.all_store,name='store'),

]