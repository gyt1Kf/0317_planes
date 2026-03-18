/*jshint esversion: 6 */
// @ts-check

/**
 * Minimal Starter Code for the QuadCopter assignment
 */

import * as T from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";


let renderer = new T.WebGLRenderer({ antialias: true, preserveDrawingBuffer: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);
document.body.appendChild(renderer.domElement);
renderer.domElement.id = "canvas";

let scene = new T.Scene();
scene.background = new T.Color("#3d98e2");

let camera = new T.PerspectiveCamera(
    40,
    window.innerWidth / window.innerHeight,
    1,
    1000
);

camera.position.set(20, 10, 20);
camera.lookAt(0, 0, 0);
let controls = new OrbitControls(camera, renderer.domElement);

scene.add(new T.AmbientLight("white", 0.2));

// two lights - both a little off white to give some contrast
let dirLight1 = new T.DirectionalLight(0xf0e0d0, 1.6);
dirLight1.position.set(1, 1, 0);
scene.add(dirLight1);

let dirLight2 = new T.DirectionalLight(0xd0e0f0, 1);
dirLight2.position.set(-1, 1, -0.2);
scene.add(dirLight2);


// make a ground plane
let groundBox = new T.BoxGeometry(10, 1, 10);
let groundMesh = new T.Mesh(
        groundBox,
        new T.MeshStandardMaterial({ color: "green", roughness: 0.9 })
    );
// put the top of the box at the ground level (0)
groundMesh.position.y = -4;
scene.add(groundMesh);

// track
let track = new T.BoxGeometry(9.5, 0.3, 1.5);
let trackMesh = new T.Mesh(
        track,
        new T.MeshStandardMaterial({ color: "black", roughness: 1 })
    );
// add runway
trackMesh.position.z = 2;
trackMesh.position.y = -3.6;
scene.add(trackMesh);

// create the radar station
function createRadar() {
    const radarGroup = new T.Group();

    const baseGeom = new T.CylinderGeometry(0.3, 0.5, 0.8, 16);
    const baseMat = new T.MeshToonMaterial({ color: "#898282" });
    const base = new T.Mesh(baseGeom, baseMat);
    base.castShadow = true;
    radarGroup.add(base);


    const points = [];
    for (let i = 0; i < 10; i++) {
        points.push(new T.Vector2(Math.sin(i * 0.2) * 0.8, i * 0.1));
    }
    const dishGeom = new T.LatheGeometry(points, 7);
    const dishMat = new T.MeshToonMaterial({ 
        color: "#cccccc", 
        side: T.DoubleSide
    });
    const dish = new T.Mesh(dishGeom, dishMat);
    
    dish.rotation.x = -Math.PI / 2;

    const dishPivot = new T.Group();
    dishPivot.position.y = 0.8;
    dishPivot.add(dish);
    
    radarGroup.add(dishPivot);

    const needleGeom = new T.CylinderGeometry(0.02, 0.02, 0.7);
    const needle = new T.Mesh(needleGeom, baseMat);
    needle.position.z = 0.3;
    needle.position.y = 0;
    needle.rotation.x = Math.PI / 2;
    dishPivot.add(needle);

    radarGroup.userData.pivot = dishPivot;

    return radarGroup;
}

// create the control tower
function createTower() {
    const tower = new T.Group();

    const bodyMat = new T.MeshToonMaterial({ color: "#898282" });
    const windowMat = new T.MeshToonMaterial({ color: "#2ca8dd" });

    const bodyGeo = new T.CylinderGeometry(0.4, 0.4, 1.5, 7);
    const bodyGeo2 = new T.CylinderGeometry(0.5, 0.5, 0.5, 7);
    const needleGeo = new T.CylinderGeometry(0.02,0.01, 1, 7);
    const windowGeo = new T.CylinderGeometry(0.51, 0.51, 0.4, 7);

    const body = new T.Mesh(bodyGeo, bodyMat);
    body.position.set(0, 0, 0);
    tower.add(body);

    const body2 = new T.Mesh(bodyGeo2, bodyMat);
    body2.position.set(0, 1, 0);
    tower.add(body2);

    const window = new T.Mesh(windowGeo, windowMat);
    window.position.set(0, 1, 0);
    tower.add(window);

    const needle = new T.Mesh(needleGeo, bodyMat);
    needle.position.set(0, 1.5, 0);
    tower.add(needle);

    return tower;

}


// make an airplane
function createBiplane() {
    const biplane = new T.Group();

    // materials
    const bodyMat = new T.MeshToonMaterial({ color: "#af1111" });
    const bodyMat2 = new T.MeshToonMaterial({ color: "#ffffff" });
    const wingMat = new T.MeshToonMaterial({ color: "#af1111" });
    const glassMat = new T.MeshToonMaterial({ color: "#88ccff" });
    const propMat = new T.MeshToonMaterial({ color: "#4e2809" });
    const propMat2 = new T.MeshToonMaterial({ color: "#ffffff" });

    // body
    const bodyGeom = new T.CylinderGeometry(0.3, 0.2, 1.3, 7);
    const body = new T.Mesh(bodyGeom, bodyMat);
    body.rotation.x = Math.PI / 2; 
    body.position.z -= 0.25;
    body.castShadow = true;
    biplane.add(body);

    const bodyGeom2 = new T.CylinderGeometry(0.24, 0.3, 0.2, 7);
    const body2 = new T.Mesh(bodyGeom2, bodyMat);
    body2.rotation.x = Math.PI / 2; 
    body2.position.z += 0.5;
    body2.castShadow = true;
    biplane.add(body2);

    const bodyGeom3 = new T.SphereGeometry(0.2, 7, 7);
    const body3 = new T.Mesh(bodyGeom3, bodyMat);
    body3.rotation.x = Math.PI / 2; 
    body3.position.z -= 0.9;
    body3.castShadow = true;
    biplane.add(body3);

    const bodyGeom4 = new T.CylinderGeometry(0.242, 0.22, 0.3, 7);
    const body4 = new T.Mesh(bodyGeom4, bodyMat2);
    body4.rotation.x = Math.PI / 2; 
    body4.position.z -= 0.5;
    body4.castShadow = true;
    biplane.add(body4);


    // wings
    const wingGeom = new T.BoxGeometry(2, 0.05, 0.4);
  
    const bottomWing = new T.Mesh(wingGeom, wingMat);
    bottomWing.position.y = 0;
    bottomWing.castShadow = true;
    biplane.add(bottomWing);

    const topWing = new T.Mesh(wingGeom, wingMat);
    topWing.position.y = 0.45;
    topWing.castShadow = true;
    biplane.add(topWing);

    const endWingGeom = new T.BoxGeometry(0.9, 0.05, 0.3);
    const endWing = new T.Mesh(endWingGeom, wingMat);
    endWing.position.z -= 0.9;
    endWing.castShadow = true;
    biplane.add(endWing);


    const wing2Geom = new T.CylinderGeometry(0.2, 0.2, 0.05, 7);
    const wing2 = new T.Mesh(wing2Geom, bodyMat2);
    wing2.rotation.x = Math.PI / 2;
    wing2.rotation.z = Math.PI / 2;

    wing2.position.z -= 1.1;
    wing2.position.y += 0.2;
    wing2.castShadow = true;
    biplane.add(wing2);

    // pillar
    const strutGeom = new T.BoxGeometry(0.02, 0.45, 0.02);
    [-0.8, 0.8].forEach(x => {
        const strut = new T.Mesh(strutGeom, propMat);
        strut.position.set(x, 0.22, 0);
        biplane.add(strut);
    });

    // window
    const cockpitGeom = new T.BoxGeometry(0.23, 0.18, 0.02);
    const cockpit = new T.Mesh(cockpitGeom, glassMat);
    cockpit.position.set(0, 0.25, 0.1);
    //cockpit.rotation.x = -Math.PI / 4;
    biplane.add(cockpit);

    // propeller
    const propGroup1 = new T.Group();
    const propGeom = new T.BoxGeometry(0.8, 0.05, 0.02);
    const propeller = new T.Mesh(propGeom, propMat);
    const propeller2 = new T.Mesh(propGeom, propMat);
    propeller2.rotation.z = Math.PI / 2;
    propGroup1.add(propeller);
    propGroup1.add(propeller2);
  
    propGroup1.position.set(0, 0, 0.61);
    biplane.add(propGroup1);

    const propGroup2 = new T.Group();
    const propGeom2 = new T.BoxGeometry(0.8, 0.05, 0.02);
    const propeller3 = new T.Mesh(propGeom2, propMat2);
    const propeller4 = new T.Mesh(propGeom2, propMat2);
    propeller4.rotation.z = Math.PI / 2;
    propGroup2.add(propeller3);
    propGroup2.add(propeller4);
  
    propGroup2.position.set(0, 0, 0.63);
    

    biplane.userData.propeller1 = propGroup1;
    

    return biplane;
}

// create a water plane
function createWaterPlane() {
    const biplane = new T.Group();

    // materials
    const bodyMat = new T.MeshToonMaterial({ color: "#ffffff" });
    const bodyMat2 = new T.MeshToonMaterial({ color: "#2080c0" });
    const wingMat = new T.MeshToonMaterial({ color: "#ffffff" });
    const glassMat = new T.MeshToonMaterial({ color: "#88ccff" });
    const propMat = new T.MeshToonMaterial({ color: "#000000" });

    // body
    const bodyGeom = new T.CylinderGeometry(0.3, 0.2, 1.3, 7);
    const body = new T.Mesh(bodyGeom, bodyMat);
    body.rotation.x = Math.PI / 2; 
    body.position.z -= 0.25;
    body.castShadow = true;
    biplane.add(body);

    const bodyGeom2 = new T.CylinderGeometry(0.15, 0.3, 0.6, 7);
    const body2 = new T.Mesh(bodyGeom2, bodyMat);
    body2.rotation.x = Math.PI / 2; 
    body2.position.z += 0.7;
    body2.castShadow = true;
    biplane.add(body2);

    const bodyGeom3 = new T.SphereGeometry(0.2, 7, 7);
    const body3 = new T.Mesh(bodyGeom3, bodyMat);
    body3.rotation.x = Math.PI / 2; 
    body3.position.z -= 0.9;
    body3.castShadow = true;
    biplane.add(body3);

    const bodyGeom4 = new T.CylinderGeometry(0.242, 0.22, 0.3, 7);
    const body4 = new T.Mesh(bodyGeom4, bodyMat2);
    body4.rotation.x = Math.PI / 2; 
    body4.position.z -= 0.5;
    body4.castShadow = true;
    biplane.add(body4);

    // engines
    const engineGeo = new T.CylinderGeometry(0.2, 0.2, 0.4, 7);
    const engine1 = new T.Mesh(engineGeo, bodyMat);
    engine1.position.set(0.7, 0, 0.3);
    engine1.rotation.x = Math.PI/2;
    engine1.castShadow = true;
    biplane.add(engine1);

    const engine2 = new T.Mesh(engineGeo, bodyMat);
    engine2.position.set(-0.7, 0, 0.3);
    engine2.rotation.x = Math.PI/2;
    engine2.castShadow = true;
    biplane.add(engine2);


    // wings
    const wingGeom = new T.BoxGeometry(3, 0.05, 0.4);
  
    const bottomWing = new T.Mesh(wingGeom, wingMat);
    bottomWing.position.y += 0.1;
    bottomWing.position.z += 0.2;
    bottomWing.castShadow = true;
    biplane.add(bottomWing);

    const endWingGeom = new T.BoxGeometry(0.9, 0.05, 0.3);
    const endWing = new T.Mesh(endWingGeom, wingMat);
    endWing.position.z -= 0.9;
    endWing.position.y += 0.1;
    endWing.castShadow = true;
    biplane.add(endWing);


    const wing2Geom = new T.CylinderGeometry(0.2, 0.2, 0.05, 7);
    const wing2 = new T.Mesh(wing2Geom, bodyMat2);
    wing2.rotation.x = Math.PI / 2;
    wing2.rotation.z = Math.PI / 2;

    wing2.position.z -= 1.1;
    wing2.position.y += 0.2;
    wing2.castShadow = true;
    biplane.add(wing2);


    // window
    const cockpitGeom = new T.BoxGeometry(0.23, 0.18, 0.02);
    const cockpit = new T.Mesh(cockpitGeom, glassMat);
    cockpit.position.set(0, 0.25, 0.5);
    cockpit.rotation.x = -Math.PI / 2.5;
    biplane.add(cockpit);

    // propeller x2
    const propGroup1 = new T.Group();
    const propGeom = new T.BoxGeometry(0.6, 0.05, 0.02);
    const propeller = new T.Mesh(propGeom, propMat);
    const propeller2 = new T.Mesh(propGeom, propMat);
    propeller2.rotation.z = Math.PI / 2;
    propGroup1.add(propeller);
    propGroup1.add(propeller2);
    propGroup1.position.set(0.7, 0, 0.5);
    biplane.add(propGroup1);
    biplane.userData.propeller1 = propGroup1;

    const propGroup2 = new T.Group();
    const propeller3 = new T.Mesh(propGeom, propMat);
    const propeller4 = new T.Mesh(propGeom, propMat);
    propeller4.rotation.z = Math.PI / 2;
    propGroup2.add(propeller3);
    propGroup2.add(propeller4);
    propGroup2.position.set(-0.7, 0, 0.5);
    biplane.add(propGroup2);
    biplane.userData.propeller2 = propGroup2;

    return biplane;
}

// add planes
let plane1 = createBiplane();
plane1.position.set(0, 2, 4);
plane1.castShadow = true;
scene.add(plane1);

let plane2 = createWaterPlane();
plane2.position.set(0, 0, 0);
plane2.castShadow = true;
scene.add(plane2);

// add ground control center
let radar = createRadar();
radar.position.set(-3, 0, 0);
radar.position.z = -0.5;
radar.position.y = -3.2;
radar.castShadow = true;
scene.add(radar);

let tower = createTower();
tower.position.set(-2, -3, -2);
tower.castShadow = true;
scene.add(tower);

// animation loop
function animateLoop(timestamp) {
    //** EXAMPLE CODE - STUDENT SHOULD REPLACE */
    // move in a circle
    let theta = timestamp / 1000;
    let y= 2.5 * Math.cos(theta);
    let z = 2.5 * Math.sin(theta);
    plane1.position.y = y;
    plane1.position.z = z;

    let ty = -Math.sin(theta);
    let tz = Math.cos(theta);
        
    let upVec = new T.Vector3(0, -y, -z).normalize();
    plane1.up.copy(upVec);
    plane1.lookAt(0, y + ty, z + tz);

    let swing = Math.sin(timestamp * 0.05) * 0.04;
    plane1.rotateZ(swing);

    // plane2
    let x1 = 5 * Math.cos(theta);
    let z1 = 5 * Math.sin(theta);
    plane2.position.x = x1;
    plane2.position.z = z1;

    let tx1 = -Math.sin(theta);
    let tz1 = Math.cos(theta);

    plane2.lookAt(x1 + tx1, 0, z1 + tz1);

    // propeller motion
    plane1.userData.propeller1.rotation.z += 0.5;
    
    plane2.userData.propeller1.rotation.z += 0.5;
    plane2.userData.propeller2.rotation.z += 0.5;

    // radar motion
    radar.userData.pivot.lookAt(plane2.position);
    radar.userData.pivot.rotateX(Math.PI);

    renderer.render(scene, camera);
    window.requestAnimationFrame(animateLoop);
  }
window.requestAnimationFrame(animateLoop);
