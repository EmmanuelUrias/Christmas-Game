import './style.css'

import * as THREE from 'three';
import { Scene } from 'three';

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
            Math.floor(Math.random() * maxRange + minRange), //y 250 to 750
            Math.floor(Math.random() * maxRange - minRange)), //x -500 to 500
        
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
