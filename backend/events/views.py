from django.shortcuts import get_object_or_404
from django.http import Http404
from rest_framework import viewsets
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

    def get_serialized_obj(self, pk, ticket__qrcode_id):
        try:
            int(pk)
        except ValueError:
            raise Http404
        obj = get_object_or_404(Ticket, event=pk, qrcode_id=ticket__qrcode_id)
        self.check_object_permissions(self.request, obj)
        serializer = self.get_serializer(obj)
        return serializer.data

    @action(methods=['GET'], detail=True, url_path='(?P<ticket__qrcode_id>[A-Z0-9]{12})')
    def get_qrcode(self, request, pk=None, ticket__qrcode_id=None):
        return Response(self.get_serialized_obj(pk, ticket__qrcode_id))

    @action(methods=['DELETE'], detail=True, url_path='(?P<ticket__qrcode_id>[A-Z0-9]{12})')
    def delete_qrcode(self, request, pk=None, ticket__qrcode_id=None):
        data = self.get_serialized_obj(pk, ticket__qrcode_id)
        Ticket.objects.filter(event=pk, qrcode_id=ticket__qrcode_id).delete()
        return Response(data)
