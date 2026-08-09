# 5-5-2025

From [https://coda.io/d/_d0SvdI3KSto/_su8GTZ6-](https://coda.io/d/_d0SvdI3KSto/_su8GTZ6-) 

---

I dont know what you want me to build.

We all seem to be agreed this is what the edges of the shape look like in 3d.



Quadray.h

// Calculate the length of a quadray vector  
    float length() const {  
        // Using the formula: D = sqrt((a² + b² + c² + d²) / 2)  
        return std::sqrt((a*a + b*b + c*c + d*d) / 2.0f);  
    }

This is scaled 4d flat space distance. (a,b,c,d)=>sqrt(a*a+b*b+c*c+d*d).

So if you want me to use that distance function, you cant say its a 3d shape.

 // Normalize to ensure at least one coordinate is zero (zero-minimum normalization)  
    Quadray normalized() const {  
        float minVal = std::min({a, b, c, d});  
        return Quadray(a - minVal, b - minVal, c - minVal, d - minVal);  
    }  
  
That makes there always be at least one 0 in the 4 numbers, and at most 3 nonzero numbers. This is a 3d cross-section of the flat 4d space that quadray.length() is a (scaled) flat space distance in. There is no 3d cross-section that fits all those 3d cross-sections in it. Only the 4d space contains them all. The infinite set of normed quadrays is a 3d surface in a 4d flat space,

The shapes you told me to build do not equal those shapes, cuz they do fit in a single 3d surface. Therefore I need you to exactly define the shapes you want me to build instead. These are 4d shapes that are an infinitely thin 3d surface, with jagged edges, in 4d space.

    // Convert from quadray to Cartesian coordinates  
    Vector3 toCartesian() const {  
        const float scale = 1.0f / ROOT2;  
        float x = scale * (a - b - c + d);  
        float y = scale * (a - b + c - d);  
        float z = scale * (a + b - c - d);  
        return Vector3(x, y, z);  
    }

This appears to be the 4 vec3s that are dimension axises. Other than scaling.  
const A = [ 1,  1,  1];  // Quadray (1,0,0,0)  
const B = [ 1, -1, -1];  // Quadray (0,1,0,0)  
const C = [-1,  1, -1];  // Quadray (0,0,1,0)  
const D = [-1, -1,  1];  // Quadray (0,0,0,1)  


If all dimensions are laid in 1d parallel to eachother and of length 1 per dimension axis, then its length would simply be the sum of the positions in each dimension. Similarly, quadray lays 4 vectors into a 3d space. These are both nonaffine transforms. You are computing length before the nonaffine transform, aka the length aka distance between 2 points in flat 4d space. Thats what it does in Quadray.h's length function. By nonaffine transform I mean the 4x3 matrix. Or 4x4 would work too you just ignore 4 of them. There is mat4 for that in GL. This is the transform.

My mind supports alot more than 4 dimensions at once. I could code graphics similar to Miegakure (which displays a 3d cross-section of a 4d world) then does normal 3d graphics on that 3d cross-section. But I cant pretend Miegakure is a 3d game. It leads to proving true=false. The axioms wont work. It would throw a wrench into the machine.

I think you want the game's graphics and controls to make it take the fewest button presses to select a 3d point, 3d line segment, octahedron volume, or tetrahedron volume. But these are not 3d shapes. These are not the shapes you asked for. You thought you were asking for them but you are not. If you want me to write code that uses quadrays instead of vec3s to compute triples of 2d coordinates on screen for each triangle to display, or 3d coordinates of them for GL to display, then I need an exact definition of the 4d shapes you want me to display.

The shapes can not reshape just by moving in 4d. If you need more than 4 dimensions just say so. I can code alot of dimensions, but the more dimensions the fewer objects it can do at gaming speed.

I cant proceed unless I have absolute coordinates of every tetrahedron-like shape and every octahedron-like shape, all in the same space, any kind of space, but there can be no translations transforms etc that prevents you from seeing all of them at once. If you have to take min or max just to know where in 4d (or maybe its alot more dimensions? how many dimensions?) then that is not a space at all. Thats a graph as in graph-theory. If you want me to display a graph then just say so, and we can define it instead in terms of which integers are adjacent to which other integers and of n edge types.

Your coordinate system appears to be 8 dimensional: 2 nonnormed quadrays of 4 numbers each, and the shapes are each an infinitely thin 7d surface in flat 8d space. The extra quadray is to move the origin (0,0,0,0). Without this, distance changes depending on where its viewed from. The jagged 3d surface in 4d I mentioned, is still jagged as 7d surface in 8d, and the jagged parts move around, so its a transform of 3d surface to 3d surface if used some ways. These ways are not encoded into the dimensions, so you'd need even more dimensions or "ugly hacks" to do that. Im still not sure what you're using these extra dimensions for and what you want to appear on screen, what directions in 8 dimensions or somehow in 4 dimensions you want the player of the game to be able to tilt the camera.
