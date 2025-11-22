from rest_framework import serializers

from administrateur.models import Administrateur
from core.models import Utilisateur


class AdminLoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True)

    def validate(self, data):
        email = data.get('email')
        password = data.get('password')

        # Check if user exists
        try:
            user = Utilisateur.objects.get(email=email)
        except Utilisateur.DoesNotExist:
            raise serializers.ValidationError("Email ou mot de passe incorrect.")

        # Check password
        if not user.check_password(password):
            raise serializers.ValidationError("Email ou mot de passe incorrect.")

        # Check if user is an admin
        try:
            admin_profile = Administrateur.objects.get(utilisateur=user)
        except Administrateur.DoesNotExist:
            raise serializers.ValidationError("Cet utilisateur n'est pas un administrateur.")

        return {
            "user": user,
            "admin": admin_profile
        }
