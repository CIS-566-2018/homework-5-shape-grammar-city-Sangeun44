import { vec2, vec3, vec4, mat4 } from 'gl-matrix';
import * as Stats from 'stats-js';
import * as DAT from 'dat-gui';

import Square from './geometry/Square';
import City from './geometry/City';

import OpenGLRenderer from './rendering/gl/OpenGLRenderer';
import Camera from './Camera';
import { setGL } from './globals';
import ShaderProgram, { Shader } from './rendering/gl/ShaderProgram';

//shapeGrammar
import ShapeGrammar from './ShapeGrammar';
import ShapeRenderer from './ShapeRenderer';
import Shape from './Shape';
import Carrot from './geometry/Carrot';
import CarrotTop from './geometry/CarrotTop';
import RoadBlock from './geometry/RoadBlock';
import Grass from './geometry/Grass';
import Flower from './geometry/Flower';

// Define an object with application parameters and button callbacks
// This will be referred to by dat.GUI's functions that add GUI elements.
const controls = {
  shaders: 'lambert',
  color: [255, 0, 105, 1.0], // CSS string
  iterations: 4,
  randomize: 2,
  'Load Scene': loadScene // A function pointer, essentially
};

//shapes
let square: Square;
let road1: RoadBlock;
let cityMesh: Set<City>;
let city1: City;
let grasses: City;
let flowers: City;

let carrot: Carrot;

//Shape Set maker 
let shapeRen: ShapeRenderer;
let shapeGram: ShapeGrammar;
let roads: City;
let tops: City;

let iteration: number;
let axiom: string;
let height: number;

//time
let count: number = 0.0;

//grammar city
function loadScene() {
  //ground
  square = new Square(vec3.fromValues(0, 0, 0));
  square.create();
  roads.create();
  cityMesh.forEach(function (building: City) {
    building.create();
  });
  grasses.create();
  flowers.create();
  tops.create();
}

function distance(one: vec2, two: vec2) {
  var a = one[0] - two[0];
  var b = one[1] - two[1];

  var c = Math.sqrt(a * a + b * b);
}

