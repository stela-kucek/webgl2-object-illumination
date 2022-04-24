/*
 *  the third object 'type', sphere
 */
class sphere extends object {
    constructor() {
        super();

        /*
         * code for creating sphere vertices and indices partly derived from
         * https://github.com/davidwparker/programmingtil-webgl/blob/master/0078-3d-sphere/index.js
         */
        var n = 20;
        var i, ai, si, ci;
        var j, aj, sj, cj;
        var p1, p2;

        this.vertices = [];
        this.indices = [];
        
        var vert = this.vertices;
        for (j = 0; j <= n; j++) {
            aj = j * Math.PI / n;
            sj = Math.sin(aj);
            cj = Math.cos(aj);
            for (i = 0; i <= n; i++) {
                ai = i * 2 * Math.PI / n;
                si = Math.sin(ai);
                ci = Math.cos(ai);
                vert.push(si * sj / 2.5);  // X
                vert.push(cj/2.5);       // Y
                vert.push(ci * sj / 2.5);  // Z
            }
        }

        var ids = this.indices;
        for (j = 0; j < n; j++) {
            for (i = 0; i < n; i++) {
                p1 = j * (n + 1) + i;
                p2 = p1 + (n + 1);
                ids.push(p1);
                ids.push(p2);
                ids.push(p1 + 1);
                ids.push(p1 + 1);
                ids.push(p2);
                ids.push(p2 + 1);
            }
        }

        var cols = [];

        for (j = 0; j <= n; j++) {
            for (i = 0; i <= n; i++) {
                cols.push(1-(i*0.01));
                cols.push(1-(j*0.01));
                cols.push(0.5);
                cols.push(1);
            }
        }
        this.colors = cols;

        this.modelMatrix = mat4.create();

        this.index = objects.push(this) - 1;

        this.vertexNormals = [];

        for(i = 0; i < vert.length; ++i){
            this.vertexNormals.push(vert[i]);
        }

        this.vPositionBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.vPositionBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.vertices), gl.STATIC_DRAW);
        this.vPositionBuffer.itemSize = 3;
        this.vPositionBuffer.numItems = this.vertices.length / 3;

        this.vColorBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.vColorBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.colors), gl.STATIC_DRAW);
        this.vColorBuffer.itemSize = 4;
        this.vColorBuffer.numItems = this.indices.length / 4;
        this.normalBuffer = gl.createBuffer();

        gl.bindBuffer(gl.ARRAY_BUFFER, this.normalBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.vertexNormals), gl.STATIC_DRAW);
        this.normalBuffer.itemSize = 3;
        this.normalBuffer.numItems = this.normalBuffer.length / 3;

        this.indicesBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indicesBuffer);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(this.indices), gl.STATIC_DRAW);

    }

}

