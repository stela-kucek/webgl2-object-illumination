/*
 * class holding all necessary data for displaying
 * an object in the canvas;
 * includes local coordinate system axes
 */
class object{
    constructor(){
        this.index = 0;
        this.vertices = [];
        this.colors = [];
        this.faceColors = []; // an array holding colors for cuboid faces
        this.tMatrix = []; // translation matrix
        this.rMatrix = []; // rotation matrix
        this.sMatrix = []; // scaling matrix
        this.modelMatrix = [];
        this.vPositionBuffer = [];
        this.vColorBuffer = [];
        this.localAxes = [
            0, 0, 0,
            1, 0, 0,         // X

            0, 1, 0,         // Y
            0, 0, 0,

            0, 0, 0,         // Z
            0, 0, 1
        ];
        this.axesColors = [
            1, 0, 0, 1,
            1, 0, 0, 1,       // x --> red

            0, 1, 0, 1,
            0, 1, 0, 1,       // y --> green

            0, 0, 1, 1,
            0, 0, 1, 1        // z --> blue

        ];


        this.coordsPB = [];
        this.coordsCB = [];

        this.coordsPB = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.coordsPB);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.localAxes), gl.STATIC_DRAW);
        this.coordsPB.itemSize = 3;
        this.coordsPB.numItems = this.localAxes.length / 3;

        this.coordsCB = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.coordsCB);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.axesColors), gl.STATIC_DRAW);
        this.coordsCB.itemSize = 4;
        this.coordsCB.numItems = this.axesColors.length / 4;

    }

}
