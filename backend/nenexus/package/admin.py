from django.contrib import admin

# Register your models here.
from .models import Package, PackageVersion

admin.site.register(Package)
admin.site.register(PackageVersion)
