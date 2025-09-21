from django.shortcuts import render,get_object_or_404
from .models import account

# Create your views here.
def accountView(request):
    accView = account.objects.all()
    return render(request,'account/account.html',{'account':accView})

def accView(request,id):
    accountView  = get_object_or_404(account,pk=id)
    return render(request,'account/account_det.html',{'accdet':accountView})
