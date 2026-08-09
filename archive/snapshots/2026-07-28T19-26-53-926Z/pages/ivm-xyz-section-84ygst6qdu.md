# ivm-xyz

[source code](https://github.com/4dsolutions/School_of_Tomorrow/blob/master/tabulate.py) for the program shown below:





<columns>
https://www.youtube.com/watch?v=2WuJGHUIq_I



|||

# This report covers the Measurement, Methods, and Further Avenues of Approach for [https://coda.io/d/_d0SvdI3KSto/_suSt6qdu](https://coda.io/d/_d0SvdI3KSto/_suSt6qdu) on 3-13-2024. 

[https://www.youtube.com/watch?v=2WuJGHUIq_I](https://www.youtube.com/watch?v=2WuJGHUIq_I)



# Check more recent developments in [https://coda.io/d/_d0SvdI3KSto/_suSt6qdu](https://coda.io/d/_d0SvdI3KSto/_suSt6qdu) at:  
[https://github.com/4dsolutions/m4w](https://github.com/4dsolutions/m4w) 


</columns>

# DEVELOPMENTS:  SEPT 4, 2024

GIven the overall topic heading here is ivm-xyz, I (<formula id="f-9ttZ426-gV">kirby urner</formula> ) am giving headline treatment (H2 tag) to my rewrite, as of this morning, of the xyz ←→ abcd conversion algorithms, using far simpler and more intuitive logic. 

Compare old (*_old) and new below:





A vector is a vector sum of scaled basis vectors. 

**VECTOR → QVECTOR**: If you have the XYZ basis vectors i, j, k expressed as quadrays Q1, Q2, Q3, then random (x, y, z) means (x Q1 + y Q2 + z Q3) where Q1, Q2, Q3 are the Qvectors corresponding to i, j, k respectively. A negative x, y and/or z will scale -Q1, -Q2, and/or -Q3 accordingly.

**QVECTOR → VECTOR**: If you have the four basis Qvectors expressed in xyz, then random (a, b, c, d) is simply the vector sum (a V1 + b V2 + c V3 + d V4) where V1 - V4 are the XYZ vectors corresponding to (1, 0, 0 0), (0, 1, 0, 0), (0, 0, 1, 0) and (0, 0, 0, 1).

By the end of Sep 4 I had this new Google slide based on the latest source code. The old versions of the conversion methods were deleted (they live on in version history).



[Related Notebook / Worksheet](https://github.com/4dsolutions/m4w/blob/main/QraysDev.ipynb)

# Measurement

- ivm-xyz [https://github.com/docxology/ivm-xyz](https://github.com/docxology/ivm-xyz) is a (messy and incomplete) step towards multi-operability and inter-/intra-legibility for at least two co-ordinate systems (reference frames):

  - 3-dimensional, right-angle, cubic (XYZ)

  - 4-dimensional, quadray, caltrop, close packing spheres, Isotropic Vector Matrix (IVM)  

<columns>
12 sphere around 1



|||

Co-tessellation of Tetrahedra and Octahedra (Octet Truss)

 



|||



The basic observation is that:  
the XYZ unit cube,  
has an irrational hypotenuse in XYZ mindset,  
which can be rescaled to an integer Tet side,  
and also omni-triangulates the cube



So there still is a rectangular/cubic overlay on the IVM, that right-angled crystal/shape is the irrational (though still legible & integral) one, in a cosmic hierarchy of shapes reflecting a variety of woven properties related to their low or finte integer status, and geo-topo-vectorial gravitations and radiations.   





|||

Other notes; 

## **Vpython + Synergetics**

[http://www.4dsolutions.net/ocn/koskigeom.html](http://www.4dsolutions.net/ocn/koskigeom.html)  
 

[Isotropic Vector Matrix Grid and Face-Centered Cubic Lattice Data Structures](https://link.springer.com/chapter/10.1007/11428862_181)




</columns>

- [https://github.com/docxology/ivm-xyz](https://github.com/docxology/ivm-xyz) is the open source repo where the code is now hosted.

# Methods 

Today following <formula id="f-byIwwaFdaa">3/13/2024</formula> Knowledge Engineering with Andrius & Kirby, I continued to work on the [https://coda.io/d/_d0SvdI3KSto/_sumdOW8a](https://coda.io/d/_d0SvdI3KSto/_sumdOW8a) angle.

Summary: I used [https://cursor.sh/](https://cursor.sh/) as a local IDE with GPT4 access for codebase embedding, deBugging, and generating code. Also I went back and forth a few times with [https://perplexity.ai/?](https://perplexity.ai/?) 

1. Explored language models with some prompting about interoperability of XYZ 3D and IVM 4D namespaces (also this is long term conversation in Trimtab, in Kirby’s work, and elsewhere). 

1. Used Claude 3 via Perplexity to write script clone_4dsolutions.py to pull in all 4dsolutions repos locally (so Cursor could embed them within ivm-xyz repo). Pulled all 4dsolutions repos into Cursor IDE & resynced the total embeddings. 

1. Went through all folders and found what seemed to be some of the most relevant .py files (e.g. amenable for quick local execution) rather than looking through notebooks at all (this material is still indexed though). 

1. Confirmed that all packages were installed, and did some light modification on the tetravolume.py script interacting with qrays.py and and tests.py . 

1. Continuing to chat 

1. Develop towards tetravolume_2.py (I am not sure if 100% retained accuracy yet), which outputs tables and some interesting Synergetic possibilities for the IVM-XYZ curious. 

1. Upload to github, write up this list, prepare. 

# Further Avenues of Approach 

- Explorations with local-only language/codes models via [https://lmstudio.ai/](https://lmstudio.ai/) and [https://jan.ai/](https://jan.ai/) . 

- Contextualizing code with [cursor.sh](cursor.sh) and other tools, as libraries of cases/examples grow, as we continue to look back at Fuller & Applewhite’s [https://coda.io/d/_d0SvdI3KSto/_suQWY5DS](https://coda.io/d/_d0SvdI3KSto/_suQWY5DS) books, being able to articulate and leverage insights from the last 50 years and continuing through the current moment. 

- Training and Contextualizing language models with code and formalized/crystalized information (this may be accomplished simply with better overall Coding models/agents/systems — it does not seem like the overall Quadray Quest is an especially computationally intensive one). 

- Axiomatizing and creating an system for (inter)ontology works working with e.g. [https://coda.io/d/_d0SvdI3KSto/_suQWY5DS](https://coda.io/d/_d0SvdI3KSto/_suQWY5DS),  SUMO, ....... This could provide a structured and organized representation of the concepts, relationships, and entities, to fold back in & improve with the statistical [https://coda.io/d/_d0SvdI3KSto/_sumdOW8a](https://coda.io/d/_d0SvdI3KSto/_sumdOW8a) 



# Responses

Andrius, 03.13: Daniel, nice to see your whirlwind progress!

# Regarding the original Python codebase

KU: the original [qrays.py](https://github.com/4dsolutions/m4w/blob/main/qrays.py) does ivm-xyz conversion, while implementing specific conventions, such as having the “basis tetrahedron” of edges D (IVM ball diameter) be unit volume, with D set to 1. 

That means the distance from the tetrahedron’s center at (0,0,0,0) to its corners at (1,0,0,0), (0,1,0,0), (0,0,1,0) and (0,0,0,1) is not set to unit (heresy!).

```
>>> import qrays
>>> a, b, c, d = qrays.ivm_basis()
>>> a
ivm_vector(a=1, b=0, c=0, d=0)
>>> a.length()
sqrt(6)/4
>>> a.length().evalf(40)
0.6123724356957945245493210186764728479915
>>> b
ivm_vector(a=0, b=1, c=0, d=0)
>>> (a - b).length()
1
>>> (a - b).length().evalf(40)
1.000000000000000000000000000000000000000
```

The topic of tetrahedron volume computation has been treated in separate modules. The ivm way of figuring out a tetrahedron’s volume differs from the xyz way, with a conversion constant between the two outcomes. 

The XYZ → IVM volumetric conversion constant S3 is about 1.06066, meaning the volume in unit tetrahedrons is a little greater, because an IVM unit tetrahedron with edges D (diameter) is a little smaller than the corresponding XYZ unit cube with edges R (radius, or half diameter). 

It’ll take a roughly 6% larger number of unit tetrahedrons than unit cubes to account for the same shape or volume. IVM → XYZ volumetric conversion involves using 1/S3, the sqrt(8/9).

The topic of rendering 3D ray traced scenes of polyhedrons, sometimes defining them [using ivm coordinates](https://en.wikipedia.org/wiki/Quadray_coordinates) initially, and/or the topic of generating [ivm sphere centers in a lattice](https://github.com/4dsolutions/Python5/blob/master/Generating%20the%20FCC.ipynb), likewise using quadrays, have been taken up in separate Python modules that depend on some version of qrays.py.

Then comes the whole topic of how to store polyhedron data. It makes sense to store the concentric hierarchy directly in the source code sometimes, minus any separate data layer. Other times, it makes sense to have a database of polyhedrons specifically, in relational tables with an SQL API. The modules in my repos have examples of these designs. 

Check out Antiprism by Adrian Rossiter for another codebase that aims to output in povray scene description language (.pov files). This has been one of my chief strategies as it’s something renderable that I’m after. Alternatives are to use Blender for rendering and animation, or VPython, a Python environments that includes a relatively simple API to OpenGL.

In the cases of Synergetics area and volume computations: the vectors in question share a common origin while the area or volume in question is formed by “closing the lid” i.e. connecting vector tips to form either a 3rd edge (triangular area) or 4th face (tetrahedral volume). These are measured in unit triangles and tetrahedrons respectively. 

I confess to spending far more time on the topic of volume (tetravolumes) and volumetric conversion, than on the topic of area. I retrospectively discovered [Wayne Roberts](https://www.principlesofnature.com) exploring “equilateral triangular units” (etus) long after picking up on Fuller’s analogous approach with volume. I’ve highlighted his website in my Youtubes. He does not appear to be tracing any of his thinking to Bucky’s.

My codebase makes both types of vector, Vector and Qvector, Python classes with instance methods, meaning these vector types “look within” to find their own length etc.  v1 + v2 is implementing with “dunder add” and 3 * v1 with “dunder mul”. If unfamiliar with this shoptalk, maybe check out [my creative writing](https://mail.python.org/archives/list/edu-sig@python.org/message/MXGXRQLW63L6XCPABB53PS4YCMYEBKFJ/).

A different approach would be to have xyz and ivm vectors reduced to mere 3-tuples and 4-tuples respectively, then fed to external library functions that find vector length, angle and area between two vectors, volume between three (shared tail point) and so on.

Internally to these vector types, I use [the Python “namedtuple”](https://docs.python.org/3/library/collections.html#namedtuple-factory-function-for-tuples-with-named-fields) as my data structure. 

```
XYZ = namedtuple("xyz_vector", "x y z")
IVM = namedtuple("ivm_vector", "a b c d")
```

I also treat Qvector as a subclass of Vector. 

```
Python 3.11.3 | packaged by conda-forge | (main, Apr  6 2023, 09:05:00) [Clang 14.0.6 ] on darwin
Type "help", "copyright", "credits" or "license" for more information.

>>> from qrays import Vector, Qvector
>>> import qrays
>>> a, b, c, d = qrays.ivm_basis()
>>> for v in a, b, c, d:
...     print("{ivm} --> {xyz}".format(ivm = v, xyz = v.xyz))
... 
ivm_vector(a=1, b=0, c=0, d=0) --> xyz_vector(x=sqrt(2)/4, y=sqrt(2)/4, z=sqrt(2)/4)
ivm_vector(a=0, b=1, c=0, d=0) --> xyz_vector(x=-sqrt(2)/4, y=-sqrt(2)/4, z=sqrt(2)/4)
ivm_vector(a=0, b=0, c=1, d=0) --> xyz_vector(x=-sqrt(2)/4, y=sqrt(2)/4, z=-sqrt(2)/4)
ivm_vector(a=0, b=0, c=0, d=1) --> xyz_vector(x=sqrt(2)/4, y=-sqrt(2)/4, z=-sqrt(2)/4)

>>> a.length()
sqrt(6)/4
>>> a.xyz.length()
sqrt(6)/4
>>> (a-b).length()
1
```

The Vector → Qvector conversion method is named Vector.quadray and the version in the m4w repo is especially weird-looking, because it’s designed to work with [sympy](https://docs.sympy.org/latest/index.html) types that can’t be treated like ordinary integers or floats. 

(x >=0) usually returns native True or False, immediately usable as integers because bool is a subclass of int. Not so in sympy.

```
>>> from sympy import sqrt
>>> phi = (1 + sqrt(5))/2
>>> phi
1/2 + sqrt(5)/2
>>> phi >= 0
True
>>> type(phi >= 0)
<class 'sympy.logic.boolalg.BooleanTrue'>
>>> bool(phi >= 0) * 10
10
>>> type(bool(phi >= 0))
<class 'bool'>
>>> import sympy
>>> bool(phi >= 0) * sympy.Integer(10)
10
>>> bool(phi >= 0) * sympy.Rational(1,10) # bool doesn't work with Rational
Traceback (most recent call last):
  File "<stdin>", line 1, in <module>
TypeError: unsupported operand type(s) for *: 'bool' and 'Rational'
>>> int(bool(phi >= 0)) * sympy.Rational(1,10) # convert bool to int first
1/10
```

In chronological terms, I was content with floating point numbers exclusively through many iterations of qrays.py and related modules. Only later did I become interested in the arbitrary precision option, which can be tricky to implement because of the “fragility” of such computations: any ordinary number type sneaking into the computations is likely to dumb it all down, losing the algebraic generality of the sympy expressions.

Because of these “early” and “later” experiments, it wouldn’t surprise me if the AI-generated background information is ahead of its skis regarding the high precision standards used throughout. We shall see. I’m still [looking over its shoulder](https://github.com/4dsolutions/m4w/blob/main/visualize_2.py), supervising. In this case I might argue the deficiency is less in the code than in [the hype](https://github.com/docxology/ivm-xyz/blob/main/BACKGROUND.md) surrounding it. When AI over-promises, we need to remember: it’s AI.

The Qvector → Vector method is decorated as a property, meaning attribute syntax (q.xyz) triggers a method call under the hood. This design asymmetry will likely be displeasing to some developers.

```
    def quadray(self):
        """inside Vector, return an (a, b, c, d) quadray based on current (x, y, z)"""
        x, y, z = self.xyz
        k = 2/root2
        a = k * (int(bool(x >= 0)) * ( x) + int(bool(y >= 0)) * ( y) + int(bool(z >= 0)) * ( z))
        b = k * (int(bool(x <  0)) * (-x) + int(bool(y <  0)) * (-y) + int(bool(z >= 0)) * ( z))
        c = k * (int(bool(x <  0)) * (-x) + int(bool(y >= 0)) * ( y) + int(bool(z <  0)) * (-z))
        d = k * (int(bool(x >= 0)) * ( x) + int(bool(y <  0)) * (-y) + int(bool(z <  0)) * (-z))
        return Qvector((a, b, c, d))

    @property
    def xyz(self):
        """inside Qvector, returns an xyz Vector"""
        a,b,c,d     =  self.coords
        k           =  1/(2 * root2)
        xyz         = (k * (a - b - c + d),
                       k * (a - b + c - d),
                       k * (a + b - c - d))
        return Vector(xyz)
```

Here’s an alternative version of those “same” methods in the older [Python5 repo](https://github.com/4dsolutions/Python5), wherein I wasn’t trying so hard to accommodate sympy types:

```
    def quadray(self):
        """return (a, b, c, d) quadray based on current (x, y, z)"""
        x, y, z = self.xyz
        k = 2/root2
        a = k * ((x >= 0)* ( x) + (y >= 0) * ( y) + (z >= 0) * ( z))
        b = k * ((x <  0)* (-x) + (y <  0) * (-y) + (z >= 0) * ( z))
        c = k * ((x <  0)* (-x) + (y >= 0) * ( y) + (z <  0) * (-z))
        d = k * ((x >= 0)* ( x) + (y <  0) * (-y) + (z <  0) * (-z))
        return Qvector((a, b, c, d))

    @property
    def xyz(self):
        a,b,c,d     =  self.coords
        k           =  0.5/root2
        xyz         = (k * (a - b - c + d),
                       k * (a - b + c - d),
                       k * (a + b - c - d))
        return Vector(xyz)
```

Some of these design decisions will be worth changing in future implementations, as we continue to experiment.

Extra notes: 

---



<columns>
Working in [Cursor.sh](Cursor.sh) 



|||



Ghost DeBugging





|||



|||






</columns>







---

-
