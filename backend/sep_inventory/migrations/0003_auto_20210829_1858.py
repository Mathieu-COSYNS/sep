# Generated by Django 3.2.6 on 2021-08-29 16:58

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('sep_inventory', '0002_remove_product_quantity'),
    ]

    operations = [
        migrations.AlterField(
            model_name='entry',
            name='product',
            field=models.ForeignKey(on_delete=django.db.models.deletion.RESTRICT, related_name='product', to='sep_inventory.product'),
        ),
        migrations.AlterField(
            model_name='sale',
            name='items',
            field=models.ManyToManyField(related_name='items', through='sep_inventory.SaleItem', to='sep_inventory.Product'),
        ),
        migrations.AlterField(
            model_name='sale',
            name='payment_method',
            field=models.ForeignKey(on_delete=django.db.models.deletion.RESTRICT, related_name='payment_method', to='sep_inventory.paymentmethod'),
        ),
        migrations.AlterField(
            model_name='saleitem',
            name='product',
            field=models.ForeignKey(on_delete=django.db.models.deletion.RESTRICT, related_name='product_bought', to='sep_inventory.product'),
        ),
        migrations.AlterField(
            model_name='saleitem',
            name='sale',
            field=models.ForeignKey(on_delete=django.db.models.deletion.RESTRICT, related_name='sale', to='sep_inventory.sale'),
        ),
    ]