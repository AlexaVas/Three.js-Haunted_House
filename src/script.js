import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'lil-gui'
import gsap from 'gsap'

THREE.ColorManagement.enabled = false

/**
 * Base
 */
// Debug
const gui = new dat.GUI()

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

/**
 * Textures
 */
const loadingManager = new THREE.LoadingManager()
loadingManager.onError = (e) => {
    console.log('error', e);
};

const textureLoader = new THREE.TextureLoader(loadingManager);

const doorColor = textureLoader.load('/textures/door/color.jpg')
const doorAmbientOcclusion = textureLoader.load("/textures/door/ambientOcclusion.jpg");
const doorAplha = textureLoader.load("/textures/door/alpha.jpg");
const doorHeight = textureLoader.load("/textures/door/height.jpg");
const doorMetalness = textureLoader.load("/textures/door/metalness.jpg");
const doorRoughness = textureLoader.load("/textures/door/roughness.jpg");
const doorNormal = textureLoader.load("/textures/door/normal.jpg");

const wallColor = textureLoader.load('/textures/bricks/color.jpg');
const wallAmbientOc = textureLoader.load("/textures/bricks/ambientOcclusion.jpg");
const wallNormal= textureLoader.load("/textures/bricks/normal.jpg");
const wallRoughness = textureLoader.load("/textures/bricks/roughness.jpg");

const grassAmbientOc = textureLoader.load("/textures/grass/ambientOcclusion.jpg");
const grassColor = textureLoader.load("/textures/grass/color.jpg");
const grassNormal = textureLoader.load("/textures/grass/normal.jpg");
const grassRoughness = textureLoader.load("/textures/grass/roughness.jpg");


grassAmbientOc.repeat.set(7,7);
grassColor.repeat.set(7,7);
grassNormal.repeat.set(7,7);
grassRoughness.repeat.set(7,7);

grassAmbientOc.wrapS = THREE.RepeatWrapping;
grassColor.wrapS = THREE.RepeatWrapping;
grassNormal.wrapS = THREE.RepeatWrapping;
grassRoughness.wrapS = THREE.RepeatWrapping;

grassColor.wrapT = THREE.RepeatWrapping;
grassAmbientOc.wrapT = THREE.RepeatWrapping;

grassNormal.wrapT = THREE.RepeatWrapping;

grassRoughness.wrapT = THREE.RepeatWrapping;

/**
 * House
 */

//Group
const house = new THREE.Group();
scene.add(house);

//Walls
const walls = new THREE.Mesh(
    new THREE.BoxGeometry(4,2.5,4),
    new THREE.MeshStandardMaterial({
aoMap: wallAmbientOc,
map: wallColor,
normalMap: wallNormal,
roughnessMap: wallRoughness,
})
)



walls.position.y = 2.5 * 0.5;
house.add(walls);


//Roof

const roof = new THREE.Mesh(
    new THREE.ConeGeometry(3.5,1,4),
    new THREE.MeshStandardMaterial({color: '#b35f45'})
)

roof.position.y = 2.5 + 0.5;  
roof.rotation.y = Math.PI * 0.25

house.add(roof);

//Door

const door = new THREE.Mesh(
    new THREE.PlaneGeometry(2.2,2.2,100,100),
    new THREE.MeshStandardMaterial({
color: 'white',
 map: doorColor,
alphaMap: doorAplha,
transparent: true,
aoMap:doorAmbientOcclusion,
displacementMap: doorHeight,
displacementScale:0.2,
normalMap: doorNormal,
roughnessMap: doorRoughness,
metalnessMap: doorMetalness
})
);






door.position.y = 2 * 0.5;
door.position.z = 2 + 0.001

house.add(door);

//Bushes

const bushGeometry = new THREE.SphereGeometry(1,16,16) ;
const bushMaterial =new THREE.MeshStandardMaterial({color:'#89c854'});
   
const bush = new THREE.Mesh(bushGeometry, bushMaterial);


bush.position.set(1, 0.5 * 0.3,2.2 )
bush.scale.set(0.5, 0.5, 0.5);

const bush1 = new THREE.Mesh(
bushGeometry,
bushMaterial 
);

bush1.position.set(1.6, 0.25 * 0.3, 2.1);
bush1.scale.set(0.25, 0.25, 0.25);

const bush2 = new THREE.Mesh(
bushGeometry,
bushMaterial 
);

bush2.scale.set(0.4, 0.4, 0.4);
bush2.position.set(-0.8, 0.4 * 0.3, 2.2);


const bush3 = new THREE.Mesh(
    bushGeometry,
    bushMaterial);

bush3.scale.set(0.15, 0.15, 0.15);
bush3.position.set(-1, 0.15 * 0.3, 2.6);


house.add(bush, bush1, bush2, bush3);

// Floor
const floor = new THREE.Mesh(
    new THREE.PlaneGeometry(20, 20),
    new THREE.MeshStandardMaterial({ color: '#a9c388',
map: grassColor,
aoMap: grassAmbientOc,
normalMap: grassNormal,
roughnessMap: grassRoughness })
)
floor.rotation.x = - Math.PI * 0.5
floor.position.y = 0

floor.material.metalness = 0;
floor.material.roughness = 1;


scene.add(floor)


//Graves


const graves = new THREE.Group();

scene.add(graves);

