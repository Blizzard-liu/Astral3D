/**
 * @author ErSan
 * @email  mlt131220@163.com
 * @date   2025/01/08 
 * @description 贴相机的下雪效果
 */
import * as THREE from 'three';
import type CameraControls from 'camera-controls';

interface ISnowOption {
    size: number;
    density: number;
    speed: number;
    alpha: number;
}

export default class Snow {
    options: ISnowOption;
    mesh: THREE.Mesh;
    controls: CameraControls;

    constructor(option: ISnowOption, controls: CameraControls) {
        const defaultOption: ISnowOption = {
            size: 0.05,
            density: 1.0,
            speed: 1.0,
            alpha: 0.4,
        };

        this.options = Object.assign({}, defaultOption, option);

        this.controls = controls;

        this.mesh = this.createMesh();
        this.mesh.renderOrder = 100;

        this.updatePosition();
    }

    createMesh() {
        const geometry = new THREE.PlaneGeometry(200, 200);

        const uniforms = {
            iTime: {
                type: "f",
                value: 0.0
            },
            tDiffuse: { value: null },
            iResolution: {
                type: "v2",
                value: new THREE.Vector2(window.innerWidth, window.innerHeight).multiplyScalar(window.devicePixelRatio)
            },
            size: { value: this.options.size },
            speed: { value: this.options.speed },
            density: { value: this.options.density },
            alpha: {
                type: "f",
                value: this.options.alpha,
            },
        };

        const material = new THREE.ShaderMaterial({
            transparent: true,
            uniforms: uniforms,
            side: 2,
            depthTest: false, // 禁用深度测试
            depthWrite: false, // 禁用深度写入
            blending: THREE.AdditiveBlending, // 使用叠加混合模式
            vertexShader: `
                varying highp vec2 vUv;

                void main() {
                    vUv = uv;

                    gl_Position = vec4( position, 1.0 );
                }`,
            fragmentShader: `
        #define PI 3.14159265359
        uniform sampler2D tDiffuse;
        uniform vec2 iResolution;
        uniform float iTime;
        uniform float size; // 输入的 size,显示给用户的值是实际值的十倍
        uniform float density;
        uniform float speed;
        uniform float alpha;
        varying highp vec2 vUv;

        float ball(vec2 p) {
           float d = distance(vec2(.5), p);
           return smoothstep(size / 10.0, size / 10.0 - .05, d); // 将 size 缩小十倍
        }
        float N11(float n) {
           return fract(sin(n * 871.213) * 3134.422);
        }
        float N21(vec2 uv) {
           return N11(N11(uv.x) + uv.y);
        }
        
        float snow(vec2 uv, float t) {
           vec2 org_uv = vec2(uv.x, uv.y);
           float z = 10.;
           uv.y += t * .5;
           vec2 gv = fract(uv*z);
           vec2 id = floor(uv*z); 
           gv.x += (sin(N21(id) * 128. + t) * .4);
           gv.y += (sin(N11(N21(id)) * 128. + t) * .4);
           
           float dots = ball(gv);
           return dots;
        }
        void main(){
            vec3 col=texture(tDiffuse,vUv).rgb;
            vec2 uv = gl_FragCoord.xy/iResolution.xy;
            uv.x *= iResolution.x / iResolution.y;
            float t = iTime * .3*speed;
            vec2 gh_uv = uv;
    
            // Time varying pixel color
            vec3 colSnow = vec3(0.);
    
            float m = 0.;
    
            for(float i =0.; i <= 1.; i += 1. / (32.*density)) {
                float z = mix(1., .5 , i);
                vec2 offset = vec2(N11(i), N11(N11(i)));
                m += snow((uv + offset) * z, t) * .3;
            }
    
            colSnow = vec3(m)*1.2;
            colSnow += col *.8 * mix(.5, 1., uv.y);

            // 如果不是雪的像素，设置为透明
            // if (m <= 0.0) {
            //     gl_FragColor = vec4(0.0, 0.0, 0.0, 0.0); // 完全透明
            // } else {
            //     gl_FragColor = vec4(colSnow, alpha); // 雪的像素保持原有颜色和透明度
            // }
            
            gl_FragColor = vec4(colSnow,alpha);
        }`
        });

        return new THREE.Mesh(geometry, material);
    }

    updatePosition() {
        if (this.controls && this.mesh) {
            const position = this.controls.getPosition(new THREE.Vector3());
            const center = this.controls.getTarget(new THREE.Vector3());

            if (this.mesh.position.x === center.x && this.mesh.position.z === center.z) return;

            this.mesh.position.copy(center);
            if (position.y < 100) {
                this.mesh.position.y = -100;
            } else {
                this.mesh.position.y = 0;
            }
        }
    }

    updateOptions(option) {
        const material = <THREE.ShaderMaterial>this.mesh.material;
        for (const key in option) {
            this.options[key] = option[key];

            if (material.uniforms[key]) {
                material.uniforms[key].value = option[key];
            }
        }
    }

    update(deltaTime) {
        this.updatePosition();

        if (this.mesh.material && this.mesh.material instanceof THREE.ShaderMaterial) {
            this.mesh.material.uniforms.iTime.value += deltaTime;
        }
    }

    dispose() {
        this.mesh.geometry.dispose();
        (<THREE.Material>this.mesh.material).dispose();
        this.mesh.removeFromParent();
    }
}