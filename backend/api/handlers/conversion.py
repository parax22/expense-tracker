import os
import requests
from decimal import Decimal
from django.utils.timezone import now, timedelta
from api.models import ExchangeRate
from dotenv import load_dotenv

load_dotenv()
API_URL = os.getenv('EXCHANGE_RATE_BASE_URL')

def fetch_exchange_rates():
    url = f"{API_URL}/latest/USD"
    response = requests.get(url)

    if response.status_code == 200:
        data = response.json()
        conversion_rates = data.get("conversion_rates", {})

        if conversion_rates:
            for currency, rate in conversion_rates.items():
                ExchangeRate.objects.update_or_create(
                    currency=currency,
                    defaults={'rate_to_usd': Decimal(rate), 'last_updated': now()}
                )

def get_conversion_rate(from_currency, to_currency):
    if from_currency == to_currency:
        return Decimal('1.0')

    one_week_ago = now() - timedelta(days=7)
    exchange_rates = ExchangeRate.objects.filter(last_updated__gte=one_week_ago)

    if not exchange_rates.exists():
        fetch_exchange_rates()  # Si no hay tasas recientes, actualizarlas

    try:
        usd_to_from = ExchangeRate.objects.get(currency=from_currency).rate_to_usd
        usd_to_to = ExchangeRate.objects.get(currency=to_currency).rate_to_usd
        return usd_to_to / usd_to_from  # Conversión indirecta
    except ExchangeRate.DoesNotExist:
        return Decimal('1.0')  # Si falta algún dato, asumimos 1:1