from django.db import models
from django.contrib.auth.models import User

class Expense(models.Model):
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    currency = models.CharField(max_length=3, default='USD')
    date = models.DateField()
    description = models.TextField(max_length=50, default="No description")
    category = models.ForeignKey('Category', on_delete=models.CASCADE, related_name='expenses')
    category_name = models.CharField(max_length=20, default='Other')
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='expenses')

    def __str__(self):
        return f"{self.description}: {self.currency} {self.amount} on {self.date}"
    
class Setting(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='settings')
    preferred_currency = models.CharField(max_length=3, default='USD')

    def __str__(self):
        return f"{self.user.username}'s settings"

class Category(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="categories")
    name = models.CharField(max_length=20)

    class Meta:
        constraints = [
            models.UniqueConstraint(fields=['name', 'user'], name='unique_category_name_per_user', violation_error_message='You already have a category with this name')
        ]

    def save(self, **kwargs):
        self.name = self.name.lower().capitalize()
        super().save(**kwargs)

    def __str__(self):
        return f"{self.user.username} - {self.name}"