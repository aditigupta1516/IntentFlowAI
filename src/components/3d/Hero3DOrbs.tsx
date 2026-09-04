import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

export const Hero3DOrbs: React.FC = () => {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // Scene setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(60, container.clientWidth / container.clientHeight, 0.1, 1000);
    camera.position.z = 7;

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    // Soft Ambient & Directional Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.9);
    scene.add(ambientLight);

    const light1 = new THREE.PointLight(0x5b8cff, 2.0, 30);
    light1.position.set(6, 6, 4);
    scene.add(light1);

    const light2 = new THREE.PointLight(0x9b7bff, 1.8, 30);
    light2.position.set(-6, -4, 3);
    scene.add(light2);

    // Floating Crystal Geometry (Torus Knots & Octahedrons) positioned gracefully on outer perimeter
    const crystalConfigs = [
      { type: 'torus', color: 0x5b8cff, size: 0.7, pos: [-4.2, 1.8, -1.5], rotX: 0.005, rotY: 0.008, floatSpeed: 0.7, amp: 0.25 },
      { type: 'octa', color: 0x9b7bff, size: 0.65, pos: [4.4, 1.5, -2], rotX: 0.006, rotY: 0.007, floatSpeed: 0.9, amp: 0.2 },
      { type: 'icosa', color: 0x22d3ee, size: 0.5, pos: [-3.8, -1.8, -1.8], rotX: 0.007, rotY: 0.009, floatSpeed: 0.8, amp: 0.3 },
      { type: 'torus', color: 0xf472b6, size: 0.45, pos: [4.2, -1.9, -2.2], rotX: 0.005, rotY: 0.006, floatSpeed: 1.1, amp: 0.22 },
      { type: 'octa', color: 0x34d399, size: 0.4, pos: [0, 3.2, -3], rotX: 0.008, rotY: 0.005, floatSpeed: 0.6, amp: 0.15 }
    ];

    const meshes: THREE.Mesh[] = [];

    crystalConfigs.forEach((cfg) => {
      let geo: THREE.BufferGeometry;
      if (cfg.type === 'torus') {
        geo = new THREE.TorusGeometry(cfg.size, cfg.size * 0.28, 16, 32);
      } else if (cfg.type === 'octa') {
        geo = new THREE.OctahedronGeometry(cfg.size, 1);
      } else {
        geo = new THREE.IcosahedronGeometry(cfg.size, 1);
      }

      const mat = new THREE.MeshPhysicalMaterial({
        color: cfg.color,
        emissive: cfg.color,
        emissiveIntensity: 0.2,
        metalness: 0.1,
        roughness: 0.2,
        transparent: true,
        opacity: 0.55,
        clearcoat: 0.8,
        clearcoatRoughness: 0.1
      });

      const mesh = new THREE.Mesh(geo, mat);
      mesh.position.set(cfg.pos[0], cfg.pos[1], cfg.pos[2]);
      mesh.userData = {
        baseY: cfg.pos[1],
        baseX: cfg.pos[0],
        rotX: cfg.rotX,
        rotY: cfg.rotY,
        floatSpeed: cfg.floatSpeed,
        amp: cfg.amp
      };

      // Delicate wireframe ring
      const wireMat = new THREE.MeshBasicMaterial({
        color: cfg.color,
        wireframe: true,
        transparent: true,
        opacity: 0.18
      });
      const wire = new THREE.Mesh(geo, wireMat);
      wire.scale.set(1.12, 1.12, 1.12);
      mesh.add(wire);

      scene.add(mesh);
      meshes.push(mesh);
    });

    // Subtle floating star constellation (gentle, not blinding)
    const particleCount = 800;
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount * 3; i += 3) {
      positions[i] = (Math.random() - 0.5) * 20;
      positions[i + 1] = (Math.random() - 0.5) * 14;
      positions[i + 2] = (Math.random() - 0.5) * 10 - 2;

      colors[i] = 0.4 + Math.random() * 0.2;
      colors[i + 1] = 0.6 + Math.random() * 0.3;
      colors[i + 2] = 1.0;
    }

    const particleGeo = new THREE.BufferGeometry();
    particleGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    particleGeo.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const particleMat = new THREE.PointsMaterial({
      size: 0.03,
      vertexColors: true,
      transparent: true,
      opacity: 0.45,
      blending: THREE.AdditiveBlending
    });

    const particles = new THREE.Points(particleGeo, particleMat);
    scene.add(particles);

    // Mouse Parallax
    let mouseX = 0;
    let mouseY = 0;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      mouseX = ((e.clientX - rect.left) / container.clientWidth) * 2 - 1;
      mouseY = -(((e.clientY - rect.top) / container.clientHeight) * 2 - 1);
    };

    window.addEventListener('mousemove', handleMouseMove);

    const handleResize = () => {
      if (!container) return;
      camera.aspect = container.clientWidth / container.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(container.clientWidth, container.clientHeight);
    };

    window.addEventListener('resize', handleResize);

    // Animation Loop
    let animId: number;
    const clock = new THREE.Clock();

    const animate = () => {
      const time = clock.getElapsedTime();

      meshes.forEach((m) => {
        m.rotation.x += m.userData.rotX;
        m.rotation.y += m.userData.rotY;
        m.position.y = m.userData.baseY + Math.sin(time * m.userData.floatSpeed) * m.userData.amp;
      });

      particles.rotation.y = time * 0.015;

      camera.position.x += (mouseX * 0.4 - camera.position.x) * 0.04;
      camera.position.y += (mouseY * 0.3 - camera.position.y) * 0.04;
      camera.lookAt(0, 0, 0);

      renderer.render(scene, camera);
      animId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animId);
      if (container && renderer.domElement) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, []);

  return <div ref={mountRef} className="absolute inset-0 pointer-events-none z-0 overflow-hidden opacity-90" />;
};
