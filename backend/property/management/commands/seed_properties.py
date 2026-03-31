import random
from decimal import Decimal
from django.core.management.base import BaseCommand
from django.core.files import File
from faker import Faker
from property.models import Property, Agent
import os

fake = Faker()

ASSETS_DIR = os.path.join(os.path.dirname(__file__), "assets")

NEPAL_SUBURBS = [
    # Kathmandu Valley
    "Thamel",
    "Baneshwor",
    "Lazimpat",
    "Baluwatar",
    "Maharajgunj",
    "Koteshwor",
    "Kalanki",
    "Kirtipur",
    "Bhaktapur",
    "Lalitpur",
    "Patan",
    "Boudha",
    "Pashupatinath",
    "Chabahil",
    "Gongabu",
    "Thankot",
    "Budhanilkantha",
    "Tokha",
    "Gokarneshwor",
    "Jorpati",
    # Outside valley
    "Pokhara",
    "Chitwan",
    "Butwal",
    "Dharan",
    "Biratnagar",
    "Birgunj",
    "Nepalgunj",
    "Dhangadhi",
    "Janakpur",
    "Hetauda",
]

PROPERTY_TITLES = [
    "Modern {type} in {suburb}",
    "Spacious {type} with stunning views in {suburb}",
    "Charming {type} close to cafes in {suburb}",
    "Renovated {type} with large backyard in {suburb}",
    "Luxury {type} near transport in {suburb}",
    "Cozy {type} perfect for first home buyers in {suburb}",
    "Brand new {type} with open plan living in {suburb}",
    "Classic {type} with modern finishes in {suburb}",
]


def get_random_image(property_type: str):
    """Pick a random image from assets/ that matches the property type."""
    all_images = os.listdir(ASSETS_DIR)

    # prefer images matching property type name
    matching = [f for f in all_images if property_type in f.lower()]
    candidates = matching if matching else all_images  # fallback to any image

    filename = random.choice(candidates)
    filepath = os.path.join(ASSETS_DIR, filename)
    return filepath, filename


def handle_bulk_property(total: int, property_types: list[str], agent_ids: list[int]):
    properties = []
    for _ in range(total):
        suburb = random.choice(NEPAL_SUBURBS)
        property_type = random.choice(property_types)
        title = random.choice(PROPERTY_TITLES).format(type=property_type, suburb=suburb)

        properties.append(
            Property(
                title=title,
                description=fake.paragraph(nb_sentences=10),
                suburb=suburb,
                price=Decimal(random.randrange(300_000, 2_000_000, 50_000)),
                bedrooms=random.randint(1, 5),
                bathrooms=random.randint(1, 3),
                property_type=property_type,
                agent_id=random.choice(agent_ids),
                internal_notes=fake.sentence() if random.random() < 0.3 else None,
                is_published=random.choices([True, False], weights=[75, 25])[0],
            )
        )

    Property.objects.bulk_create(properties)
    return True


def handle_with_image_property(
    total: int, property_types: list[str], agent_ids: list[int]
):
    """Insert properties one-by-one so Django processes the ImageField correctly."""
    for _ in range(total):
        suburb = random.choice(NEPAL_SUBURBS)
        property_type = random.choice(property_types)

        prop = Property(
            title=random.choice(PROPERTY_TITLES).format(
                type=property_type, suburb=suburb
            ),
            description=fake.paragraph(nb_sentences=10),
            suburb=suburb,
            price=Decimal(random.randrange(5_000_000, 50_000_000, 500_000)),
            bedrooms=random.randint(1, 5),
            bathrooms=random.randint(1, 3),
            property_type=property_type,
            agent_id=random.choice(agent_ids),
            internal_notes=fake.sentence() if random.random() < 0.3 else None,
            is_published=random.choices([True, False], weights=[75, 25])[0],
        )
        prop.save()

        filepath, filename = get_random_image(property_type)
        with open(filepath, "rb") as img_file:
            prop.image.save(filename, File(img_file), save=True)


class Command(BaseCommand):
    help = "Seed the database with fake property listings using Faker"

    def add_arguments(self, parser):
        parser.add_argument(
            "--count",
            type=int,
            default=50,
            help="Number of properties to create (default: 50)",
        )
        parser.add_argument(
            "--clear",
            action="store_true",
            help="Clear existing properties before seeding",
        )
        parser.add_argument(
            "--no-images",
            action="store_true",
            help="Skip image fetching (faster seeding)",
        )

    def handle(self, *args, **options):
        if options["clear"]:
            deleted, _ = Property.objects.all().delete()
            print(f"Deleted {deleted} existing properties")

        total = options["count"]
        skip_images = options["no_images"]
        property_type = [pt.value for pt in Property.PropertyType]

        agent_ids = list(Agent.objects.values_list("id", flat=True))
        if not agent_ids:
            self.stdout.write(
                self.style.ERROR("No agents found. Run seed_agents first.")
            )
            self.stdout.write(self.style.ERROR("  python manage.py seed_agents"))
            return

        if skip_images:
            handle_bulk_property(total, property_type, agent_ids)
        else:
            handle_with_image_property(total, property_type, agent_ids)
        print(f"Successfully seeded {total} properties")
