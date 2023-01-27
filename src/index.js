const { io } = require('../node_modules/socket.io/client-dist/socket.io.js')
var socket = io('https://dimetrondon-backend.onrender.com/');
const THREE = require('three');
const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const screenid = urlParams.get('id')
import {
    GLTFLoader
} from 'three/examples/jsm/loaders/GLTFLoader.js';

import {
    OrbitControls
} from 'three/examples/jsm/controls/OrbitControls.js';

socket.on('display-' + screenid, (object) => {
    document.getElementById('container').innerHTML = ""
    console.log(object[0].genre)

    if (object[0].genre == "Video") {
        let source = document.createElement("source")
        source.src = "https://dimetrodon.fr/files/" + object[0].file;
        source.type = "video/mp4"
        let test = document.createElement('video');
        test.classList.add('test')
        test.autoplay = true;
        test.loop = true;
        test.load();
        test.append(source)
        document.getElementById('container').appendChild(test)

    } else if (object[0].genre == "3D") {
        let model;
        let MODEL_ROTATION = 0.002;
        let LINE_COLOR = 0x000000;


        const scene = new THREE.Scene();
        const color2 = new THREE.Color(0x000000);
        scene.background = color2;
        const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

        const renderer = new THREE.WebGLRenderer();
        renderer.setSize(window.innerWidth, window.innerHeight);
        document.getElementById('container').appendChild(renderer.domElement);


        const geometry = new THREE.BoxGeometry(window.innerWidth / 100, window.innerHeight / 100, 10);
        const edges = new THREE.EdgesGeometry(geometry);
        const line = new THREE.LineSegments(edges, new THREE.LineBasicMaterial({
            color: LINE_COLOR,
            linewidth: 0.1
        }));

        line.translateY(2);
        scene.add(line);

        camera.position.z = 6;
        camera.position.y = 2;

        const controls = new OrbitControls(camera, renderer.domElement);

        const loader = new GLTFLoader();
        loader.load("https://dimetrodon.fr/files/" + object[0].file, (gltf) => {
            model = gltf.scene;
            scene.add(model);
            model.scale.set(0.09, 0.09, 0.09);


            //light
            const light1 = new THREE.PointLight('lightblue', 2);
            light1.position.set(3, 10, 25);
            const lightHolder = new THREE.Group();
            lightHolder.add(light1);



            scene.add(lightHolder);
            const sphereSize = 1;
            const pointLightHelper = new THREE.PointLightHelper(light1, sphereSize);
            scene.add(pointLightHelper);

            function animate() {
                requestAnimationFrame(animate);
                model.rotation.y += MODEL_ROTATION;
                /*     cube.rotation.x += 0.01;
                    cube.rotation.y += 0.01; */

                renderer.render(scene, camera);

            };

            animate();
        });




    } else {
        let test = document.createElement('img');
        let blur = document.createElement('img');
        test.classList.add('image')
        blur.classList.add('blur')
        test.src = "https://dimetrodon.fr/files/" + object[0].file;
        blur.src = "https://dimetrodon.fr/files/" + object[0].file;
        document.getElementById('container').appendChild(test)

        document.getElementById('container').appendChild(blur)
    }

});