function main() {
  cityMesh = new Set<City>();
  tops = new City(vec3.fromValues(0,0,0));
  grasses = new City(vec3.fromValues(0,0,0));
  flowers = new City(vec3.fromValues(0,0,0));

  //Shapes
  shapeGram = new ShapeGrammar();
  shapeRen = new ShapeRenderer();

  //create grass
  for(var i = 0; i < 200; ++i ) {
    var rand1 = Math.random() * 200 - 100;
    var rand2 = Math.random() * 200 - 100;
    var grassPos = vec3.fromValues(rand1, 0, rand2);
    var newGrass = new Grass(vec3.fromValues(0,0,0));
    var vertices = newGrass.getPos();
    vertices = rotateVertices(9, vec3.fromValues(0, 1, 0), vertices);
    vertices = translateVertices(vertices, grassPos);
    newGrass.setPos(vertices)
    grasses.addGrass(newGrass);
  }

    //create flowers
    for(var i = 0; i < 100; ++i ) {
      var rand1 = Math.random() * 200 - 100;
      var rand2 = Math.random() * 200 - 100;
      var flowerPos = vec3.fromValues(rand1, 0, rand2);
      var newflower = new Flower(vec3.fromValues(0,0,0));
      var vertices = newflower.getPos();
      vertices = rotateVertices(9, vec3.fromValues(0, 1, 0), vertices);
      vertices = translateVertices(vertices, flowerPos);
      newflower.setPos(vertices);
      flowers.addFlower(newflower);
    }

  //create roads
  roads = new City(vec3.fromValues(i * 10, 0, 0));
  for (var i = 0; i < 18; ++i) {

    var rand = Math.random() * 10;
    var roadBlockPos1 = vec3.fromValues(0 + rand, 0, i * 10 - 90);
    var road = new RoadBlock(vec3.fromValues(0, 0, 0));
    var vertices = road.getPos();
    vertices = rotateVertices(9, vec3.fromValues(0, 1, 0), vertices);
    vertices = translateVertices(vertices, roadBlockPos1);
    road.setPos(vertices);
    roads.addRoad(road);

    if(i % 4 === 0) { 
       //let's start the chain
       var symbol = "A";
       var position = vec3.fromValues(roadBlockPos1[0] + 10, 0, roadBlockPos1[2]);
       var rotation = vec3.fromValues(1, i, 1);
       var scale = vec3.fromValues(1, 1, 1);
       var material = "carrot";
       var x = vec3.fromValues(1, 0, 0);
       var z = vec3.fromValues(0, 0, i);
       var door = false;
       var iter = 10;

        //add a carrot top at the position
        var top = new CarrotTop(vec3.fromValues(0,0,0));
        var vertices = top.getPos();
        vertices = scaleVertices(vertices, vec3.fromValues(3,3,3));
        vertices = rotateVertices(9, vec3.fromValues(0, 1, 0), vertices);
        vertices = translateVertices(vertices, vec3.fromValues(position[0], position[1] + 10, position[2]));
        top.setPos(vertices);
        tops.addCarrotTop(top);
  
       //get a set of shapes from the shapeGrammar
       city1 = new City(vec3.fromValues(0, 0, 0));
       var shapeSet = shapeGram.doIterations(iter, position, rotation, scale, material, x, z, door);
       city1 = shapeRen.build(shapeSet, city1);
       cityMesh.add(city1);
    }

    var rand = Math.random() * 10;
    var roadBlockPos2 = vec3.fromValues(-60 + rand, 0, i * 10 - 90);
    var road = new RoadBlock(vec3.fromValues(0, 0, 0));
    var vertices = road.getPos();
    vertices = rotateVertices(9, vec3.fromValues(0, 1, 0), vertices);
    vertices = translateVertices(vertices, roadBlockPos2);
    road.setPos(vertices);
    roads.addRoad(road);

    if (i % 3 === 0) {
      //let's start the chain
      var symbol = "A";
      var position = vec3.fromValues(roadBlockPos2[0] + 20, 0, roadBlockPos2[2] + 2);
      var rotation = vec3.fromValues(1, i, 1);
      var scale = vec3.fromValues(1, 1, 1);
      var material = "carrot";
      var x = vec3.fromValues(1, 0, 0);
      var z = vec3.fromValues(0, 0, 1);
      var door = false;
      var iter = 2;

      //add a carrot top at the position
      var top = new CarrotTop(vec3.fromValues(0,0,0));
      var vertices = top.getPos();
      vertices = scaleVertices(vertices, vec3.fromValues(3,3,3));
      vertices = rotateVertices(9, vec3.fromValues(0, 1, 0), vertices);
      vertices = translateVertices(vertices, vec3.fromValues(position[0], position[1] + 10, position[2]));
      top.setPos(vertices);
      tops.addCarrotTop(top);

      //get a set of shapes from the shapeGrammar
      city1 = new City(vec3.fromValues(0, 0, 0));
      var shapeSet = shapeGram.doIterations(iter, position, rotation, scale, material, x, z, door);
      city1 = shapeRen.build(shapeSet, city1);
      cityMesh.add(city1);
    }
    if (i % 4 === 0) {
      //let's start the chain
      var symbol = "A";
      var position = vec3.fromValues(roadBlockPos2[0] - 20, 0, roadBlockPos2[2] + 2);
      var rotation = vec3.fromValues(1, i, 1);
      var scale = vec3.fromValues(1, 1, 1);
      var material = "carrot";
      var x = vec3.fromValues(1, 0, 0);
      var z = vec3.fromValues(0, 0, 1);
      var door = false;
      var iter = 2;
          //add a carrot top at the position
          var top = new CarrotTop(vec3.fromValues(0,0,0));
          var vertices = top.getPos();
          vertices = scaleVertices(vertices, vec3.fromValues(3,3,3));
          vertices = rotateVertices(9, vec3.fromValues(0, 1, 0), vertices);
          vertices = translateVertices(vertices, vec3.fromValues(position[0], position[1] + 10, position[2]));
          top.setPos(vertices);
          tops.addCarrotTop(top);
    
      //get a set of shapes from the shapeGrammar
      city1 = new City(vec3.fromValues(0, 0, 0));
      var shapeSet = shapeGram.doIterations(iter, position, rotation, scale, material, x, z, door);
      city1 = shapeRen.build(shapeSet, city1);
      cityMesh.add(city1);
    }

    var rand = Math.random() * 10;
    var roadBlockPos3 = vec3.fromValues(60 + rand, 0, i * 10 - 90);
    var road = new RoadBlock(vec3.fromValues(0, 0, 0));
    var vertices = road.getPos();
    vertices = rotateVertices(9, vec3.fromValues(0, 1, 0), vertices);
    vertices = translateVertices(vertices, roadBlockPos3);
    road.setPos(vertices);
    roads.addRoad(road);

    if (i % 3 === 0) {
      //let's start the chain
      var symbol = "A";
      var position = vec3.fromValues(roadBlockPos3[0] + 20, 0, roadBlockPos3[2] + 2);
      var rotation = vec3.fromValues(1, i, 1);
      var scale = vec3.fromValues(1, 1, 1);
      var material = "carrot";
      var x = vec3.fromValues(1, 0, 0);
      var z = vec3.fromValues(0, 0, 1);
      var door = false;
      var iter = 4;

          //add a carrot top at the position
          var top = new CarrotTop(vec3.fromValues(0,0,0));
          var vertices = top.getPos();
          vertices = scaleVertices(vertices, vec3.fromValues(3,3,3));
          vertices = rotateVertices(9, vec3.fromValues(0, 1, 0), vertices);
          vertices = translateVertices(vertices, vec3.fromValues(position[0], position[1] + 10, position[2]));
          top.setPos(vertices);
          tops.addCarrotTop(top);
    
      //get a set of shapes from the shapeGrammar
      city1 = new City(vec3.fromValues(0, 0, 0));
      var shapeSet = shapeGram.doIterations(iter, position, rotation, scale, material, x, z, door);
      city1 = shapeRen.build(shapeSet, city1);
      cityMesh.add(city1);
    }
    if (i % 4 === 0) {
      //let's start the chain
      var symbol = "A";
      var position = vec3.fromValues(roadBlockPos3[0] - 20, 0, roadBlockPos3[2] + 2);
      var rotation = vec3.fromValues(1, i, 1);
      var scale = vec3.fromValues(1, 1, 1);
      var material = "carrot";
      var x = vec3.fromValues(1, 0, 0);
      var z = vec3.fromValues(0, 0, 1);
      var door = false;
      var iter = 4;

          //add a carrot top at the position
          var top = new CarrotTop(vec3.fromValues(0,0,0));
          var vertices = top.getPos();
          vertices = scaleVertices(vertices, vec3.fromValues(3,3,3));
          vertices = rotateVertices(9, vec3.fromValues(0, 1, 0), vertices);
          vertices = translateVertices(vertices, vec3.fromValues(position[0], position[1] + 10, position[2]));
          top.setPos(vertices);
          tops.addCarrotTop(top);
    
      //get a set of shapes from the shapeGrammar
      city1 = new City(vec3.fromValues(0, 0, 0));
      var shapeSet = shapeGram.doIterations(iter, position, rotation, scale, material, x, z, door);
      city1 = shapeRen.build(shapeSet, city1);
      cityMesh.add(city1);
    }
  }



  // for (var i = 0; i < 2; ++i) {
  //   //let's start the chain
  //   var symbol = "A";
  //   var position = vec3.fromValues(i, 0, i);
  //   var rotation = vec3.fromValues(1, 1, 1);
  //   var scale = vec3.fromValues(1, 1, 1);
  //   var material = "carrot";
  //   var x = vec3.fromValues(1, 0, i);
  //   var z = vec3.fromValues(i, 0, 1);
  //   var door = false;
  //   var iter = 2;
  //   //get a set of shapes from the shapeGrammar
  //   city1 = new City(vec3.fromValues(0, 0, 0));
  //   var shapeSet = shapeGram.doIterations(iter, position, rotation, scale, material, x, z, door);
  //   city1 = shapeRen.build(shapeSet, city1);
  //   cityMesh.add(city1);
  // }

  // Initial display for framerate
  const stats = Stats();
  stats.setMode(0);
  stats.domElement.style.position = 'absolute';
  stats.domElement.style.left = '0px';
  stats.domElement.style.top = '0px';
  document.body.appendChild(stats.domElement);

  // Add controls to the gui
  const gui = new DAT.GUI();
  gui.addColor(controls, 'color');
  gui.add(controls, 'shaders', ['lambert']);
  gui.add(controls, 'randomize', 0, 3).step(1);
  gui.add(controls, 'iterations', 0, 5).step(1);
  gui.add(controls, 'Load Scene');

  // get canvas and webgl context
  const canvas = <HTMLCanvasElement>document.getElementById('canvas');
  const gl = <WebGL2RenderingContext>canvas.getContext('webgl2');
  if (!gl) {
    alert('WebGL 2 not supported!');
  }
  // `setGL` is a function imported above which sets the value of `gl` in the `globals.ts` module.
  // Later, we can import `gl` from `globals.ts` to access it
  setGL(gl);

  // Initial call to load scene
  loadScene();

  const camera = new Camera(vec3.fromValues(0, 500, 5), vec3.fromValues(0, 0, 0));

  const renderer = new OpenGLRenderer(canvas);
  renderer.setClearColor(0.3, 0.7, 0.9, 1);
  gl.enable(gl.DEPTH_TEST);

  const base_lambert = new ShaderProgram([
    new Shader(gl.VERTEX_SHADER, require('./shaders/base-lambert-vert.glsl')),
    new Shader(gl.FRAGMENT_SHADER, require('./shaders/base-lambert-frag.glsl')),
  ]);

  const road_lambert = new ShaderProgram([
    new Shader(gl.VERTEX_SHADER, require('./shaders/base-lambert-vert.glsl')),
    new Shader(gl.FRAGMENT_SHADER, require('./shaders/base-lambert-frag.glsl')),
  ]);

  const carrot_lambert = new ShaderProgram([
    new Shader(gl.VERTEX_SHADER, require('./shaders/carrot-lambert-vert.glsl')),
    new Shader(gl.FRAGMENT_SHADER, require('./shaders/carrot-lambert-frag.glsl')),
  ]);

  // This function will be called every frame
  function tick() {
    //u_Time
    // count++;
    // vertex.setTime(count)
    let base_color = vec4.fromValues(50 / 255, 240 / 255, 100 / 255, 1);
    base_lambert.setGeometryColor(base_color);
    let carrot_color = vec4.fromValues(250 / 255, 120 / 255, 0 / 255, 1);
    carrot_lambert.setGeometryColor(carrot_color);
    camera.update();
    stats.begin();

    gl.viewport(0, 0, window.innerWidth, window.innerHeight);
    renderer.clear();

    //renderer.render(camera, carrot_lambert, [carrot]);
    renderer.render(camera, base_lambert, [square]);

    let road_color = vec4.fromValues(100 / 255, 240 / 255, 100 / 255, 1);
    road_lambert.setGeometryColor(road_color);
    renderer.render(camera, road_lambert, [roads]);

    let grass_color = vec4.fromValues(120 / 255, 200 / 255, 20 / 255, 1);
    road_lambert.setGeometryColor(grass_color);
    renderer.render(camera, road_lambert, [grasses]);
    renderer.render(camera, road_lambert, [tops]);

    let flower_color = vec4.fromValues(200 / 255, 200 / 255, 200 / 255, 1);
    road_lambert.setGeometryColor(flower_color);
    renderer.render(camera, road_lambert, [flowers]);

    cityMesh.forEach(function (building: City) {
      renderer.render(camera, carrot_lambert, [building]);
    });
    //renderer.render(camera, base_lambert, [square]);
    //tester cylinder
    //renderer.render(camera, tree_lambert, [flower]);

    stats.end();

    // Tell the browser to call `tick` again whenever it renders a new frame
    requestAnimationFrame(tick);
  }

  window.addEventListener('resize', function () {
    renderer.setSize(window.innerWidth, window.innerHeight);
    camera.setAspectRatio(window.innerWidth / window.innerHeight);
    camera.updateProjectionMatrix();
  }, false);

  renderer.setSize(window.innerWidth, window.innerHeight);
  camera.setAspectRatio(window.innerWidth / window.innerHeight);
  camera.updateProjectionMatrix();

  // Start the render loop
  tick();
}

