# Generated by Django 3.2.6 on 2021-08-31 22:13

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('sep_inventory', '0005_auto_20210830_1108'),
    ]

    operations = [
        migrations.AlterUniqueTogether(
            name='saleitem',
            unique_together={('product', 'sale')},
        ),
    ]