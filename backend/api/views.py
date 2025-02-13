from django.shortcuts import render
from django.db import transaction
from django.contrib.auth.models import User
from rest_framework import generics
from .serializers import UserSerializer, ExpenseSerializer, CategorySerializer, SettingSerializer, AnalyticsSerializer
from rest_framework.permissions import IsAuthenticated, AllowAny
from .models import Expense, Category, Setting, Analytics


# Create your views here.
class UserCreateView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [AllowAny]

    @transaction.atomic
    def perform_create(self, serializer):
        user = serializer.save()
        Setting.objects.create(user=user)

# Expense Views
class ExpenseListCreateView(generics.ListCreateAPIView):
    queryset = Expense.objects.all()
    serializer_class = ExpenseSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Expense.objects.filter(user=self.request.user, is_recurring=False)

    def perform_create(self, serializer):
        category_name = self.request.data.get('category_name')

        if category_name:
            category, created = Category.objects.get_or_create(
                name=category_name.lower().capitalize(),
                user=self.request.user
            )
            if created:
                print(f"Category '{category_name}' was created.")

            serializer.save(user=self.request.user, category=category, category_name=category.name)
        else:
            print("Category name is missing from the request data.")

class RecurringExpenseListView(generics.ListAPIView):
    serializer_class = ExpenseSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Expense.objects.filter(user=self.request.user, is_recurring=True)

class ExpenseUpdateView(generics.UpdateAPIView):
    queryset = Expense.objects.all()
    serializer_class = ExpenseSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        return Expense.objects.get(id=self.kwargs['pk'], user=self.request.user)

    def perform_update(self, serializer):
        category_name = self.request.data.get('category_name')

        if category_name:
            category, created = Category.objects.get_or_create(
                name=category_name.lower().capitalize(),
                user=self.request.user
            )
            if created:
                print(f"Category '{category_name}' was created.")
            serializer.save(user=self.request.user, category=category, category_name=category.name)
        else:
            print("Category name is missing from the request data.")

class ExpenseDeleteView(generics.DestroyAPIView):
    queryset = Expense.objects.all()
    serializer_class = ExpenseSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Expense.objects.filter(user=self.request.user)


# Category Views
class CategoryListCreateView(generics.ListCreateAPIView):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Category.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        if serializer.is_valid():
            serializer.save()
        else:
            print(serializer.errors)


# Setting Views
class SettingListCreateView(generics.ListCreateAPIView):
    queryset = Setting.objects.all()
    serializer_class = SettingSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Setting.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        if serializer.is_valid():
            serializer.save(user=self.request.user)
        else:
            print(serializer.errors)

class SettingUpdateView(generics.UpdateAPIView):
    queryset = Setting.objects.all()
    serializer_class = SettingSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        return Setting.objects.get(user=self.request.user)

    def perform_update(self, serializer):
        serializer.save(user=self.request.user)

# Analytics Views
class AnalyticsListView(generics.ListAPIView):
    queryset = Analytics.objects.all()
    serializer_class = AnalyticsSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Analytics.objects.filter(user=self.request.user)