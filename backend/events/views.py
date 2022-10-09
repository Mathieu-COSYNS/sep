from django.shortcuts import get_object_or_404
from rest_framework import viewsets, mixins
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from .models import Event, Ticket
from .serializers import EventSerializer, TicketSerializer


class EventViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Event.objects.all()
    serializer_class = EventSerializer
    permission_classes = [IsAuthenticated]


class EventTicketViewSet(viewsets.GenericViewSet):
    """
    Kept separated from EventViewSet for openapi schema
    """
    queryset = Event.objects.none()
    serializer_class = TicketSerializer
    permission_classes = [IsAuthenticated]

    @action(detail=True, url_path='(?P<ticket__qrcode_id>[A-Z0-9]{12})')
    def qrcode(self, request, pk=None, ticket__qrcode_id=None):
        obj = get_object_or_404(
            Ticket, event=pk, qrcode_id=ticket__qrcode_id)
        self.check_object_permissions(self.request, obj)
        serializer = self.get_serializer(obj)
        return Response(serializer.data)
