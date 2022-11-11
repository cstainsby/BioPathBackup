import api.models as models

m1 = models.Molecule(
  name="molecule1",
  link="",
  abbr="m1"
)
m1.save(using="test")

m2 = models.Molecule(
  name="molecule2",
  link="",
  abbr="m2"
)
m2.save(using="test")

m3 = models.Molecule(
  name="molecule3",
  link="",
  abbr="m3"
)
m3.save(using="test")

e1 = models.Enzyme(
  name="enzyme1",
  link="",
  abbr="e1",
  reversible=True
)
e1.save(using="test")

e1.cofactors.add(m3)
e1.substrates.add(m1)
e1.products.add(m2)

p1 = models.Pathway(
  name="path1",
  link="",
  public=True
)
p1.save(using="test")
p1.enzymes.add(e1, x=0, y=100)
p1.substrates.add(m1, x=0, y=0)
p1.substrates.add(m2, x=0, y=200)
p1.substrates.add(m3, x=None, y=None)

p1.save(using="test")