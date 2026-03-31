from django.shortcuts import get_object_or_404
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.contrib.postgres.search import TrigramSimilarity
from django.db.models import Q


from .paginations import PropertyCursorPagination
from .models import Property
from .serializers import PropertySerializer


class PropertySearchView(APIView):
    def get(self, request):
        property = Property.objects.filter(is_published=True).select_related("agent")

        search = request.query_params.get("search", "").strip()
        suburb = request.query_params.get("suburb", "").strip()
        property_type = request.query_params.get("property_type", "").strip()
        min_price = request.query_params.get("min_price")
        max_price = request.query_params.get("max_price")
        min_bedrooms = request.query_params.get("min_bedrooms")
        min_bathrooms = request.query_params.get("min_bathrooms")

        if suburb:
            property = property.filter(suburb__icontains=suburb)

        if property_type:
            property = property.filter(property_type=property_type)

        if min_price:
            property = property.filter(price__gte=min_price)

        if max_price:
            property = property.filter(price__lte=max_price)

        if min_bedrooms:
            property = property.filter(bedrooms__gte=min_bedrooms)

        if min_bathrooms:
            property = property.filter(bathrooms__gte=min_bathrooms)

        if search:
            property = (
                property.annotate(
                    similarity=TrigramSimilarity("title", search)
                    + TrigramSimilarity("description", search)
                )
                .filter(
                    Q(similarity__gt=0.1)
                    | Q(title__icontains=search)
                    | Q(suburb__icontains=search)
                )
                .order_by("-similarity")
            )
        else:
            property = property.order_by("-created_at")

        paginator = PropertyCursorPagination()
        paginated_data = paginator.paginate_queryset(property, request)
        serializer = PropertySerializer(
            paginated_data, many=True, context={"request": request}
        )
        return paginator.get_paginated_response(serializer.data)


class PropertyDetailView(APIView):
    def get(self, request, property_id):
        property = get_object_or_404(Property, id=property_id, is_published=True)
        serializer = PropertySerializer(property, context={"request": request})
        return Response(serializer.data, status=status.HTTP_200_OK)
