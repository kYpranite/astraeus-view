var scene = new THREE.Scene();

var camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth/window.innerHeight,
    0.1,
    1000
)
camera.position.z = 10;

var renderer = new THREE.WebGLRenderer({antialias: true});
renderer.setClearColor("#000000");
renderer.setSize(window.innerWidth, window.innerHeight);
const textureLoader = new THREE.TextureLoader();

document.body.appendChild(renderer.domElement);

window.addEventListener('resize', ()=> {
    renderer.setSize(window.innerWidth, window.innerHeight);
    camera.aspect = window.innerWidth / window.innerHeight

    camera.updateProjectionMatrix();
})

const marsBaseColor = textureLoader.load("./maps/2k_mars.jpg");

var planet = new THREE.Mesh(new THREE.SphereGeometry(0.2, 50, 50), new THREE.MeshStandardMaterial(
    {
        map: marsBaseColor
    }
));
planet.position.x = -7
scene.add(planet);


const sunBaseColor = textureLoader.load('./maps/2k_sun.jpg');
var star = new THREE.Mesh(new THREE.SphereGeometry(3, 50, 50), new THREE.MeshStandardMaterial(
    {
        map: sunBaseColor,
        emissive: 0x00FFFF,
        emissiveIntensity: 1
    }
));

scene.add(star);

var light = new THREE.PointLight(0xFFFFFF, 4, 500)
light.position.set(0, 0, 10)
scene.add(light)

var render = function() {
    requestAnimationFrame(render);
    star.rotation.y += 0.01;
    planet.rotation.y += 0.01
    renderer.render(scene, camera);

    date = Date.now() * 0.0005;
    orbitRadius = 6
    planet.position.set(
    -Math.cos(date) * orbitRadius,
    0,
    Math.sin(date) * orbitRadius
    );
}
render();

function normalize(array)
{
    let low = array[0]
    let multiple = (2 * Math.PI) / (array[array.length - 1] - array[0])
    for(let i = 0; i < array.length; i++)
    {
        array[i] -= low
        array[i] *= multiple
        print(array[i]);
    }

}