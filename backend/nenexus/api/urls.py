from django.urls import path, include
from drf_spectacular.views import SpectacularAPIView, SpectacularSwaggerView, \
    SpectacularRedocView
from rest_framework.routers import DefaultRouter

from .views import PackageViewSet, PackageVersionViewSet

router_v1 = DefaultRouter()
router_v1.register(f'packages', PackageViewSet, basename='package')
router_v1.register(f'packages/(?P<package_id>\d+)/versions', PackageVersionViewSet, basename='version')

urlpatterns = [
    path('v1/', include(router_v1.urls)),
    path('v1/', include('djoser.urls')),
    path('v1/', include('djoser.urls.jwt')),
    path('schema/', SpectacularAPIView.as_view(), name='schema'),
    path('schema/swagger-ui/', SpectacularSwaggerView.as_view(),
         name='swagger-ui'),
    path('schema/redoc/', SpectacularRedocView.as_view(), name='redoc'),
]
