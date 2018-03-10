import {vec3, vec4, mat3, mat4} from 'gl-matrix';
import Shape from './Shape';
import City from './geometry/City';
import Door from './geometry/Door';
import Carrot from './geometry/Carrot';
import Chimney from './geometry/Chimney';
import Banana from './geometry/Banana';
import CarrotTop from './geometry/CarrotTop';

export default class ShapeRenderer {
    shapeSet : Set<Shape>;
    
    constructor() {} 

    //build the shapes according to the symbols
    build = function(shapeSet: Set<Shape>, citySet: City) {
        //var citySet = citySet;
        var array = Array.from(shapeSet);
        console.log(shapeSet.size);
        if(shapeSet.size != 0) {
            for(var i = 0; i < shapeSet.size; ++i) {
                console.log("each shape symbol:" + array[i].symbol);
                if(array[i].symbol === 'F') {
                    console.log("chimney:");
                    var chimney = new Chimney(vec3.fromValues(0,0,0));
                    var vertices = chimney.getPos();
                    vertices = this.scaleVertices(vertices, vec3.fromValues(10,20,10));
                    vertices = this.rotateVertices(6, vec3.fromValues(1,0,0), vertices);
                    vertices = this.translateVertices(vertices, vec3.fromValues(array[i].position[0], array[i].position[1] + 12, array[i].position[2]+ 5));
                    chimney.setPos(vertices);
                    citySet.addChimney(chimney);
                } else if(array[i].symbol == 'G') {
                    var mat;
                    var rand = Math.random();
                    console.log("door:");
                    var door = new Door(vec3.fromValues(0,0,0));
                    var vertices = door.getPos();
                    vertices = this.scaleVertices(vertices, array[i].scale);
                    vertices = this.translateVertices(vertices, array[i].position);
                    door.setPos(vertices);
                    citySet.addDoor(door); 
                }
                else {
                    var rand = Math.random();
                        console.log("carrot:");
                        var carrot = new Carrot(vec3.fromValues(0, 0, 0));
                        var carrotTop = new CarrotTop(vec3.fromValues(0,0,0));
                        var verticesTop = carrotTop.getPos();
                        var vertices = carrot.getPos();
                        var rotation = array[i].rotation;
                        console.log(rotation);
                        if(rotation[0] > 0) {
                            verticesTop = this.rotateVertices(rotation[0], vec3.fromValues(1,0,0), verticesTop);
                            vertices = this.rotateVertices(rotation[0], vec3.fromValues(1,0,0), vertices);
                        }
                        if(rotation[1] > 0) {
                            verticesTop = this.rotateVertices(rotation[1], vec3.fromValues(0,1,0), verticesTop);
                            vertices = this.rotateVertices(rotation[1], vec3.fromValues(0,1,0), vertices);
                        }
                        if(rotation[2] > 0) {
                            verticesTop = this.rotateVertices(rotation[2], vec3.fromValues(0,0,1), verticesTop);
                            vertices = this.rotateVertices(rotation[2], vec3.fromValues(0,0,1), vertices);
                        }
                        verticesTop = this.scaleVertices(verticesTop, vec3.fromValues(1,2,1));
                        verticesTop = this.translateVertices(verticesTop, vec3.fromValues(array[i].position[0] + 5, array[i].position[1] + 5, array[i].position[2]));
                        vertices = this.scaleVertices(vertices, array[i].scale);
                        vertices = this.translateVertices(vertices, array[i].position);
                        carrotTop.setPos(verticesTop);
                        carrot.setPos(vertices);
                        //citySet.addCarrotTop(carrotTop);
                        citySet.addCarrot(carrot); 
                }      
            }
        }
        return citySet;
    }
    
    translateVertices(positions: Array<number>, pos : vec3) {
        var newPositions = new Array<number>();
        for(var i = 0; i < positions.length; i = i + 4) {
            //input vertex x, y, z
            var xCom = positions[i];
            var yCom = positions[i+1];
            var zCom = positions[i+2];
            
            //console.log("original: " + positions[i], positions[i+1], positions[i+2]);
            //apply rotation in x, y, z direction to the vertex
            var vert = vec3.fromValues(xCom + pos[0], yCom + pos[1], zCom+ pos[2]);

            newPositions[i] = vert[0];
            newPositions[i+1] = vert[1];
            newPositions[i+2] = vert[2];
            newPositions[i+3] = 1;
            //console.log("translated Pos: " + newPositions[i], newPositions[i+1], newPositions[i+2]);
        }
        return newPositions;
    }

    rotateVertices(x: number, axis: vec3, positions: Array<number>) {

        //only rotate by y axis
            var rotMat = this.rotationMatrix(axis, x);
        //matrices

        var newPositions = new Array<number>();
        for(var i = 0; i < positions.length; i = i + 4) {
            //input vertex x, y, z
            var xCom = positions[i];
            var yCom = positions[i+1];
            var zCom = positions[i+2];
            
            //console.log("original: " + positions[i], positions[i+1], positions[i+2]);
            //apply rotation in x, y, z direction to the vertex
            var vert = vec3.fromValues(xCom, yCom, zCom);
            vec3.transformMat4(vert, vert, rotMat);           

            newPositions[i] = vert[0];
            newPositions[i+1] = vert[1];
            newPositions[i+2] = vert[2];
            newPositions[i+3] = 1;
            //console.log("rotateed Pos: " + newPositions[i], newPositions[i+1], newPositions[i+2]);
    
        }

        return newPositions;
    }

    scaleVertices(positions : Array<number>, scale: vec3) {
        var newPositions = new Array<number>();
        for(var i = 0; i < positions.length; i = i + 4) {
            //input vertex x, y, z
            var xCom = positions[i];
            var yCom = positions[i+1];
            var zCom = positions[i+2];
            
            //console.log("original: " + positions[i], positions[i+1], positions[i+2]);
            //apply rotation in x, y, z direction to the vertex
            var vert = vec3.fromValues(xCom * scale[0], yCom * scale[1], zCom * scale[2]);

            newPositions[i] = vert[0];
            newPositions[i+1] = vert[1];
            newPositions[i+2] = vert[2];
            newPositions[i+3] = 1;
            //console.log("rotateed Pos: " + newPositions[i], newPositions[i+1], newPositions[i+2]);
        }
        return newPositions;
    }


    rotationMatrix = function(axis : vec3 , angle:number) {
    axis = vec3.normalize(axis, axis);
    var s = Math.sin(angle);
    var c = Math.cos(angle);
    var oc = 1.0 - c;
    
    return mat4.fromValues(oc * axis[0] * axis[0] + c,           oc * axis[0] * axis[1] - axis[2] * s,  oc * axis[2] * axis[0] + axis[1] * s,  0.0,
                oc * axis[0] * axis[1] + axis[2] * s,  oc * axis[1] * axis[1] + c,           oc * axis[1] * axis[2] - axis[0] * s,  0.0,
                oc * axis[2] * axis[0] - axis[1] * s,  oc * axis[1] * axis[2] + axis[0] * s,  oc * axis[2] * axis[2] + c,           0.0,
                0.0,                                0.0,                                0.0,                                1.0);
    }   
}