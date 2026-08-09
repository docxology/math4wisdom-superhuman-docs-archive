# Synergetics & Language/Code Models

[https://github.com/4dsolutions](https://github.com/4dsolutions)

It would be useful to explore: 

- combine this proprietary web-based internet accessible mode, with local code models in [https://jan.ai/](https://jan.ai/) and [https://lmstudio.ai/](https://lmstudio.ai/) 

- [https://cursor.sh/](https://cursor.sh/) using code contextualizing, cloning in all of the 4dsolutions repos with embeddings. 

- Making a long large plaintext file for prompting/training language models, with [https://coda.io/d/_d0SvdI3KSto/_suQWY5DS](https://coda.io/d/_d0SvdI3KSto/_suQWY5DS) information

- Axiomatizing and making an Upper/Midlevel/Lower ontology system for [https://coda.io/d/_d0SvdI3KSto/_suQWY5DS](https://coda.io/d/_d0SvdI3KSto/_suQWY5DS) , e.g. as per [https://github.com/ontologyportal/sumo](https://github.com/ontologyportal/sumo) SUMO [https://www.ontologyportal.org/](https://www.ontologyportal.org/)  

- KU: Good starting place if looking for XYZ ←→ Quadray (IVM) interconvertibility:



from [Quadrays and XYZ](https://www.grunch.net/synergetics/quadxyz.html) (1997) — that’s Visual FoxPro code (VFP), by then a Microsoft product

Here is using Perplexity to research Kirby’s repositories

[https://www.perplexity.ai/search/Research-all-of-q7eQENnPT.eaEiaDyYfbZg](https://www.perplexity.ai/search/Research-all-of-q7eQENnPT.eaEiaDyYfbZg)

These functions provide the following functionality:

1. `**quadray_to_xyz**`: Converts a quadray (a, b, c, d) to Cartesian coordinates (x, y, z).

1. `**xyz_to_quadray**`: Converts Cartesian coordinates (x, y, z) to a quadray (a, b, c, d).

1. `**quadray_midpoint**`: Finds the midpoint between two quadrays.

1. `**quadray_distance**`: Calculates the Euclidean distance between two quadrays.

1. `**generate_fcc_quadrays**`: Generates the first n layers of the face-centered cubic (FCC) lattice using quadrays.

```
from math import sqrt

def quadray_to_xyz(quadray):
    """
    Convert a quadray (a, b, c, d) to Cartesian coordinates (x, y, z).
    """
    a, b, c, d = quadray
    x = (a + b) / 2
    y = (b + c) / 2
    z = (c + d) / 2
    return x, y, z

def xyz_to_quadray(x, y, z):
    """
    Convert Cartesian coordinates (x, y, z) to a quadray (a, b, c, d).
    """
    a = x - y + z
    b = x + y - z
    c = -x + y + z
    d = -x - y - z
    return a, b, c, d

def quadray_midpoint(q1, q2):
    """
    Find the midpoint between two quadrays.
    """
    return tuple((a + b) / 2 for a, b in zip(q1, q2))

def quadray_distance(q1, q2):
    """
    Calculate the Euclidean distance between two quadrays.
    """
    return sqrt(sum((a - b)**2 for a, b in zip(q1, q2)))

def generate_fcc_quadrays(n):
    """
    Generate the first n layers of the face-centered cubic (FCC) lattice using quadrays.
    """
    fcc_quadrays = [(0, 0, 0, 0)]
    for layer in range(1, n + 1):
        for a in range(layer + 1):
            for b in range(layer + 1 - a):
                c = layer - a - b
                d = -layer
                fcc_quadrays.append((a, b, c, d))
                fcc_quadrays.append((a, b, d, c))
                fcc_quadrays.append((a, c, b, d))
                fcc_quadrays.append((a, c, d, b))
                fcc_quadrays.append((a, d, b, c))
                fcc_quadrays.append((a, d, c, b))
    return fcc_quadrays
```

KU: Here’s my test drive of the above code. In canonical form, a Qvector should have only non-negative elements, and that rule is broken right away. However a non-normalized (a, b, c, d) might be the correct quadray once normalized, so I check that. I’d say none of these are usable, except the midpoint algorithm is actually correct if we ignore normalizing.

Source code:  [https://github.com/4dsolutions/m4w/blob/main/perp_qrays.py](https://github.com/4dsolutions/m4w/blob/main/perp_qrays.py)

```
(py311) 4dsolutions:m4w kirbyurner$ python
Python 3.11.3 | packaged by conda-forge | (main, Apr  6 2023, 09:05:00) [Clang 14.0.6 ] on darwin
Type "help", "copyright", "credits" or "license" for more information.

>>> import perp_qrays as pq  # Perplexity functions

>>> pq.quadray_to_xyz((1, 0, 0, 0))
(0.5, 0.0, 0.0)

Correct answer:
>>> from qrays import Qvector, Vector  # accepted version
>>> Qvector((1,0,0,0)).xyz             # quadray --> xyz
xyz_vector(x=sqrt(2)/4, y=sqrt(2)/4, z=sqrt(2)/4)

Try going backwards, from previous output:
>>> pq.xyz_to_quadray(0.5, 0, 0)       # xyz --> quadray?
(0.5, 0.5, -0.5, -0.5)

The result is not normalized. Subtract minimum (-0.5, -0.5, -0.5, -0.5) from (0.5, 0.5, -0.5, -0.5) to get (1, 1, 0, 0). However the right answer is:

>>> Vector((0.5, 0, 0)).quadray()
ivm_vector(a=0.5*sqrt(2), b=0, c=0, d=0.5*sqrt(2))

Which is not back to where we started. Round trip in general fails:

>>> pq.xyz_to_quadray(*pq.quadray_to_xyz((2,1,1,0)))  # round trip
(1.0, 2.0, 0.0, -3.0)
>>> Qvector((1,2,0,-3)) # correct normalization = not where we started
ivm_vector(a=4, b=5, c=3, d=0)
>>> Qvector((2,1,1,0)).xyz.quadray() # round trip as it should be
ivm_vector(a=2, b=1, c=1, d=0)

Midpoint works but for normalization issue:

`>>> mp = pq.quadray_midpoint((1,0,0,0), (0,1,0,0))`
`>>> mp`
`(0.5, 0.5, 0.0, 0.0)`
>>> v = Qvector((2,1,1,0))
>>> v
ivm_vector(a=2, b=1, c=1, d=0)
>>> (1/2) * v
ivm_vector(a=1.0, b=0.5, c=0.5, d=0.0)
>>> pq.quadray_midpoint((0,0,0,0), (2,1,1,0))
(1.0, 0.5, 0.5, 0.0)

Euclidean Distance between two points, with points expressed in Quadays:

Testing AI function:
>>> pq.quadray_distance((1,0,0,0),(0,1,0,0))
1.4142135623730951

Correct answer:
>>> (Qvector((1,0,0,0))-Qvector((0,1,0,0))).length()  # edge D of a tetrahedron
1.00000000000000

>>> pq.generate_fcc_quadrays(1)
[(0, 0, 0, 0), (0, 0, 1, -1), (0, 0, -1, 1), (0, 1, 0, -1), (0, 1, -1, 0), (0, -1, 0, 1), (0, -1, 1, 0), (0, 1, 0, -1), (0, 1, -1, 0), (0, 0, 1, -1), (0, 0, -1, 1), (0, -1, 1, 0), (0, -1, 0, 1), (1, 0, 0, -1), (1, 0, -1, 0), (1, 0, 0, -1), (1, 0, -1, 0), (1, -1, 0, 0), (1, -1, 0, 0)]
>>> answer = pq.generate_fcc_quadrays(1)
>>> len(answer)
19

Too many for a first laywer, screen out any dupes:

>>> uniq = list(set(answer))
>>> uniq
[(0, -1, 0, 1), (1, -1, 0, 0), (0, -1, 1, 0), (0, 1, -1, 0), (0, 0, 0, 0), (1, 0, 0, -1), (1, 0, -1, 0), (0, 0, 1, -1), (0, 0, -1, 1), (0, 1, 0, -1)]
>>> len(uniq)
10

Now we have too few. If nuclear ball is included we should have 1 + 12 = 13.

On the bright side, but for (0, 0, 0, 0) the unique tuples returned by generate_fcc_quadrays(1) do indeed all correspond to first layer quadrays, once properly normalized.

>>> [Qvector(t) for t in uniq]
[ivm_vector(a=1, b=0, c=1, d=2), ivm_vector(a=2, b=0, c=1, d=1), ivm_vector(a=1, b=0, c=2, d=1), ivm_vector(a=1, b=2, c=0, d=1), ivm_vector(a=0, b=0, c=0, d=0), ivm_vector(a=2, b=1, c=1, d=0), ivm_vector(a=2, b=1, c=0, d=1), ivm_vector(a=1, b=1, c=2, d=0), ivm_vector(a=1, b=1, c=0, d=2), ivm_vector(a=1, b=2, c=1, d=0)]

generate_fcc_quadrays(2) seems give the right number of balls at first i.e. 55 balls (nuclear ball + twelve in layer 1 + forty two in layer 2)

>>> answer = pq.generate_fcc_quadrays(2)
>>> len(answer)
55
>>> 1 + 12 + 42
55

... but once dupes are weeded out we have only 28 unique vectors.

>>> len(set(answer))
28

Those that made it to the final answer do seem to be from the correct set judging from the lengths, even if not normalized.

>>> [Qvector(q).length() for q in set(answer)] 
[1.00000000000000, 1.73205080756888, 2.00000000000000, 1.00000000000000, 1.00000000000000, 2.00000000000000, 1.73205080756888, 1.73205080756888, 1.00000000000000, 1.73205080756888, 2.00000000000000, 1.00000000000000, 2.00000000000000, 1.00000000000000, 1.73205080756888, 1.73205080756888, 1.00000000000000, 2.00000000000000, 1.73205080756888, 2.00000000000000, 2.00000000000000, 1.00000000000000, 0, 1.00000000000000, 1.73205080756888, 1.73205080756888, 2.00000000000000, 2.00000000000000]

But the real answer, of 42 balls in layer 2 has other lengths also:

[1.7320508075688772,
 1.4142135623730951,
 1.7320508075688772,
 1.7320508075688772,
 1.7320508075688772,
 1.4142135623730951,
 1.4142135623730951,
 2.0,
 1.7320508075688772,
 2.0,
 1.7320508075688772,
 1.7320508075688772,
 1.7320508075688772,
 1.7320508075688772,
 2.0,
 1.7320508075688772,
 1.7320508075688772,
 1.7320508075688772,
 1.4142135623730951,
 1.4142135623730951,
 2.0,
 1.7320508075688772,
 2.0,
 1.4142135623730951,
 2.0,
 2.0,
 1.7320508075688772,
 1.7320508075688772,
 2.0,
 2.0,
 1.7320508075688772,
 1.7320508075688772,
 1.7320508075688772,
 1.7320508075688772,
 1.7320508075688772,
 1.7320508075688772,
 1.7320508075688772,
 1.7320508075688772,
 1.7320508075688772,
 2.0,
 2.0,
 2.0]
```
