from django.contrib.auth import get_user_model
from django.contrib.auth.models import Group
from django.db import models
from django.conf import settings

User = get_user_model()

class Package(models.Model):
    name = models.CharField(max_length=100)
    description = models.TextField(blank=True, null=True)
    is_published = models.BooleanField(default=False)
    downloads_count = models.PositiveIntegerField(default=0)
    contributors = models.ManyToManyField(
        User,
        related_name='packages_contributed',
        blank=True
    )
    subscribers = models.ManyToManyField(
        User,
        related_name='subscriptions',
        blank=True
    )
    allowed_groups = models.ManyToManyField(
        Group,
        related_name='allowed_packages',
        blank=True
    )
    dependencies = models.ManyToManyField(
        'self',
        related_name='usages',
        symmetrical=False,
        blank=True
    )

    def __str__(self):
        return self.name


def version_path(instance, filename):
    return f'{instance.package.name}/{instance.version}/{filename}'


class PackageVersion(models.Model):
    package = models.ForeignKey(
        Package,
        on_delete=models.CASCADE,
        related_name='versions'
    )
    version = models.CharField(max_length=20)
    description = models.TextField(blank=True, null=True)
    release_date = models.DateTimeField(auto_now_add=True)
    is_published = models.BooleanField(default=False)
    path = models.FileField(upload_to=version_path)

    def __str__(self):
        return f'{self.package.name} {self.version}'