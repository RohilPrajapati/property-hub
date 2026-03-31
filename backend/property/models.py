from django.db import models
from django.contrib.postgres.indexes import GinIndex
import uuid
import os


class Agent(models.Model):
    name = models.CharField(max_length=255)
    email = models.EmailField(unique=True)
    phone = models.CharField(max_length=20, blank=True)
    license_number = models.CharField(max_length=50, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name


def get_file_path(instance, filename):
    """Generates a unique filename using UUID while preserving the extension."""
    ext = filename.split(".")[-1]
    filename = f"{uuid.uuid4()}.{ext}"
    return os.path.join("properties/", filename)


class Property(models.Model):
    class PropertyType(models.TextChoices):
        HOUSE = "house", "House"
        APARTMENT = "apartment", "Apartment"
        TOWNHOUSE = "townhouse", "Townhouse"
        LAND = "land", "Land"

    title = models.CharField(max_length=255)
    description = models.TextField()

    agent = models.ForeignKey(
        Agent, on_delete=models.CASCADE, related_name="properties"
    )

    image = models.ImageField(upload_to=get_file_path, null=True, blank=True)

    suburb = models.CharField(max_length=100)
    price = models.DecimalField(max_digits=12, decimal_places=2)
    bedrooms = models.IntegerField()
    bathrooms = models.IntegerField()
    property_type = models.CharField(
        max_length=20, choices=PropertyType.choices, default=PropertyType.HOUSE
    )

    internal_notes = models.TextField(blank=True, null=True)
    is_published = models.BooleanField(default=True)

    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        indexes = [
            models.Index(fields=["price"]),
            models.Index(fields=["suburb"]),
            models.Index(fields=["property_type"]),
            models.Index(fields=["bedrooms"]),
            models.Index(
                fields=["agent", "is_published"], name="property_agent_published_idx"
            ),
            GinIndex(
                name="property_search_gin",
                fields=["title", "description"],
                opclasses=[
                    "gin_trgm_ops",
                    "gin_trgm_ops",
                ],
            ),
        ]
        verbose_name_plural = "Properties"

    def __str__(self):
        return f"{self.title} - {self.suburb}"
