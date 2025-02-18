from django.db.models.signals import post_save, post_delete
from django.dispatch import receiver
from .models import Expense, Analytics, Setting
from decimal import Decimal
from .handlers.conversion import get_conversion_rate

@receiver(post_save, sender=Expense)
def update_analytics(sender, instance, **kwargs):
    user = instance.user
    preferred_currency = user.settings.preferred_currency 
    
    conversion_rate = get_conversion_rate(instance.currency, preferred_currency)

    expenses = Expense.objects.filter(
        user=user,
        category=instance.category,
        date__month=instance.date.month,
        date__year=instance.date.year,
        is_recurring=False
    )
    
    total_amount = Decimal('0')
    total_payments = 0
    
    for expense in expenses:
        converted_amount = expense.amount * conversion_rate
        total_amount += converted_amount
        total_payments += 1

    analytics, created = Analytics.objects.get_or_create(
        user=user,
        category=instance.category,
        month=instance.date.month,
        year=instance.date.year,
    )
    
    analytics.total_amount = total_amount
    analytics.total_payments = total_payments
    analytics.save()

@receiver(post_delete, sender=Expense)
def update_analytics_on_delete(sender, instance, **kwargs):
    user = instance.user
    preferred_currency = user.settings.preferred_currency 
    
    conversion_rate = get_conversion_rate(instance.currency, preferred_currency)

    expenses = Expense.objects.filter(
        user=user,
        category=instance.category,
        date__month=instance.date.month,
        date__year=instance.date.year,
        is_recurring=False
    )
    
    total_amount = Decimal('0')
    total_payments = 0
    
    for expense in expenses:
        converted_amount = expense.amount * conversion_rate
        total_amount += converted_amount
        total_payments += 1

    analytics, created = Analytics.objects.get_or_create(
        user=user,
        category=instance.category,
        month=instance.date.month,
        year=instance.date.year,
    )
    
    analytics.total_amount = total_amount
    analytics.total_payments = total_payments

    if total_payments == 0:
        analytics.delete()
    else:
        analytics.save()

@receiver(post_save, sender=Setting)
def update_analytics_on_currency_change(sender, instance, created, **kwargs):
    if not created:
        user = instance.user
        new_currency = instance.preferred_currency

        print(f"Preferred currency changed for user {user.username}. Updating analytics...")

        analytics = Analytics.objects.filter(user=user)

        for analytic in analytics:
            expenses = Expense.objects.filter(
                user=user,
                category=analytic.category,
                date__month=analytic.month,
                date__year=analytic.year,
                is_recurring=False
            )

            total_amount = Decimal('0')
            total_payments = 0

            for expense in expenses:
                conversion_rate = get_conversion_rate(expense.currency, new_currency)
                converted_amount = expense.amount * conversion_rate
                total_amount += converted_amount
                total_payments += 1

            analytic.total_amount = total_amount
            analytic.total_payments = total_payments
            analytic.save()