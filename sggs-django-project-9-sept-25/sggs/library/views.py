from django.shortcuts import render,get_object_or_404
from .models import library

# Create your views here.
def libraryView(request):
    libView = library.objects.all()
    return render(request,'library/library.html',{'library':libView})

def libView(request,id):
    libraryView  = get_object_or_404(library,pk=id)
    return render(request,'library/library_det.html',{'libdet':libraryView})
