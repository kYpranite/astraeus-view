var cepheid = false
var binary = true
var slider = document.getElementById("time-slider");
var sliderMin = document.getElementById("first");
var sliderMax = document.getElementById("last");
var kic846 = $("#kic846");
var kic010 = $("#kic010");
var kic754 = $("#kic754");
var kic014 = $("#kic014");
var kic373 = $("#kic373");
var currStarLabel = document.querySelector('.current-star');
var time = $("#current-time");

const container = document.getElementById( 'canvas' );

console.log(container);


kic846.click(function(){
    getJson('8462852', false)
})
kic010.click(function(){
    getJson('01026957', true)
})
kic754.click(function(){
    getJson('7548061', false)
})
kic014.click(function(){
    getJson('01433962', false)
})
kic373.click(function(){
    getJson('3733346', false)
})

var starTitle = $(".star-title");
var starInfo = $(".star-info");

$('#kic-form').on("keyup", function(e) {
    if (e.keyCode == 13) {
        let searchValue = $('#kic-form')[0].value;
        getJson(searchValue, false);
    }
});

$(".learn-label").click(function(){
    if($(this).attr('id') == "754id"){
        starTitle[0].textContent = "V1154 Cyg";
        starInfo[0].innerHTML = "Cepheids are variable stars that brighten and dim regularly (period = 2- 60 days). It was also noted by Harvard astronomer Henrietta Swan Leavitt that their period is a uniform function of their luminosity (average luminosity = 300 to 40000 L). This relationship is important because it allows us to calculate a star’s distance away from Earth from the comparison of its apparent brightness versus its calculated brightness. Thus, cepheids are used as a ruler to measure the distance to its galaxy.  (Learn more on <a href='https://starchild.gsfc.nasa.gov/docs/StarChild/questions/cepheids.html'>Cepheids (nasa.gov)</a>)"
    }else if($(this).attr('id') == "010id"){
        starTitle[0].textContent = "Kepler-11731";
        starInfo[0].innerHTML = "An eclipsing binary consists of two bodies moving close in orbit. Due to their position in relation to Earth, their combined light curve can dip every time each star is in front of the other. The shape of this light curve can be used to calculate the ratio of size of the two stars and the ratio of luminosity. (Learn more on  <a href='https://www.britannica.com/science/star-astronomy/Eclipsing-binaries'> star - Eclipsing binaries | Britannica </a>)"
    }else if($(this).attr('id') == "846id"){
        starTitle[0].textContent = "Tabby's Star";
        starInfo[0].innerHTML = "Unusual fluctuations in this star’s brightness were identified by citizen scientists as part of Project Hunters. Various hypotheses including an alien megastructure have been created to explain this anomaly, although recent discoveries suggest that an uneven ring of dust orbiting the star might be the culprit. (Learn more on: <a href='https://www.nasa.gov/feature/jpl/mysterious-dimming-of-tabbys-star-may-be-caused-by-dust'>Mysterious Dimming of Tabby's Star May Be Caused by Dust | NASA</a>)"
    }else if($(this).attr('id') == "373id"){
        starTitle[0].textContent = "RR Lyrae";
        starInfo[0].innerHTML = "RR Lyrae variables are variable stars with similar properties to Cepheids. Although more common than Cepheids, their shorter periods (period 4 hours- 1 day) and lower average luminosity (80L) make them less useful in identifying galaxies far far away. (Learn more on <a href='https://www.astronomy.ohio-state.edu/ryden.1/ast162_4/notes16.html'>Lecture 16: Pulsating Stars (ohio-state.edu)</a>)"
    }

    $(".learn-more-popup").show();
});

$(".xicon").click(function(){
    $(".learn-more-popup").hide();
})

var curArray = []
// Update the current slider value (each time you drag the slider handle)
slider.oninput = function() {
    rads = this.value * .01 * 2 * Math.PI 
    if(cepheid)
    {
        console.log(curArray[this.value] + 2)
        light.intensity = curArray[this.value] + 2
    }
    else if(binary)
    {
        orbitRadius = 8
        planet.position.set(
            Math.cos(rads + Math.PI/2 - Math.PI/15) * orbitRadius - 2.5,
            0,
            Math.sin(rads + Math.PI/2- Math.PI/15) * orbitRadius,
        );
    }
}


var scene = new THREE.Scene();

var camera = new THREE.PerspectiveCamera(
    75,
    container.offsetWidth/container.offsetHeight,
    0.1,
    1000
)
camera.position.z = 12;

var renderer = new THREE.WebGLRenderer({antialias: true});
renderer.setClearColor("#000000");
renderer.setSize(container.offsetWidth, container.offsetHeight);
const textureLoader = new THREE.TextureLoader();

container.appendChild(renderer.domElement);

window.addEventListener('resize', ()=> {
    renderer.setSize(container.offsetWidth, container.offsetHeight);
    camera.aspect = container.offsetWidth / container.offsetHeight

    camera.updateProjectionMatrix();
})

const marsBaseColor = textureLoader.load("../maps/2k_mars.jpg");

var planet = new THREE.Mesh(new THREE.SphereGeometry(0.2, 50, 50), new THREE.MeshStandardMaterial(
    {
        map: marsBaseColor
    }
));

planet.position.x=-5;

const sunBaseColor = textureLoader.load('../maps/2k_sun.jpg');
var star = new THREE.Mesh(new THREE.SphereGeometry(3, 50, 50), new THREE.MeshStandardMaterial(
    {
        map: sunBaseColor,
       
    }
));

star.position.x = -5;



var light = new THREE.PointLight(0xFFFFFF, 5, 500)
light.position.set(-5, 0, 7)
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
var myChart

function getJson(name, binary)
{
    if (name[0] == "K"){
        name = name.slice(4)
    }
    scene.add(star);
    if (name != "7548061" && name != "3733346" && name != "8462852" && name != "01026957"){
        fetch("https://salty-temple-63100.herokuapp.com/https://secret-chamber-88123.herokuapp.com/getjson" + name).then((response) => response.json())
        .then((data) => {console.log(data); modelJson(data, binary)});
    }
    else{
        jsonName = '../assets/sample-stars/KIC ' + name + '.json';
        fetch(jsonName).then((response) => response.json())
        .then((json) => {
            modelJson(json, binary);
        })
    }
}

function modelJson(json, binary){
    currStarLabel.textContent = json.kic;
    if(myChart != null)
    {
        myChart.destroy();
    }
    time1 = json.time
    flux1 = json.flux
    if(binary)
    {
        setupEclipseBinary(time1, flux1)
    }
    else{
        setupCepheid(time1, flux1)
    }
    
    
    console.log(combine(time1, flux1))
    const data = {
        datasets: [{
            label: 'Light Curve',
            data: combine(time1, flux1),
            backgroundColor: 'rgb(255, 99, 132)'
        }],
        };
    const ctx1 = document.getElementById('graph').getContext('2d');
    myChart = new Chart(ctx1, {
        type: 'scatter',
        data: data,
        color: "rgba(255,255,255,1)",
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
    sliderMin.textContent = time[0].toFixed(3)
    sliderMax.textContent = time[time.length - 1].toFixed(3)

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
    curArray = maxArray(flux, 5)
    sliderMin.textContent = time[0].toFixed(3)
    sliderMax.textContent = time[time.length - 1].toFixed(3)
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

