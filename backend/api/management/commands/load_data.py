"""
Script for clearing and glycolysis data into the database.
This script is called in setup.sh, so you'll have to not use that script or remove
    that line if you wish to persist database data.
TODO Put ALL data in a dict and use serializers to insert into DB instead of manually
    creating each model.
TODO Add links, photos(?), etc
    * Only necessary if this will be used to get glycolysis into prod
"""

from api import models
from django.core.management.base import BaseCommand

class Command(BaseCommand):
    def handle(self, **options):
        
        # now do the things that you want with your models here
        
        for e in models.EnzymeInstance.objects.all():
          e.delete()
        for e in models.MoleculeInstance.objects.all():
          e.delete()
        for m in models.Molecule.objects.all():
          m.delete()
        for e in models.Enzyme.objects.all():
          e.delete()
        for e in models.Pathway.objects.all():
          e.delete()

        try:
            root = models.User.objects.get(username="root")
        except:
            root = models.User.objects.create_superuser(
                username='root',
                email='',
                password='root'
            )
        
        # ----- Fake Pathway -----
        p1 = models.Pathway.objects.create(
            name="path1",
            public=True,
            author=root
        )

        # molecules
        m1 = models.Molecule.objects.create(
            name="molecule1",
            abbreviation="m1",
            author=root,
            public=True
        )
        m1i = models.MoleculeInstance.objects.create(
            molecule=m1,
            x=45,
            y=0,
            pathway=p1
        )

        m2 = models.Molecule.objects.create(
            name="molecule2",
            abbreviation="m2",
            author=root,
            public=True
        )
        m2i = models.MoleculeInstance.objects.create(
            molecule=m2,
            x=45,
            y=240,
            pathway=p1
        )

        m3 = models.Molecule.objects.create(
            name="molecule3",
            abbreviation="m3",
            author=root,
            public=True
        )
        m3i = models.MoleculeInstance.objects.create(
            molecule=m3,
            x=195,
            y=120,
            pathway=p1
        )

        e1 = models.Enzyme.objects.create(
            name="enzyme1",
            abbreviation="e1",
            reversible=True,
            author=root,
            public=True
        )
        e1i = models.EnzymeInstance.objects.create(
            enzyme=e1,
            x=0,
            y=100,
            limiting=True,
            pathway=p1
        )

        e1.substrates.add(m1)
        e1.products.add(m2)
        e1.cofactors.add(m3)

        e1i.substrate_instances.add(m1i)
        e1i.product_instances.add(m2i)
        e1i.cofactor_instances.add(m3i)


        

        # p1.molecule_instances.add(m1i, m2i, m3i)
        # p1.enzyme_instances.add(e1i)


        # ----- Glycolysis -----
        glycolysis = models.Pathway.objects.create(
            name="Glycolysis",
            author=root,
            #link=
            public=True
        )

        # molecules
        glu = models.Molecule.objects.create(
            name="Glucose",
            abbreviation="GLU",
            #ball_and_stick_image=,
            #space_filling_image=,
            # link=,
            author=root,
            public=True
        )
        glu_instance = models.MoleculeInstance.objects.create(
            molecule=glu,
            x=225,
            y=150,
            pathway=glycolysis
        )

        g6p = models.Molecule.objects.create(
            name="Glucose 6-Phosphate",
            abbreviation="G6P",
            #ball_and_stick_image=,
            #space_filling_image=,
            # link=,
            author=root,
            public=True
        )
        g6p_instance = models.MoleculeInstance.objects.create(
            molecule=g6p,
            x=240,
            y=390,
            pathway=glycolysis
        )

        f6p = models.Molecule.objects.create(
            name="Fructose 6-Phosphate",
            abbreviation="F6P",
            #ball_and_stick_image=,
            #space_filling_image=,
            # link=,
            author=root,
            public=True
        )
        f6p_instance = models.MoleculeInstance.objects.create(
            molecule=f6p,
            x=225,
            y=630,
            pathway=glycolysis
        )
        
        f16bp = models.Molecule.objects.create(
            name="Fructose 1,6-Biphosphate",
            abbreviation="F16BP",
            #ball_and_stick_image=,
            #space_filling_image=,
            # link=,
            author=root,
            public=True
        )
        f16bp_instance = models.MoleculeInstance.objects.create(
            molecule=f16bp,
            x=240,
            y=855,
            pathway=glycolysis
        )
        
        g3p = models.Molecule.objects.create(
            name="Glyceraldehyde 3-Phosphate",
            abbreviation="G3P",
            #ball_and_stick_image=,
            #space_filling_image=,
            # link=,
            author=root,
            public=True
        )
        g3p_instance = models.MoleculeInstance.objects.create(
            molecule=g3p,
            x=210,
            y=1395,
            pathway=glycolysis
        )

        dhap = models.Molecule.objects.create(
            name="Dehydrocycetone Phosphate",
            abbreviation="DHAP",
            #ball_and_stick_image=,
            #space_filling_image=,
            # link=,
            author=root,
            public=True
        )
        dhap_instance = models.MoleculeInstance.objects.create(
            molecule=dhap,
            x=345,
            y=1095,
            pathway=glycolysis
        )

        bpg = models.Molecule.objects.create(
            name="1,3-Bisphosphoglycerate",
            abbreviation="13BPG",
            #ball_and_stick_image=,
            #space_filling_image=,
            # link=,
            author=root,
            public=True
        )
        bpg_instance = models.MoleculeInstance.objects.create(
            molecule=bpg,
            x=195,
            y=1710,
            pathway=glycolysis
        )

        pg3 = models.Molecule.objects.create(
            name="3-Phosphoglycerate",
            abbreviation="3PG",
            #ball_and_stick_image=,
            #space_filling_image=,
            # link=,
            author=root,
            public=True
        )
        pg3_instance = models.MoleculeInstance.objects.create(
            molecule=pg3,
            x=210,
            y=1980,
            pathway=glycolysis
        )

        pg2 = models.Molecule.objects.create(
            name="2-Phosphoglycerate",
            abbreviation="2PG",
            #ball_and_stick_image=,
            #space_filling_image=,
            # link=,
            author=root,
            public=True
        )
        pg2_instance = models.MoleculeInstance.objects.create(
            molecule=pg2,
            x=270,
            y=2235,
            pathway=glycolysis
        )

        pep = models.Molecule.objects.create(
            name="Phosphoenolpyruvate",
            abbreviation="PEP",
            #ball_and_stick_image=,
            #space_filling_image=,
            # link=,
            author=root,
            public=True
        )
        pep_instance = models.MoleculeInstance.objects.create(
            molecule=pep,
            x=240,
            y=2535,
            pathway=glycolysis
        )

        pyr = models.Molecule.objects.create(
            name="Pyruvate",
            abbreviation="PYR",
            #ball_and_stick_image=,
            #space_filling_image=,
            # link=,
            author=root,
            public=True
        )
        pyr_instance = models.MoleculeInstance.objects.create(
            molecule=pyr,
            x=225,
            y=2850,
            pathway=glycolysis
        )

        nad = models.Molecule.objects.create(
            name="NAD+",
            abbreviation="NAD+",
            #ball_and_stick_image=,
            #space_filling_image=,
            # link=,
            author=root,
            public=True
        )
        nad_instance = models.MoleculeInstance.objects.create(
            molecule=nad,
            x=375,
            y=1410,
            pathway=glycolysis
        )

        nadh = models.Molecule.objects.create(
            name="NADH",
            abbreviation="NADH",
            #ball_and_stick_image=,
            #space_filling_image=,
            # link=,
            author=root,
            public=True
        )
        nadh_instance = models.MoleculeInstance.objects.create(
            molecule=nadh,
            x=285,
            y=1680,
            pathway=glycolysis
        )

        h = models.Molecule.objects.create(
            name="H+",
            abbreviation="H+",
            #ball_and_stick_image=,
            #space_filling_image=,
            # link=,
            author=root,
            public=True
        )
        h_instance = models.MoleculeInstance.objects.create(
            molecule=h,
            x=375,
            y=1680,
            pathway=glycolysis
        )

        atp = models.Molecule.objects.create(
            name="ATP",
            abbreviation="ATP",
            #ball_and_stick_image=,
            #space_filling_image=,
            # link=,
            author=root,
            public=True
        )
        atp_instance1 = models.MoleculeInstance.objects.create(
            molecule=atp,
            x=375,
            y=150,
            pathway=glycolysis
        )
        atp_instance2 = models.MoleculeInstance.objects.create(
            molecule=atp,
            x=375,
            y=630,
            pathway=glycolysis
        )
        atp_instance3 = models.MoleculeInstance.objects.create(
            molecule=atp,
            x=360,
            y=1740,
            pathway=glycolysis
        )
        atp_instance4 = models.MoleculeInstance.objects.create(
            molecule=atp,
            x=360,
            y=2565,
            pathway=glycolysis
        )

        adp = models.Molecule.objects.create(
            name="ADP",
            abbreviation="ADP",
            #ball_and_stick_image=,
            #space_filling_image=,
            # link=,
            author=root,
            public=True
        )
        adp_instance1 = models.MoleculeInstance.objects.create(
            molecule=adp,
            x=390,
            y=390,
            pathway=glycolysis
        )
        adp_instance2 = models.MoleculeInstance.objects.create(
            molecule=adp,
            x=375,
            y=855,
            pathway=glycolysis
        )
        adp_instance3 = models.MoleculeInstance.objects.create(
            molecule=adp,
            x=390,
            y=1980,
            pathway=glycolysis
        )
        adp_instance4 = models.MoleculeInstance.objects.create(
            molecule=adp,
            x=360,
            y=2850,
            pathway=glycolysis
        )

        h2o = models.Molecule.objects.create(
            name="Hydrogen Dioxide",
            abbreviation="H2O",
            # ball_and_stick_image=,
            # space_filling_image=,
            # link=,
            author=root,
            public=True
        )
        h2o_instance = models.MoleculeInstance.objects.create(
            molecule=h2o,
            x=360,
            y=2490,
            pathway=glycolysis
        )

        # ----- enzymes -----
        hexokinase = models.Enzyme.objects.create(
            name="Hexokinase",
            abbreviation="HK",
            # image=,
            link="hexokinase",
            author=root,
            public=True,
            reversible=False
        )
        hexokinase.substrates.add(glu, atp)
        hexokinase.products.add(g6p, adp)
        hexokinase_instance = models.EnzymeInstance.objects.create(
            enzyme=hexokinase,
            x=210,
            y=240,
            limiting=True,
            pathway=glycolysis
        )
        hexokinase_instance.substrate_instances.add(glu_instance, atp_instance1)
        hexokinase_instance.product_instances.add(g6p_instance, adp_instance1)

        phosphoglucoisomerase = models.Enzyme.objects.create(
            name="Phosphoglucoisomerase",
            abbreviation="PGI",
            # image=,
            link="phosphoglucose isomerase",
            author=root,
            public=True,
            reversible=True,
        )
        phosphoglucoisomerase.substrates.add(g6p)
        phosphoglucoisomerase.products.add(f6p)
        phosphoglucoisomerase_instance = models.EnzymeInstance.objects.create(
            enzyme=phosphoglucoisomerase,
            x=135,
            y=480,
            limiting=True,
            pathway=glycolysis
        )
        phosphoglucoisomerase_instance.substrate_instances.add(g6p_instance)
        phosphoglucoisomerase_instance.product_instances.add(f6p_instance)
        
        phosphofructokinase = models.Enzyme.objects.create(
            name="Phosphofructokinase",
            abbreviation="PFK",
            # image=,
            link="phosphofructokinase",
            author=root,
            public=True,
            reversible=False,
        )
        phosphofructokinase.substrates.add(f6p, atp)
        phosphofructokinase.products.add(f16bp, adp)
        phosphofructokinase_instance = models.EnzymeInstance.objects.create(
            enzyme=phosphofructokinase,
            x=210,
            y=720,
            limiting=True,
            pathway=glycolysis
        )
        phosphofructokinase_instance.substrate_instances.add(f6p_instance, atp_instance2)
        phosphofructokinase_instance.product_instances.add(f16bp_instance, adp_instance2)

        aldolase = models.Enzyme.objects.create(
            name="Aldolase",
            abbreviation="ALD",
            # image=,
            link="aldolase",
            author=root,
            public=True,
            reversible=True,
        )
        aldolase.substrates.add(f16bp)
        aldolase.products.add(g3p, dhap)
        aldolase_instance = models.EnzymeInstance.objects.create(
            enzyme=aldolase,
            x=165,
            y=945,
            limiting=True,
            pathway=glycolysis
        )
        aldolase_instance.substrate_instances.add(f16bp_instance)
        aldolase_instance.product_instances.add(g3p_instance, dhap_instance)
        
        triose_phosphate_isomerase = models.Enzyme.objects.create(
            name="Triose Phosphate Isomerase",
            abbreviation="ISO",
            # image=,
            link="triose phosphate isomerase",
            author=root,
            public=True,
            reversible=True,
        )
        triose_phosphate_isomerase.substrates.add(dhap)
        triose_phosphate_isomerase.products.add(g3p)
        triose_phosphate_isomerase_instance = models.EnzymeInstance.objects.create(
            enzyme=triose_phosphate_isomerase,
            x=285,
            y=1185,
            limiting=True,
            pathway=glycolysis
        )
        triose_phosphate_isomerase_instance.substrate_instances.add(dhap_instance)
        triose_phosphate_isomerase_instance.product_instances.add(g3p_instance)

        tpd = models.Enzyme.objects.create(
            name="Trios Phosphate Dehydrogenase",
            abbreviation="TPD",
            # image=,
            link="triose phosphate dehydrogenase",
            author=root,
            public=True,
            reversible=True,
        )
        tpd.substrates.add(g3p, nad)
        tpd.products.add(bpg, nadh, h)
        tpd_instance = models.EnzymeInstance.objects.create(
            enzyme=tpd,
            x=195,
            y=1515,
            limiting=True,
            pathway=glycolysis
        )
        tpd_instance.substrate_instances.add(g3p_instance, nad_instance)
        tpd_instance.product_instances.add(bpg_instance, nadh_instance, h_instance)
        
        phosphoglycerokinase = models.Enzyme.objects.create(
            name="Phosphoglycerokinase",
            abbreviation="PGK",
            # image=,
            link="phosphoglycerate kinase",
            author=root,
            public=True,
            reversible=True
        )
        phosphoglycerokinase.substrates.add(bpg, atp)
        phosphoglycerokinase.products.add(pg3, adp)
        phosphoglycerokinase_instance = models.EnzymeInstance.objects.create(
            enzyme=phosphoglycerokinase,
            x=195,
            y=1830,
            limiting=True,
            pathway=glycolysis
        )
        phosphoglycerokinase_instance.substrate_instances.add(bpg_instance, atp_instance3)
        phosphoglycerokinase_instance.product_instances.add(pg3_instance, adp_instance3)

        phosphoglyceromutase = models.Enzyme.objects.create(
            name="Phosphoglyceromutase",
            abbreviation="PGM",
            # image=,
            link="phosphoglycerate mutase",
            author=root,
            public=True,
            reversible=True,
        )
        phosphoglyceromutase.substrates.add(pg3)
        phosphoglyceromutase.products.add(pg2)
        phosphoglyceromutase_instance = models.EnzymeInstance.objects.create(
            enzyme=phosphoglyceromutase,
            x=150,
            y=2070,
            limiting=True,
            pathway=glycolysis
        )
        phosphoglyceromutase_instance.substrate_instances.add(pg3_instance)
        phosphoglyceromutase_instance.product_instances.add(pg2_instance)

        enolase = models.Enzyme.objects.create(
            name="Enolase",
            abbreviation="ENO",
            # image=,
            link="enolase",
            author=root,
            public=True,
            reversible=True,
        )
        enolase.substrates.add(pg2)
        enolase.products.add(pep, h2o)
        enolase_instance = models.EnzymeInstance.objects.create(
            enzyme=enolase,
            x=210,
            y=2340,
            limiting=True,
            pathway=glycolysis
        )
        enolase_instance.substrate_instances.add(pg2_instance)
        enolase_instance.product_instances.add(pep_instance, h2o_instance)

        pyrk = models.Enzyme.objects.create(
            name="Pyruvate Kinase",
            abbreviation="PYRK",
            # image=,
            link="pyruvate kinase",
            author=root,
            public=True,
            reversible=True,
        )
        pyrk.substrates.add(pep, atp)
        pyrk.products.add(pyr, adp)
        pyrk_instance = models.EnzymeInstance.objects.create(
            enzyme=pyrk,
            x=195,
            y=2670,
            limiting=True,
            pathway=glycolysis
        )
        pyrk_instance.substrate_instances.add(pep_instance, atp_instance4)
        pyrk_instance.product_instances.add(pyr_instance, adp_instance4)