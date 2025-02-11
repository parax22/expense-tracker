from django.contrib.auth.models import User
from rest_framework import serializers
from .models import Expense, Setting, Category


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["id", "username", "password"]
        extra_kwargs = {"password": {"write_only": True}}

    def create(self, validated_data):
        user = User.objects.create_user(**validated_data)
        return user
    
class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ["id", "name", "user"]
        extra_kwargs = {"user": {"read_only": True}}

    def validate_name(self, value):
        if Category.objects.filter(name__iexact=value, user=self.context["request"].user).exists():
            raise serializers.ValidationError("You already have a category with this name")
        return value

    def create(self, validated_data):
        validated_data["name"] = validated_data["name"].lower().capitalize()
        category = Category.objects.create(**validated_data)
        return category

class SettingSerializer(serializers.ModelSerializer):
    class Meta:
        model = Setting
        fields = ["id", "preferred_currency", "user"]
        extra_kwargs = {"user": {"read_only": True}}

class ExpenseSerializer(serializers.ModelSerializer):
    class Meta:
        model = Expense
        fields = ["id", "amount", "currency", "date", "description", "category", "category_name", "user"]
        extra_kwargs = {"user": {"read_only": True}, "category": {"read_only": True}}
