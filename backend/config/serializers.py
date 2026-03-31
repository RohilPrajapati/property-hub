from rest_framework_simplejwt.serializers import (
    TokenObtainPairSerializer,
    TokenRefreshSerializer,
)
from rest_framework_simplejwt.tokens import AccessToken


class AuthTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        # add custom claims to token payload
        token["is_admin"] = user.is_staff
        token["email"] = user.email
        token["username"] = user.username
        return token

    def validate(self, attrs):
        data = super().validate(attrs)
        # add extra info to login response
        data["user"] = {
            "id": self.user.id,
            "email": self.user.email,
            "username": self.user.username,
            "is_admin": self.user.is_staff,
        }
        return data


class AuthTokenRefreshSerializer(TokenRefreshSerializer):
    def validate(self, attrs):
        data = super().validate(attrs)

        # decode new access token to extract user info
        access_token = AccessToken(data["access"])
        data["user"] = {
            "is_admin": access_token.get("is_admin", False),
            "email": access_token.get("email", ""),
            "username": access_token.get("username", ""),
        }
        return data
