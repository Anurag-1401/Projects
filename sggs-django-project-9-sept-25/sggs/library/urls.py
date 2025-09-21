from django.urls import path
from . import views

urlpatterns = [
    path('',views.libraryView,name='libraryView'),
    path('<int:id>/',views.libView,name='libView'),
    # path('all_stores/',views.all_store,name='store'),

]