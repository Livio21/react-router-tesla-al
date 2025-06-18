import { Canvas } from "@react-three/fiber";
import {
  PresentationControls,
  useGLTF,
  AdaptiveDpr,
  ContactShadows,
  Environment,
  Center,
  CameraControls,
  Line,
  Html,
} from "@react-three/drei";
import {
  Suspense,
  useRef,
  useState,
  useEffect,
  memo,
  useCallback,
} from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";

declare global {
  interface Window {
    resetTimer: number | undefined;
  }
}

// Preload the model for better performance
useGLTF.preload("/model-3/scene.gltf");

const Model3 = memo(function Model3() {
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
        <Html position={[0, 2, 0]} style={{ color: "black", fontSize: "12px" }}>
          <div className="p-4">
            <span className="text-lg text-zinc-600">Model 3</span>
          </div>
        </Html>
      </group>
    </group>
  );
});

const Scene = memo(
  ({
    cameraResetPosition,
  }: {
    cameraResetPosition: [number, number, number];
  }) => {
    const controlsRef = useRef<CameraControls | null>(null);

    const handleControlStart = useCallback(() => {
      if (window.resetTimer) clearTimeout(window.resetTimer);
    }, []);

    const handleControlEnd = useCallback(() => {
      window.resetTimer = window.setTimeout(() => {
        if (controlsRef.current) {
          controlsRef.current.setPosition(...cameraResetPosition, true);
        }
      }, 5000);
    }, [cameraResetPosition]);

    useEffect(() => {
      if (controlsRef.current) {
        controlsRef.current.setPosition(...cameraResetPosition, true);
      }
      return () => {
        if (window.resetTimer) clearTimeout(window.resetTimer);
      };
    }, [cameraResetPosition]);

    return (
      <Canvas
        shadows
        dpr={1}
        gl={{
          powerPreference: "high-performance",
          antialias: true,
          alpha: true,
          stencil: false,
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
        <ambientLight intensity={0.5} />
        <spotLight
          position={[10, 15, 10]}
          angle={0.3}
          penumbra={1}
          intensity={0.7}
          castShadow
          shadow-mapSize={[256, 256]}
        />
        <Suspense fallback={<Html center className='text-zinc-400'>Loading 3D...</Html>}>
          <Center>
            <Model3 />
          </Center>
          <ContactShadows
            position={[0, -0.3, 0]}
            opacity={0.5}
            scale={12}
            blur={2.5}
            far={1.5}
            resolution={128}
          />
        </Suspense>
        <Environment preset="city" />
      </Canvas>
    );
  }
);

function TripsCard() {
  return (
    <div className="rounded-lg drop-shadow-lg text-gray-700 dark:text-gray-200 bg-slate-50 dark:bg-zinc-900 h-full w-full min-w-[220px] min-h-[140px] snap-center transition-colors duration-300 p-4 text-sm">
      <div className="w-full h-full grid grid-cols-3 grid-rows-1 gap-4">
        <div className="flex flex-col justify-between w-full h-full">
          <span className="text-zinc-500 dark:text-zinc-400">Current Trip</span>
          <span className="font-semibold">12.3 km</span>
          <span className="font-semibold">1.1 kWh</span>
          <span className="font-semibold">180 Wh/km</span>
        </div>
        <div className="flex flex-col justify-between w-full h-full">
          <span className="text-zinc-500 dark:text-zinc-400">Since Charge</span>
          <span className="font-semibold">12.3 km</span>
          <span className="font-semibold">1.1 kWh</span>
          <span className="font-semibold">180 Wh/km</span>
        </div>
        <div className="flex flex-col justify-between w-full h-full">
          <span className="text-zinc-500 dark:text-zinc-400">Trip A</span>
          <span className="font-semibold">12.3 km</span>
          <span className="font-semibold">1.1 kWh</span>
          <span className="font-semibold">180 Wh/km</span>
        </div>
      </div>
    </div>
  );
}

function MusicCard() {
  return (
    <div className="grid grid-flow-row grid-rows-[1fr_0.1fr_1fr] text-gray-700 dark:text-gray-200 bg-slate-50 dark:bg-zinc-900 h-full w-full min-w-[220px] max-h-[140px] snap-center transition-colors duration-300 rounded-lg drop-shadow-lg text-xs flex-1">
      <div className="grid grid-rows-1 grid-cols-[0.3fr_1fr_0.2fr_0.2fr] items-center w-full gap-3">
        <img
          src="/Cybertruck.jpg"
          alt=""
          className="object-cover aspect-square"
        />
        <div className="flex flex-col w-full overflow-hidden">
          <span className="font-semibold text-sm truncate">Song Title</span>
          <span className="text-gray-500 dark:text-gray-400 text-xs truncate">Artist - Album</span>
        </div>
        <span className="material-symbols-outlined">shuffle</span>
        <span className="material-symbols-outlined">laps</span>
      </div>
      <div className="relative w-full h-[2px] bg-white/80 dark:bg-zinc-700">
        <div className="absolute top-1/2 -translate-y-1/2 translate-x-[50px] w-[8px] h-[8px] rounded-full bg-zinc-400 dark:bg-zinc-500"></div>
      </div>
      <div className="flex items-center justify-between w-full h-full flex-1">
        <span className="material-symbols-outlined flex-1 text-center">
          skip_previous
        </span>
        <span className="material-symbols-outlined flex-1 text-center">
          play_arrow
        </span>
        <span className="material-symbols-outlined flex-1 text-center">
          skip_next
        </span>
        <span className="material-symbols-outlined flex-1 text-center">
          thumb_up
        </span>
        <span className="material-symbols-outlined flex-1 text-center">
          instant_mix
        </span>
        <span className="material-symbols-outlined flex-1 text-center">
          search
        </span>
      </div>
    </div>
  );
}

function TireCard() {
  return (
    <div className="rounded-lg drop-shadow-lg flex text-gray-700 dark:text-gray-200 bg-slate-50 dark:bg-zinc-900 h-full min-w-[220px] min-h-[140px] max-w-full snap-center transition-colors duration-300 p-2 text-sm justify-center">
      <span className="w-full font-medium p-3">Tire pressure</span>
      <div className="grid grid-cols-3 grid-rows-2 gap-2 w-full">
        <div className="flex flex-col justify-center items-center">
          <span>44 </span>
          <span className="text-[0.7em] text-zinc-500 dark:text-zinc-400">psi</span>
        </div>
        <div className="row-span-2 p-2 self-center">
          <img src="/model-3-car-top-down.png" alt="" />
        </div>
        <div className="flex flex-col justify-center items-center">
          <span>44 </span>
          <span className="text-[0.7em] text-zinc-500 dark:text-zinc-400">psi</span>
        </div>
        <div className="flex flex-col justify-center items-center">
          <span>44 </span>
          <span className="text-[0.7em] text-zinc-500 dark:text-zinc-400">psi</span>
        </div>
        <div className="flex flex-col justify-center items-center">
          <span>44 </span>
          <span className="text-[0.7em] text-zinc-500 dark:text-zinc-400">psi</span>
        </div>
      </div>
    </div>
  );
}

function InfoCardCarousel() {
  // Order: Music, Tires, Trips
  const infoCards = [MusicCard, TireCard, TripsCard];
  const [index, setIndex] = useState(0);

  return (
    <div className="flex flex-col items-center w-full h-full px-4 py-2 z-20">
      <Swiper
        spaceBetween={16}
        slidesPerView={1}
        onSlideChange={(swiper) => setIndex(swiper.activeIndex)}
        className="w-full h-full"
      >
        {infoCards.map((Card, i) => (
          <SwiperSlide key={i}>
            <div className="w-full h-full flex items-center justify-center">
              <Card />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
      <div className="flex gap-1 mt-2">
        {infoCards.map((_, i) => (
          <span
            key={i}
            className={`w-[5px] h-[5px] rounded-full ${i === index ? "bg-zinc-600 dark:bg-zinc-200" : "bg-zinc-400 dark:bg-zinc-600"} inline-block`}
          />
        ))}
      </div>
    </div>
  );
}

// Contact form component
function ContactForm({ onClose }: { onClose: () => void }) {
  return (
    <motion.div
      className="absolute inset-0 z-20 rounded-t-md mt-10 shadow-[0_0_10px_rgba(0,0,0,0.5)] overflow-hidden bg-zinc-200 text-zinc-800 dark:bg-zinc-800 dark:text-zinc-200 transition-colors duration-300"
      initial={{ y: "100%" }}
      animate={{ y: 0 }}
      exit={{ y: "100%" }}
      transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
    >
      <div className="grid grid-rows-1 grid-cols-[0.4fr_1fr] size-full mt-10">
        <div className="flex flex-col w-full overflow-y-auto px-6 gap-4 text-gray-400 font-[530] text-lg">
          <div className="w-full active:bg-white/90 hover:bg-white/90 active:text-gray-800 hover:text-gray-800 px-4 py-2 rounded-md flex items-center gap-3">
            <span className="material-symbols-outlined">lock</span>
            <span>Phone</span>
          </div>
        </div>
        <form className=""></form>
      </div>
    </motion.div>
  );
}

function CarSettings({ onClose }: { onClose: () => void }) {
  return (
    <motion.div
      className="absolute inset-0 z-20 rounded-t-md mt-10 shadow-[0_0_10px_rgba(0,0,0,0.5)] overflow-hidden bg-zinc-200 text-zinc-800 dark:bg-zinc-800 dark:text-zinc-200 transition-colors duration-300"
      initial={{ y: "100%" }}
      animate={{ y: 0 }}
      exit={{ y: "100%" }}
      transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
    >
      <div className="grid grid-rows-1 grid-cols-[0.4fr_1fr] size-full mt-10">
        <div className="flex flex-col w-full overflow-y-auto px-6 gap-4 text-gray-400 font-[530] text-lg">
          <div className="w-full active:bg-white/90 hover:bg-white/90 active:text-gray-800 hover:text-gray-800 px-4 py-2 rounded-md flex items-center gap-3">
            <span className="material-symbols-outlined">lock</span>
            <span>Phone</span>
          </div>
        </div>
        <form className=""></form>
      </div>
    </motion.div>
  );
}

// Map component with Leaflet
function MapView({ onClose }: { onClose: () => void }) {
  const mapRef = useRef<HTMLDivElement>(null);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!isClient || !mapRef.current) return;

    // Dynamically import Leaflet
    Promise.all([import("leaflet"), import("leaflet/dist/leaflet.css")]).then(
      ([L]) => {
        const mapInstance = L.default
          .map(mapRef.current!, {
            zoomControl: false,
            attributionControl: false,
          })
          .setView([41.336260751300564, 19.515695697066924], 15);

        L.default
          .tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
            maxZoom: 19,
          })
          .addTo(mapInstance);

        // Add custom marker
        const customIcon = L.default.icon({
          iconUrl: "/screen-icons/map-pin.png",
          iconSize: [40, 40],
          iconAnchor: [20, 40],
        });

        L.default
          .marker([41.336260751300564, 19.515695697066924], {
            icon: customIcon,
          })
          .addTo(mapInstance)
          .bindPopup("Our Location");

        return () => {
          mapInstance.remove();
        };
      }
    );
  }, [isClient]);

  return (
    <div className="h-full w-full">
      <div ref={mapRef} className="w-full h-full" />
    </div>
  );
}

