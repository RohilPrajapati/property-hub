from decimal import Decimal
from django.test import TestCase
from .models import Agent, Property
from rest_framework.test import APITestCase
from rest_framework import status
from django.urls import reverse


def make_agent(**kwargs):
    defaults = {
        "name": "Ram Sharma",
        "email": "ram@example.com",
        "phone": "+977-9812345678",
        "license_number": "NRB-1234-56",
    }
    defaults.update(kwargs)
    return Agent.objects.create(**defaults)


def make_property(agent, **kwargs):
    defaults = {
        "title": "Modern House in Thamel",
        "description": "A beautiful house near the main bazaar with pani batti sadak.",
        "suburb": "Thamel",
        "price": Decimal("15000000"),
        "bedrooms": 3,
        "bathrooms": 2,
        "property_type": Property.PropertyType.HOUSE,
        "is_published": True,
    }
    defaults.update(kwargs)
    return Property.objects.create(agent=agent, **defaults)


class PropertyModelTest(TestCase):
    def setUp(self):
        self.agent = make_agent()

    def test_str_representation(self):
        prop = make_property(self.agent)
        self.assertEqual(str(prop), "Modern House in Thamel - Thamel")

    def test_unpublished_property_exists_in_db(self):
        """unpublished properties should exist in DB but not appear in listings"""
        prop = make_property(self.agent, is_published=False)
        self.assertFalse(
            Property.objects.filter(id=prop.id, is_published=True).exists()
        )

    def test_property_type_choices(self):
        """only valid property types should be accepted"""
        valid_types = [pt.value for pt in Property.PropertyType]
        self.assertIn("house", valid_types)
        self.assertIn("apartment", valid_types)
        self.assertIn("townhouse", valid_types)
        self.assertIn("land", valid_types)

    def test_agent_cascade_delete(self):
        """deleting agent should delete their properties"""
        prop = make_property(self.agent)
        prop_id = prop.id
        self.agent.delete()
        self.assertFalse(Property.objects.filter(id=prop_id).exists())


class PropertyFilterTest(APITestCase):
    """Tests that each filter param narrows results correctly."""

    def setUp(self):
        self.agent = make_agent()
        self.url = reverse("property-search")

        self.house_thamel = make_property(
            self.agent,
            title="Spacious House in Thamel",
            suburb="Thamel",
            price=Decimal("20000000"),
            bedrooms=4,
            bathrooms=3,
            property_type=Property.PropertyType.HOUSE,
        )
        self.apartment_patan = make_property(
            self.agent,
            title="Cozy Apartment in Patan",
            suburb="Patan",
            price=Decimal("8000000"),
            bedrooms=2,
            bathrooms=1,
            property_type=Property.PropertyType.APARTMENT,
        )
        self.land_pokhara = make_property(
            self.agent,
            title="Prime Land in Pokhara",
            suburb="Pokhara",
            price=Decimal("5000000"),
            bedrooms=0,
            bathrooms=0,
            property_type=Property.PropertyType.LAND,
        )

    def test_search_by_title_keyword(self):
        """searching 'apartment' should return apartment listings"""
        res = self.client.get(self.url, {"search": "apartment"})
        self.assertEqual(res.status_code, status.HTTP_200_OK)
        titles = [p["title"] for p in res.data["results"]]
        self.assertTrue(any("Apartment" in t for t in titles))

    def test_filter_suburb_exact(self):
        res = self.client.get(self.url, {"suburb": "Thamel"})
        self.assertEqual(res.status_code, status.HTTP_200_OK)
        results = res.data["results"]
        self.assertEqual(len(results), 1)
        self.assertEqual(results[0]["suburb"], "Thamel")

    def test_filter_property_type(self):
        res = self.client.get(self.url, {"property_type": "apartment"})
        self.assertEqual(res.status_code, status.HTTP_200_OK)
        results = res.data["results"]
        self.assertEqual(len(results), 1)
        self.assertEqual(results[0]["property_type"], "apartment")

    def test_filter_min_price(self):
        res = self.client.get(self.url, {"min_price": "10000000"})
        self.assertEqual(res.status_code, status.HTTP_200_OK)
        for prop in res.data["results"]:
            self.assertGreaterEqual(Decimal(prop["price"]), Decimal("10000000"))

    def test_filter_max_price(self):
        res = self.client.get(self.url, {"max_price": "10000000"})
        self.assertEqual(res.status_code, status.HTTP_200_OK)
        for prop in res.data["results"]:
            self.assertLessEqual(Decimal(prop["price"]), Decimal("10000000"))

    def test_filter_price_range(self):
        res = self.client.get(
            self.url, {"min_price": "6000000", "max_price": "15000000"}
        )
        self.assertEqual(res.status_code, status.HTTP_200_OK)
        results = res.data["results"]
        self.assertEqual(len(results), 1)
        self.assertEqual(results[0]["suburb"], "Patan")

    def test_filter_min_bedrooms(self):
        res = self.client.get(self.url, {"min_bedrooms": "3"})
        self.assertEqual(res.status_code, status.HTTP_200_OK)
        for prop in res.data["results"]:
            self.assertGreaterEqual(prop["bedrooms"], 3)

    def test_filter_min_bathrooms(self):
        res = self.client.get(self.url, {"min_bathrooms": "2"})
        self.assertEqual(res.status_code, status.HTTP_200_OK)
        for prop in res.data["results"]:
            self.assertGreaterEqual(prop["bathrooms"], 2)

    def test_combined_filters(self):
        """suburb + property_type + price together"""
        res = self.client.get(
            self.url,
            {
                "suburb": "Patan",
                "property_type": "apartment",
                "max_price": "10000000",
            },
        )
        self.assertEqual(res.status_code, status.HTTP_200_OK)
        results = res.data["results"]
        self.assertEqual(len(results), 1)
        self.assertEqual(results[0]["title"], "Cozy Apartment in Patan")

    def test_filter_no_match_returns_empty(self):
        res = self.client.get(self.url, {"suburb": "Butwal"})
        self.assertEqual(res.status_code, status.HTTP_200_OK)
        self.assertEqual(len(res.data["results"]), 0)


class PropertyDetailViewTest(APITestCase):
    def setUp(self):
        self.agent = make_agent()
        self.prop = make_property(self.agent)
        self.unpublished = make_property(
            self.agent,
            is_published=False,
        )

    def test_detail_returns_correct_property(self):
        url = reverse("property-detail", args=[self.prop.id])
        res = self.client.get(url)
        self.assertEqual(res.status_code, status.HTTP_200_OK)
        self.assertEqual(res.data["title"], self.prop.title)

    def test_detail_returns_agent_info(self):
        url = reverse("property-detail", args=[self.prop.id])
        res = self.client.get(url)
        self.assertEqual(res.status_code, status.HTTP_200_OK)
        self.assertIn("agent_detail", res.data)
        self.assertEqual(res.data["agent_detail"]["name"], self.agent.name)

    def test_detail_unpublished_returns_404(self):
        url = reverse("property-detail", args=[self.unpublished.id])
        res = self.client.get(url)
        self.assertEqual(res.status_code, status.HTTP_404_NOT_FOUND)

    def test_detail_nonexistent_returns_404(self):
        url = reverse("property-detail", args=[999999])
        res = self.client.get(url)
        self.assertEqual(res.status_code, status.HTTP_404_NOT_FOUND)
