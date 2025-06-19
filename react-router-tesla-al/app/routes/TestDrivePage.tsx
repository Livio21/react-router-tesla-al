import { Canvas } from "@react-three/fiber";
import { memo, Suspense, useCallback, useEffect, useRef } from "react";
import { Html } from "@react-three/drei";
import { CameraControls } from "components/CameraControls";
import { Model3 } from "components/Model3";
import { ContactShadows, Environment } from "@react-three/drei";

const Scene = memo(
  ({
    cameraResetPosition,
  }: {
    cameraResetPosition: [number, number, number];
  }) => {
    const controlsRef = useRef<CameraControls | null>(null);
    const isMobile = typeof window !== 'undefined' && (window.innerWidth <= 900 || /Mobi|Android/i.test(navigator.userAgent));

    const handleControlStart = useCallback(() => {
      if (window.resetTimer) clearTimeout(window.resetTimer);
    }, []);

    const handleControlEnd = useCallback(() => {
      window.resetTimer = window.setTimeout(() => {
        controlsRef.current?.setPosition(...cameraResetPosition, true);
      }, 5000);
    }, [cameraResetPosition]);

    useEffect(() => {
      controlsRef.current?.setPosition(...cameraResetPosition, true);
      return () => {
        if (window.resetTimer) clearTimeout(window.resetTimer);
      };
    }, [cameraResetPosition]);

    return (
      <Canvas
        shadows
        dpr={isMobile ? 0.7 : 1}
        frameloop="demand"
        performance={{ min: 0.5, max: 1, debounce: 200 }}
        gl={{
          powerPreference: "high-performance",
          antialias: false,
          alpha: true,
          stencil: false,
          preserveDrawingBuffer: false,
        }}
        camera={{ position: cameraResetPosition, fov: 35 }}
        className="w-full h-full bg-white dark:bg-zinc-900"
      >
        <CameraControls
          ref={controlsRef}
          makeDefault
          minPolarAngle={Math.PI / 4}
          maxPolarAngle={Math.PI / 2}
          polarAngle={Math.PI / 3}
          azimuthAngle={Math.PI + Math.PI / 4}
          distance={6}
          restThreshold={0.001}
          dampingFactor={0.05}
          minDistance={4}
          maxDistance={8}
          smoothTime={0.3}
          onControlStart={handleControlStart}
          onControlEnd={handleControlEnd}
        />
        <ambientLight intensity={0.4} />
        <spotLight
          position={[10, 15, 10]}
          angle={0.3}
          penumbra={1}
          intensity={0.5}
          castShadow
          shadow-mapSize={[128, 128]}
        />
        <Suspense
          fallback={
            <Html center className="text-zinc-400">
              Loading 3D...
            </Html>
          }
        >
          <Center>
            <Model3 />
          </Center>
          <ContactShadows
            position={[0, -0.3, 0]}
            opacity={0.4}
            scale={10}
            blur={2}
            far={1.2}
            resolution={64}
          />
        </Suspense>
        <Environment preset="sunset" background={false} blur={0.7} />
      </Canvas>
    );
  }
);

export default Scene;