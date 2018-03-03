import { vec3, vec4, mat4 } from 'gl-matrix';
import { gl } from './globals';
import Shape from './Shape';


export default class ShapeGrammar {
      axiom: string;
      shapeSet: Set<Shape>;

      constructor() {
            this.axiom = "A";
            this.shapeSet = new Set();
      }

      //remove this shape returning empty set
      modif3 = function (shape: Shape) {
            if (this.shapeSet.size != 0) {
                  this.shapeSet.delete(shape);

                  if (shape.door) {
                        var scale = vec3.fromValues(0.5, 1.0, 0.1);
                        var pos1 = shape.position;
                        pos1[2] -= 0.5;
                        this.shapeSet.add(new Shape('G', pos1, shape.rotation, scale, shape.material, shape.x, shape.z, false));
                  }
            }
      }

      //do nothing to this shape, return it unchanged
      modif4 = function (shape: Shape) {
            if (this.shapeSet.size != 0) {
                  if (shape.door) {
                        var scale = vec3.fromValues(0.5, 1.0, 0.1);
                        var pos1 = vec3.fromValues(shape.position[0], shape.position[1], shape.position[2]);
                        pos1[0] = pos1[0] + 1.25 * shape.z[0];
                        pos1[1] = pos1[1] + 1.25 * shape.z[1];
                        pos1[2] = pos1[2] + 1.25 * shape.z[2];
                        pos1[1] -= 0.5;
                        this.shapeSet.add(new Shape('G', pos1, shape.rotation, scale, shape.material, shape.x, shape.z, false));
                  }
            }
      }



      config1 = function (shape: Shape) {
            if (this.shapeSet.size != 0) {
                  var scale1 = vec3.fromValues(shape.scale[0], shape.scale[1], shape.scale[2]);
                  scale1[0] *= 0.5;
                  var pos1 = vec3.fromValues(shape.position[0], shape.position[1], shape.position[2]);
                  pos1[0] = pos1[0] - 0.75 * shape.x[0];
                  pos1[1] = pos1[1] - 0.75 * shape.x[1];
                  pos1[2] = pos1[2] - 0.75 * shape.x[2];

                  this.shapeSet.add(new Shape('D', pos1, shape.rotation, scale1, shape.material, shape.x, shape.z, false));

                  var scale2 = vec3.fromValues(shape.scale[0], shape.scale[1], shape.scale[2]);
                  scale2[0] *= 0.5;
                  scale2[2] *= 0.5;
                  var pos2 = vec3.fromValues(shape.position[0], shape.position[1], shape.position[2]);
                  pos2[0] = pos2[0] - 0.75 * shape.x[0];
                  pos2[1] = pos2[1] - 0.75 * shape.x[1];
                  pos2[2] = pos2[2] - 0.75 * shape.x[2];

                  var rand = Math.random(); //
                  if (rand < 0.5) {
                        pos2[0] = pos2[0] - 1.0 * shape.z[0];
                        pos2[1] = pos2[1] - 1.0 * shape.z[1];
                        pos2[2] = pos2[2] - 1.0 * shape.z[2];
                        this.shapeSet.add(new Shape('B', pos2, shape.rotation, shape.scale, shape.material, shape.x, shape.z, false));
                  } else {
                        pos2[0] = pos2[0] - 1.0 * shape.z[0];
                        pos2[1] = pos2[1] - 1.0 * shape.z[1];
                        pos2[2] = pos2[2] - 1.0 * shape.z[2];
                        this.shapeSet.add(new Shape('E', pos2, shape.rotation, shape.scale, shape.material, shape.x, shape.z, false));
                  }
                  this.shapeSet.delete(shape);
            }
      }

