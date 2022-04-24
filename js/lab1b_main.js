/*
 * this is the main script of the program
 */

// Constant strings used in the script
const context = "webgl2";
const canvasId = "Canvas";

const gouraudVS = "vertexGouraudShader";
const gouraudFS = "fragmentGouraudShader";

const phongVS = "vertexPhongShader";
const phongFS = "fragmentPhongShader";

// Set default shaders
var fShaderId = phongFS;
var vShaderId = phongVS;

// Global vars - general
var gl;
var fshader;
var vshader;
var shaderProgram;
var canvas;
var objects = []; // holds created objects
var currentlyPressedKeys = {};
var activeShapeIdx;
var allActive = true;

// Illumination
var mode = 0; //  diffuse 0 (default) /specular 1

// Transformation mode
var lightTransformsActive = false;
var lightMatrix = mat4.create();
var lightPosition = vec3.fromValues(0, 10, 0);

function degToRad(degrees) {
    return degrees * Math.PI / 180;
}

function setUpCanvas() {
    canvas = document.getElementById(canvasId);
    gl = canvas.getContext(context);
    gl.viewport(0, 0, canvas.width, canvas.height);
}

function initialize() {
    setUpCanvas();
    setShaders();
    initGlobalMatrices();
}

function createObject(type) {
    if (type === "cube") new cube();
    if (type === "rectangle") new rectangle();
    if (type === "sphere") new sphere();
}

function renderLoop() {
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    gl.enable(gl.DEPTH_TEST);

    animate();
    draw();
    requestAnimationFrame(renderLoop);
}

function draw() {
    var projMatrix = mat4.create();
    mat4.identity(projMatrix);
    mat4.perspective(projMatrix, 45 * Math.PI / 180.0, (canvas.width / canvas.height), 0.1, 1000);

    gl.uniform1i(gl.getUniformLocation(shaderProgram, "mode"),mode);
    gl.uniform3fv(gl.getUniformLocation(shaderProgram, "lightPosition"), lightPosition);
    gl.uniformMatrix4fv(gl.getUniformLocation(shaderProgram, "viewMatrix"), false, viewMatrix);
    gl.uniformMatrix4fv(gl.getUniformLocation(shaderProgram, "projectionMatrix"), false, projMatrix);

    objects.forEach(function (object) {

        mat4.multiply(object.modelMatrix, gMatrix, object.modelMatrix);
        gl.uniformMatrix4fv(gl.getUniformLocation(shaderProgram, "modelMatrix"), false, object.modelMatrix);
        var modelInvTranspose = mat4.create();
        mat4.invert(modelInvTranspose, object.modelMatrix);
        mat4.transpose(modelInvTranspose, modelInvTranspose);
        gl.uniformMatrix4fv(gl.getUniformLocation(shaderProgram, "normalMatrix"), false, modelInvTranspose);

        if (object instanceof sphere) {
            gl.uniform1i(gl.getUniformLocation(shaderProgram, "type"),1);
            gl.bindBuffer(gl.ARRAY_BUFFER, object.vPositionBuffer);
            gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, object.vPositionBuffer.itemSize, gl.FLOAT, false, 0, 0);

            gl.bindBuffer(gl.ARRAY_BUFFER, object.vColorBuffer);
            gl.vertexAttribPointer(shaderProgram.vertexColorAttribute, object.vColorBuffer.itemSize, gl.FLOAT, false, 0, 0);

            gl.bindBuffer(gl.ARRAY_BUFFER, object.normalBuffer);
            gl.vertexAttribPointer(shaderProgram.vertexNormalAttribute, object.normalBuffer.itemSize, gl.FLOAT, false, 0, 0);

            gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, object.indicesBuffer);

            gl.drawElements(gl.TRIANGLES, object.indices.length, gl.UNSIGNED_SHORT, 0);

        }

        else {
            gl.uniform1i(gl.getUniformLocation(shaderProgram, "type"),1);
            gl.bindBuffer(gl.ARRAY_BUFFER, object.vPositionBuffer);
            gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, object.vPositionBuffer.itemSize, gl.FLOAT, false, 0, 0);
            gl.bindBuffer(gl.ARRAY_BUFFER, object.normalBuffer);
            gl.vertexAttribPointer(shaderProgram.vertexNormalAttribute, object.normalBuffer.itemSize, gl.FLOAT, false, 0, 0);
            gl.bindBuffer(gl.ARRAY_BUFFER, object.vColorBuffer);
            gl.vertexAttribPointer(shaderProgram.vertexColorAttribute, object.vColorBuffer.itemSize, gl.FLOAT, false, 0, 0);

            gl.drawArrays(gl.TRIANGLES, 0, 36);
        }


        if (activeShapeIdx === object.index) {
            gl.uniform1i(gl.getUniformLocation(shaderProgram, "type"),0);
            gl.bindBuffer(gl.ARRAY_BUFFER, object.coordsPB);
            gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, object.coordsPB.itemSize, gl.FLOAT, false, 0, 0);
            gl.bindBuffer(gl.ARRAY_BUFFER, object.coordsCB);
            gl.vertexAttribPointer(shaderProgram.vertexColorAttribute, object.coordsCB.itemSize, gl.FLOAT, false, 0, 0);
            gl.drawArrays(gl.LINES, 0, 6);
        }

    })
}

function createObjects() {
    for (let i = 0; i < 3; i++) {
        createObject("rectangle");
        createObject("cube");
        createObject("sphere");
    }
}

function arrangeObjectsOnScreen() {
    mat4.translate(objects[1].modelMatrix, objects[1].modelMatrix, [2, 0, 0]);
    mat4.translate(objects[2].modelMatrix, objects[2].modelMatrix, [-2, 0, 0]);

    mat4.translate(objects[3].modelMatrix, objects[3].modelMatrix, [-2, 2, 0]);
    mat4.translate(objects[4].modelMatrix, objects[4].modelMatrix, [0, 2, 0]);
    mat4.translate(objects[5].modelMatrix, objects[5].modelMatrix, [2, 2, 0]);

    mat4.translate(objects[6].modelMatrix, objects[6].modelMatrix, [2, -2, 0]);
    mat4.translate(objects[7].modelMatrix, objects[7].modelMatrix, [-2, -2, 0]);
    mat4.translate(objects[8].modelMatrix, objects[8].modelMatrix, [0, -2, 0]);
}

function main() {
    initialize();
    // the keyboard event handlers are partly derived from the WebGl tutorial by Herzberger Lukas (SS18)
    document.onkeydown = handleKeyDown;
    document.onkeyup = handleKeyUp;
    createObjects();
    arrangeObjectsOnScreen();
    renderLoop();
}