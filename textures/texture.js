let vertexShaderText = [
  'precision mediump float;',
  '',
  'attribute vec3 vertPosition;',
  'attribute vec2 vertTexCoord; ',
  'varying vec2 fragTexCoord;',
  'uniform mat4 mWorld;',
  'uniform mat4 mView;',
  'uniform mat4 mProj;',
  '',
  'void main ()',
  '{',
  '   fragTexCoord = vertTexCoord;',
  '   gl_Position = mProj * mView * mWorld * vec4(vertPosition, 1.0);',
  '}'
].join('\n');


let fragmentShaderText = [
  'precision mediump float;',
  '',
  'varying vec2 fragTexCoord;',
  'uniform sampler2D sampler;',
  '',
  'void main()',
  '{',
  '   gl_FragColor = texture2D(sampler, fragTexCoord);',
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

    // we have to enable depth test to prevent seeing backside of cube
    gl.enable(gl.DEPTH_TEST);

    // to prevent gpu from doing extra math (cull face means removed face), CCW is counterclock wise
    gl.enable(gl.CULL_FACE);
    gl.frontFace(gl.CCW);
    gl.cullFace(gl.BACK);

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

    var boxVertices = 
    [ // X, Y, Z           U, V
      // Top
      -1.0, 1.0, -1.0,   0, 0,
      -1.0, 1.0, 1.0,    0, 1,
      1.0, 1.0, 1.0,     1, 1,
      1.0, 1.0, -1.0,    1, 0,

      // Left
      -1.0, 1.0, 1.0,    0, 0,
      -1.0, -1.0, 1.0,   1, 0,
      -1.0, -1.0, -1.0,  1, 1,
      -1.0, 1.0, -1.0,   0, 1,

      // Right
      1.0, 1.0, 1.0,    1, 1,
      1.0, -1.0, 1.0,   0, 1,
      1.0, -1.0, -1.0,  0, 0,
      1.0, 1.0, -1.0,   1, 0,

      // Front
      1.0, 1.0, 1.0,    1, 1,
      1.0, -1.0, 1.0,    1, 0,
      -1.0, -1.0, 1.0,    0, 0,
      -1.0, 1.0, 1.0,    0, 1,

      // Back
      1.0, 1.0, -1.0,    0, 0,
      1.0, -1.0, -1.0,    0, 1,
      -1.0, -1.0, -1.0,    1, 1,
      -1.0, 1.0, -1.0,    1, 0,

      // Bottom
      -1.0, -1.0, -1.0,   1, 1,
      -1.0, -1.0, 1.0,    1, 0,
      1.0, -1.0, 1.0,     0, 0,
      1.0, -1.0, -1.0,    0, 1,
    ];
  

	var boxIndices =
	[
		// Top
		0, 1, 2,
		0, 2, 3,

		// Left
		5, 4, 6,
		6, 4, 7,

		// Right
		8, 9, 10,
		8, 10, 11,

		// Front
		13, 12, 14,
		15, 14, 12,

		// Back
		16, 17, 18,
		16, 18, 19,

		// Bottom
		21, 20, 22,
		22, 20, 23
	];

    let boxVertexBufferObject = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, boxVertexBufferObject); 
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(boxVertices), gl.STATIC_DRAW);
    

    let boxIndexBufferObject =  gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, boxIndexBufferObject);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(boxIndices), gl.STATIC_DRAW);


    //  we only put attributes here and no varying, only inputs to vertex shader, because the inputs to fragment shader the 
    // CPU isn't involved in.  
    let positionAttribLocation = gl.getAttribLocation(program, 'vertPosition');
    let texCoordAttribLocation = gl.getAttribLocation(program, 'vertTexCoord');

    //  associating shader variables and to later on enable them.
    gl.vertexAttribPointer(
      positionAttribLocation,             // Attributes location
      3,                                  // no of elements per attribute
      gl.FLOAT,                           // type of elemets 
      gl.FALSE,
      5* Float32Array.BYTES_PER_ELEMENT,   // size of an individual vertex
      0                                    // Offset 
    );
    
    gl.vertexAttribPointer(
      texCoordAttribLocation,             // Attributes location
      2,                                  // no of elements per attribute
      gl.FLOAT,                           // type of elemets 
      gl.FALSE,
      5 * Float32Array.BYTES_PER_ELEMENT,   // size of an individual vertex
      3 * Float32Array.BYTES_PER_ELEMENT                                    // Offset 
    );

    // enabling vertex and fragmet shader 
    gl.enableVertexAttribArray(positionAttribLocation);
    gl.enableVertexAttribArray(texCoordAttribLocation);

    // create textures
    let boxTexture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, boxTexture);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, document.getElementById('crate-image'));
    gl.bindTexture(gl.TEXTURE_2D, null);



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
    glMatrix.mat4.lookAt(viewMatrix, [0, 0, -8], [0, 0, 0], [0, 1, 0]);
    // vert pov in rad, aspect ratio i.e width/height, near, far 
    glMatrix.mat4.perspective(projMatrix, glMatrix.glMatrix.toRadian(45), canvas.clientWidth/ canvas.clientHeight, 0.1, 1000.0);

    // specify matrix values for uniform variables. as per mdn web docs
    gl.uniformMatrix4fv(matWorldUniformLocation, gl.FALSE, worldMatrix);
    gl.uniformMatrix4fv(matViewUniformLocation, gl.FALSE, viewMatrix);
    gl.uniformMatrix4fv(matProjUniformLocation, gl.FALSE, projMatrix);


    let xRotationMatrix = new Float32Array(16);
    let yRotationMatrix = new Float32Array(16);

    //  render stage 
    let identityMatrix = new Float32Array(16);
    glMatrix.mat4.identity(identityMatrix);
    let angle = 0;
    let loop = function(){
      angle = performance.now() / 1000 / 6 * 2 * Math.PI;
      glMatrix.mat4.rotate(yRotationMatrix, identityMatrix, angle, [0, 1, 0]);
      glMatrix.mat4.rotate(xRotationMatrix, identityMatrix, angle / 4, [1, 0, 0]);
      glMatrix.mat4.mul(worldMatrix, yRotationMatrix, xRotationMatrix);
      gl.uniformMatrix4fv(matWorldUniformLocation, gl.FALSE, worldMatrix)

      gl.clearColor(0.75, 0.85, 0.8, 1.0);
      gl.clear(gl.DEPTH_BUFFER_BIT | gl.COLOR_BUFFER_BIT);

      gl.bindTexture(gl.TEXTURE_2D, boxTexture);
      gl.activeTexture(gl.TEXTURE0)
      
      gl.drawElements(gl.TRIANGLES, boxIndices.length, gl.UNSIGNED_SHORT, 0);

      requestAnimationFrame(loop);
    }

    requestAnimationFrame(loop);

}
  
//    = main;