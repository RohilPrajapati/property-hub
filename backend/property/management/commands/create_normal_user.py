from django.core.management.base import BaseCommand
from django.contrib.auth.models import User
import getpass


class Command(BaseCommand):
    help = "Interactively creates a normal user (similar to createsuperuser)"

    def handle(self, *args, **options):
        self.stdout.write(self.style.MIGRATE_HEADING("--- Create Normal User ---"))

        username = input("Username: ").strip()
        if not username:
            self.stdout.write(self.style.ERROR("Error: Username is required."))
            return

        if User.objects.filter(username=username).exists():
            self.stdout.write(
                self.style.ERROR(f"Error: User '{username}' already exists.")
            )
            return


        email = input("Email address: ").strip()


        password = getpass.getpass("Password: ")
        password_confirm = getpass.getpass("Password (again): ")

        if password != password_confirm:
            self.stdout.write(self.style.ERROR("Error: Passwords do not match."))
            return

        if len(password) < 8:
            self.stdout.write(
                self.style.WARNING("Warning: Password is short, but proceeding...")
            )

        try:
            User.objects.create_user(
                username=username,
                email=email,
                password=password,
                is_staff=False,  # Ensures they cannot access admin
                is_superuser=False,  # Ensures they have no root privileges
            )
            self.stdout.write(
                self.style.SUCCESS(f"User '{username}' created successfully.")
            )
        except Exception as e:
            self.stdout.write(self.style.ERROR(f"Error creating user: {e}"))
