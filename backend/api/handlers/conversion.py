import os
import requests
from decimal import Decimal
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

# Get the URL and API key from the environment variables
API_URL = os.getenv('EXCHANGE_RATE_BASE_URL')

def get_conversion_rate(from_currency, to_currency):
    """Gets conversion rate from one currency to another."""
    if from_currency == to_currency:
        return Decimal('1.0')
    
    # Construct the URL with the API_KEY if necessary
    url = f"{API_URL}/latest/{from_currency}"
    
    response = requests.get(url)
    
    if response.status_code == 200:
        data = response.json()
        if to_currency in data["conversion_rates"]:
            return Decimal(data["conversion_rates"][to_currency])
        else:
            return Decimal('1.0')
    return Decimal('1.0')
