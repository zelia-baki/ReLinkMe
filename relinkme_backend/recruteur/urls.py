from rest_framework.routers import DefaultRouter
from .views import RecruteurViewSet, OffreViewSet

router = DefaultRouter()
router.register(r'recruteurs', RecruteurViewSet)
router.register(r'offres', OffreViewSet)

urlpatterns = router.urls
