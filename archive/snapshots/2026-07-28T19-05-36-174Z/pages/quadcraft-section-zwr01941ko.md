# QuadCraft

<formula id="f-Uyv_7pJSTB">{"FullName":"docxology/QuadCraft","Name":"QuadCraft","IsPrivate":false,"Owner":{"type":"obj","value":{"Login":"docxology","Avatar":{"type":"imageurlref","url":"https://avatars.githubusercontent.com/u/6911384?v=4","outline":true},"Url":{"type":"urlref","url":"https://github.com/docxology","name":""}}},"Url":{"type":"urlref","url":"https://github.com/docxology/QuadCraft","name":""},"Description":"MineCraft with Tetrahedra (Quadray coordinates)","IsFork":false,"Created":{"type":"dt","input":"3/19/2025 8:05:45 AM","epoch":1742396745},"Modified":{"type":"dt","input":"3/19/2025 2:51:39 PM","epoch":1742421099},"LastPushed":{"type":"dt","input":"3/19/2025 10:17:31 AM","epoch":1742404651},"StarCount":0,"WatcherCount":0,"Language":"Makefile","ForkCount":0,"OpenIssueCount":0,"SubscriberCount":1}</formula>

[https://github.com/docxology/QuadCraft](https://github.com/docxology/QuadCraft)  
And see [https://coda.io/d/_d0SvdI3KSto/_suXtZKEK](https://coda.io/d/_d0SvdI3KSto/_suXtZKEK) 

---

[https://www.youtube.com/watch?v=nAj4dwF8SX8](https://www.youtube.com/watch?v=nAj4dwF8SX8)  
4D Chess -- Actually Playing Open Source 4D Chess with Quadray Coordinates

---

It's actually two layers, plus a nuclear ball. 55 balls in all: 1 + 12 + 42:



"all integer coordinates" are not a goal where <x, y, z> is concerned. The quadray coordinates <a, b, c, d> of CCP ball centers -- the same as rhombic dodecahedron centers -- are all non-negative integers. The corresponding <x, y, z> coords will be floating point and non-integer.

---

<columns>
This is not how it has to look but this dashboard does convey the kind of information we would want to provide a user. 

**Turtle**: Let’s assume four “turtles” (as in Logo) with pen up / pen down indicating whether they should fill in the position moved to and occupied, with a ball and/or rhombic dodecahedron (RD). RDs are to the IVM as cubes are to XYZ:  single object space-fillers, packing with no gaps.



|||


</columns>

**Movement**:  “you are here” refers to whatever ball the selected turtle is currently centered at, with options to move to any of 12 neighbors. Neighboring balls are tangent at the diamond face centers of the encasing RD, as shown above.

**Location**: IVM ([https://coda.io/d/_d0SvdI3KSto/_suXtZKEK](https://coda.io/d/_d0SvdI3KSto/_suXtZKEK) ) and XYZ (Cartesian) coordinates of the selected turtles current location. Regardless of how computations are accomplished under the hood, we would like (a, b, c, d) to always display integers. Why? Because (0,0,0,0) is the origin and any hop to a neighboring ball means adding some permutation of {2, 1, 1, 0} of which there are 12. A hop is always of distance 1, because the balls are unit diameter (D=1).

**Distance**: between any two turtles there’s a distance. XYZ and IVM distance formulas will get the same answer.

 

See this Jupyter Notebook: [Generating the FCC](https://github.com/4dsolutions/Python5/blob/master/Generating%20the%20FCC.ipynb)







How does the IVM fill space with tetrahedrons?

The cube below (right) has face diagonals of length D (D for ball Diameter). In Synergetics its volume is 3.

The RD (left) has long face diagonals of length D (diamond faces have long and short diagonals). In Synergetics its volume is 6, twice that of the cube.  These same ratios apply in XYZ of course.



Below, we have put the identical four-tetrahedron shapes back where we got them. The diamond faces of the RD are now clearly visible. 

We can think of an RD as a duo-tet cube (face diagonals D, like on the right) with these half octahedrons applied to each face. 

But be careful: these are *not* half *regular* octahedrons.  They’re half couplers, where a Coupler as an “*oblate*” octahedron, with the same volume as a D-edged tetrahedron (i.e. one tetravolume). Couplers are space-fillers.



So that’s how identical yet irregular tetrahedrons fill space:



Another view:

Key: the green cube, adjoined to a copy of itself in Fig 3., is our canonical CH volume 3 cube defining the two alternate unit volume tetrahedrons. The marbled tet of all three figures, marbled, transparent, and highlighted in orange, is a MITE or Minimum Tetrahedron, a non-chiral space-filler as tabulated in 1974 by Michael Goldberg (slide 25 in the BASKET deck, in the 2nd image below, and 3rd image). The orange Mite, combined with its twin, mirrored though the cube’s facet, and striking to the center of the silver rhombic dodecahedron around the 2nd cube, would from the Rite, another space-filler. Mites make Rite.



Rhombic dodecahedron has a Cube inscribed within it. 





---

[https://coda.io/d/_d0SvdI3KSto/_suXtZKEK](https://coda.io/d/_d0SvdI3KSto/_suXtZKEK) + [https://coda.io/d/_d0SvdI3KSto/_suQWY5DS](https://coda.io/d/_d0SvdI3KSto/_suQWY5DS) 

<columns>




|||





|||



|||

kirby urner it is not very functional, however it is out there haha. 

Daniel Ari Friedman a space filled with RITEs would be a candidate for QuadCraft (MITEs make RITEs).

Long Live [https://coda.io/d/_d0SvdI3KSto/_su1941KO](https://coda.io/d/_d0SvdI3KSto/_su1941KO) 

[https://github.com/docxology/QuadCraft/tree/main/docs](https://github.com/docxology/QuadCraft/tree/main/docs)


</columns>
