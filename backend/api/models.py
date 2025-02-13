from django.db import models
from django.contrib.auth.models import User

class Expense(models.Model):
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    currency = models.CharField(max_length=3, default='USD')
    date = models.DateField()
    description = models.TextField(max_length=50, default="No description")
    category = models.ForeignKey('Category', on_delete=models.CASCADE, related_name='expenses')
    category_name = models.CharField(max_length=20, default='Other')
    is_recurring = models.BooleanField(default=False)
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
    
class Analytics(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='expense_analytics')
    category = models.ForeignKey('Category', on_delete=models.CASCADE, related_name='analytics', null=True, blank=True)
    month = models.IntegerField()
    year = models.IntegerField()
    total_amount = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    total_payments = models.IntegerField(default=0)

    class Meta:
        unique_together = ('user', 'category', 'month', 'year')

    def __str__(self):
        category_name = self.category.name if self.category else "All Categories"
        return f"{self.user.username} - {category_name} ({self.month}/{self.year}): {self.total_payments} payments, {self.total_amount} total"

class ExchangeRate(models.Model):
    currency = models.CharField(max_length=3, unique=True)
    rate_to_usd = models.DecimalField(max_digits=10, decimal_places=4)
    last_updated = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"1 USD = {self.rate_to_usd} {self.currency}"
