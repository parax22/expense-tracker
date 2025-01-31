from django.urls import path
from . import views

urlpatterns = [
    path('expenses/', views.CreateExpenseListView.as_view(), name='expenses'),
    path('expenses/delete/<int:pk>/', views.DeleteExpenseView.as_view(), name='delete_expense'),
]