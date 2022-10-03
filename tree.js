var cepheid = false
var binary = false
const coolbutton = $(".cool-button");
var slider = document.getElementById("myRange");

var curArray;
coolbutton.click(function(){
    if(cepheid)
    {
        var min
        var max1
        var max2
        setupEclipseBinary(time1, flux1)
    }
    else
    {
        setupCepheid(time1, flux1)
        curArray = maxArray(flux1, 5)
        console.log(curArray)
    }

})


// Update the current slider value (each time you drag the slider handle)
slider.oninput = function() {
    rads = this.value * .01 * 2 * Math.PI
    console.log(curArray[this.value]);
    if(cepheid)
    {
        light.intensity = curArray[this.value]
    }
    else if(binary)
    {
        console.log("test")
        orbitRadius = 8
        planet.position.set(
            Math.cos(rads) * orbitRadius,
            0,
            Math.sin(rads) * orbitRadius
        );
    }
}


var scene = new THREE.Scene();

var camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth/window.innerHeight,
    0.1,
    1000
)
camera.position.z = 12;

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
       
    }
));

scene.add(star);

var light = new THREE.PointLight(0xFFFFFF, 5, 500)
light.position.set(0, 0, 7)
scene.add(light)

var render = function() {
    requestAnimationFrame(render);
    star.rotation.y += 0.01;
    planet.rotation.y += 0.01
    renderer.render(scene, camera);

    // date = Date.now() * 0.0005;
    // orbitRadius = 6
    // planet.position.set(
    //     Math.cos(Math.PI/2) * orbitRadius,
    //     0,
    //     Math.sin(Math.PI/2) * orbitRadius
    // );
}
render();

var time1;
var flux1
fetch('./assets/sample-stars/KIC 01026957.json').then((response) => response.json())
.then((json) => 
    {
        
        time1 = json.time
        flux1 = json.flux

        
        setupCepheid(time1, flux1)
        setupEclipseBinary(time1, flux1)
        
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
    scene.remove(planet)
    cepheid = true
    binary = false
    
    slider.setAttribute("max", time.length -1)
    slider.setAttribute("min", 0)


    min = Math.min(...flux)
    max = Math.max(...flux)
    max2 = 0

    minIndex = flux.indexOf(min)
    maxIndex = flux.indexOf(max)
    maxIndex2 = flux.indexOf(max2)
    console.log("cepheid min " + time[minIndex] + "|" + time[maxIndex] + "|" + time[maxIndex2])
}

function maxArray(array, max)
{
    let arrayMax = Math.max(...array)
    console.log(arrayMax)
    let multiple = 5 / arrayMax
    let result = [];
    console.log(array)
    for(let i = 0; i< array.length; i++)
    {
        // console.log(array[i])
        result.push(array[i] * multiple);
    }
    return result;
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