main();

function translateVertices(positions: Array<number>, pos: vec3) {
  var newPositions = new Array<number>();
  for (var i = 0; i < positions.length; i = i + 4) {
    //input vertex x, y, z
    var xCom = positions[i];
    var yCom = positions[i + 1];
    var zCom = positions[i + 2];

    //console.log("original: " + positions[i], positions[i+1], positions[i+2]);
    //apply rotation in x, y, z direction to the vertex
    var vert = vec3.fromValues(xCom + pos[0], yCom + pos[1], zCom + pos[2]);

    newPositions[i] = vert[0];
    newPositions[i + 1] = vert[1];
    newPositions[i + 2] = vert[2];
    newPositions[i + 3] = 1;
    //console.log("translated Pos: " + newPositions[i], newPositions[i+1], newPositions[i+2]);
  }
  return newPositions;
}

function rotateVertices(x: number, axis: vec3, positions: Array<number>) {

  //only rotate by y axis
  var rotMat = rotationMatrix(axis, x);
  //matrices

  var newPositions = new Array<number>();
  for (var i = 0; i < positions.length; i = i + 4) {
    //input vertex x, y, z
    var xCom = positions[i];
    var yCom = positions[i + 1];
    var zCom = positions[i + 2];

    //console.log("original: " + positions[i], positions[i+1], positions[i+2]);
    //apply rotation in x, y, z direction to the vertex
    var vert = vec3.fromValues(xCom, yCom, zCom);
    vec3.transformMat4(vert, vert, rotMat);

    newPositions[i] = vert[0];
    newPositions[i + 1] = vert[1];
    newPositions[i + 2] = vert[2];
    newPositions[i + 3] = 1;
    //console.log("rotateed Pos: " + newPositions[i], newPositions[i+1], newPositions[i+2]);

  }

  return newPositions;
}

