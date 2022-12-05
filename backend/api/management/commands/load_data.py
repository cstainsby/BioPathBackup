"""
File: load_data.py

Script for clearing and loading fresh data into the database.
Ideally used for testing and to have a consistent database everytime.
This script is called using "python manage.py load_data" from setup.sh
and can be ommitted to retain old database data. 
"""

import api.models as models
from django.contrib.auth.models import User

from django.core.management.base import BaseCommand

class Command(BaseCommand):
    def handle(self, **options):
        
        # now do the things that you want with your models here
        
        for e in models.PathwayEnzyme.objects.all():
          e.delete()
        for e in models.PathwayMolecule.objects.all():
          e.delete()
        for m in models.Molecule.objects.all():
          m.delete()
        for e in models.Enzyme.objects.all():
          e.delete()
        for e in models.Pathway.objects.all():
          e.delete()
        for e in User.objects.all():
          e.delete()

        u1 = User.objects.create_superuser('root', 'root@biopath.com', 'root')
        m1 = models.Molecule(
          name="molecule1",
          link="",
          abbreviation="m1",
          author=u1
        )
        m1.save()

        m2 = models.Molecule(
          name="molecule2",
          link="",
          abbreviation="m2",
          author=u1
        )
        m2.save()

        m3 = models.Molecule(
          name="molecule3",
          link="",
          abbreviation="m3",
          author=u1
        )
        m3.save()

        e1 = models.Enzyme(
          name="enzyme1",
          link="",
          abbreviation="e1",
          reversible=True,
          author=u1
        )
        e1.save()

        e1.cofactors.add(m3)
        e1.substrates.add(m1)
        e1.products.add(m2)

        p1 = models.Pathway(
          name="path1",
          link="",
          public=True,
          author=u1
        )
        p1.save()

        pe1 = models.PathwayEnzyme(
          enzyme=e1,
          pathway=p1,
          x=0,
          y=100
        )
        pe1.save()
        pm1 = models.PathwayMolecule(
          molecule=m1,
          pathway=p1,
          x=0,
          y=0
        )
        pm1.save()
        pm2 = models.PathwayMolecule(
          molecule=m2,
          pathway=p1,
          x=0,
          y=200
        )
        pm2.save()
        pm3 = models.PathwayMolecule(
          molecule=m3,
          pathway=p1,
          x=400,
          y=100
        )
        pm3.save()