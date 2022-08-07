import * as THREE from "three";
import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader";

class App {
  constructor() {
    this.camera = null;
    this.scene = null;
    this.renderer = null;
  }

  init = () => {
    const container = document.createElement("div");
    document.body.appendChild(container);

    // Configure and create Draco decoder.
    const dracoLoader = new DRACOLoader();
    dracoLoader.setDecoderPath("draco/");
    dracoLoader.setDecoderConfig({ type: "js" });

    // camera
    this.camera = new THREE.PerspectiveCamera(
      45,
      window.innerWidth / window.innerHeight,
      0.00000001,
      10000
    );
    this.camera.position.set(10, 6, 10);

    // renderer
    this.renderer = new THREE.WebGLRenderer({
      antialias: true,
      logarithmicDepthBuffer: true,
    });
    this.renderer.setClearColor(0xaaaaaa, 0); // Alpha color setting.
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.physicallyCorrectLights = true;
    this.renderer.outputEncoding = THREE.sRGBEncoding;
    container.appendChild(this.renderer.domElement);

    // scene
    this.scene = new THREE.Scene();
    new RGBELoader().load("assets/royal_esplanade_1k.hdr", (texture) => {
      texture.mapping = THREE.EquirectangularReflectionMapping;

      this.scene.background = texture;
      this.scene.environment = texture;
      this.#render();
    });

    // glTF model
    const loader = new GLTFLoader().setDRACOLoader(dracoLoader);
    loader.load("assets/models/WalkingAstronaut_compressed.glb", (gltf) => {
      gltf.scene.position.set(0, -3.5, 0);
      gltf.scene.scale.setScalar(3);
      this.scene.add(gltf.scene);

      this.#render();
    });

    // controls
    const controls = new OrbitControls(this.camera, this.renderer.domElement);
    controls.addEventListener("change", this.#render);
    controls.minDistance = 0.02;
    controls.maxDistance = 10;
    controls.target.set(0, 0, -0.2);
    controls.update();

    //
    window.addEventListener("resize", this.#onWindowResize);
  };

  #onWindowResize = () => {
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(window.innerWidth, window.innerHeight);

    this.#render();
  };

  #render = () => {
    this.renderer.render(this.scene, this.camera);
  };
}

export { App };
