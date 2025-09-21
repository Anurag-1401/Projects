from django.shortcuts import render,get_object_or_404
from .models import hostel

# Create your views here.
def hostelView(request):
    hostView = hostel.objects.all()
    return render(request,'hostel/hostel.html',{'hostel':hostView})

def hostView(request,id):
    hostelView  = get_object_or_404(hostel,pk=id)
    return render(request,'hostel/hostel_det.html',{'hostdet':hostelView})
