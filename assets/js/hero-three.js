// Three.js (module build)
import * as THREE from "https://unpkg.com/three@0.160.0/build/three.module.js";

// ======== Scene Setup ========
const canvas = document.getElementById("hero-canvas");

const renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: true,
    alpha: true,

});

renderer.outputEncoding = THREE.sRGBEncoding;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 5;
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;

renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
renderer.setSize(window.innerWidth, window.innerHeight);


const scene = new THREE.Scene();

// Camera
const camera = new THREE.PerspectiveCamera(
    45,
    window.innerWidth / window.innerHeight,
    0.1,
    100
);

camera.position.set(0, 1.35, 3.2);
camera.lookAt(0, 2, 2);

// Lighting (subtle blue fill)
const ambient = new THREE.AmbientLight(0x5d8c9e, 2);
scene.add(ambient);



// ======== Water Plane (Liquid Wave Shader) ========
const geo = new THREE.PlaneGeometry(20, 8, 2500, 2*Math.PI);

const uniforms = {
    uTime: { value: 50 },
    uAmp1: { value: .01 },
    uAmp2: { value: .01 },
    uFreq1: { value: new THREE.Vector2(1, 5) },
    uFreq2: { value: new THREE.Vector2(5, 0) },
    uSpeed: { value: 10 },
    uTintDeep: { value: new THREE.Color("#3bb7ff") },   // deeper, luminous blue
    uTintShallow: { value: new THREE.Color("#b0eaff") }, // shallow, lighter tint
    uFoam: { value: new THREE.Color("#0d6efd") },        // bright foam shimmer
    uCamPos: { value: camera.position },
};

const vert = /* glsl */ `
    varying vec2 vUv;
    varying vec3 vPos;
    uniform float uTime;
    uniform float uAmp1; uniform float uAmp2;
    uniform vec2 uFreq1;  uniform vec2 uFreq2;
    uniform float uSpeed;
    
    // Simple pseudo-random noise
    float hash(vec2 p){return fract(sin(dot(p, vec2(127.1,311.7))) * 43758.5453123);}        
    float noise(vec2 p){
        vec2 i = floor(p); vec2 f = fract(p);
        float a = hash(i);
        float b = hash(i + vec2(1.0,0.0));
        float c = hash(i + vec2(0.0,1.0));
        float d = hash(i + vec2(1.0,1.0));
        vec2 u = f*f*(3.0-2.0*f);
        return mix(a,b,u.x) + (c - a)*u.y*(1.0 - u.x) + (d - b)*u.x*u.y;
    }
    
    void main(){
        vUv = uv; 
        vec3 pos = position;
        float t = uTime * uSpeed;
        float w1 = sin((pos.x * uFreq1.x + pos.y * uFreq1.y) * 3.1415 + t) * uAmp1;
        float w2 = sin((pos.x * uFreq2.x - pos.y * uFreq2.y) * 3.1415 - t*1.3) * uAmp2;
        float n = noise(uv * 5.0 + t*0.2) * 0.05;
        pos.z += w1 + w2 + n; // vertical displacement
        vPos = pos;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(pos,1.0);
    }
`;

const frag = /* glsl */ `
    precision highp float;
    varying vec2 vUv; 
    varying vec3 vPos;
    uniform float uTime;
    uniform vec3 uTintDeep; uniform vec3 uTintShallow; uniform vec3 uFoam;
    uniform vec3 uCamPos;
    
    // Fresnel for rim highlights
    float fresnel(vec3 viewDir, vec3 normal){
        return pow(1.0 - max(dot(viewDir, normal), 0.0), 2.5);
    }
    
    // Fake normal from derivatives
    vec3 fakeNormal(){
        vec3 dx = dFdx(vec3(vPos));
        vec3 dy = dFdy(vec3(vPos));
        return normalize(cross(dx, dy));
    }
    
    // Procedural foam/cap hints
    float foamMask(){
        float m = smoothstep(0.03, 0.22, abs(vPos.z));
        return m;
    }

    void main(){
        vec3 N = fakeNormal();
        vec3 V = normalize(uCamPos - vPos);
        float f = fresnel(V, N);
        vec3 base = mix(uTintDeep, uTintShallow, 0.5 + vPos.z*0.8);
        vec3 col = base + f * vec3(0.18, 0.45, 0.6);
        col = mix(col, uFoam, foamMask()*0.25);
        gl_FragColor = vec4(col, 0.95);
    }
`;

