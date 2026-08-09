# benrayfield

[https://coda.io/d/_d0SvdI3KSto/_su1941KO](https://coda.io/d/_d0SvdI3KSto/_su1941KO) 

Lambda Rick /acc ~ @benrayfield ~ [https://x.com/benrayfield](https://x.com/benrayfield)

---

 

   

.





4-30-2025 discussion

- Unit test for [https://coda.io/d/_d0SvdI3KSto/_suXtZKEK](https://coda.io/d/_d0SvdI3KSto/_suXtZKEK) 

  - The distance between any two tips — is 1 or 2. 

  - If you start with Unit cube, and put Tets inside of it, you will never get Quadrays. 

  - We will have unit tests and 

- “Alternative to Minecraft” was the tagline. 

- We also had the [https://coda.io/d/_d0SvdI3KSto/_suSt6qdu](https://coda.io/d/_d0SvdI3KSto/_suSt6qdu). 

---

4-30-2025 from Ben

I'm attaching a html that displays an experiment on browser console to compute, by 3d cellular automata, the set of corner coordinates of every tetrahedron and octahedron, by recursing some combos of octahedron coordinates. Turns out, its just (x+y+z)&1 aka manhattan distance mod 2, where x, y, and z are integers.  
  
const octahedronCorners = [[0,0,0],[0,0,2],[0,-1,1],[0,1,1],[-1,0,1],[1,0,1]];  
const canRecursePairs = [  
    [ true,  false,  true,   true,   true,   true  ],  
    [ false,  true,  true,   true,   true,   true  ],  
    [ true,   true,  true,   false,  true,   true  ],  
    [ true,   true,  false,  true,   true,   true  ],  
    [ true,   true,  true,   true,   true,   false ],  
    [ true,   true,  true,   true,   false,  true  ]  
];  
  
Derived the 12 vec3 directions:  
directions.length=13 directions=  
[[0,0,0],[0,-1,1],[0,1,1],[-1,0,1],[1,0,1],[0,-1,-1],[0,1,-1],[-1,0,-1],[1,0,-1],[-1,1,0],[1,1,0],[-1,-1,0],[1,-1,0]] octAutomata_001.html:147:9  
fractionFilled=0.5000539898499082  
  
let directGridAt = ([x,y,z])=>(1-((x+y+z)&1));  
we can leave off the 1- depending on starting square.



---

<columns>
- “*I've given up on the equilateral tetrahedra packing a 3d space*” — Correct. Regular tetrahedra cannot pack 3D space. However, regular Tetrahedra & Octahedra do co-tesselate space ([link](https://www.aperiodictiling.org/wpaperiodictiling/index.php/tetrahedra-and-octahedra/)), image to the right. 
  - If you push that shape together, and have a spherical center at each Octohedron center, you get the IVM (which is all-space filling).
  - Alternatively you can have the spherical centers at the junctions of the Tet/Oct (this IVM is dual to the one if you choose the Oct center).  
  - So it is not just that a cube-denominated space is being carved up into Tetrahedra. It is that the underlying geometry is close-packed spheres, and cubic structures arise at a larger level of crystal order (e.g. face-centered cubic crystal arising from packing of spheres). 
- For the spatial framework, we are interested in the underlying geometry being close-packed spheres (IVM), so that from each spherical center, there are 12 adjacent spheres.
  - If you use [https://coda.io/d/_d0SvdI3KSto/_suXtZKEK](https://coda.io/d/_d0SvdI3KSto/_suXtZKEK), then all the spherical centers are in whole-integer accounting. 
  - This is like a hexagonal flat tiling in 2D, in 3D (using the rhombic dodecahedron, which has a cube inscribed within it).  



|||


</columns>





---

[https://coda.io/d/_d0SvdI3KSto/_su8GTZ6-](https://coda.io/d/_d0SvdI3KSto/_su8GTZ6-) response on 4/20/2025

<columns>


|||

Almost there... I've given up on the equilateral tetrahedra packing a 3d space, but here's 6 of them of the same shape rotated (and mirrored?) forming a cube. 6 tetrahedra form a cube. Will this work? Are you asking for a cube filled with tetrahedrons, repeated? Or are you asking for some other repeated set of tetrahedrons? Are you asking for more than 1 unique shape? Do you want the 5 tets per cube instead of 6? Or theres other combos. You listed so many.

  


|||

if(i==0){v0=vec3(0,0,0); v1=vec3(1,0,0); v2=vec3(1,1,0); v3=vec3(1,1,1);}

if(i==1){v0=vec3(0,0,0); v1=vec3(1,0,0); v2=vec3(1,0,1); v3=vec3(1,1,1);}

if(i==2){v0=vec3(0,0,0); v1=vec3(0,1,0); v2=vec3(1,1,0); v3=vec3(1,1,1);}

if(i==3){v0=vec3(0,0,0); v1=vec3(0,1,0); v2=vec3(0,1,1); v3=vec3(1,1,1);}

if(i==4){v0=vec3(0,0,0); v1=vec3(0,0,1); v2=vec3(1,0,1); v3=vec3(1,1,1);}

if(i==5){v0=vec3(0,0,0); v1=vec3(0,0,1); v2=vec3(0,1,1); v3=vec3(1,1,1);}
</columns>

<columns>
I can tilt a cube coordinate system this way if you like. The 4 points v0 v1 v2 v3 are distance 1 from eachother.

v0 = [0,0,0]; v1 = [1, 0, 0]; v2 = [.5, Math.sqrt(3)/2, 0]; v3 = [.5, Math.sqrt(3)/6, Math.sqrt(2/3)];

Array(3) [ 0.5, 0.28867513459481287, 0.816496580927726 ]

[dist(v0,v1), dist(v0,v2), dist(v0,v3), dist(v1,v2), dist(v1,v3), dist(v2,v3)]

Array(6) [ 1, 1, 0.9999999999999999, 1, 0.9999999999999999, 0.9999999999999999 ]

|||



|||

Do you want different rotations of the cube to be available? Or just the 1?

  

</columns>



---

---

---

---

---

---

# 4-17-2025

- 

- We're agreed on the graphics level, that it will not have textures but will be minecraftlike with a constant color per triangle, in a way you can see the angle of it by its color or basic lighting. 

- We are having some kind of math problem agreeing on the shape to be built. Heres 2 pics I just had GPT make, both with 3 layers of balls (all of radius 1) stacked in 3d. On the left the balls are in straight lines, at 3 certain angles, so this appears to be an affine transform of the cube grid that tilts until its a hex grid on the flat 2d floor and has 3 balls on top and 3 on bottom of each ball, so 12 balls beside each ball. On the right, its that same thing but flip it with each alternating layer. These appear to both be tetrahedron tesselations (completely filling) 3d space.

- You said "Regular Tets do not tesselate space". The one on the left looks regular, and the only on the right looks nonregular.

- GPT does not think these tesselate 3d space but cant seem to explain why

- If we go ahead with this project, these details will get figured out. Do you want to proceed, or do we need to talk more?

- i could start with a wireframe of the edges of the tetrahedrons so we can see its covering the 3d volume

---

# 4/18/2025 ~ Kirby response. 

The matrix in question is the CCP, shown top row below. 

Balls pack hexagonally (6-around-1) in each layer, and then layers above and below nest in the valleys between spheres. 

However there are two ways to add layer C: have it *aligned* with A, or have it *non-aligned* with A. **CCP is that 2nd option**.



What’s true with the CCP is all “buried balls” (not on any boundary) will have 12 neighbors to the corners of a cuboctahedron (shape with 8 triangles, 6 squares).



Also true: each ball may be encased in a diamond-faced rhombic dodecahedron such that each ball will touch its neighbors at the face centers of those 12-faceted casements.



Source:  [https://docs.google.com/presentation/d/1kuexCXe1UCsiO9yH_zp2zbAxXJP_fKclqUsp5EZVBPU/edit?usp=sharing](https://docs.google.com/presentation/d/1kuexCXe1UCsiO9yH_zp2zbAxXJP_fKclqUsp5EZVBPU/edit?usp=sharing) (slide 24)

Once balls are layered, say 100 layers deep (ABCABCABC....) we will have two kinds of “holes”: where four balls meet around a hole (tetrahedral) and where six balls meet around a hole (octahedral).



Source:  [https://uwaterloo.ca/chem13-news-magazine/march-2018/feature/part-3-building-nanoparticle](https://uwaterloo.ca/chem13-news-magazine/march-2018/feature/part-3-building-nanoparticle)

Balls stacked in the CCP pattern will make an n-frequency tetrahedron (n = intervals between balls along an edge):



Source: [https://www.doitpoms.ac.uk/tlplib/crystallography3/packing.php](https://www.doitpoms.ac.uk/tlplib/crystallography3/packing.php)

However, the very same CCP pattern will also make an n-frequency half octahedron (square-based pyramid):



Source:  [https://en.wikipedia.org/wiki/Sphere_packing](https://en.wikipedia.org/wiki/Sphere_packing)

This slice through a 7-frequency CCP tetrahedron shows how balls are also layered in a squares packing, 



Source: [http://rwgrayprojects.com/synergetics/s04/figs/f1701.html](http://rwgrayprojects.com/synergetics/s04/figs/f1701.html)

When stacking squares layers, there’s no ambiguity about where the next layer fits (the CCP vs HCP choice — ABA vs ABC — does not arise). Slicing this way gives a clear view of the octahedral voids that permeate the matrix.

One way to generate the CCP from a more familiar all-cubes XYZ-like matrix:  Think of a 3D checkers-chess board of alternating white and black cubes. Put a sphere in each black cube, leaving white cubes empty. Have those spheres expand inside each black cube to where they bulge out though their cube faces into the neighboring white cubes (which do not have balls of their own) to where the balls touch their containing cubes at the 12 cube-edge midpoints. This will also be where the spheres touch each other. This will also be a CCP. 3D chess board cube corners will occur in the tetrahedral voids (holes) of the matrix, octahedral voids (holes) at the white (empty) cube centers. In Synergetics, these are the volume 3 cubes, or duo-tet cubes, in which volume 1 tetrahedrons are alternately inscribed as face diagonals, which are all ball-diameter in length.





How this relates to Quadrays with four basis vectors from the tetra-volume 3 duo-tet cube center (green) to one of the two comprising tet’s vertices: 

- put a ball at the origin, then: 

- hop twice in one of the four directions

- hop once in each of two other remaining directions, 

- hop not at all in the fourth direction. 

That gives 12 unique permutations: (2,1,1,0) (2,1,0,1)... (0,1,1,2) to the surrounding 12 CCP ball centers in neighboring — alternately empty — cubes.



---

---

# Older notes

“what do you mean 4d?”

Here by 4D I mean [https://coda.io/d/_d0SvdI3KSto/_suXtZKEK](https://coda.io/d/_d0SvdI3KSto/_suXtZKEK)  (caltrop coordinates): [https://en.wikipedia.org/wiki/Quadray_coordinates](https://en.wikipedia.org/wiki/Quadray_coordinates) , code [https://github.com/4dsolutions/m4w/blob/main/Tetravolumes.ipynb](https://github.com/4dsolutions/m4w/blob/main/Tetravolumes.ipynb) . 

[https://www.youtube.com/watch?v=vMtWFQXUp_U](https://www.youtube.com/watch?v=vMtWFQXUp_U) Here is a video, with Kirby Urner (key developer on the Quadray methods), about 4D and how the Synergetics / IVM / 4D differs from “hypercross” N dimensional, or 4D like XYZ+T

Isotropic → Isotropic vector matrix (IVM), close packing sphere geometry (where we usually use distance between sphere centers as scaled to linear 2), convertable simply in and out of XYZ: [https://github.com/4dsolutions/School_of_Tomorrow/blob/master/tabulate.py](https://github.com/4dsolutions/School_of_Tomorrow/blob/master/tabulate.py) .

I made a started / vibe coded “QuadCraft” a few days ago [https://github.com/docxology/QuadCraft](https://github.com/docxology/QuadCraft) to start making directions / learnings, that way.  

Doing tetrahedral mesh modeling/rendering, is cool (especially for the geospatial side). However even more fundamentally, our interest is like (Mincraft:XYZ::QuadCraft:IVM) in that it fundamentally embodies and calculates within the Quadray coordinate system. 

---

  - the difficulty extremely varies by number of blocks (on screen at once, and total), and by the kind of graphics effects you want on them. Can you show me a pic of a similar thing, maybe of a minecraft or experiment of some kind, to give me an idea of the scale you want?

  - or a few sets of answers to that, and I can answer separately for each

  - Here's how I think it should be done: Each tetrahedron stores 5 bits. existsBit is the main bit. for each face (an equilateral triangle), its the xor of the 2 existsBits of the 2 tetrahedra which share that face. Paint whichever triangles have an xor of 1 aka are solid on one side and open area on the other. So when you add/remove a tetrahedra (by flipping existsBit in the 3d grid), it turns some triangles on and some off. I would simply brute-force display the surface bounding the solid volume. There are faster ways but is more complicated to optimize. This is a basic way to get started and would likely work for a 100x100x100 grid of balls where tetrahedra are between the centers of 4 adjacent balls.

  - I could make a custom WebGL2 GLSL ES 300 GPU shader to display a tetrahedra with fancy graphics, textures, or choice of color at its corners, or we could just go with each 3d direction has its own color like its more red the more north it points, and more blue the more east it points, etc.

  - I could make the basic kind for $1000 on the condition the graphics system is opensource MIT licensed in case I want to use a fork of it. I'm more interested in raytracing isosurfaces recently but might have a use for it later.

  - it would come with a very fast (BigO(1)) function to test if a 3d point is inside or outside the solid volume

  - inside a tetrahedron is simply the AND of it being on a particular side of 4 planes.



Thanks for the response, needed some time to discuss this with Kirby. 

$1000 amount of work, all open source products, is good with us. 

We could have a Github repo or Google doc, for aligning on a scope/spec for this milestone. 

For inspiration and reference, here are some .gif that Kirby has made: [https://giphy.com/channel/4dsolutions](https://giphy.com/channel/4dsolutions) 

“100x100x100 grid of balls where tetrahedra are between the centers of 4 adjacent balls.” — Yes. To be clear, there are two kinds of voids in the close packing spheres setting, Tetrahedral and Octohedral. Regular Tets do not tesselate space, however they co-tesselate with Octohedron. 

When you say 100x100x100, that is in the Cubic framing. In the close-packed Rhombic Dodecahedron setting, there are just shells of spheres accreting/growing out from a nuclear center. The .gif at the bottom of this notebook shows that [https://github.com/4dsolutions/School_of_Tomorrow/blob/master/CascadianSynergetics.ipynb](https://github.com/4dsolutions/School_of_Tomorrow/blob/master/CascadianSynergetics.ipynb) — each shell is a rhombic dodecahedron. 

[Kirby correction: each concentric shell of 1, 12, 42, 92... balls is cuboctahedron-shaped; the polyhedron encasing each individual ball is rhombic dodecahedron shaped — which could be the single cell shape used ] 

For what it might look like — here is an example minecraft screencap. We don’t need the inventory/health bar part at bottom, or this level of graphical texturing. And we get it would be a smaller world, still we would want to walk/drone around in the space. Again though, the key angle is that “QuadCraft” is like a counter-game, where Cube:XYZ:MineCraft :: Tet:IVM:QuadCraft. 



---



#
