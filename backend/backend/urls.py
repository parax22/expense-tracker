from django.contrib import admin
from django.http import JsonResponse
from django.urls import path, include
from api.views import UserCreateView
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

def health_check(request):
    return JsonResponse({"status": "ok"})

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/user/register/', UserCreateView.as_view(), name='register'),
    path('api/token/', TokenObtainPairView.as_view(), name='get_token'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='refresh'),
    path('api/healthcheck/', health_check),
    path('api-auth/', include('rest_framework.urls')),
    path('api/', include('api.urls')),
]