const mat = new THREE.ShaderMaterial({
    vertexShader: vert,
    fragmentShader: frag,
    uniforms,
    transparent: true,
    side: THREE.DoubleSide,
});

const mesh = new THREE.Mesh(geo, mat);
mesh.rotation.x = -Math.PI * 0.5; // lay flat
mesh.position.y = -0.5;
scene.add(mesh);

// ======== Caustics Layer (Underwater light pattern) ========
// Fullscreen quad below the water that animates a caustics pattern
const causticsUniforms = {
    uTime: { value: 0 },
    uColor: { value: new THREE.Color("#0A2540") },
    uAccent: { value: new THREE.Color("#00C2FF") },
};

const causticsMat = new THREE.ShaderMaterial({
    depthWrite: false,
    transparent: true,
    uniforms: causticsUniforms,
    vertexShader: /* glsl */ `
        varying vec2 vUv; 
        void main(){ vUv = uv; gl_Position = vec4(position.xy, 0.0, 1.0); }
    `,
    fragmentShader: /* glsl */ `
        precision highp float; varying vec2 vUv; uniform float uTime; uniform vec3 uColor; uniform vec3 uAccent;
        // IQ-style FBM for caustics
        float hash(vec2 p){ return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123); }
        float noise(vec2 p){ vec2 i=floor(p); vec2 f=fract(p); float a=hash(i); float b=hash(i+vec2(1,0)); float c=hash(i+vec2(0,1)); float d=hash(i+vec2(1,1)); vec2 u=f*f*(3.0-2.0*f); return mix(a,b,u.x)+(c-a)*u.y*(1.0-u.x)+(d-b)*u.x*u.y; }
        float fbm(vec2 p){ float v=0.0; float a=0.5; for(int i=0;i<5;i++){ v+=a*noise(p); p*=2.0; a*=0.55; } return v; }
        void main(){
            vec2 uv = vUv*2.0; // tile
            float t = uTime*0.25;
            float c1 = fbm(uv*3.0 + vec2(t, -t*0.7));
            float c2 = fbm(uv*3.0 - vec2(t*0.6, t));
            float c = smoothstep(0.65, 1.0, c1*c2);
            vec3 base = uColor * 0.65;
            vec3 light = mix(base, uAccent, c*0.85);
            gl_FragColor = vec4(light, 0.55); // translucent glow below water
        }
    `,
});

// Screen-space quad
const causticsGeo = new THREE.PlaneGeometry(2, 2);

const causticsMesh = new THREE.Mesh(causticsGeo, causticsMat);
causticsMesh.frustumCulled = false;

const causticsScene = new THREE.Scene();
causticsScene.add(causticsMesh);

const orthoCam = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);

// ======== Interaction (Parallax / gentle camera sway) ========
let targetRotX = camera.rotation.x;
let targetRotY = camera.rotation.y;

window.addEventListener("mousemove", (e) => {
    const nx = (e.clientX / window.innerWidth) * 2 - 1; // -1..1
    const ny = (e.clientY / window.innerHeight) * 2 - 1;
    targetRotY = nx * 0.05; // gentle yaw
    targetRotX = -ny * 0.03; // gentle pitch
});


// ======== Resize ========
function onResize() {
    const w = window.innerWidth;
    const h = window.innerHeight;
    renderer.setSize(w, h);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
}

window.addEventListener("resize", onResize);

// ======== Animate ========
let last = performance.now();

function tick(now) {
    const dt = (now - last) / 1000;
    last = now;
    uniforms.uTime.value += dt;
    causticsUniforms.uTime.value += dt;
    // ease camera rotation
    camera.rotation.x += (targetRotX - camera.rotation.x) * 0.05;
    camera.rotation.y += (targetRotY - camera.rotation.y) * 0.05;

    // Render caustics to screen first (background), then 3D water with alpha
    renderer.autoClear = true;
    renderer.render(causticsScene, orthoCam);
    renderer.autoClear = false;
    renderer.clearDepth();
    renderer.render(scene, camera);
    requestAnimationFrame(tick);
}

onResize()
requestAnimationFrame(tick)

// ======== Debug Resize Logging ========
window.addEventListener("resize", ()=>{
    const w = window.innerWidth;
    const h = window.innerHeight;
    console.log("Resized: "+ "Width = " +w+ " Height = "+h);
});
