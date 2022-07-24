let vertexShaderText = [
  'precision mediump float;',
  '',
  'attribute vec3 vertPosition;',
  'attribute vec3 vertColor; ',
  'varying vec3 fragColor;',
  'uniform mat4 mWorld;',
  'uniform mat4 mView;',
  'uniform mat4 mProj;',
  '',
  'void main ()',
  '{',
  '   fragColor = vertColor;',
  '   gl_Position = mProj * mView * mWorld * vec4(vertPosition, 1.0);',
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
    // X, Y, Z           R, G, B 
      0.0, 0.5, 0.0,     1.0, 1.0, 0.0,
      -0.5, -0.5, 0.0,   0.7, 0.0, 1.0,
      0.5, -0.5, 0.0,    0.1, 1.0, 0.6
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
      3,                                  // no of elements per attribute
      gl.FLOAT,                           // type of elemets 
      gl.FALSE,
      6* Float32Array.BYTES_PER_ELEMENT,   // size of an individual vertex
      0                                    // Offset 
    );
    
    gl.vertexAttribPointer(
      colorAttribLocation,             // Attributes location
      3,                                  // no of elements per attribute
      gl.FLOAT,                           // type of elemets 
      gl.FALSE,
      6* Float32Array.BYTES_PER_ELEMENT,   // size of an individual vertex
      3* Float32Array.BYTES_PER_ELEMENT                                    // Offset 
    );

    // enabling vertex and fragmet shader 
    gl.enableVertexAttribArray(positionAttribLocation);
    gl.enableVertexAttribArray(colorAttribLocation);

    // tell opengl which program we are using
    gl.useProgram(program);

    //  get location of uniform variables
    let matWorldUniformLocation = gl.getUniformLocation(program, 'mWorld');
    let matViewUniformLocation = gl.getUniformLocation(program, 'mView');
    let matProjUniformLocation = gl.getUniformLocation(program, 'mProj');
    
    // make them a new identity matrix for each
    let worldMatrix = new Float32Array(16);
    let viewMatrix = new Float32Array(16);
    let projMatrix = new Float32Array(16);
    glMatrix.mat4.identity(worldMatrix);
    // 3d mat for PO viewer, where viewer is looking, and what is up
    glMatrix.mat4.lookAt(viewMatrix, [0, 0, -2], [0, 0, 0], [0, 1, 0]);
    // vert pov in rad, aspect ratio i.e width/height, near, far 
    glMatrix.mat4.perspective(projMatrix, glMatrix.glMatrix.toRadian(45), canvas.clientWidth/ canvas.clientHeight, 0.1, 1000.0);

    // specify matrix values for uniform variables. as per mdn web docs
    gl.uniformMatrix4fv(matWorldUniformLocation, gl.FALSE, worldMatrix);
    gl.uniformMatrix4fv(matViewUniformLocation, gl.FALSE, viewMatrix);
    gl.uniformMatrix4fv(matProjUniformLocation, gl.FALSE, projMatrix);

    //  render stage 
    let identityMatrix = new Float32Array(16);
    glMatrix.mat4.identity(identityMatrix);
    let angle = 0;
    let loop = function(){
      angle = performance.now() / 1000 / 6 * 2 * Math.PI;
      glMatrix.mat4.rotate(worldMatrix, identityMatrix, angle, [0, 1, 0]);
      gl.uniformMatrix4fv(matWorldUniformLocation, gl.FALSE, worldMatrix)

      gl.clearColor(0.75, 0.85, 0.8, 1.0);
      gl.clear(gl.DEPTH_BUFFER_BIT | gl.COLOR_BUFFER_BIT);
      gl.drawArrays(gl.TRIANGLES, 0, 3);

      requestAnimationFrame(loop);
    }

    requestAnimationFrame(loop);

}
  
//    = main;