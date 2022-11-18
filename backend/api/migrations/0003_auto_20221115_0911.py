# Generated by Django 3.2.15 on 2022-11-15 09:11

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0002_auto_20221110_1022'),
    ]

    operations = [
        migrations.RenameField(
            model_name='pathwaymolecule',
            old_name='substrate',
            new_name='molecule',
        ),
        migrations.AlterUniqueTogether(
            name='pathwayenzyme',
            unique_together={('enzyme', 'pathway')},
        ),
        migrations.AlterUniqueTogether(
            name='pathwaymolecule',
            unique_together={('molecule', 'pathway')},
        ),
    ]
