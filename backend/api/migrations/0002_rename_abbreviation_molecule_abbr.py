# Generated by Django 4.1.3 on 2022-11-08 20:41

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0001_initial'),
    ]

    operations = [
        migrations.RenameField(
            model_name='molecule',
            old_name='abbreviation',
            new_name='abbr',
        ),
    ]