// Seat heater component with heat level support
function SeatHeater({
  heatLevel = 0,
  rightSide = false,
}: {
  heatLevel?: number;
  rightSide?: boolean;
}) {
  return (
    <div className="relative">
      <img
        src="/screen-icons/car-seat-icon-sm.png"
        className={"h-[40px] invert" + (rightSide ? " rotate-y-180" : "")}
        alt="Seat"
      />
      {heatLevel > 0 && (
        <div
          className={
            "absolute bottom-7 " +
            (rightSide ? "right-6 " : "left-10 rotate-y-180") +
            " flex flex-col justify-center items-center rotate-90"
          }
        >
          {Array.from({ length: heatLevel }).map((_, i) => (
            <motion.svg
              key={i}
              width="24"
              height="6"
              viewBox="0 0 24 6"
              className="absolute"
              style={{ top: `${i * 6}px` }}
              initial={{ opacity: 0, pathLength: 0 }}
              animate={{ opacity: 1, pathLength: 1 }}
              transition={{
                duration: 0.5,
                delay: i * 0.2,
                ease: "easeOut",
              }}
            >
              <motion.path
                d="M4 3 C7 -3, 15 10, 20 3"
                fill="none"
                stroke="red"
                strokeWidth="3"
                strokeLinecap="round"
              />
            </motion.svg>
          ))}
        </div>
      )}
    </div>
  );
}

