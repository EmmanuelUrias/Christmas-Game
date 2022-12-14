import './style.css'

import * as THREE from 'three';

import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera( 95, window.innerWidth / window.innerHeight, 0.1, 1000);

const renderer = new THREE.WebGL1Renderer({
    canvas: document.querySelector('#bg'),
});

renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
camera.position.setZ(50);

renderer.render( scene, camera )

//tree trunk
const treeGeometry = new THREE.CylinderGeometry( 3, 3, 30, 20 );
const material = new THREE.MeshStandardMaterial( {color: '#5C4033'} );
const cylinder = new THREE.Mesh( treeGeometry, material );
scene.add( cylinder );

//lighting
const pointLight = new THREE.PointLight(0xffffff)
pointLight.position.set(0,12,8)
scene.add(pointLight)

//lighting helper
const lightHelper = new THREE.PointLightHelper(pointLight)
scene.add(lightHelper)

//grid helper
const gridHelper = new THREE.GridHelper(200, 50);
scene.add(gridHelper)

//snow
let particles; //snowflakes
let positions = [], velocities = []; //snowflake positions(x, y, z) and velocities(x, y, z)

const numSnowFlakes = 1500;//amount of snowflakes

const maxRange = 1000, minRange = maxRange/2;//snowflakes placed from -500 to 500 x & z axis
const minHeight = 150;//snowflakes on 150 to 500 on y axis

const snowFlakeGeometry = new THREE.BufferGeometry();

const textureLoader = new THREE.TextureLoader();

addSnowflakes();
function addSnowflakes() {
    //create snowflake geometry
    for(let i=0 ; i < numSnowFlakes; i++) {
        positions.push(
            Math.floor(Math.random() * maxRange - minRange), //x -500 to 500
            Math.floor(Math.random() * maxRange + 0), //y 250 to 750
            Math.floor(Math.random() * maxRange - 400)), //x -500 to 500
        
        velocities.push(
            Math.floor(Math.random() * 6 - 3) * 0.1,// x -500 to 500
            Math.floor(Math.random() * 5 + 0.12) * 0.18,// y 250 to 750
            Math.floor(Math.random() * 6 - 3) * 0.1);// z -500 to 500 
    }
}

//each attribute has an array of values

snowFlakeGeometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3))
snowFlakeGeometry.setAttribute('velocity', new THREE.Float32BufferAttribute(positions, 3))

const flakeMaterial = new THREE.PointsMaterial({
    size: 4,
    map: textureLoader.load('/images/snowflake.png'),
    blending: THREE.AdditiveBlending, // add rgb values when combining 2 colors
    depthTest: false, // determines if one object is in front of another
    transparent: true, // enables opacity changes to work
    opacity: 0.7,
});

particles = new THREE.Points(snowFlakeGeometry, flakeMaterial);
scene.add(particles)

//snowflakes velocity
function updateParticles() {
    for(let i = 0; i < numSnowFlakes * 3; i += 3) { //each snowflake has a x, y, z position
        // add velocity to position of each snowflake
        // change x position by x velocity
        particles.snowFlakeGeometry.attributes.position.array[i] -= particles.snowFlakeGeometry.attributes.velocities.array[i];
        // change y position by y velocity
        particles.snowFlakeGeometry.attributes.position.array[i + 1] -= particles.snowFlakeGeometry.attributes.velocities.array[i + 1];
        //change z position by z velocity
        particles.snowFlakeGeometry.attributes.position.array[i + 2] -= particles.snowFlakeGeometry.attributes.velocities.array[i + 2];

        //check to see if below ground; if so, move to new starting x, y, z position
        if (particles.snowFlakeGeometry.attributes.position.array[i + 1] < 0) {
            particles.snowFlakeGeometry.attributes.position.array[i] = Math.floor(Math.random() * maxRange - minRange); // X
            particles.snowFlakeGeometry.attributes.position.array[i + 1] = Math.floor(Math.random() * maxRange + minRange); // Y
            particles.snowFlakeGeometry.attributes.position.array[i + 2] = Math.floor(Math.random() * maxRange - minRange); // Z
        }
    }
    //attribute changed, needs to be resent to GPU to update position array of particles
    particles.snowFlakeGeometry.attributes.position.needsUpdate = true;
}

//moon
const moonGeometry = new THREE.DodecahedronGeometry()

//controls
const controls = new OrbitControls(camera, renderer.domElement);


//animate
function animate() {
    requestAnimationFrame( animate );
    //cylinder rotate
    cylinder.rotation.x += 0.01;
    cylinder.rotation.y += 0.005;
    cylinder.rotation.z += 0.01;

    controls.update();

    //updateParticles(); // update position of snowflakes

    renderer.render( scene, camera)


}
animate()