      //subdivide in z, make two new shapes rotated to face front in front half
      config2 = function (shape: Shape) {
            if (this.shapeSet.size != 0) {
                  var scale1 = vec3.fromValues(shape.scale[0], shape.scale[1], shape.scale[2]);
                  scale1[0] *= 0.5;
                  var pos1 = vec3.fromValues(shape.position[0], shape.position[1], shape.position[2]);
                  pos1[0] = pos1[0] - 0.75 * shape.x[0];
                  pos1[1] = pos1[1] - 0.75 * shape.x[1];
                  pos1[2] = pos1[2] - 0.75 * shape.x[2];
                  this.shapeSet.add(new Shape('D', pos1, shape.rotation, scale1, shape.material, shape.x, shape.z, false));

                  var scale2 = vec3.fromValues(shape.scale[0], shape.scale[1], shape.scale[2]);
                  scale2[0] *= 0.4;
                  scale2[2] *= 0.5;
                  var rot = vec3.fromValues(shape.rotation[0], shape.rotation[1], shape.rotation[2]);
                  rot[2] += 3.1415 / 2.0;

                  var xax = vec3.fromValues(shape.x[0], shape.x[1], shape.x[2]);
                  var matx = this.rotationMatrix(vec3.fromValues(0, 1, 0), 3.1415 / 2.0);
                  vec3.transformMat4(xax, xax, matx);

                  var zax = vec3.fromValues(shape.z[0], shape.z[1], shape.z[2]);
                  var matz = this.rotationMatrix(vec3.fromValues(0, 1, 0), 3.1415 / 2.0);
                  vec3.transformMat4(zax, zax, matz);

                  var pos2 = vec3.fromValues(shape.position[0], shape.position[1], shape.position[2]);
                  pos2[0] = pos2[0] + 0.5 * shape.x[0];
                  pos2[1] = pos2[1] + 0.5 * shape.x[1];
                  pos2[2] = pos2[2] + 0.5 * shape.x[2];

                  pos2[0] = pos2[0] - 1.25 * shape.z[0];
                  pos2[1] = pos2[1] - 1.25 * shape.z[1];
                  pos2[2] = pos2[2] - 1.25 * shape.z[2];
                  var shape2 = new Shape('C', pos2, rot, scale2, shape.material, xax, zax, false);
                  this.shapeSet.add(shape2);

                  var pos3 = vec3.fromValues(shape.position[0], shape.position[1], shape.position[2]);
                  pos3[0] = pos3[0] + 0.5 * shape.x[0];
                  pos3[1] = pos3[1] + 0.5 * shape.x[1];
                  pos3[2] = pos3[2] + 0.5 * shape.x[2];

                  pos3[0] = pos3[0] + 1.25 * shape.z[0];
                  pos3[1] = pos3[1] + 1.25 * shape.z[1];
                  pos3[2] = pos3[2] + 1.25 * shape.z[2];
                  var shape3 = new Shape('C', pos3, rot, scale2, shape.material, xax, zax, false);
                  this.shapeSet.add(shape3);

                  var rando = Math.random();
                  if (rando < 0.5) {
                        shape2.door = true;
                  }
                  else {
                        shape3.door = true;
                  }

                  this.shapeSet.delete(shape);
            }
      }

      //subdivide in z, make three new shapes rotated to face front in front half

      config3 = function (shape: Shape) {
            if (this.shapeSet.size != 0) {
                  var scale1 = new THREE.Vector3(initShape.scale.x, initShape.scale.y, initShape.scale.z);
                  scale1.x *= 0.5;
                  var pos1 = new THREE.Vector3(initShape.pos.x, initShape.pos.y, initShape.pos.z);
                  pos1.x = pos1.x - 0.75 * initShape.xaxis.x;
                  pos1.y = pos1.y - 0.75 * initShape.xaxis.y;
                  pos1.z = pos1.z - 0.75 * initShape.xaxis.z;
                  shapeSet.add(new Shape('D', pos1, initShape.rot, scale1, initShape.material, initShape.xaxis, initShape.zaxis));

                  var scale2 = new THREE.Vector3(initShape.scale.x, initShape.scale.y, initShape.scale.z);
                  scale2.x *= 0.3;
                  scale2.z *= 0.5;
                  var rot = new THREE.Vector3(initShape.rot.x, initShape.rot.y, initShape.rot.z);
                  rot.y += 3.1415 / 2.0;
                  var xax = new THREE.Vector3(initShape.xaxis.x, initShape.xaxis.y, initShape.xaxis.z);
                  xax.applyAxisAngle(new THREE.Vector3(0, 1, 0), 3.1415 / 2.0);
                  var zax = new THREE.Vector3(initShape.zaxis.x, initShape.zaxis.y, initShape.zaxis.z);
                  zax.applyAxisAngle(new THREE.Vector3(0, 1, 0), 3.1415 / 2.0);

                  var pos2 = new THREE.Vector3(initShape.pos.x, initShape.pos.y, initShape.pos.z);
                  pos2.x = pos2.x + 0.5 * initShape.xaxis.x;
                  pos2.y = pos2.y + 0.5 * initShape.xaxis.y;
                  pos2.z = pos2.z + 0.5 * initShape.xaxis.z;
                  var shape2 = new Shape('C', pos2, rot, scale2, initShape.material, xax, zax, false);
                  shapeSet.add(shape2);

                  var pos3 = new THREE.Vector3(initShape.pos.x, initShape.pos.y, initShape.pos.z);
                  pos3.x = pos3.x + 0.5 * initShape.xaxis.x;
                  pos3.y = pos3.y + 0.5 * initShape.xaxis.y;
                  pos3.z = pos3.z + 0.5 * initShape.xaxis.z;
                  pos3.x = pos3.x - 1.6 * initShape.zaxis.x;
                  pos3.y = pos3.y - 1.6 * initShape.zaxis.y;
                  pos3.z = pos3.z - 1.6 * initShape.zaxis.z;
                  var shape3 = new Shape('C', pos3, rot, scale2, initShape.material, xax, zax, false);
                  shapeSet.add(shape3);

                  var pos4 = new THREE.Vector3(initShape.pos.x, initShape.pos.y, initShape.pos.z);
                  pos4.x = pos4.x + 0.5 * initShape.xaxis.x;
                  pos4.y = pos4.y + 0.5 * initShape.xaxis.y;
                  pos4.z = pos4.z + 0.5 * initShape.xaxis.z;
                  pos4.x = pos4.x + 1.6 * initShape.zaxis.x;
                  pos4.y = pos4.y + 1.6 * initShape.zaxis.y;
                  pos4.z = pos4.z + 1.6 * initShape.zaxis.z;
                  var shape4 = new Shape('C', pos4, rot, scale2, initShape.material, xax, zax, false);
                  shapeSet.add(shape4);

                  var rando = Math.random();
                  if (rando < 0.333) {
                        shape2.hasDoor = true;
                  }
                  else if (rando < 0.666) {
                        shape3.hasDoor = true;
                  }
                  else {
                        shape4.hasDoor = true;
                  }

                  shapeSet.delete(initShape);
            }
      }

