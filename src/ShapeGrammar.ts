import {vec3, vec4} from 'gl-matrix';
import {gl} from './globals';
import Shape from './Shape';


export default class ShapeGrammar {
      axiom : string;
      shapeSet: Set<Shape>;

      constructor() {
            this.axiom = "A";
            this.shapeSet = new Set();
      }

      config1 = function(shape: Shape) {
            if(this.shapeSet.size != 0) {
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
                  if(rand < 0.5) {
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

      parseA = function(shape: Shape) {
            var rand = Math.random();
            if(rand < 0.2) {
                  this.config1(shape);
            }
            // } else if(rand < 0.6) {
            //       this.config2(shape, this.shapeSet);
            // } else {
            //       this.config3(shape, this.shapeSet);
            // }
      }

      doIterations = function(it: number, pos: vec3, rot: vec3, scale: vec3, 
                        mat: string, xaxis : vec3, zaxis: vec3, door: boolean) {

            this.shapeSet.clear();
            var shape = new Shape('A', pos, rot, scale, mat, xaxis, zaxis, door);
            this.shapeSet.add(shape);

            for(var i = 0; i < it; ++i) {
                  var temp = this.shapeSet;
                  var array = Array.from(temp);
                  for(var i = 0; i < array.length; ++i) {
                        if(shape.symbol == 'A') {
                              this.parseA(shape);
                        }
                        // } else if(shape.symbol == 'B')
				// {
				// 	modif1(shape, shapeSet);
				// }
				// else if(shape.symbol == 'C')
				// {
				// 	parseC(shape, shapeSet);
				// }
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
}