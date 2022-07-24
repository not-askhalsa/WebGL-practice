let canvas = document.querySelector('.glCanvas');
let gl = canvas.getContext('webgl');
if(!gl) {
    alert("Unable to initialize WebGL. Your browser or machine may not support it.");
    return;
}

