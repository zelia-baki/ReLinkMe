from django.db import models
from django.contrib.auth.models import AbstractBaseUser, PermissionsMixin, BaseUserManager
from django.utils import timezone


# ==========================
#   GESTION UTILISATEUR
# ==========================
class UtilisateurManager(BaseUserManager):
    def create_user(self, email, nom_complet, password=None, role='chomeur', **extra_fields):
        """
        Crée un utilisateur standard.
        """
        if not email:
            raise ValueError("L'adresse email est obligatoire.")
        email = self.normalize_email(email)
        user = self.model(email=email, nom_complet=nom_complet, role=role, **extra_fields)
        user.set_password(password)  # ✅ Utilise password au lieu de mot_de_passe
        user.save(using=self._db)
        return user

    def create_superuser(self, email, nom_complet, password=None, **extra_fields):
        """
        Crée un superutilisateur avec tous les droits.
        """
        extra_fields.setdefault('role', 'admin')
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        extra_fields.setdefault('is_active', True)

        if extra_fields.get('is_staff') is not True:
            raise ValueError('Le superutilisateur doit avoir is_staff=True.')
        if extra_fields.get('is_superuser') is not True:
            raise ValueError('Le superutilisateur doit avoir is_superuser=True.')

        return self.create_user(email, nom_complet, password, **extra_fields)


class Utilisateur(AbstractBaseUser, PermissionsMixin):
    ROLE_CHOICES = (
        ('admin', 'Administrateur'),
        ('recruteur', 'Recruteur'),
        ('chomeur', 'Chômeur'),
    )

    id = models.BigAutoField(primary_key=True)
    code_utilisateur = models.CharField(max_length=10, unique=True, null=True, blank=True)
    nom_complet = models.CharField(max_length=150)
    email = models.EmailField(max_length=150, unique=True)
    
    # ✅ SUPPRIMÉ : mot_de_passe (le champ 'password' est hérité de AbstractBaseUser)
    
    role = models.CharField(max_length=20, choices=ROLE_CHOICES)
    photo_profil = models.CharField(max_length=255, null=True, blank=True)
    telephone = models.CharField(max_length=30, null=True, blank=True)
    localisation = models.CharField(max_length=150, null=True, blank=True)
    statut_verifie = models.BooleanField(default=False)
    date_inscription = models.DateTimeField(default=timezone.now)

    created_by = models.ForeignKey('self', on_delete=models.SET_NULL, null=True, blank=True, related_name='creations')
    modified_by = models.ForeignKey('self', on_delete=models.SET_NULL, null=True, blank=True, related_name='modifications')
    created_at = models.DateTimeField(default=timezone.now)
    updated_at = models.DateTimeField(auto_now=True)

    # Champs nécessaires à Django Admin
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['nom_complet']

    objects = UtilisateurManager()

    class Meta:
        db_table = 'utilisateur'

    def save(self, *args, **kwargs):
        super().save(*args, **kwargs)
        if not self.code_utilisateur:
            self.code_utilisateur = f"USER{str(self.id).zfill(5)}"
            super().save(update_fields=['code_utilisateur'])

    def __str__(self):
        return f"{self.nom_complet} ({self.role})"


# ==========================
#   COMPÉTENCE
# ==========================
class Competence(models.Model):
    id = models.BigAutoField(primary_key=True)
    code_competence = models.CharField(max_length=10, unique=True, null=True, blank=True)
    libelle = models.CharField(max_length=100, unique=True)
    categorie = models.CharField(max_length=50, null=True, blank=True)
    created_by = models.ForeignKey(Utilisateur, on_delete=models.SET_NULL, null=True, blank=True, related_name='competences_crees')
    modified_by = models.ForeignKey(Utilisateur, on_delete=models.SET_NULL, null=True, blank=True, related_name='competences_modifiees')
    created_at = models.DateTimeField(default=timezone.now)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'competence'

    def save(self, *args, **kwargs):
        super().save(*args, **kwargs)
        if not self.code_competence:
            self.code_competence = f"COMP{str(self.id).zfill(5)}"
            super().save(update_fields=['code_competence'])

    def __str__(self):
        return self.libelle


