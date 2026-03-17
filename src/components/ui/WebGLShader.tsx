import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const fragmentShader = `
  uniform float uTime;
  uniform vec2 uResolution;
  varying vec2 vUv;

  void main() {
    vec2 uv = vUv;
    float time = uTime * 0.2;
    
    vec3 color = vec3(0.0);
    
    // Create a dark futuristic AI grid/nebula effect
    float strength = 0.0;
    strength += sin(uv.x * 10.0 + time) * 0.1;
    strength += sin(uv.y * 10.0 - time) * 0.1;
    
    vec3 emerald = vec3(0.06, 0.72, 0.5);
    vec3 dark = vec3(0.02, 0.02, 0.05);
    
    float noise = sin(uv.x * 20.0 + uv.y * 20.0 + time) * 0.5 + 0.5;
    color = mix(dark, emerald * 0.2, noise * strength + 0.1);
    
    // Add some "data" particles
    float particles = pow(sin(uv.x * 100.0 + time) * sin(uv.y * 100.0 - time), 20.0);
    color += emerald * particles * 0.5;

    gl_FragColor = vec4(color, 1.0);
  }
`;

const vertexShader = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const ShaderPlane = () => {
  const meshRef = useRef<THREE.Mesh>(null);
  
  const uniforms = useMemo(() => ({
    uTime: { value: 0 },
    uResolution: { value: new THREE.Vector2(window.innerWidth, window.innerHeight) }
  }), []);

  useFrame((state) => {
    if (meshRef.current) {
      (meshRef.current.material as THREE.ShaderMaterial).uniforms.uTime.value = state.clock.getElapsedTime();
    }
  });

  return (
    <mesh ref={meshRef}>
      <planeGeometry args={[2, 2]} />
      <shaderMaterial
        fragmentShader={fragmentShader}
        vertexShader={vertexShader}
        uniforms={uniforms}
      />
    </mesh>
  );
};

export const WebGLShader = () => {
  return (
    <div className="absolute inset-0 -z-10 bg-zinc-950">
      <Canvas camera={{ position: [0, 0, 1] }}>
        <ShaderPlane />
      </Canvas>
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-zinc-950/50 to-zinc-950" />
    </div>
  );
};
