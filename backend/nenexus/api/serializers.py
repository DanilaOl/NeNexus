from django.contrib.auth import get_user_model
from django.contrib.auth.models import Group
from rest_framework import serializers
from rest_framework_recursive.fields import RecursiveField

from package.models import Package, PackageVersion

User = get_user_model()


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        fields = ('id', 'username', 'email')
        model = User


class GroupSerializer(serializers.ModelSerializer):
    class Meta:
        fields = '__all__'
        model = Group


class PackageSerializer(serializers.ModelSerializer):
    contributors = UserSerializer(many=True, read_only=True)
    subscribers = UserSerializer(many=True, read_only=True)
    allowed_groups = GroupSerializer(many=True, read_only=True)
    dependencies = RecursiveField(allow_null=True, many=True, read_only=True)
    class Meta:
        fields = ('id', 'name', 'description', 'is_published', 'downloads_count', 'contributors', 'subscribers', 'allowed_groups', 'dependencies')
        model = Package


class PackageVersionSerializer(serializers.ModelSerializer):
    class Meta:
        fields = '__all__'
        model = PackageVersion