      parseA = function (shape: Shape) {
            var rand = Math.random();
            if (rand < 0.2) {
                  this.config1(shape);
            } else if (rand < 0.6) {
                  this.config2(shape);
            } else {
                  this.config3(shape);
            }
      }

      parseB = function (shape: Shape) {
            var rand = Math.random();
            var tilt = (shape.position[2] + 40.0) / 80.0;

            var prob1 = 0.9 * tilt + 0.3 * (1 - tilt);
            var prob2 = 0.2 + (prob1 - 0.2) / 2.0;

            if (rand < 0.2) {
                  this.modif3(shape);
            } else if (rand < prob2) {
                  this.modif4(shape);
            } else if (rand < prob1) {
                  this.modif5(shape);
            } else {
                  this.modif6(shape);
            }
      }


      doIterations = function (it: number, pos: vec3, rot: vec3, scale: vec3,
            mat: string, xaxis: vec3, zaxis: vec3, door: boolean) {

            this.shapeSet.clear();
            var shape = new Shape('A', pos, rot, scale, mat, xaxis, zaxis, door);
            this.shapeSet.add(shape);

            for (var i = 0; i < it; ++i) {
                  var temp = this.shapeSet;
                  var array = Array.from(temp);
                  for (var i = 0; i < array.length; ++i) {
                        if (shape.symbol == 'A') {
                              this.parseA(shape);
                        }
                        // } else if(shape.symbol == 'B')
                        // {
                        // 	modif1(shape, shapeSet);
                        // }
                        else if (shape.symbol == 'C') {
                              this.parseB(shape);
                        }
                        // else if(shape.symbol == 'D')
                        // {
                        // 	parseD(shape, shapeSet);	
                        // }
                        // else if(shape.symbol == 'E')
                        // {
                        // 	modif2(shape, shapeSet);
                        // }
                  }
            }
            return this.shapeSet;
      }

      rotationMatrix = function (axis: vec3, angle: number) {
            axis = vec3.normalize(axis, axis);
            var s = Math.sin(angle);
            var c = Math.cos(angle);
            var oc = 1.0 - c;

            return mat4.fromValues(oc * axis[0] * axis[0] + c, oc * axis[0] * axis[1] - axis[2] * s, oc * axis[2] * axis[0] + axis[1] * s, 0.0,
                  oc * axis[0] * axis[1] + axis[2] * s, oc * axis[1] * axis[1] + c, oc * axis[1] * axis[2] - axis[0] * s, 0.0,
                  oc * axis[2] * axis[0] - axis[1] * s, oc * axis[1] * axis[2] + axis[0] * s, oc * axis[2] * axis[2] + c, 0.0,
                  0.0, 0.0, 0.0, 1.0);
      }
}