import { useState, Suspense } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import {
  Float,
  MeshShaderMaterial,
  Text3D,
  Environment,
  Center,
  OrbitControls,
  useAnimations,
  useTexture
} from "@react-three/drei";
import * as THREE from "three";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import { useRef } from "react";

// 3D Floating Shapes Component
const FloatingShapes = () => {
  const mesh = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);
  const [clicked, setClicked] = useState(false);

  useFrame((state) => {
    if (mesh.current) {
      mesh.current.rotation.x = state.clock.elapsedTime * 0.05;
      mesh.current.rotation.y = state.clock.elapsedTime * 0.1;
      mesh.current.position.y = Math.sin(state.clock.elapsedTime * 0.3) * 0.5;
    }
  });

  return (
    <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
      <group>
        {/* Large sphere */}
        <mesh
          ref={mesh}
          position={[0, 0, 0]}
          castShadow
          onPointerOver={() => setHovered(true)}
          onPointerOut={() => setHovered(false)}
          onPointerDown={() => setClicked(true)}
        >
          <sphereGeometry args={[1.5, 32, 32]} />
          <MeshShaderMaterial
            color={hovered ? "#FF6B4A" : "#FF6B4A"}
            metalness={0.3}
            roughness={0.2}
            emissive={clicked ? "#FF6B4A" : "transparent"}
            emissiveIntensity={clicked ? 0.5 : 0}
            dispatchRequests={[]}
          />
        </mesh>

        {/* Ring shape */}
        <mesh position={[2.5, 0.5, 0]} castShadow>
          <torusGeometry args={[1, 0.05, 16, 32]} />
          <MeshShaderMaterial
            color={hovered ? "#FF6B4A" : "#FF6B4A"}
            metalness={0.8}
            roughness={0.2}
          />
        </mesh>

        {/* Small cube */}
        <mesh position={[-2.5, -0.5, 0]} castShadow>
          <boxGeometry args={[0.8, 0.8, 0.8]} />
          <MeshShaderMaterial
            color={hovered ? "#FF8A7A" : "#FF6B4A"}
            metalness={0.5}
            roughness={0.3}
          />
        </mesh>
      </group>
    </Float>
  );
};

// 3D Hero Scene
const ThreeDScene = () => {
  return (
    <>
      <ambientLight intensity={0.2} />
      <directionalLight position={[10, 10, 5]} intensity={0.8} />
      <pointLight position={[-10, -10, -5]} intensity={0.3} color="#FF6B4A" />
      <Environment preset="city" />
      <FloatingShapes />
    </>
  );
};

// Loading fallback
const ThreeDLoader = () => (
  <div className="absolute inset-0 flex items-center justify-center bg-black/30">
    <div className="text-white text-2xl">Loading 3D...</div>
  </div>
);

// 3D Hero Section
export const ThreeDHero = () => {
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 500], [0, -50]);
  const opacity = useSpring(useTransform(scrollY, [0, 600], [1, 0]));

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-hero py-16 sm:py-20">
      {/* Background gradient overlay */}
      <div className="absolute inset-0 bg-gradient-hero" aria-hidden="true" />

      {/* 3D Canvas */}
      <div className="absolute inset-0">
        <Canvas
          camera={{ position: [0, 0, 10], fov: 50 }}
          dpr={[1, 2]}
          className="w-full h-full"
          onCreated={({ gl }) => {
            gl.toneMapping = THREE.ACESFilmicToneMapping;
            gl.toneMappingExposure = 1.2;
          }}
        >
          <Suspense fallback={<ThreeDLoader />}>
            <ThreeDScene />
          </Suspense>
        </Canvas>
      </div>

      {/* Content overlay */}
      <div
        className="relative z-10 container mx-auto px-4 sm:px-6 text-center transition-all duration-700"
        style={{ y, opacity }}
      >
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "power2.out" }}
          className="mb-6"
        >
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 text-white text-sm font-medium backdrop-blur-sm">
            <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
            Interactive 3D Experience
          </span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "power2.out" }}
          className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-display font-bold text-white mb-6"
        >
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-white/60">
            We build
          </span>
          <br />
          <span className="text-white">brands that</span>
          <br />
          <span className="text-white">people remember.</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "power2.out", delay: 0.2 }}
          className="text-lg sm:text-xl text-white/80 max-w-2xl mx-auto mb-8"
        >
          Premium creative design and marketing solutions for startups,
          SMEs, and enterprises across India. Experience the future of
          interactive branding.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "power2.out", delay: 0.3 }}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          <button className="h-12 px-8 rounded-lg bg-white text-black font-semibold hover:bg-gray-100 transition-all hover:scale-105">
            Get Free Consultation
            <span className="ml-2">→</span>
          </button>
          <button className="h-12 px-8 rounded-lg border border-white/30 text-white font-semibold hover:bg-white/10 transition-all hover:scale-105">
            Explore 3D Experience
          </button>
        </motion.div>
      </div>

      {/* Custom cursor glow */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 pointer-events-none">
        <motion.div
          className="w-16 h-16 rounded-full bg-white/10 backdrop-blur-sm border border-white/20"
          animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 2, repeat: Infinity }}
        />
      </div>
    </section>
  );
};

export default ThreeDHero;