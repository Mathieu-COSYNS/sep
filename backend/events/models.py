from django.core.validators import RegexValidator
from django.db import models
from django.db.models.deletion import CASCADE
from django.utils.translation import gettext_lazy as _


class Event(models.Model):
    class Meta:
        verbose_name = _('event')
        verbose_name_plural = _('events')

    name = models.CharField(_('name'), max_length=64)

    def __str__(self) -> str:
        return f'{self.name}'


class Ticket(models.Model):
    class Meta:
        verbose_name = _('ticket')
        verbose_name_plural = _('tickets')
        unique_together = ('qrcode_id', 'event')

    label = models.CharField(_('label'), max_length=64)
    price = models.DecimalField(_('price'), decimal_places=2, max_digits=4)
    qrcode_id = models.CharField(
        _('QR code identifier'), max_length=12, validators=[RegexValidator(r'[A-Z0-9]{12}}', message=_('The QR code identifier must contain exactly 12 characters in the A-Z,0-9 range'))])
    event = models.ForeignKey(
        'Event', on_delete=CASCADE, verbose_name=_('event'))

    def __str__(self) -> str:
        return f'{self.label} {self.price}'