// Volume control component with level indicators
function VolumeControl({ level = 0 }: { level?: number }) {
  return (
    <div className="relative">
      <img
        src="/screen-icons/volume.png"
        alt="Volume"
        className="max-h-[30px] invert"
      />{" "}
      {level > 0 && (
        <div className="absolute top-1/2 left-full ml-2 -translate-y-1/2 flex flex-col items-start">
          <svg width="40" height="40" style={{ display: "block" }}>
            {Array.from({ length: level }).map((_, i) => {
              const r = 1 + i * 5; // radius grows for each level
              const cx = 0,
                cy = 20;
              // Draw right half circle
              return (
                <path
                  key={i}
                  d={`M ${cx} ${cy - r} A ${r} ${r} 0 0 1 ${cx - 1} ${cy + r}`}
                  fill="none"
                  stroke="white"
                  strokeWidth="3"
                  strokeLinecap="round"
                />
              );
            })}
          </svg>
        </div>
      )}
    </div>
  );
}

function ChooseCar({ onClose }: { onClose: () => void }) {
  return (
    <motion.div
      className="absolute inset-0 z-20 rounded-t-md mt-10 shadow-[0_0_10px_rgba(0,0,0,0.5)] overflow-hidden bg-zinc-200 text-zinc-800 dark:bg-zinc-800 dark:text-zinc-200 transition-colors duration-300"
      initial={{ y: "100%" }}
      animate={{ y: 0 }}
      exit={{ y: "100%" }}
      transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
    >
      <div className="grid grid-rows-1 grid-cols-[0.4fr_1fr] size-full mt-10">
        <div className="flex flex-col w-full overflow-y-auto px-6 gap-4 text-gray-400 font-[530] text-lg">
          <div className="w-full active:bg-white/90 hover:bg-white/90 active:text-gray-800 hover:text-gray-800 px-4 py-2 rounded-md flex items-center gap-3">
            <span className="material-symbols-outlined">lock</span>
            <span>Phone</span>
          </div>
        </div>
        <form className=""></form>
      </div>
    </motion.div>
  );
}

