var cepheid = false
var binary = false
const coolbutton = $(".cool-button");
var slider = document.getElementById("myRange");

coolbutton.click(function(){
    console.log("HI");
})


// Update the current slider value (each time you drag the slider handle)
slider.oninput = function() {
  console.log(this.value);
}


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
    Math.cos(Math.PI/2) * orbitRadius,
    0,
    Math.sin(Math.PI/2) * orbitRadius
    );
}
render();

var time1;
var flux1
fetch('./assets/sample-stars/KIC 8462852.json').then((response) => response.json())
.then((json) => 
    {
        
        time1 = json.time
        flux1 = json.flux

        setupEclipseBinary(time1, flux1)
        setupCepheid(time1, flux1)
        
        console.log(combine(time1, flux1))
        const data = {
            datasets: [{
                label: 'Light Curve',
                data: combine(time1, flux1),
                backgroundColor: 'rgb(255, 99, 132)'
            }],
            };
        const ctx1 = document.getElementById('myChart').getContext('2d');
        const myChart = new Chart(ctx1, {
            type: 'scatter',
            data: data,
            options: {
            scales: {
                x: {
                type: 'linear',
                position: 'bottom'
                }
            }
            }
        });

            }
    );

function setupEclipseBinary(time, flux)
{
    binary = true
    cepheid = false
    scene.add(planet);
    
    var min = Math.min(...flux)
    console.log(min)
    var minIndex = flux.indexOf(min)
    
    var low = time[minIndex]

    console.log("binary min max" + minIndex)

}

function setupCepheid(time, flux)
{
    cepheid = true
    binary = false
    var min = Math.min(...flux)
    var max = Math.max(...flux)
    var max2 = Math.max(...(flux.slice( minIndex)))

    var minIndex = flux.indexOf(min)
    var maxIndex = flux.indexOf(max)
    var maxIndex2 = flux.indexOf(max2)
    console.log("cepheid min " + time[minIndex] + "|" + time[maxIndex] + "|" + time[maxIndex2])
}





function combine(time, flux)
{
    var result = []
    for (let i = 0; i < time.length; i++)
    {
        result.push({
            x: time[i],
            y: flux[i]
        })
    }
    return result
}

