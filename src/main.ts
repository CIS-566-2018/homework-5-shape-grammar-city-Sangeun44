import {vec3, vec4} from 'gl-matrix';
import * as Stats from 'stats-js';
import * as DAT from 'dat-gui';

import Square from './geometry/Square';
import City from './geometry/City';

import OpenGLRenderer from './rendering/gl/OpenGLRenderer';
import Camera from './Camera';
import {setGL} from './globals';
import ShaderProgram, {Shader} from './rendering/gl/ShaderProgram';

//shapeGrammar
import ShapeGrammar from './ShapeGrammar';
import ShapeRenderer from './ShapeRenderer';
import Shape from './Shape';
import Carrot from './geometry/Carrot';

// Define an object with application parameters and button callbacks
// This will be referred to by dat.GUI's functions that add GUI elements.
const controls = {
  shaders: 'lambert',
  shape: 'coral',
  color: [255, 0, 105, 1.0], // CSS string
  iterations: 4,
  randomize: 2,
  'Load Scene': loadScene // A function pointer, essentially
};

//shapes
let square: Square;
let city1: City;
let city2: City;

let carrot: Carrot;

//Shape Set maker 
let shapeRen : ShapeRenderer;
let shapeGram : ShapeGrammar;

let iteration: number;
let axiom: string;
let height: number;

//time
let count: number = 0.0;

//grammar city
function loadScene() {
  square = new Square(vec3.fromValues(0,0,0));
  square.create();
  // city1.create();
  // city2.create();
  city1.create();
}

function main() {
  //Shapes
  shapeGram = new ShapeGrammar();
  shapeRen = new ShapeRenderer();

  //let's start the chain
  var symbol = "A";
  var position = vec3.fromValues(0,3,0);
  var rotation = vec3.fromValues(0,0,0);
  var scale = vec3.fromValues(0, 0, 0);
  var material = "carrot";
  var x = vec3.fromValues(1, 0, 0);
  var z = vec3.fromValues(0, 0, 1);
  var door = false;
  var iter = 2;
  var oneShape = new Shape(symbol, position, rotation, 
    scale, material, x, z, door);
  
  //get a set of shapes from the shapeGrammar
  var shapeSet = shapeGram.doIterations(iter, position, rotation, scale, material, x, z, door);
  var city1 = shapeRen.build(shapeSet, city1);

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
  gui.add(controls, 'shape', ['coral']);
  gui.add(controls, 'Load Scene');

  // get canvas and webgl context
  const canvas = <HTMLCanvasElement> document.getElementById('canvas');
  const gl = <WebGL2RenderingContext> canvas.getContext('webgl2');
  if (!gl) {
    alert('WebGL 2 not supported!');
  }
  // `setGL` is a function imported above which sets the value of `gl` in the `globals.ts` module.
  // Later, we can import `gl` from `globals.ts` to access it
  setGL(gl);

  // Initial call to load scene
  loadScene();
  
  const camera = new Camera(vec3.fromValues(0, 0, 5), vec3.fromValues(0, 0, 0));

  const renderer = new OpenGLRenderer(canvas);
  renderer.setClearColor(0.3, 0.7, 0.9, 1);
  gl.enable(gl.DEPTH_TEST);


  const base_lambert = new ShaderProgram([
    new Shader(gl.VERTEX_SHADER, require('./shaders/base-lambert-vert.glsl')),
    new Shader(gl.FRAGMENT_SHADER, require('./shaders/base-lambert-frag.glsl')),
  ]);

  const carrot_lambert = new ShaderProgram([
    new Shader(gl.VERTEX_SHADER, require('./shaders/carrot-lambert-vert.glsl')),
    new Shader(gl.FRAGMENT_SHADER, require('./shaders/carrot-lambert-frag.glsl')),
  ]);

  // This function will be called every frame
  function tick() {
    
    //U_time
    // count++;
    // vertex.setTime(count)
    
    let carrot_color = vec4.fromValues(250/255, 120/255, 0/255, 1);
      carrot_lambert.setGeometryColor(carrot_color);
      camera.update();
      stats.begin();

      gl.viewport(0, 0, window.innerWidth, window.innerHeight);
      renderer.clear();

      renderer.render(camera, carrot_lambert, [carrot]);
      renderer.render(camera, carrot_lambert, [city1]);
      //renderer.render(camera, base_lambert, [square]);
      //tester cylinder
      //renderer.render(camera, tree_lambert, [flower]);

    stats.end();

    // Tell the browser to call `tick` again whenever it renders a new frame
    requestAnimationFrame(tick);
  }

  window.addEventListener('resize', function() {
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

// function doRenderer(it: number, pos: vec3, rot: vec3, scale: vec3, 
//   mat: string, xaxis : vec3, zaxis: vec3, door: boolean) {
//   var shapeSet = shapeGram.doIterations(it, pos, rot, scale, mat, xaxis, zaxis, door);
//   shapeRen.renderSymbols(shapeSet, citySet);
// }