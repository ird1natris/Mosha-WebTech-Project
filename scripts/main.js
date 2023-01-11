import * as THREE from 'three'
import GUI from './lil-gui.esm.min.js';
// import gsap from 'gsap'

import { GLTFLoader } from './GLTFLoader.js'
import { DRACOLoader } from './DRACOLoader.js'
import { OrbitControls } from './OrbitControls.js'

// const mosha = new MoshaSingleton(document.querySelector('.mosha-canvas'))

function initialize() {
    
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xfef0e4);
    // 0xfef0e4

    let lerpObj = {
        current: 0,
        target: 0,
        ease: 0.1
    }

    let lerpObjY = {
        current: 0,
        target: 0,
        ease: 0.1
    }

    let lerpUpDown = {
        current: 0,
        target: 0,
        ease: 0.1
    }

    let start = Date.now()
    let current = start;
    let elapsed = 0;
    let delta = 16;

    scene.rotation.x = 0.116;
    scene.rotation.z = -0.058;

    const camera = new THREE.PerspectiveCamera(40,window.innerWidth/window.innerHeight,1,2000);
    // camera.rotation.y = 45/180*Math.PI;
    // camera.position.x = 0;
    // camera.position.y = 200;
    // camera.position.z = 800;

    // camera.position.x = 16.8;
    // camera.position.y = 139.6;
    // camera.position.z = 312;

    camera.position.x = 16.8;
    camera.position.y = 598;
    camera.position.z = 312;

    const renderer = new THREE.WebGLRenderer({
        antialias: true,
        canvas: document.querySelector('.mosha-canvas')
    });

    renderer.physicallyCorrectLights = true;
    renderer.outputEncoding = THREE.sRGBEncoding;
    renderer.toneMapping = THREE.CineonToneMapping;
    renderer.toneMappingExposure = 0.5;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFShadowMap;
    renderer.setSize(window.innerWidth, window.innerHeight)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

    // renderer.setSize(window.innerWidth, window.innerHeight);
    // document.body.appendChild(renderer.domElement);

    // const controls = new OrbitControls(camera, renderer.domElement);
    // controls.addEventListener('change', renderer);

    const loader = new GLTFLoader();
    const dracoLoader = new DRACOLoader()
    dracoLoader.setDecoderPath('/draco/')
    loader.setDRACOLoader(dracoLoader)

    const moshaLogo = new THREE.TextureLoader().load('/pictures/mosha_upscale.jpg')
    moshaLogo.wrapS = THREE.ClampToEdgeWrapping
    moshaLogo.wrapT = THREE.ClampToEdgeWrapping
    moshaLogo.flipY = false

    // const gui = new GUI()

    // const folder1 = gui.addFolder('Position')

    // folder1.add(camera.position, 'x', -400, 400).onChange(value => {
    //     camera.position.setX(value)
    // })
    // folder1.add(camera.position, 'y', 0, 2000).onChange(value => {
    //     camera.position.setY(value)
    // })
    // folder1.add(camera.position, 'z', 0, 1000).onChange(value => {
    //     camera.position.setZ(value)
    // })

    // const folder2 = gui.addFolder('Rotation')

    // folder2.add(camera.rotation, 'x', -1, 1).onChange(value => {
    //     camera.rotation.x = value
    // })
    // folder2.add(camera.rotation, 'y', -1, 1).onChange(value => {
    //     camera.rotation.y = value
    // })*
    // folder2.add(camera.rotation, 'z', -1, 1).onChange(value => {
    //     camera.rotation.z = value
    // })

    // const folder3 = gui.addFolder('Rotation M')

    // folder3.add(scene.rotation, 'x', -1, 1).onChange(value => {
    //     scene.rotation.x = value
    // })
    // folder3.add(scene.rotation, 'y', -1, 1).onChange(value => {
    //     scene.rotation.y = value
    // })*
    // folder3.add(scene.rotation, 'z', -1, 1).onChange(value => {
    //     scene.rotation.z = value
    // })

    // const folder4 = gui.addFolder('Scale')

    // folder4.add(scene.scale, 'x', 0, 100).onChange(value => {
    //     scene.scale.x = value
    // })
    // folder4.add(scene.scale, 'y', 0, 100).onChange(value => {
    //     scene.scale.y = value
    // })
    // folder4.add(scene.scale, 'z', 0, 100).onChange(value => {
    //     scene.scale.z = value
    // })

    loader.load('./models/mosha3.glb', function(gltf){
        // car = gltf.scene.children[0];
        // car.scale.set(0.5,0.5,0.5);
        // scene.add(gltf.scene);
        // animate();

        gltf.scene.children.forEach((child) => {

            if (child.name === 'Cylinder003') {
                child.material = new THREE.MeshBasicMaterial({
                    map: moshaLogo
                })
            }

        })

        // -------------------------------------- mosha2.glb
        // gltf.scene.scale.set(230, 230, 230)
        // gltf.scene.position.y = 0
        // gltf.scene.position.x = 200
        // gltf.scene.rotation.y = 24.9

        // -------------------------------------- mosha3.glb
        gltf.scene.scale.set(280, 280, 280)
        // gltf.scene.position.y = 20
        // gltf.scene.position.x = 200
        gltf.scene.rotation.y = 24.9

        scene.add(gltf.scene)

    });

    window.addEventListener('mousemove', (e) => {
        const rotation = ((e.clientX - window.innerWidth / 2) * 2) / window.innerWidth
        const rotationY = ((e.clientY - window.innerHeight / 2) * 2) / window.innerHeight
        lerpObj.target = rotation * 0.8
        lerpObjY.target = rotationY * 0.25
    })

    window.addEventListener('resize', () => {

        camera.aspect = window.innerWidth / window.innerHeight
        camera.updateProjectionMatrix()

        renderer.setSize(window.innerWidth, window.innerHeight)
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

        renderer.render(scene, camera);

    })

    const ambientLight = new THREE.AmbientLight(0xffffff, 3)
    scene.add(ambientLight)

    const animate = () => {
        
        const currentTime = Date.now()
        delta = currentTime - current;
        current = currentTime;
        elapsed = current - start

        lerpUpDown.target = Math.cos(2 * Math.PI * (elapsed % 10000) * 0.0001) * 15

        lerpObj.current = gsap.utils.interpolate(
            lerpObj.current,
            lerpObj.target,
            lerpObj.ease
        )

        lerpObjY.current = gsap.utils.interpolate(
            lerpObjY.current,
            lerpObjY.target,
            lerpObjY.ease
        )

        lerpUpDown.current = gsap.utils.interpolate(
            lerpUpDown.current,
            lerpUpDown.target,
            lerpUpDown.ease,
        )

        scene.rotation.x = lerpObjY.current
        scene.rotation.y = lerpObj.current
        scene.position.y = lerpUpDown.current

        renderer.render(scene, camera);

        requestAnimationFrame(animate);
    }

    setTimeout(() => {

        const tl = gsap.timeline({
            onComplete: animate
        })

        splt({})

        tl.to(camera.position, {
            y: 156,
            duration: 2,
            ease: "power2.inOut",
        })
        .from(scene.background, {
            duration: 2,
            delay: 0.5,
            r: 0.2,
            g: 0.20,
            b: 0.20,
            ease: "power2.inOut"
        }, 'same')
        .to(camera.position, {
            x: -239.2,
            y: 178.8,
            z: 750,
            duration: 2,
            delay: 0.5,
            ease: "power2.inOut",
        }, 'same')
        .from('.char', {
            duration: 0.75,
            yPercent: 100,
            ease: 'back',
            stagger: 0.05,
            delay: 0.5
        })
        .from('.description', {
            yPercent: 100,
            duration: 1,
            ease: 'power2.inOut',
            delay: 0.5
        })
        .from('.cta-btn', {
            yPercent: 100,
            duration: 0.5,
            ease: 'back.out(2)',
            delay: 0.5
        })
        .from('.nav', {
            yPercent: -100,
            duration: 1,
            ease: 'back.out(2)',
            delay: 0.5
        })

        // tl
        // .to(camera.position, {
        //     x: -239.2,
        //     y: 139.6,
        //     z: 800,
        //     ease: 0.01,
        //     duration: 2,
        //     ease: "power2.out"
        // }, 'first')
        // .to(camera.position, { 
        //     x: -239.2,
        //     y: 178.8,
        //     z: 800,
        //     ease: 0.01,
        //     duration: 2,
        //     ease: "power2.out"
        // }, 'second')

        animate()

    }, 500)

}

initialize()