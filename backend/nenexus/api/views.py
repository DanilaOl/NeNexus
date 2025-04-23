from django.shortcuts import get_object_or_404
from drf_spectacular.utils import extend_schema_view, extend_schema, \
    OpenApiParameter
from rest_framework import viewsets, pagination
from rest_framework.filters import SearchFilter

from .serializers import PackageSerializer, PackageVersionSerializer
from package.models import Package

@extend_schema_view(
    list=extend_schema(
        description='Returns the list of all packages.'
    ),
    create=extend_schema(
        description='Create new package.'
    ),
    retrieve=extend_schema(
        description='Get specific package.'
    ),
    update=extend_schema(
        description='Update specific package.'
    ),
    partial_update=extend_schema(
        description='Partial update specific package.'
    ),
    destroy=extend_schema(
        description='Delete specific package.'
    )
)
class PackageViewSet(viewsets.ModelViewSet):
    queryset = Package.objects.all()
    serializer_class = PackageSerializer
    filter_backends = (SearchFilter,)
    pagination_class = pagination.LimitOffsetPagination

@extend_schema_view(
    list=extend_schema(
        description='Returns the list of all versions of a package.',
        parameters=[
            OpenApiParameter(
                name='package_id',
                description='A unique integer value identifying the package.',
                required=True,
                type=int,
                location=OpenApiParameter.PATH,
            ),
        ]
    ),
    create=extend_schema(
        description='Create new version for a package.',
        parameters=[
            OpenApiParameter(
                name='package_id',
                description='A unique integer value identifying the package.',
                required=True,
                type=int,
                location=OpenApiParameter.PATH,
            ),
        ]
    ),
    retrieve=extend_schema(
        description='Get specific version of a package.',
        parameters=[
            OpenApiParameter(
                name='package_id',
                description='A unique integer value identifying the package.',
                required=True,
                type=int,
                location=OpenApiParameter.PATH,
            ),
            OpenApiParameter(
                name='id',
                description='A unique integer value identifying the version.',
                required=True,
                type=int,
                location=OpenApiParameter.PATH,
            )
        ]
    ),
    update=extend_schema(
        description='Update specific version of a package.',
        parameters=[
            OpenApiParameter(
                name='package_id',
                description='A unique integer value identifying the package.',
                required=True,
                type=int,
                location=OpenApiParameter.PATH,
            ),
            OpenApiParameter(
                name='id',
                description='A unique integer value identifying the version.',
                required=True,
                type=int,
                location=OpenApiParameter.PATH,
            )
        ]
    ),
    partial_update=extend_schema(
        description='Partial update specific version of a package.',
        parameters=[
            OpenApiParameter(
                name='package_id',
                description='A unique integer value identifying the package.',
                required=True,
                type=int,
                location=OpenApiParameter.PATH,
            ),
            OpenApiParameter(
                name='id',
                description='A unique integer value identifying the version.',
                required=True,
                type=int,
                location=OpenApiParameter.PATH,
            )
        ]
    ),
    destroy=extend_schema(
        description='Delete specific version of a package.',
        parameters=[
            OpenApiParameter(
                name='package_id',
                description='A unique integer value identifying the package.',
                required=True,
                type=int,
                location=OpenApiParameter.PATH,
            ),
            OpenApiParameter(
                name='id',
                description='A unique integer value identifying the version.',
                required=True,
                type=int,
                location=OpenApiParameter.PATH,
            )
        ]
    )
)
class PackageVersionViewSet(viewsets.ModelViewSet):
    serializer_class = PackageVersionSerializer

    def get_queryset(self):
        package = get_object_or_404(Package, pk=self.kwargs['package_id'])
        return package.versions
