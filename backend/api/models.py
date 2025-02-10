from django.db import models
from django.contrib.auth.models import User

# Create your models here.
class Expense(models.Model):
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    currency = models.CharField(max_length=3, default='PEN')
    date = models.DateField()
    description = models.TextField(max_length=50, default="No description")
    category = models.CharField(max_length=20)
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='expenses')

    def __str__(self):
        return f"{self.category}: {self.currency} {self.amount} on {self.date}"