# ==========================
#   CANDIDATURE
# ==========================
class Candidature(models.Model):
    STATUT_CHOICES = (
        ('en_attente', 'En attente'),
        ('vue', 'Vue'),
        ('acceptee', 'Acceptée'),
        ('refusee', 'Refusée'),
        ('entretien', 'Entretien'),
    )

    id = models.BigAutoField(primary_key=True)
    code_candidature = models.CharField(max_length=10, unique=True, null=True, blank=True)
    chomeur = models.ForeignKey('chomeur.Chomeur', on_delete=models.CASCADE)
    offre = models.ForeignKey('recruteur.Offre', on_delete=models.CASCADE)
    lettre_motivation = models.TextField(null=True, blank=True)
    cv_fichier = models.CharField(max_length=255, null=True, blank=True)
    date_postulation = models.DateTimeField(default=timezone.now)
    statut = models.CharField(max_length=30, choices=STATUT_CHOICES, default='en_attente')
    jetons_utilises = models.IntegerField(default=0)
    created_by = models.ForeignKey(Utilisateur, on_delete=models.SET_NULL, null=True, blank=True, related_name='candidatures_creees')
    modified_by = models.ForeignKey(Utilisateur, on_delete=models.SET_NULL, null=True, blank=True, related_name='candidatures_modifiees')
    created_at = models.DateTimeField(default=timezone.now)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'candidature'
        unique_together = ('chomeur', 'offre')

    def save(self, *args, **kwargs):
        super().save(*args, **kwargs)
        if not self.code_candidature:
            self.code_candidature = f"CAND{str(self.id).zfill(5)}"
            super().save(update_fields=['code_candidature'])

    def __str__(self):
        return f"{self.chomeur} → {self.offre}"


# ==========================
#   TRANSACTION JETON
# ==========================
class TransactionJeton(models.Model):
    TYPE_TRANSACTION_CHOICES = (
        ('achat', 'Achat'),
        ('gain_test', 'Gain test'),
        ('postulation', 'Postulation'),
        ('remboursement', 'Remboursement'),
        ('bonus', 'Bonus'),
        ('depense_service', 'Dépense service'),
    )

    id = models.BigAutoField(primary_key=True)
    code_transaction = models.CharField(max_length=10, unique=True, null=True, blank=True)
    chomeur = models.ForeignKey('chomeur.Chomeur', on_delete=models.CASCADE, null=True, blank=True)
    recruteur = models.ForeignKey('recruteur.Recruteur', on_delete=models.SET_NULL, null=True, blank=True)
    montant = models.IntegerField()
    type_transaction = models.CharField(max_length=50, choices=TYPE_TRANSACTION_CHOICES)
    candidature = models.ForeignKey('Candidature', on_delete=models.SET_NULL, null=True, blank=True)
    description = models.CharField(max_length=255, null=True, blank=True)
    date_transaction = models.DateTimeField(default=timezone.now)
    created_by = models.ForeignKey(Utilisateur, on_delete=models.SET_NULL, null=True, blank=True, related_name='transactions_creees')
    modified_by = models.ForeignKey(Utilisateur, on_delete=models.SET_NULL, null=True, blank=True, related_name='transactions_modifiees')
    created_at = models.DateTimeField(default=timezone.now)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'transaction_jeton'

    def save(self, *args, **kwargs):
        super().save(*args, **kwargs)
        if not self.code_transaction:
            self.code_transaction = f"TRX{str(self.id).zfill(6)}"
            super().save(update_fields=['code_transaction'])

    def __str__(self):
        return f"{self.type_transaction} ({self.montant})"


# ==========================
#   EVALUATION
# ==========================
class Evaluation(models.Model):
    TYPE_EVALUATION_CHOICES = (
        ('recruteur_vers_chomeur', 'Recruteur vers Chômeur'),
        ('chomeur_vers_recruteur', 'Chômeur vers Recruteur'),
    )

    id = models.BigAutoField(primary_key=True)
    code_evaluation = models.CharField(max_length=10, unique=True, null=True, blank=True)
    chomeur = models.ForeignKey('chomeur.Chomeur', on_delete=models.CASCADE)
    recruteur = models.ForeignKey('recruteur.Recruteur', on_delete=models.CASCADE)
    candidature = models.ForeignKey('Candidature', on_delete=models.SET_NULL, null=True, blank=True)
    note = models.IntegerField()
    commentaire = models.TextField(null=True, blank=True)
    type_evaluation = models.CharField(max_length=50, choices=TYPE_EVALUATION_CHOICES)
    date_evaluation = models.DateTimeField(default=timezone.now)
    created_by = models.ForeignKey(Utilisateur, on_delete=models.SET_NULL, null=True, blank=True, related_name='evaluations_creees')
    modified_by = models.ForeignKey(Utilisateur, on_delete=models.SET_NULL, null=True, blank=True, related_name='evaluations_modifiees')
    created_at = models.DateTimeField(default=timezone.now)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'evaluation'

    def save(self, *args, **kwargs):
        super().save(*args, **kwargs)
        if not self.code_evaluation:
            self.code_evaluation = f"EVAL{str(self.id).zfill(5)}"
            super().save(update_fields=['code_evaluation'])

    def __str__(self):
        return f"{self.chomeur} ↔ {self.recruteur} ({self.note}/5)"