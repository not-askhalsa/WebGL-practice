# WebGL-practice

## Shaders

- A shader is a program, written using the (GLSL), that takes information about the vertices that make up a shape and generates the data needed to render the pixels onto the screen: namely, the positions of the pixels and their colors.
- There are two shader functions run when drawing WebGL content: the vertex shader and the fragment shader. You write these in GLSL and pass the text of the code into WebGL to be compiled for execution on the GPU. Together, a set of vertex and fragment shaders is called a shader program.

> In a WebGL program, data is typically uploaded to the GPU with its own coordinate system and then the vertex shader transforms those points into a special coordinate system known as clip space. Any data which extends outside of the clip space is clipped off and not rendered.

- Each time a shape is rendered, the vertex shader is run for each vertex in the shape. Its job is to transform the input vertex from its original coordinate system into the clip space coordinate system used by WebGL, in which each axis has a range from -1.0 to 1.0, regardless of aspect ratio, actual size, or any other factors.



- Buffers are the memory areas of WebGL that hold the data. There are various buffers namely, drawing buffer, frame buffer, vetex buffer, and index buffer. The vertex buffer and index buffer are used to describe and process the geometry of the model.

- Vertex buffer objects store data about the vertices, while Index buffer objects store data about the indices. After storing the vertices into arrays, we pass them to WegGL graphics pipeline using these Buffer objects. Frame buffer is a portion of graphics memory that hold the scene data. This buffer contains details such as width and height of the surface (in pixels), color of each pixel, depth and stencil buffers.

- To draw 2D or 3D objects, the WebGL API provides two methods namely, drawArrays() and drawElements(). These two methods accept a parameter called mode using which you can select the object you want to draw. The options provided by this field are restricted to points, lines, and triangles.

- A 3D object drawn using primitive polygons is called a mesh.

- A mesh is formed by multiple triangles, and the surface of each of the triangles is known as a fragment. Fragment shader is the code that runs on all pixels of every fragment. It is written to calculate and fill the color on individual pixels.

The following tasks can be performed using Fragment shaders −

    * Operations on interpolated values
    * Texture access
    * Texture application
    * Fog
    * Color sum