const graveGeometry = new THREE.BoxGeometry(0.6, 0.8, 0.2);
const graveMaterial = new THREE.MeshStandardMaterial({ color: "#b2b6b1" });

for (let i = 0; i < 50; i++) {
  const grave = new THREE.Mesh(graveGeometry, graveMaterial);
  //get a random number in 360 degrees angle
  const angle = (Math.random() * Math.PI)*2;
  
  //
  grave.position.x = Math.cos(angle) * (Math.random() * 6 + 3);
  //after '*' goes the formula to get a distance
  grave.position.z = Math.sin(angle) * (Math.random() * 6 + 3);
  grave.position.y = 0.8 * 0.4;

  grave.rotation.y = (Math.random() - 0.5) * 0.5;
  grave.rotation.z = (Math.random() - 0.5) * 0.3;
  grave.rotation.x = (Math.random() - 0.5) * 0.2;

  grave.castShadow = true;
  graves.add(grave);
}
 


 
/**
 * Lights
 */
// Ambient light
const ambientLight = new THREE.AmbientLight('#ffffff', 0.15)
//gui.add(ambientLight, 'intensity').min(0).max(1).step(0.001)
//scene.add(ambientLight)

// Directional light
const moonLight = new THREE.DirectionalLight('lightblue', 0.35)
moonLight.position.set(4, 5, - 2)
gui.add(moonLight, 'intensity').min(0).max(1).step(0.001).name('moon-light-intensity')
//gui.add(moonLight.position, 'x').min(- 5).max(5).step(0.001)
//gui.add(moonLight.position, 'y').min(- 5).max(5).step(0.001)
//gui.add(moonLight.position, 'z').min(- 5).max(5).step(0.001)



scene.add(moonLight) 

//Door Light

const doorLight = new THREE.PointLight('orange',1.5,7);

doorLight.position.set(0,2.3,2.5)
doorLight.scale.set(0.5,0.5,0.5);


house.add(doorLight);

const doorLightHelper = new THREE.PointLightHelper(doorLight);

//house.add(doorLightHelper);

gui
.add(doorLight, 'intensity')
.min(0)
.max(3)
.step(0.1)
.name('door-light');
//Fog

const fog = new THREE.Fog("#262837", 5, 15);

scene.fog = fog;

//Ghosts

const ghost1 = new THREE.PointLight('pink',1,3);
const ghost2 = new THREE.PointLight('white', 1, 3);
const ghost3 = new THREE.PointLight('lightblue', 1, 3);

ghost1.scale.set(0.5,0.5,0.5);
ghost2.scale.set(0.5, 0.5, 0.5);
ghost3.scale.set(0.5, 0.5, 0.5);


//const ghostHelper = new THREE.PointLightHelper(ghost2);
scene.add(ghost1,ghost2, ghost3);



//

//Shadows
floor.receiveShadow = true;
moonLight.castShadow = true;
doorLight.castShadow = true;
walls.castShadow = true;
bush.castShadow = true;
bush1.castShadow = true;
bush2.castShadow = true;
bush3.castShadow = true;
ghost1.castShadow = true;
ghost2.castShadow = true;
ghost3.castShadow = true;
 

doorLight.shadow.mapSize.width = 256;
doorLight.shadow.mapSize.height = 256;
doorLight.shadow.camera.far = 7;

ghost1.shadow.mapSize.width = 256;
ghost1.shadow.mapSize.height = 256;
ghost1.shadow.camera.far = 7;

ghost2.shadow.mapSize.width = 256;
ghost2.shadow.mapSize.height = 256;
ghost2.shadow.camera.far = 7;

ghost3.shadow.mapSize.width = 256;
ghost3.shadow.mapSize.height = 256;
ghost3.shadow.camera.far = 7;

moonLight.shadow.mapSize.width = 256;
moonLight.shadow.mapSize.height = 256;
moonLight.shadow.camera.far = 7;

//
/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () =>
{
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.x = 6
camera.position.y = 6
camera.position.z = 11
scene.add(camera)
//Animate

gsap.to(camera.position, {duration:3.5,x:3,y:3,z:5, ease: 'linear'});

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.outputColorSpace = THREE.LinearSRGBColorSpace
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
renderer.setClearColor("#262837");
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
/**
 * Animate
 */
const clock = new THREE.Clock()

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()

    //Animate Ghost

      
    ghost1.position.x = Math.cos(elapsedTime * 0.2)*4;
    ghost1.position.z = Math.sin(elapsedTime * 0.2)*4;
    ghost1.position.y = Math.sin(elapsedTime* 0.2);

    ghost2.position.x =
      Math.cos(-elapsedTime * 0.4) * (6 + Math.sin(elapsedTime * 0.2));
    ghost2.position.z =
      Math.sin(-elapsedTime * 0.4) * (6 + Math.cos(elapsedTime * 0.2));
    ghost2.position.y = Math.sin(elapsedTime * 0.3);

    ghost3.position.x = Math.cos(elapsedTime * 0.1)  *(7+ Math.sin(elapsedTime*0.2));
    ghost3.position.z = Math.sin(elapsedTime * 0.1)  * (7 + Math.cos(elapsedTime*0.2));
    ghost3.position.y = Math.sin(elapsedTime * 0.3);
    //
    // Update controls
    controls.update()
    // Render
    renderer.render(scene, camera);
    

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()