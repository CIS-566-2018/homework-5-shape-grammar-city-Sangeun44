import {vec3, vec4} from 'gl-matrix';

export default class Shape {
    symbol : string;
    position : vec3;
    rotation : vec3;
    scale : vec3;
    material : string;
    x : vec3;
    z : vec3;
    door : boolean;

    constructor(symbol: string, position: vec3, rotation: vec3, 
                scale: vec3, material: string, x: vec3, z: vec3, door: boolean) {
        this.symbol = symbol;
        this.position = position;
        this.rotation = rotation;
        this.scale = scale;
        this.material = material;
        this.x = x;
        this.z = z;
        this.door = door;
        }
}