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

      //create 
      config1 = function (shape: Shape) {
            if (this.shapeSet.size != 0) {
                  var scale1 = vec3.fromValues(shape.scale[0], shape.scale[1], shape.scale[2]);
                  //scale1[0] *= 0.5;
                  var pos1 = vec3.fromValues(shape.position[0], shape.position[1], shape.position[2]);
                  pos1[0] = pos1[0] - 0.75 * shape.x[0];
                  pos1[1] = pos1[1] - 0.75 * shape.x[1];
                  pos1[2] = pos1[2] - 0.75 * shape.x[2];

                  this.shapeSet.add(new Shape('D', pos1, shape.rotation, scale1, shape.material, shape.x, shape.z, false));

                  var scale2 = vec3.fromValues(shape.scale[0], shape.scale[1], shape.scale[2]);
                  scale2[0] *= 0.9;
                  scale2[1] *= 0.9;
                  scale2[2] *= 0.9;
                  var pos2 = vec3.fromValues(shape.position[0], shape.position[1], shape.position[2]);
                  pos2[0] = pos2[0] - 0.75 * shape.x[0];
                  pos2[1] = pos2[1] - 0.75 * shape.x[1];
                  pos2[2] = pos2[2] - 0.75 * shape.x[2];

                  var rand = Math.random(); 
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
                  //scale1[0] *= 0.5;
                  var rotate1 = vec3.fromValues(shape.rotation[0], shape.rotation[1], shape.rotation[2]);
                  rotate1[2] += 3.1415 / 13.0;
                  var pos1 = vec3.fromValues(shape.position[0], shape.position[1], shape.position[2]);
                  pos1[0] = pos1[0] - 0.75 * shape.x[0];
                  pos1[1] = pos1[1] - 0.75 * shape.x[1];
                  pos1[2] = pos1[2] - 0.75 * shape.x[2];
                  this.shapeSet.add(new Shape('D', pos1, rotate1, scale1, shape.material, shape.x, shape.z, false));

                  var scale2 = vec3.fromValues(shape.scale[0], shape.scale[1], shape.scale[2]);
                  scale2[0] *= 0.9;
                  scale2[1] *= 0.9;
                  scale2[2] *= 0.9;
                  var rot = vec3.fromValues(shape.rotation[0], shape.rotation[1], shape.rotation[2]);
                  rot[2] += 3.1415 / 31.0;

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

      //make 2 new shapes rotated to face front in front half
      config3 = function (shape: Shape) {
            if (this.shapeSet.size != 0) {
                  var scale1 = vec3.fromValues(shape.scale[0], shape.scale[1], shape.scale[2]);
                  scale1[0] *= 0.3;
                  scale1[1] *= 0.3;
                  scale1[2] *= 0.3;
                  var pos1 = vec3.fromValues(shape.position[0], shape.position[1], shape.position[2]);
                  pos1[0] = pos1[0] - 2;
                  // pos1[1] = pos1[1] - 0;
                  pos1[2] = pos1[2] - 2;
                  this.shapeSet.add(new Shape('D', pos1, shape.rotation, scale1, shape.material, shape.x, shape.z, false));

                  var scale2 = vec3.fromValues(shape.scale[0], shape.scale[1], shape.scale[2]);
                  scale2[0] *= 0.9;
                  scale2[1] *= 0.9;
                  scale2[2] *= 0.9;
                  var rot = vec3.fromValues(shape.rotation[0], shape.rotation[1], shape.rotation[2]);
                  rot[1] += 3.1415 / 12.0;

                  var xax = vec3.fromValues(shape.x[0], shape.x[1], shape.x[2]);
                  var matx = this.rotationMatrix(vec3.fromValues(1, 0, 0), 3.1415 / 2.0);
                  vec3.transformMat4(xax, xax, matx);

                  var zax = vec3.fromValues(shape.z[0], shape.z[1], shape.z[2]);
                  var matz = this.rotationMatrix(vec3.fromValues(0, 0, 1), 3.1415 / 2.0);
                  vec3.transformMat4(zax, zax, matz);

                  var pos2 = vec3.fromValues(shape.position[0], shape.position[1], shape.position[2]);
                  pos2[0] = pos2[0] + 5;
                  pos2[1] = pos2[1] + 10;
                  pos2[2] = pos2[2] + 2.5 * shape.x[2];
                  var shape2 = new Shape('C', pos2, rot, scale2, shape.material, xax, zax, false);
                  this.shapeSet.add(shape2);

                  var rand = Math.random() * 10;
                  var pos3 = vec3.fromValues(shape.position[0], shape.position[1], shape.position[2]);
                  pos3[0] = pos3[0] + rand * shape.x[0];
                  pos3[1] = pos3[1] + 0.5 * shape.x[1];
                  pos3[2] = pos3[2] + rand * shape.x[2];
                  pos3[0] = pos3[0] - 1.6 * shape.z[0];
                  pos3[1] = pos3[1] - 1.6 * shape.z[1];
                  pos3[2] = pos3[2] - 1.6 * shape.z[2];
                  var shape3 = new Shape('C', pos3, rot, scale2, shape.material, xax, zax, false);
                  this.shapeSet.add(shape3);

                  var pos4 = vec3.fromValues(shape.position[0], shape.position[1], shape.position[2]);
                  pos4[0] = pos4[0] + 0.5 * shape.x[0];
                  pos4[1] = pos4[1] + 0.5 * shape.x[1];
                  pos4[2] = pos4[2] + 0.5 * shape.x[2];
                  pos4[0] = pos4[0] + 1.6 * shape.z[0];
                  pos4[1] = pos4[1] + 1.6 * shape.z[1];
                  pos4[2] = pos4[2] + 1.6 * shape.z[2];
                  var shape4 = new Shape('F', pos4, rot, scale2, shape.material, xax, zax, false);
                  this.shapeSet.add(shape4);

                  var rand = Math.random();
                  if (rand < 0.333) {
                        shape2.door = true;
                  }
                  else if (rand < 0.666) {
                        shape3.door = true;
                  }
                  else {
                        shape4.door = true;
                  }

                  this.shapeSet.delete(shape);
            }
      }

      //add half sized shape to left side of parent shape
      modif1 = function (shape: Shape) {
            if (this.shapeSet.size != 0) {
                  var rand1 = Math.random() * 20;
                  var scale1 = vec3.fromValues(shape.scale[0], shape.scale[1], shape.scale[2]);
                  scale1[0] *= 0.5;
                  scale1[1] *= 0.5;
                  scale1[2] *= 0.5;
                  var pos1 = vec3.fromValues(shape.position[0], shape.position[1], shape.position[2]);
                  pos1[0] = pos1[0] + rand1 * shape.z[0];
                  pos1[1] = pos1[1] + 1.75 * shape.z[1];
                  pos1[2] = pos1[2] + 1.75 * shape.z[2];
                  pos1[1] -= 0.25;
                  this.shapeSet.add(new Shape('C', pos1, shape.rotation, scale1, shape.material, shape.x, shape.z, false));

                  var scale = vec3.fromValues(1.5, 1.5, 1.1);
                  var pos2 = vec3.fromValues(shape.position[0], shape.position[1], shape.position[2]);
                  var rand = Math.random() * 2;
                  pos2[0] = pos2[0] + rand * shape.z[0];
                  pos2[1] = pos2[1] + rand * shape.z[1];
                  pos2[2] = pos2[2] + rand * shape.z[2];
                  pos2[1] -= 0.5;
                  pos2[0] = pos2[0] + rand * shape.x[0];
                  pos2[1] = pos2[1] + rand * shape.x[1];
                  pos2[2] = pos2[2] + .15 * shape.x[2];
                  this.shapeSet.add(new Shape('G', pos2, shape.rotation, scale, shape.material, shape.x, shape.z, false));
            }
      }

      //add half sized shape to right side of parent shape
      modif2 = function (shape: Shape) {
            if (this.shapeSet.size != 0) {
                  var scale1 = vec3.fromValues(shape.scale[0], shape.scale[1], shape.scale[2]);
                  scale1[0] *= 0.5;
                  scale1[1] *= 0.5;
                  scale1[2] *= 0.5;
                  var pos1 = vec3.fromValues(shape.position[0], shape.position[1], shape.position[2]);
                  pos1[0] = pos1[0] - 1.75 * shape.z[0];
                  pos1[1] = pos1[1] - 1.75 * shape.z[1];
                  pos1[2] = pos1[2] - 1.75 * shape.z[2];
                  pos1[1] -= 0.25;
                  this.shapeSet.add(new Shape('T', pos1, shape.rotation, scale1, shape.material, shape.x, shape.z, false));

                  var scale = vec3.fromValues(0.5, 0.5, 0.5);
                  var pos2 = vec3.fromValues(shape.position[0], shape.position[1], shape.position[2]);
                  pos2[0] = pos2[0] - 2.4 * shape.z[0];
                  pos2[1] = pos2[1] - 2.4 * shape.z[1];
                  pos2[2] = pos2[2] - 2.4 * shape.z[2];
                  pos2[0] = pos2[0] + .15 * shape.x[0];
                  pos2[1] = pos2[1] + .15 * shape.x[1];
                  pos2[2] = pos2[2] + .15 * shape.x[2];
                  pos2[1] -= 0.5;
                  this.shapeSet.add(new Shape('G', pos2, shape.rotation, scale, shape.material, shape.x, shape.z, false));
            }
      }
      //remove this shape returning empty set
      modif3 = function (shape: Shape) {
            if (this.shapeSet.size != 0) {
                  this.shapeSet.delete(shape);

                  if (shape.door) {
                        var scale = vec3.fromValues(0.5, 0.5, 0.5);
                        var pos1 = shape.position;
                        pos1[2] -= 0.5;
                        this.shapeSet.add(new Shape('G', pos1, shape.rotation, scale, shape.material, shape.x, shape.z, false));
                  }
            }
      }

      //half scale shape
      modif4 = function (shape: Shape) {
            if (this.shapeSet.size != 0) {
                  if (shape.door) {
                        var scale = vec3.fromValues(0.5, 1.0, 0.5);
                        var pos1 = vec3.fromValues(shape.position[0], shape.position[1], shape.position[2]);
                        pos1[0] = pos1[0] + 1.25 * shape.z[0];
                        pos1[1] = pos1[1] + 1.25 * shape.z[1];
                        pos1[2] = pos1[2] + 1.25 * shape.z[2];
                        pos1[2] -= 0.5;
                        this.shapeSet.add(new Shape('G', pos1, shape.rotation, scale, shape.material, shape.x, shape.z, false));
                  }
            }
      }

      //scale height of this shape by 1.25
      modif5 = function (shape: Shape) {
            if (this.shapeSet.size != 0) {
                  var scale1 = vec3.fromValues(shape.scale[0], shape.scale[1], shape.scale[2]);
                  scale1[1] *= 0.5;
                  var pos1 = vec3.fromValues(shape.position[0], shape.position[1], shape.position[2]);
                  pos1[1] += 0.5;
                  this.shapeSet.add(new Shape('T', pos1, shape.rotation, scale1, shape.material, shape.x, shape.z, false));

                  this.shapeSet.delete(shape);

                  if (shape.door) {
                        var scale = vec3.fromValues(0.5, 1.0, 0.1);
                        var pos2 = vec3.fromValues(shape.position[0], shape.position[1], shape.position[2]);
                        pos2[0] = pos2[0] + 1.25 * shape.z[0];
                        pos2[1] = pos2[1] + 1.25 * shape.z[1];
                        pos2[2] = pos2[2] + 1.25 * shape.z[2];
                        pos2[1] -= 0.5;
                        this.shapeSet.add(new Shape('G', pos2, shape.rotation, scale, shape.material, shape.z, shape.z, false));
                  }
            }
      }
      //scale height of this shape by 1.5
      modif6 = function (shape: Shape) {
            if (this.shapeSet.size != 0) {
                  var scale1 = vec3.fromValues(shape.scale[0], shape.scale[1], shape.scale[2]);
                  scale1[1] *= 1.5;
                  var pos1 = vec3.fromValues(shape.position[0], shape.position[1], shape.position[2]);
                  pos1[1] += 0.5;
                  this.shapeSet.add(new Shape('T', pos1, shape.rotation, scale1, shape.material, shape.x, shape.z, false));

                  this.shapeSet.delete(shape);

                  if (shape.door) {
                        var scale = vec3.fromValues(0.5, 1.0, 0.1);
                        var pos2 = vec3.fromValues(shape.position[0], shape.position[1], shape.position[2]);
                        pos2[0] = pos2[0] + 1.25 * shape.z[0];
                        pos2[1] = pos2[1] + 1.25 * shape.z[1];
                        pos2[2] = pos2[2] + 1.25 * shape.z[2];
                        pos2[1] -= 0.5;
                        this.shapeSet.add(new Shape('G', pos2, shape.rotation, scale, shape.material, shape.x, shape.z, false));
                  }
            }
      }

      //scale height by 1.5, add a chimney on left side
      modif7 = function (shape: Shape) {
            if (this.shapeSet.size != 0) {
                  var scale1 = vec3.fromValues(shape.scale[0], shape.scale[1], shape.scale[2]);
                  scale1[1] *= 1.5;
                  var pos1 = vec3.fromValues(shape.position[0], shape.position[1], shape.position[2]);
                  pos1[1] += 0.5;
                  this.shapeSet.add(new Shape('T', pos1, shape.rotation, scale1, shape.material, shape.x, shape.z, false));

                  this.shapeSet.delete(shape);

                  var scale = vec3.fromValues(0.5, 5.0, 0.5);
                  var pos2 = vec3.fromValues(shape.position[0], shape.position[1], shape.position[2]);
                  pos2[1] += 2.0;
                  pos2[0] = pos2[0] - 1.5 * shape.z[0];
                  pos2[1] = pos2[1] - 1.5 * shape.z[1];
                  pos2[2] = pos2[2] - 1.5 * shape.z[2];
                  pos2[0] = pos2[0] - 0.5 * shape.x[0];
                  pos2[1] = pos2[1] - 0.5 * shape.x[1];
                  pos2[2] = pos2[2] - 0.5 * shape.x[2];
                  this.shapeSet.add(new Shape('F', pos2, shape.rotation, scale, shape.material, shape.x, shape.z, false));
            }
      }

      //scale height by 1.5, add a chimney on right side
      modif8 = function (shape: Shape) {
            if (this.hapeSet.size != 0) {
                  var scale1 = vec3.fromValues(shape.scale[0], shape.scale[1], shape.scale[2]);
                  scale1[2] *= 1.5;
                  var pos1 = vec3.fromValues(shape.position[0], shape.position[1], shape.position[2]);
                  pos1[1] += 0.5;
                  this.shapeSet.add(new Shape('T', pos1, shape.rotation, scale1, shape.material, shape.x, shape.z, false));

                  this.shapeSet.delete(shape);

                  var scale = vec3.fromValues(0.5, 5.0, 0.5);
                  var pos2 = vec3.fromValues(shape.position[0], shape.position[1], shape.position[2]);
                  pos2[1] += 2.0;
                  pos2[0] = pos2[0] + 1.5 * shape.z[0];
                  pos2[1] = pos2[1] + 1.5 * shape.z[1];
                  pos2[2] = pos2[2] + 1.5 * shape.z[2];
                  pos2[0] = pos2[0] - 0.5 * shape.x[0];
                  pos2[1] = pos2[1] - 0.5 * shape.x[1];
                  pos2[2] = pos2[2] - 0.5 * shape.x[2];
                  this.shapeSet.add(new Shape('F', pos2, shape.rotation, scale, shape.material, shape.x, shape.z, false));
            }
      }

      //don't scale height, add a chimney on left side
      modif9 = function (shape: Shape) {
            if (this.shapeSet.size != 0) {
                  var scale = vec3.fromValues(0.5, 4.0, 0.5);
                  var pos2 = vec3.fromValues(shape.position[0], shape.position[1], shape.position[2]);
                  pos2[1] += 1.0;
                  pos2[0] = pos2[0] - 1.5 * shape.z[0];
                  pos2[1] = pos2[1] - 1.5 * shape.z[1];
                  pos2[2] = pos2[2] - 1.5 * shape.z[2];
                  pos2[0] = pos2[0] - 0.5 * shape.x[0];
                  pos2[1] = pos2[1] - 0.5 * shape.x[1];
                  pos2[2] = pos2[2] - 0.5 * shape.x[2];
                  this.shapeSet.add(new Shape('F', pos2, shape.rotation, scale, shape.material, shape.x, shape.z, false));
            }
      }

      //don't scale height, add a chimney on right side
      modif10 = function (shape: Shape) {
            if (this.shapeSet.size != 0) {
                  var scale = vec3.fromValues(0.5, 4.0, 0.5);
                  var pos2 = vec3.fromValues(shape.position[0], shape.position[1], shape.position[2]);
                  pos2[1] += 1.0;
                  pos2[0] = pos2[0] + 1.5 * shape.z[0];
                  pos2[1] = pos2[1] + 1.5 * shape.z[1];
                  pos2[2] = pos2[2] + 1.5 * shape.z[2];
                  pos2[0] = pos2[0] - 0.5 * shape.x[0];
                  pos2[1] = pos2[1] - 0.5 * shape.x[1];
                  pos2[2] = pos2[2] - 0.5 * shape.x[2];
                  this.shapeSet.add(new Shape('F', pos2, shape.rotation, scale, shape.material, shape.x, shape.z, false));
            }
      }

      parseA = function (shape: Shape) {
            var rand = Math.random();
            if (rand < 0.4) {
                  this.config1(shape);
            } else if (rand < 0.6) {
                  this.config2(shape);
            } else {
                  this.config3(shape);
            }
      }

      parseC = function (shape: Shape) {
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

      parseD = function (shape: Shape) {
            var rando = Math.random();

            var prob1;
            var prob2;
            var prob3;
            var t = (shape.position[2] + 40.0) / 80.0;

            prob1 = 0.8 * (1 - t) + 0.2 * t;
            prob2 = prob1 / 2.0;
            prob3 = prob1 + (1 - prob1) / 2.0;

            if (rando < prob2) {
                  this.modif7(shape);
            }
            else if (rando < prob1) {
                  this.modif8(shape);
            }
            else if (rando < prob3) {
                  this.modif9(shape);
            }
            else {
                  this.modif10(shape);
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
                        // } else if (shape.symbol == 'B') {
                        //       this.modif1(shape);
                        // } else if (shape.symbol == 'C') {
                        //       this.parseC(shape);
                        // } else if (shape.symbol == 'D') {
                        //       this.parseD(shape);
                        // } else if (shape.symbol == 'E') {
                        //       this.modif2(shape);
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