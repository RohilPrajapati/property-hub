from django.urls import path
from .views import PropertySearchView, PropertyDetailView

urlpatterns = [
    path("", PropertySearchView.as_view(), name="property-search"),
    path("<int:property_id>/", PropertyDetailView.as_view(), name="property-detail"),
]
