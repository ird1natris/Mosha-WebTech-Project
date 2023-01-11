import * as THREE from 'three'

export default class MoshaSingleton {

    static instance

    constructor(canvas) {
        
        if (MoshaSingleton.instance) {
            return MoshaSingleton.instance
        }

        MoshaSingleton.instance = this;
        this.canvas = canvas;
        this.scene = new THREE.Scene()
        this.sizes = new Sizes()
        this.time = new Time()

        // this.sizes.on('resize', () => {
        //     this.resize()
        // })

        // this.time.on('update', () => {
        //     this.update()
        // })

    }

    update() {
        // this.camera.update()
        // this.renderer.update()
        // this.world.update()
    }

    resize() {
        // this.camera.resize()
        // this.renderer.resize()
    }

}