var viewMatrix;
var gMatrix;

/*
 * initializes the "global" matrices,
 * translates the view to the back so the objects and the
 * global transformations are seen from a distance and
 * therefore more clear
 */
function initGlobalMatrices(){
    viewMatrix = mat4.create();
    mat4.translate(viewMatrix, viewMatrix, [0, 0, -7.0]);
    gMatrix = mat4.create();
}
