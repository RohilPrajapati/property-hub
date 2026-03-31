import random
from django.core.management.base import BaseCommand
from faker import Faker
from property.models import Agent

fake = Faker()

NEPALI_FIRST_NAMES = [
    "Aarav", "Bikash", "Sanjay", "Rajesh", "Dipak",
    "Suresh", "Ramesh", "Naresh", "Prakash", "Manish",
    "Priya", "Sita", "Anita", "Sunita", "Kabita",
    "Sabina", "Rojina", "Namrata", "Puja", "Nisha",
]

NEPALI_LAST_NAMES = [
    "Sharma", "Thapa", "Shrestha", "Adhikari", "Poudel",
    "Karki", "Rai", "Gurung", "Tamang", "Magar",
    "Basnet", "Pandey", "Koirala", "Bhandari", "Maharjan",
]


class Command(BaseCommand):
    help = "Seed the database with fake agents"

    def add_arguments(self, parser):
        parser.add_argument("--count", type=int, default=10)
        parser.add_argument("--clear", action="store_true")

    def handle(self, *args, **options):
        if options["clear"]:
            deleted, _ = Agent.objects.all().delete()
            self.stdout.write(self.style.WARNING(f"Deleted {deleted} existing agents"))

        total = options["count"]
        agents = []

        for _ in range(total):
            first = random.choice(NEPALI_FIRST_NAMES)
            last = random.choice(NEPALI_LAST_NAMES)
            name = f"{first} {last}"

            agents.append(
                Agent(
                    name=name,
                    email=f"{first.lower()}.{last.lower()}{random.randint(1, 999)}@gmail.com",
                    phone=f"+977-98{random.randint(10000000, 99999999)}",
                    license_number=f"NRB-{random.randint(1000, 9999)}-{random.randint(10, 99)}",
                )
            )

        Agent.objects.bulk_create(agents, ignore_conflicts=True)
        self.stdout.write(self.style.SUCCESS(f"Successfully seeded {total} agents"))