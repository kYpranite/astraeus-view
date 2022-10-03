var cepheid = false
var binary = true
var slider = document.getElementById("time-slider");

var kic846 = $("#kic846");
var kic010 = $("#kic010");
var kic754 = $("#kic754");
var kic014 = $("#kic014");
var kic373 = $("#kic373");

kic846.click(function(){
    // do shit
})


// Update the current slider value (each time you drag the slider handle)
slider.oninput = function() {
    rads = this.value * .01 * 2 * Math.PI 
    if(cepheid)
    {
        light.intensity = curArray[this.value] + 2
    }
    else if(binary)
    {
        console.log("test")
        orbitRadius = 8
        planet.position.set(
            Math.cos(rads + Math.PI/2 - Math.PI/18) * orbitRadius,
            0,
            Math.sin(rads + Math.PI/2- Math.PI/18) * orbitRadius
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

const marsBaseColor = textureLoader.load("../maps/2k_mars.jpg");

var planet = new THREE.Mesh(new THREE.SphereGeometry(0.2, 50, 50), new THREE.MeshStandardMaterial(
    {
        map: marsBaseColor
    }
));


const sunBaseColor = textureLoader.load('../maps/2k_sun.jpg');
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

    // if( binary && Date.now() % 100 == 0)
    // {
    //    slider.stepUp(1)
    //    if(slider.value == 100)
    //    {
    //         slider.value = 0
    //    }
    //    rads = (slider.value / 100)* .01 * 2 * Math.PI 
    //    orbitRadius = 8
    //     planet.position.set(
    //         Math.cos(rads + Math.PI/2) * orbitRadius,
    //         0,
    //         Math.sin(rads + Math.PI/2) * orbitRadius
    //     );
    // }
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
fetch('../assets/sample-stars/KIC 8462852.json').then((response) => response.json())
.then((json) => 
    {
        
        time1 = json.time
        flux1 = json.flux
        setupEclipseBinary(time1, flux1)
        
        console.log(combine(time1, flux1))
        const data = {
            datasets: [{
                label: 'Light Curve',
                data: combine(time1, flux1),
                backgroundColor: 'rgb(255, 99, 132)'
            }],
            };
        const ctx1 = document.getElementById('graph').getContext('2d');
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
    slider.setAttribute("max", 100)
    slider.setAttribute("min", 0)

    var min = Math.min(...flux)
    console.log(min)
    var minIndex = flux.indexOf(min)
    var min2 = Math.min(...flux.slice(minIndex+400))
    var min2Index = flux.indexOf(min2)
    var end = Math.min(2*(min2Index - minIndex) + minIndex, time.length - 1)
    console.log(end)
    console.log(time[end])
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
    let arrayMin = Math.min(...array)

    console.log(arrayMax)
    let multiple = 5 / (arrayMax - arrayMin)
    let result = [];
    console.log(array)
    for(let i = 0; i< array.length; i++)
    {
        // console.log(array[i])
        result.push((array[i] - arrayMin ) * multiple);
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

