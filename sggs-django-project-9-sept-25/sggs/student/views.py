from django.shortcuts import render,get_object_or_404
from .models import student

# Create your views here.
def studentView(request):
    stuView = student.objects.all()
    return render(request,'student/student.html',{'student':stuView})

def stuView(request,id):
    studentView  = get_object_or_404(student,pk=id)
    return render(request,'student/student_det.html',{'studet':studentView})
