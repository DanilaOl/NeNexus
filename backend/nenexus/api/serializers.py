from django.contrib.auth import get_user_model
from rest_framework import serializers

from package.models import Package, PackageVersion

User = get_user_model()


class PackageSerializer(serializers.ModelSerializer):
    class Meta:
        fields = '__all__'
        model = Package


class PackageVersionSerializer(serializers.ModelSerializer):
    class Meta:
        fields = '__all__'
        model = PackageVersion