export default function TestDrivePage() {
  const [activeApp, setActiveApp] = useState<"contact" | "map" | "car">("map");
  const [cameraResetPosition] = useState<[number, number, number]>([-4, 2, -4]);
  const [driverTemp, setDriverTemp] = useState<number>(22);
  const [passengerTemp, setPassengerTemp] = useState<number>(22);
  const [driverSeatHeat, setDriverSeatHeat] = useState<number>(0);
  const [passengerSeatHeat, setPassengerSeatHeat] = useState<number>(0);
  const [volumeLevel, setVolumeLevel] = useState<number>(0);

  const handleHeatLevelChange = (
    setter: React.Dispatch<React.SetStateAction<number>>
  ) => {
    setter((current: number) => (current + 1) % 4);
  };

  const handleVolumeChange = (increment: boolean) => {
    setVolumeLevel((current) => {
      if (increment) {
        return current < 3 ? current + 1 : current;
      } else {
        return current > 0 ? current - 1 : current;
      }
    });
  };

  return (
    <div className="w-screen h-screen min-h-screen min-w-screen bg-white dark:bg-zinc-900 snap-proximity focus:outline-none transition-colors duration-300 relative overflow-hidden">
      <div className="background absolute inset-0 w-full h-full bg-[url('/model-3-screen.png')] bg-cover z-0 blur-md" />
      <div className="flex items-center justify-center w-full h-full relative z-10">
        <div className="tesla-ui aspect-[730/460] w-full max-w-[80vw] h-auto max-h-[90vh] rounded-2xl overflow-hidden font-universal-sans text-zinc-800 bg-white/80 dark:bg-zinc-900/80 shadow-2xl p-2">
          <div className="flex flex-col w-full h-full">
            <div className="flex grow">
              <div className="relative basis-1/3 flex flex-col justify-center items-center p-2 z-30">
                <div className="absolute z-30 min-h-[12.5em] w-full top-0 flex flex-col justify-between p-2 ">
                  <div className="self-end flex gap-[0.625em] items-center">
                    <span className="font-medium text-xl">44%</span>
                    <div className="relative flex items-center">
                      <svg
                        viewBox="0 0 52 24"
                        width="56"
                        height="28"
                        className="block"
                        style={{
                          minWidth: 40,
                          minHeight: 18,
                          maxWidth: 80,
                          maxHeight: 40,
                        }}
                      >
                        <rect
                          x="2"
                          y="4"
                          width="44"
                          height="16"
                          rx="2"
                          fill="#e5e7eb"
                          stroke="#a1a1aa"
                          strokeWidth="2"
                        />
                        {/* Battery level (44%) */}
                        <rect
                          x="4"
                          y="6"
                          width={Math.round(40 * 0.44)}
                          height="12"
                          rx="1"
                          fill="#52525b"
                        />
                        {/* Battery tip */}
                        <rect
                          x="48"
                          y="9"
                          width="2"
                          height="6"
                          rx="0.5"
                          fill="#e5e7eb"
                          stroke="#a1a1aa"
                          strokeWidth="1"
                        />
                      </svg>
                    </div>
                  </div>
                  <div className="self-center">
                    <span className="text-[1.5em] font-medium">Hello</span>
                  </div>
                </div>
                <div className="absolute inset-0 z-10 w-full h-full min-h-[18.75em]">
                  <Scene cameraResetPosition={cameraResetPosition} />
                </div>
                <div className="absolute bottom-0 z-20 w-full flex justify-center items-end">
                  <InfoCardCarousel />
                </div>
              </div>

              <div className="basis-2/3 z-20">
                <div className="h-full w-full flex flex-col relative">
                  <div className="absolute top-0 w-full z-30 grid grid-rows-1 grid-cols-[0.1fr_0.2fr_0.1fr_1fr] items-center p-3 h-10 text-xl text-black font-[530]">
                    {activeApp !== "map" ? (
                      <motion.button
                        onClick={() => setActiveApp("map")}
                        className="flex items-center"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <span className="material-symbols-outlined mr-1">
                          arrow_back
                        </span>
                        Back
                      </motion.button>
                    ) : (
                      <span className="material-symbols-outlined mr-1">
                        lock
                      </span>
                    )}
                    <span>11:11 am</span>
                    <span>36°C</span>
                    <div className="flex items-center align-middle gap-2">
                      <span className="material-symbols-outlined mr-1">
                        person
                      </span>
                      <span>Profile</span>
                    </div>
                    
                  </div>
                  {/* Content Area */}
                  <div className="relative w-full h-full overflow-hidden z-10">
                    {/* MapView always in background */}
                    <div className="absolute inset-0 z-0">
                      <MapView onClose={() => setActiveApp("map")} />
                    </div>
                    {/* Animated Content overlays above map with shadow */}
                    <AnimatePresence mode="wait">
                      {activeApp === "contact" && (
                        <div className="absolute inset-0 z-20 bg-transparent shadow-2xl">
                          <ContactForm
                            key="contact"
                            onClose={() => setActiveApp("map")}
                          />
                        </div>
                      )}
                      {activeApp === "car" && (
                        <div className="absolute inset-0 z-20 bg-transparent shadow-2xl">
                          <CarSettings
                            key="car-settings"
                            onClose={() => setActiveApp("map")}
                          />
                        </div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer bar */}
            <div className="grid grid-rows-1 grid-cols-[0.3fr_0.3fr_0.2fr_1fr_0.2fr_0.3fr_0.3fr] items-center place-items-center p-3 bg-black w-full h-[5em] text-white text-[0.875em]">
              {" "}
              <div className="place-self-start ml-5">
                <button
                  onClick={() =>
                    setActiveApp(activeApp === "car" ? "map" : "car")
                  }
                  className={`p-2 rounded-lg transition-colors 
                  ${
                    activeApp === "car"
                      ? "bg-gray-700"
                      : "hover:bg-gray-700/50 active:bg-gray-700"
                  }`}
                >
                  <img
                    src="/screen-icons/car-icon.png"
                    className="w-[50px]"
                    alt="Car"
                  />
                </button>
              </div>
              {/* Driver Temperature */}
              <div className="flex items-center justify-evenly w-full gap-2">
                {" "}
                <button
                  className="text-white/40 p-1 rounded transition-colors hover:bg-gray-700/50 active:bg-gray-700"
                  onClick={() =>
                    setDriverTemp((d: number) => Math.max(15, d - 1))
                  }
                >
                  <span className="material-symbols-outlined">
                    chevron_left
                  </span>
                </button>
                <div className="">
                  <div className="text-4xl font-medium">{driverTemp}°</div>
                </div>{" "}
                <button
                  className="text-white/40 p-1 rounded transition-colors hover:bg-gray-700/50 active:bg-gray-700"
                  onClick={() =>
                    setDriverTemp((d: number) => Math.min(30, d + 1))
                  }
                >
                  <span className="material-symbols-outlined">
                    chevron_right
                  </span>
                </button>
              </div>{" "}
              {/* Driver Seat Heater */}
              <motion.button
                className="p-2 rounded-lg transition-colors hover:bg-gray-700/50 active:bg-gray-700"
                onClick={() => handleHeatLevelChange(setDriverSeatHeat)}
              >
                <SeatHeater heatLevel={driverSeatHeat} rightSide={false} />
              </motion.button>{" "}
              <div className="flex items-center justify-evenly w-full gap-2">
                <button
                  onClick={() =>
                    setActiveApp(activeApp === "contact" ? "map" : "contact")
                  }
                  className={`p-2 rounded-lg transition-colors 
                    ${
                      activeApp === "contact"
                        ? "bg-gray-700"
                        : "hover:bg-gray-700/50 active:bg-gray-700"
                    }`}
                >
                  <img
                    src="/screen-icons/phone.png"
                    alt="Phone"
                    className="h-[40px]"
                  />
                </button>

                <button className="p-2 rounded-lg transition-colors hover:bg-gray-700/50 active:bg-gray-700">
                  <img
                    src="/screen-icons/music-icon.png"
                    alt="Music"
                    className="h-[40px]"
                  />
                </button>
                <button className="p-2 rounded-lg transition-colors hover:bg-gray-700/50 active:bg-gray-700">
                  <img
                    src="/screen-icons/camera-icon.png"
                    alt="Camera"
                    className="h-[40px]"
                  />
                </button>
                <button className="p-2 rounded-lg transition-colors hover:bg-gray-700/50 active:bg-gray-700">
                  <img
                    src="/screen-icons/calendar-icon.png"
                    alt="Calendar"
                    className="h-[40px]"
                  />
                </button>
                <button className="p-2 rounded-lg transition-colors hover:bg-gray-700/50 active:bg-gray-700">
                  <img
                    src="/screen-icons/settings-icon.png"
                    alt="Settings"
                    className="h-[40px]"
                  />
                </button>
              </div>
              <motion.button
                className="p-2 rounded-lg transition-colors hover:bg-gray-700/50 active:bg-gray-700"
                onClick={() => handleHeatLevelChange(setPassengerSeatHeat)}
              >
                <SeatHeater heatLevel={passengerSeatHeat} rightSide={true} />
              </motion.button>
              <div className="flex items-center justify-evenly w-full gap-2">
                {" "}
                <button
                  className="text-white/40 p-1 rounded transition-colors hover:bg-gray-700/50 active:bg-gray-700"
                  onClick={() =>
                    setPassengerTemp((p: number) => Math.max(15, p - 1))
                  }
                >
                  <span className="material-symbols-outlined">
                    chevron_left
                  </span>
                </button>
                <div className="flex ">
                  <div className="text-4xl font-medium">{passengerTemp}°</div>
                </div>{" "}
                <button
                  className="text-white/40 p-1 rounded transition-colors hover:bg-gray-700/50 active:bg-gray-700"
                  onClick={() =>
                    setPassengerTemp((p: number) => Math.min(30, p + 1))
                  }
                >
                  <span className="material-symbols-outlined">
                    chevron_right
                  </span>
                </button>
              </div>{" "}
              {/* Volume Control */}
              <div className="flex items-center justify-evenly w-full h-full gap-2">
                <button
                  className="p-1 rounded transition-colors hover:bg-gray-700/50 active:bg-gray-700"
                  onClick={() => handleVolumeChange(false)}
                >
                  <span className="material-symbols-outlined text-white/40">
                    chevron_left
                  </span>
                </button>
                <VolumeControl level={volumeLevel} />
                <button
                  className="p-1 rounded transition-colors hover:bg-gray-700/50 active:bg-gray-700"
                  onClick={() => handleVolumeChange(true)}
                >
                  <span className="material-symbols-outlined text-white/40">
                    chevron_right
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
