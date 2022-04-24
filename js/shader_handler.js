/*
 * initializes and compiles shaders,
 * alerts if something went wrong during compilation
 */

function setShaders() {
    var vshaderElement = document.getElementById(vShaderId);
    var vshaderText = vshaderElement.text.trim();
    vshader = gl.createShader(gl.VERTEX_SHADER);
    gl.shaderSource(vshader, vshaderText);
    gl.compileShader(vshader);
    if (!gl.getShaderParameter(vshader, gl.COMPILE_STATUS)) {
        alert(gl.getShaderInfoLog(vshader));
    }

    var fshaderElement = document.getElementById(fShaderId);
    var fshaderText = fshaderElement.text.trim();
    fshader = gl.createShader(gl.FRAGMENT_SHADER);
    gl.shaderSource(fshader, fshaderText);
    gl.compileShader(fshader);
    if (!gl.getShaderParameter(fshader, gl.COMPILE_STATUS)) {
        alert(gl.getShaderInfoLog(fshader));
    }
    else setShaderProgram();
}

/*
 * sets up and links the shader program,
 * alerts if linking unsuccessful
 */
function setShaderProgram() {
    shaderProgram = gl.createProgram();
    gl.attachShader(shaderProgram, vshader);
    gl.attachShader(shaderProgram, fshader);
    gl.linkProgram(shaderProgram);
    if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
        alert("Could not initialise shaders");
    }

    gl.useProgram(shaderProgram);

    shaderProgram.vertexPositionAttribute = gl.getAttribLocation(shaderProgram, "position");
    gl.enableVertexAttribArray(shaderProgram.vertexPositionAttribute);

    shaderProgram.vertexNormalAttribute = gl.getAttribLocation(shaderProgram, "normal");
    gl.enableVertexAttribArray(shaderProgram.vertexNormalAttribute);

    shaderProgram.vertexColorAttribute = gl.getAttribLocation(shaderProgram, "color");
    gl.enableVertexAttribArray(shaderProgram.vertexColorAttribute);

    shaderProgram.pMatrixUniform = gl.getUniformLocation(shaderProgram, "projectionMatrix");

}