function scaleVertices(positions: Array<number>, scale: vec3) {
  var newPositions = new Array<number>();
  for (var i = 0; i < positions.length; i = i + 4) {
    //input vertex x, y, z
    var xCom = positions[i];
    var yCom = positions[i + 1];
    var zCom = positions[i + 2];

    //console.log("original: " + positions[i], positions[i+1], positions[i+2]);
    //apply rotation in x, y, z direction to the vertex
    var vert = vec3.fromValues(xCom * scale[0], yCom * scale[1], zCom * scale[2]);

    newPositions[i] = vert[0];
    newPositions[i + 1] = vert[1];
    newPositions[i + 2] = vert[2];
    newPositions[i + 3] = 1;
    //console.log("rotateed Pos: " + newPositions[i], newPositions[i+1], newPositions[i+2]);
  }
  return newPositions;
}


function rotationMatrix(axis: vec3, angle: number) {
  axis = vec3.normalize(axis, axis);
  var s = Math.sin(angle);
  var c = Math.cos(angle);
  var oc = 1.0 - c;

  return mat4.fromValues(oc * axis[0] * axis[0] + c, oc * axis[0] * axis[1] - axis[2] * s, oc * axis[2] * axis[0] + axis[1] * s, 0.0,
    oc * axis[0] * axis[1] + axis[2] * s, oc * axis[1] * axis[1] + c, oc * axis[1] * axis[2] - axis[0] * s, 0.0,
    oc * axis[2] * axis[0] - axis[1] * s, oc * axis[1] * axis[2] + axis[0] * s, oc * axis[2] * axis[2] + c, 0.0,
    0.0, 0.0, 0.0, 1.0);
}  