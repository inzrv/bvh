import { Point } from "./point.js";
import { MTriangle } from "./m_triangle.js";
import { Camera } from "./camera.js";
import { AABBTree } from "./aabb_tree.js";
import { VisTree } from "./vis_tree.js";
import { pointInAABB, pointInOBB, pointInTriangle, triangleAABBIntersection } from "./collision.js";
import { Triangle } from "./triangle.js";
import { AABB } from "./aabb.js";
import { minOBB, OBB, OBBForOBBs, OBBForTriangle } from "./obb.js";
import { compareOBBNodes, OBBTree } from "./obb_tree.js";
import { Node, visibleNodesNumber } from "./tree.js";

const sceneCanvas = document.getElementById('scene');
const sceneContext = sceneCanvas.getContext('2d'); 
const sceneFillColor = 'white';

const treeCanvas = document.getElementById('tree');
const treeContext = treeCanvas.getContext('2d'); 
const treeFillColor = 'white';


// Отслеживание нажатия и отпускания клавиш
const keys = {
    right: {
        pressed: false
    },
    left: {
        pressed: false
    },
    up: {
        pressed: false
    },
    down: {
        pressed: false
    }
 }


let mesh = [];
mesh.push(new MTriangle([new Point(510, 110), new Point(570, 120), new Point(600, 150)]));
mesh.push(new MTriangle([new Point(700, 130), new Point(720, 150), new Point(710, 170)]));
mesh.push(new MTriangle([new Point(540, 160), new Point(555, 165), new Point(548, 170)]));
mesh.push(new MTriangle([new Point(800, 120), new Point(830, 130), new Point(845, 170)]));
mesh.push(new MTriangle([new Point(800, 380), new Point(830, 380), new Point(845, 395)]));
mesh.push(new MTriangle([new Point(860, 395), new Point(890, 370), new Point(870, 350)]));

mesh.forEach(meshTriangle => {
    meshTriangle.draw(sceneContext);
});

document.getElementById("polyNumber").innerHTML = mesh.length;

let T = new OBBTree();
T.buildUp(mesh);

document.getElementById("treeHeight").innerHTML = T.root.level + 1;



const VT = new VisTree(T, 2);
VT.draw(treeContext, treeCanvas.clientWidth, treeCanvas.clientHeight);

let camera = new Camera(0.9, 100);

let h = 0;


function process() {
    requestAnimationFrame(process);
    sceneContext.fillStyle = sceneFillColor;
    sceneContext.fillRect(0, 0, sceneCanvas.width, sceneCanvas.height);

    T.update(camera);
    T.draw(sceneContext);

    document.getElementById("visNodesNumber").innerHTML = visibleNodesNumber(T);
    //console.log(visibleNodesNumber(T));

    mesh.forEach(meshTriangle => {
        meshTriangle.draw(sceneContext);
    });
   
    VT.draw(treeContext, treeCanvas.clientWidth, treeCanvas.clientHeight);

    camera.draw(sceneContext);
    camera.update();

    if (keys.left.pressed) {
       camera.velocity.x = -camera.speed;
    }
    else {
        if (keys.right.pressed) {
            camera.velocity.x = camera.speed;
        }
        else {
            camera.velocity.x = 0;
        }
    }

    if (keys.down.pressed) {
        camera.velocity.y = camera.speed;
    }
    else {
        if (keys.up.pressed) {
            camera.velocity.y = -camera.speed;
        }
        else{
            camera.velocity.y = 0;
        }
    }
}   

process();


 window.addEventListener('keyup', ({key}) => { // Обработка отпускания клавиши
    switch(key) {
       case 'd':
            keys.right.pressed = false; 
            break;
        case 'a':
            keys.left.pressed = false;
            break;
        case 's':
            keys.down.pressed = false;
            break;
        case 'w':
            keys.up.pressed = false;
            break;
    }
 });

 window.addEventListener('keydown', ({key}) => { // Обработка нажатия клавиши
    switch(key) {
        case 'a':
            keys.left.pressed = true;
            break;
       case 'd':
            keys.right.pressed = true;
            break;
       case 'w':
            keys.up.pressed = true;
            break;
       case 's':
            keys.down.pressed = true;
            break;
    }
});

window.addEventListener('mousemove', function(e) { // отслеживание поворота камеры
    let delta_y = e.clientY - sceneCanvas.offsetTop - camera.pyramid.vertices[0].x;
    let delta_x = e.clientX - sceneCanvas.offsetLeft - camera.pyramid.vertices[0].y;
    let theta = - Math.atan(delta_y / delta_x);
    if (delta_y >= 0 && delta_x <= 0) {
            theta -= Math.PI;
    }
    if (delta_y < 0 && delta_x < 0) {
        theta += Math.PI;
    }
    camera.rotate(theta - camera.angle);
});



