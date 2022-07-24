let vertexShaderText = [
  'precision mediump float;',
  '',
  'attribute vec2 vertPosition;',
  'attribute vec3 vertColor; ',
  'varying vec3 fragColor;',
  '',
  'void main ()',
  '{',
  '   fragColor = vertColor;',
  '   gl_Position = vec4(vertPosition, 0.0, 1.0);',
  '}'
].join('\n');


let fragmentShaderText = [
  'precision mediump float;',
  '',
  'varying vec3 fragColor;',
  'void main()',
  '{',
  '   gl_FragColor = vec4(fragColor, 1.0);',
  '}'
].join('\n');

window.onload = function main() {
    const canvas = document.querySelector("#glCanvas");
    const gl = canvas.getContext("webgl");

    let triangleRotation = 0.0;
  
    console.log(gl)

    if (gl === null) {
      alert("Unable to initialize WebGL. Your browser or machine may not support it.");
      return;
    }
  
    gl.clearColor(0.75, 0.85, 0.8, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    // Creation phase and compilation phase for shaders

    // we use a createShader funtion to create a shader
    let vertexShader = gl.createShader(gl.VERTEX_SHADER);  
    let fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);


    // we provide shader source for our shaders, these sources are written at top
    gl.shaderSource(vertexShader, vertexShaderText);
    gl.shaderSource(fragmentShader,fragmentShaderText);

    // Here we are compiling individual shader and using a shader logger to check if there's a compiltion error
    gl.compileShader(vertexShader);
    if(!gl.getShaderParameter(vertexShader, gl.COMPILE_STATUS)){
      console.error('Error compiling vertex shader!', gl.getShaderInfoLog(vertexShader));
      return;
    }

    gl.compileShader(fragmentShader);
    if(!gl.getShaderParameter(fragmentShader, gl.COMPILE_STATUS)){
      console.error('Error compiling fragment shader!', gl.getShaderInfoLog(fragmentShader));
      return;
    }

    // now we make entire graphics pipeline, whereas shader is an individual component
    let program = gl.createProgram();
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);
    if(!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      console.error('error linking program!',gl.getProgramInfoLog(program));
      return;
    }
    gl.validateProgram(program);
    if(!gl.getProgramParameter(program, gl.VALIDATE_STATUS)) {
      console.error('error validating program', gl.getProgramInfoLog(program))
      return;
    }

    let triangleVertices = [
    // X, Y,        R, G, B 
      0.0, 0.5,     1.0, 1.0, 0.0,
      -0.5, -0.5,   0.7, 0.0, 1.0,
      0.5, -0.5,    0.1, 1.0, 0.6
    ];

    let triangleVertexBufferObject = gl.createBuffer();
    // we bind our global bind point i.e triangleVertexBufferObject to ARRAY_Buffer here .
    gl.bindBuffer(gl.ARRAY_BUFFER, triangleVertexBufferObject) 
    // Since we joined our buffer above we will just use ARRAy_Buffer here instead of triangleVertexBufferObject,
    // and we cant directly provide vertices because js vert are 64 bit and our GPU needs 32 bit array,
    // STATIC_DRAW means we are sending data form CPU to GPU, this is not a repeatable process, we are providing data,
    // that we wont change 
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(triangleVertices), gl.STATIC_DRAW);
    
    //  we only put attributes here and no varying, only inputs to vertex shader, because the inputs to fragment shader the 
    // CPU isn't involved in.  
    let positionAttribLocation = gl.getAttribLocation(program, 'vertPosition');
    let colorAttribLocation = gl.getAttribLocation(program, 'vertColor');
    gl.vertexAttribPointer(
      positionAttribLocation,             // Attributes location
      2,                                  // no of elements per attribute
      gl.FLOAT,                           // type of elemets 
      gl.FALSE,
      5* Float32Array.BYTES_PER_ELEMENT,   // size of an individual vertex
      0                                    // Offset 
    );
    
    gl.vertexAttribPointer(
      colorAttribLocation,             // Attributes location
      3,                                  // no of elements per attribute
      gl.FLOAT,                           // type of elemets 
      gl.FALSE,
      5* Float32Array.BYTES_PER_ELEMENT,   // size of an individual vertex
      2* Float32Array.BYTES_PER_ELEMENT                                    // Offset 
    );

    gl.enableVertexAttribArray(positionAttribLocation);
    gl.enableVertexAttribArray(colorAttribLocation);
    //  render stage 

    gl.useProgram(program);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
}
  
//    = main;