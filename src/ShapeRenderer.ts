import {vec3, vec4} from 'gl-matrix';
import Shape from './Shape';
import City from './geometry/City';


export default class ShapeRenderer {
    shapeSet : Set<Shape>;
    citySet : Set<City>;
    
    constructor(shapeSet: Set<Shape>, city: Set<City>) {
        this.shapeSet = shapeSet;
        this.citySet = city;
    } 

    renderSymbols = function() {
        this.build(set, this.scene);   
    }

    build = function(shapeSet: Set<Shape>, city: Set<City>) {

    }   
}