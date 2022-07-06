# Generated by Django 4.0.3 on 2022-07-06 20:10

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('sep_inventory', '0008_alter_entry_options_alter_pack_options_and_more'),
    ]

    database_operations = [
        migrations.RunSQL(
            sql='ALTER TABLE sep_inventory_pack_products RENAME TO sep_inventory_packitem',
            reverse_sql='ALTER TABLE sep_inventory_packitem RENAME TO sep_inventory_pack_products',
        ),
    ]

    state_operations = [
        migrations.CreateModel(
            name='PackItem',
            fields=[
                ('id', models.BigAutoField(auto_created=True,
                                           primary_key=True, serialize=False, verbose_name='ID')),
            ],
            options={
                'verbose_name': 'pack item',
                'verbose_name_plural': 'pack items',
            },
        ),
        migrations.AddField(
            model_name='packitem',
            name='pack',
            field=models.ForeignKey(
                on_delete=django.db.models.deletion.RESTRICT, to='sep_inventory.pack', verbose_name='pack'),
        ),
        migrations.AddField(
            model_name='packitem',
            name='product',
            field=models.ForeignKey(on_delete=django.db.models.deletion.RESTRICT,
                                    to='sep_inventory.product', verbose_name='product'),
        ),
        migrations.AlterUniqueTogether(
            name='packitem',
            unique_together={('pack', 'product')},
        ),
        migrations.AlterField(
            model_name='pack',
            name='products',
            field=models.ManyToManyField(
                through='sep_inventory.PackItem', to='sep_inventory.product', verbose_name='products'),
        ),
    ]

    operations = [
        migrations.SeparateDatabaseAndState(
            database_operations=database_operations, state_operations=state_operations),
    ]
