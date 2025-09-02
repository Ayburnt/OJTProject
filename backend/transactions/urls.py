# transactions/urls.py
from django.urls import path
from .views import TransactionCreateView

urlpatterns = [
    path("create/", TransactionCreateView.as_view(), name="transaction-create"),
]
