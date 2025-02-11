from django.urls import path
from . import views

urlpatterns = [
    path('expenses/', views.ExpenseListCreateView.as_view(), name='expenses'),
    path('expenses/update/<int:pk>/', views.ExpenseUpdateView.as_view(), name='update_expense'),
    path('expenses/delete/<int:pk>/', views.ExpenseDeleteView.as_view(), name='delete_expense'),
    path('categories/', views.CategoryListCreateView.as_view(), name='categories'),
    path('settings/', views.SettingListCreateView.as_view(), name='settings'),    
    path('settings/update/', views.SettingUpdateView.as_view(), name='update_setting'),   
]