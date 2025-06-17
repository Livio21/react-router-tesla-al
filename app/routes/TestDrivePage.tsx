import { Canvas } from "@react-three/fiber";
import {
  PresentationControls,
  useGLTF,
  AdaptiveDpr,
  ContactShadows,
  Environment,
  Center,
  CameraControls,
  PerspectiveCamera,
  Line,
  Html,
} from "@react-three/drei";
import { Suspense, useRef, useState } from "react";
import { div } from "framer-motion/client";

declare global {
  interface Window {
    resetTimer: NodeJS.Timeout | undefined;
  }
}

function Model3() {
  const { scene } = useGLTF("/model-3/scene.gltf");

  return (
    <group>
      <primitive object={scene} scale={0.004} position={[0, 1, 0]} />
      <group position={[0, 0.5, 1]}>
        <Line
          points={[
            [0, 0.7, 0],
            [0, 1.4, 0],
          ]}
          color="black"
          lineWidth={1}
        />
        <Html
          position={[0, 2, 0]}
          style={{ color: "black", fontSize: "12px" }}
        >
          <div className=" p-4">
            <span className="text-lg text-zinc-600">Model 3</span>
          </div>
        </Html>
      </group>
    </group>
  );
}

export default function TestDrivePage() {
  const Scene = () => {
    const controlsRef = useRef<CameraControls | null>(null);
    return (
      <Canvas
        shadows
        dpr={[1, 2]}
        gl={{
          powerPreference: "low-power",
          antialias: true,
          alpha: true,
          stencil: false,
        }}
        camera={{ position: [0, 0, 6], fov: 35 }}
        style={{
          width: "100%",
          height: "100%",
          background: "white",
        }}
      >
        <CameraControls
          ref={controlsRef}
          makeDefault
          minPolarAngle={Math.PI / 4}
          maxPolarAngle={Math.PI / 2.5}
          polarAngle={Math.PI / 3}
          distance={6}
          restThreshold={0.001}
          dampingFactor={0.05}
          minDistance={4}
          maxDistance={8}
          smoothTime={0.3}
          onControlStart={() => {
            if (window.resetTimer) clearTimeout(window.resetTimer);
          }}
          onControlEnd={() => {
            // Set a new reset timer
            window.resetTimer = setTimeout(() => {
              if (controlsRef.current) {
                controlsRef.current.setPosition(-5, 4, -6, true);
              }
            }, 1000); // Reset after 5 seconds of inactivity
          }}
        />
        <ambientLight intensity={0.7} />
        <spotLight
          position={[10, 15, 10]}
          angle={0.3}
          penumbra={1}
          intensity={1}
          castShadow
          shadow-mapSize={[512, 512]}
        />
        <Suspense fallback={null}>
          <Center>
            <Model3 />
          </Center>
          <ContactShadows
            position={[0, -0.3, 0]}
            opacity={0.65}
            scale={12}
            blur={2.5}
            far={1.5}
            resolution={256}
          />
          <AdaptiveDpr pixelated />
        </Suspense>
        <Environment preset="city" />
      </Canvas>
    );
  };

  return (
    <div className=" w-full h-full p-16 bg-white snap-proximity ">
      <div className="snap-y snap-center flex flex-col items-center justify-center ring-[15px] ring-offset-1 py-8 ring-zinc-800 rounded-3xl">
        {/* <div className="w-full fixed inset-0">
        <img
          src="/model-3-screen.png"
          alt=""
          className="object-cover w-full h-full overflow-hidden"
        />
      </div> */}

        <div
          className="aspect-[730/460] w-full h-full max-h-[90dvh] max-w-[90dvw] rounded-2xl overflow-hidden font-universal-sans ring-[40px]"
          style={{ fontSize: "clamp(8px, 1.2vw, 16px)" }}
        >
          <div className="flex flex-col w-full h-full ">
            <div className="flex grow">
              {/* Left side */}
              <div className="relative basis-1/3 grid grid-cols-1 grid-rows-[0.3fr_1fr_0.3fr] gap-[1em]">
                <div className="absolute z-20 min-h-[12.5em] w-full top-0 flex flex-col justify-between p-2">
                  <div className="self-end flex gap-[0.625em] items-center">
                    <span className="font-medium text-xl">44%</span>
                    <div className="relative flex">
                      <div className="w-14 h-6 bg-gray-200 p-[0.1875em] rounded-[0.125em]">
                        <div className="w-full h-full bg-gray-100 rounded-[0.125em]">
                          <div className="w-1/2 h-full bg-gray-500 rounded-[0.125em]"></div>
                        </div>
                      </div>
                      <div className="bg-gray-200 w-[0.3125em] ml-[0.125em] my-[0.3125em] rounded-full"></div>
                    </div>
                  </div>
                  <div className="self-center">
                    <span className="text-[1.5em] font-medium">Hello</span>
                  </div>
                </div>
                <div className="absolute inset-0 z-10 w-full h-full min-h-[18.75em]">
                  <Scene />
                </div>
                <div className="absolute bottom-0 z-20 p-4">
                  <div className="rounded-[0.5em] shadow-xl flex text-gray-600 bg-slate-50 h-full w-full">
                    <span className="basis-1/3 p-[1.25em] w-full text-[1.125em]">
                      Tire pressure
                    </span>
                    <div className="basis-2/3 grid grid-cols-3 grid-rows-2 p-[1.25em]">
                      <div className="flex flex-col justify-center items-center">
                        <span>44 psi</span>
                        <span className="text-[0.75em] text-zinc-500">
                          5 min ago
                        </span>
                      </div>
                      <img
                        className="row-span-2 w-full h-full p-[1.875em] object-cover"
                        src="/model-3-car-top-down.png"
                        alt=""
                      />
                      <div className="flex flex-col justify-center items-center">
                        <span>44 psi</span>
                        <span className="text-[0.75em] text-zinc-500">
                          5 min ago
                        </span>
                      </div>
                      <div className="flex flex-col justify-center items-center">
                        <span>44 psi</span>
                        <span className="text-[0.75em] text-zinc-500">
                          5 min ago
                        </span>
                      </div>
                      <div className="flex flex-col justify-center items-center">
                        <span>44 psi</span>
                        <span className="text-[0.75em] text-zinc-500">
                          5 min ago
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right side: Map */}
              <div className="basis-2/3">
                <div className="h-full w-full flex flex-col relative ">
                  <div className=" grid grid-rows-1 grid-cols-[0.1fr_0.1fr_0.1fr_1fr_0.1fr] items-center p-2 z-10 bg-gradient-to-t from-transparent to-black/50 text-white font-medium text-lg">
                    <img className="w-[30px]" src="/screen-icons/lock.png" />
                    <span>11:11 am</span>
                    <span>36°C</span>
                    <div className="flex items-center align-middle gap-2">
                      <img
                        className="w-[30px]"
                        src="/screen-icons/profile.png"
                      />
                      <span>Profile</span>
                    </div>
                    <div className="border-4 p-1 border-white/70 rounded-lg w-fit text-white font-bold text-sm place-self-end">
                      SOS
                    </div>
                  </div>
                  <img
                    src="/screen-icons/image.png"
                    alt="Map Placeholder"
                    className="w-full h-full object-cover absolute inset-0 z-0"
                  />
                </div>
              </div>
            </div>

            {/* Footer bar */}
            <div className="grid grid-rows-1 grid-cols-[0.3fr_0.3fr_0.2fr_1fr_0.2fr_0.3fr_0.3fr] items-center place-items-center p-3 bg-black w-full h-[4em]  text-white text-[0.875em]">
              <div className=" place-self-start ml-5">
                <img
                  src="/screen-icons/car-icon.png"
                  className="w-[50px]"
                  alt=""
                />
              </div>
              <div className="flex items-center justify-evenly w-full gap-2">
                <span className="material-symbols-outlined text-white/40">
                  chevron_left
                </span>
                <span className="text-4xl font-medium">25</span>
                <span className="material-symbols-outlined text-white/40">
                  chevron_right
                </span>
              </div>
              <div className="invert">
                <img
                  src="/screen-icons/car-seat-icon-sm.png"
                  className="h-[40px]"
                  alt=""
                />
              </div>
              <div className=" flex items-center justify-evenly w-full gap-2">
                <img
                  src="/screen-icons/phone.png"
                  alt=""
                  className="h-[40px]"
                />
                <img
                  src="/screen-icons/map-icon.png"
                  alt=""
                  className="h-[40px]"
                />
                <img
                  src="/screen-icons/map-icon.png"
                  alt=""
                  className="h-[40px]"
                />
                <img
                  src="/screen-icons/map-icon.png"
                  alt=""
                  className="h-[40px]"
                />
                <img
                  src="/screen-icons/map-icon.png"
                  alt=""
                  className="h-[40px]"
                />
                <img
                  src="/screen-icons/map-icon.png"
                  alt=""
                  className="h-[40px]"
                />
              </div>
              <div className="w-[50px] invert rotate-y-180">
                <img
                  src="/screen-icons/car-seat-icon-sm.png"
                  className="h-[40px]"
                  alt=""
                />
              </div>
              <div className="flex items-center justify-evenly w-full gap-2">
                <span className="material-symbols-outlined text-white/40">
                  chevron_left
                </span>
                <span className="text-4xl font-medium">25</span>
                <span className="material-symbols-outlined text-white/40">
                  chevron_right
                </span>
              </div>
              <div className="flex items-center justify-evenly w-full  gap-2">
                <span className="material-symbols-outlined text-white/40">
                  chevron_left
                </span>
                <img
                  src="/screen-icons/volume.webp"
                  alt=""
                  className="h-[30px] invert"
                />
                <span className="material-symbols-outlined text-white/40">
                  chevron_right
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
