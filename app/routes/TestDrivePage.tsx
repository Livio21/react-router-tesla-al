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
  useMemo,
} from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import PaintIcon from "../components/PaintIcon";
import { client } from "../sanity/client";
import imageUrlBuilder from "@sanity/image-url";
import {
  MapPinIcon,
  PhoneIcon,
  DevicePhoneMobileIcon,
  EnvelopeIcon,
  ChatBubbleLeftRightIcon,
  PlayIcon,
  ChatBubbleLeftIcon,
  ChatBubbleOvalLeftEllipsisIcon,
  PhotoIcon,
  ChevronRightIcon,
  PaperAirplaneIcon,
  DocumentTextIcon,
  TruckIcon,
  ArrowRightIcon,
  CheckIcon,
} from "@heroicons/react/24/solid";
import { ArrowTopRightOnSquareIcon } from "@heroicons/react/24/outline";

declare global {
  interface Window {
    resetTimer: number | undefined;
  }
}

// Preload the model for better performance
useGLTF.preload("/model-3/scene.gltf");

const builder = imageUrlBuilder(client);
const urlFor = (source: any) =>
  builder.image(source).width(400).height(300).fit("crop").url();

const Model3 = memo(function Model3() {
  const { scene } = useGLTF("/model-3/scene.gltf");
  return (
    <group>
      <primitive object={scene} scale={0.004} position={[0, 1, 0]} />
      <group position={[0, 0.5, 1]}>
        <Line
          points={[
            [0, 0.9, -1],
            [0, 1.4, -0.9],
          ]}
          color="black"
          lineWidth={1}
        />
        <Html
          position={[0.2, 1.7, -0.9]}
          style={{ color: "black", fontSize: "12px" }}
        >
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

const TripsCard = memo(function TripsCard() {
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
});

const MusicCard = memo(function MusicCard() {
  const [isPlaying, setIsPlaying] = useState(true);
  const [shuffle, setShuffle] = useState(false);
  const [repeat, setRepeat] = useState(false);
  const [progress, setProgress] = useState(0.1);
  const progressBarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => {
      setProgress((p) => (p >= 1 ? 0 : p + 0.01));
    }, 2000);
    return () => clearInterval(interval);
  }, [isPlaying]);

  const handleProgressClick = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (!progressBarRef.current) return;
      const rect = progressBarRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      setProgress(Math.max(0, Math.min(1, x / rect.width)));
    },
    []
  );

  const progressBarStyle = useMemo(
    () => ({
      width: `${progress * 100}%`,
    }),
    [progress]
  );

  const thumbStyle = useMemo(
    () => ({
      left: `calc(${progress * 100}% - 4px)`,
    }),
    [progress]
  );

  return (
    <div className="grid grid-flow-row grid-rows-[1fr_0.1fr_1fr] text-gray-700 dark:text-gray-200 bg-slate-50 dark:bg-zinc-900 h-full w-full min-w-[220px] max-h-[140px] snap-center transition-colors duration-300 rounded-lg drop-shadow-lg text-xs flex-1 select-none">
      <div className="grid grid-rows-1 grid-cols-[0.3fr_1fr_0.2fr_0.2fr] items-center w-full gap-3">
        <img
          src="/Cybertruck.webp"
          alt="Album cover"
          className="object-cover aspect-square"
        />
        <div className="flex flex-col w-full overflow-hidden">
          <span className="font-semibold text-sm truncate">Song Title</span>
          <span className="text-gray-500 dark:text-gray-400 text-xs truncate">
            Artist - Album
          </span>
        </div>
        <button
          className={`material-symbols-outlined transition-colors ${
            shuffle ? "text-blue-500" : ""
          }`}
          onClick={() => setShuffle((s) => !s)}
          aria-label="Shuffle"
        >
          shuffle
        </button>
        <button
          className={`material-symbols-outlined transition-colors ${
            repeat ? "text-blue-500" : ""
          }`}
          onClick={() => setRepeat((r) => !r)}
          aria-label="Repeat"
        >
          laps
        </button>
      </div>
      <div
        className="relative w-full h-[2px] bg-white/80 dark:bg-zinc-700 cursor-pointer"
        ref={progressBarRef}
        onClick={handleProgressClick}
        aria-label="Seek bar"
      >
        <div
          className="absolute top-1/2 -translate-y-1/2 h-[8px] rounded-full bg-zinc-400 dark:bg-zinc-500 transition-all"
          style={thumbStyle}
        ></div>
        <div
          className="absolute top-0 left-0 h-full bg-blue-400/60 dark:bg-blue-500/60 rounded"
          style={progressBarStyle}
        ></div>
      </div>
      <div className="flex items-center justify-between w-full h-full flex-1">
        <button
          className="material-symbols-outlined flex-1 text-center hover:text-blue-500 transition-colors"
          aria-label="Previous"
        >
          skip_previous
        </button>
        <button
          className="material-symbols-outlined flex-1 text-center hover:text-blue-500 transition-colors"
          onClick={() => setIsPlaying((p) => !p)}
          aria-label={isPlaying ? "Pause" : "Play"}
        >
          {isPlaying ? "pause" : "play_arrow"}
        </button>
        <button
          className="material-symbols-outlined flex-1 text-center hover:text-blue-500 transition-colors"
          aria-label="Next"
        >
          skip_next
        </button>
        <button
          className="material-symbols-outlined flex-1 text-center hover:text-blue-500 transition-colors"
          aria-label="Like"
        >
          thumb_up
        </button>
        <button
          className="material-symbols-outlined flex-1 text-center hover:text-blue-500 transition-colors"
          aria-label="Instant Mix"
        >
          instant_mix
        </button>
        <button
          className="material-symbols-outlined flex-1 text-center hover:text-blue-500 transition-colors"
          aria-label="Search"
        >
          search
        </button>
      </div>
    </div>
  );
});

const TireCard = memo(function TireCard() {
  return (
    <div className="rounded-lg drop-shadow-lg flex text-gray-700 dark:text-gray-200 bg-slate-50 dark:bg-zinc-900 h-full min-w-[220px] min-h-[140px] max-w-full snap-center transition-colors duration-300 p-2 text-sm justify-center">
      <span className="w-full font-medium p-3">Tire pressure</span>
      <div className="grid grid-cols-3 grid-rows-2 gap-2 w-full">
        <div className="flex flex-col justify-center items-center">
          <span>44 </span>
          <span className="text-[0.7em] text-zinc-500 dark:text-zinc-400">
            psi
          </span>
        </div>
        <div className="row-span-2 p-2 self-center">
          <img src="/model-3-car-top-down.png" alt="Car top view" />
        </div>
        <div className="flex flex-col justify-center items-center">
          <span>44 </span>
          <span className="text-[0.7em] text-zinc-500 dark:text-zinc-400">
            psi
          </span>
        </div>
        <div className="flex flex-col justify-center items-center">
          <span>44 </span>
          <span className="text-[0.7em] text-zinc-500 dark:text-zinc-400">
            psi
          </span>
        </div>
        <div className="flex flex-col justify-center items-center">
          <span>44 </span>
          <span className="text-[0.7em] text-zinc-500 dark:text-zinc-400">
            psi
          </span>
        </div>
      </div>
    </div>
  );
});

function InfoCardCarousel() {
  const infoCards = useMemo(() => [MusicCard, TireCard, TripsCard], []);
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
            className={`w-[5px] h-[5px] rounded-full ${
              i === index
                ? "bg-zinc-600 dark:bg-zinc-200"
                : "bg-zinc-400 dark:bg-zinc-600"
            } inline-block`}
          />
        ))}
      </div>
    </div>
  );
}

// Contact form component
const ContactForm = memo(function ContactForm({
  onClose,
}: {
  onClose: () => void;
}) {
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
});

const CarSettings = memo(function CarSettings({
  onClose,
}: {
  onClose: () => void;
}) {
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
});

// Map component with Leaflet
const MapView = memo(function MapView({ onClose }: { onClose: () => void }) {
  const mapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!mapRef.current) return;

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
  }, []);

  return (
    <div className="h-full w-full">
      <div ref={mapRef} className="w-full h-full" />
    </div>
  );
});

// Seat heater component with heat level support
const SeatHeater = memo(function SeatHeater({
  heatLevel = 0,
  rightSide = false,
}: {
  heatLevel?: number;
  rightSide?: boolean;
}) {
  const heatLevels = useMemo(
    () => Array.from({ length: heatLevel }),
    [heatLevel]
  );

  return (
    <div className="relative">
      <img
        src="/screen-icons/car-seat-icon-sm.svg"
        className={`h-[40px] invert ${rightSide ? "rotate-y-180" : ""}`}
        alt="Seat"
      />
      {heatLevel > 0 && (
        <div
          className={`absolute bottom-7 ${
            rightSide ? "right-6 " : "left-10 rotate-y-180"
          } flex flex-col justify-center items-center rotate-90`}
        >
          {heatLevels.map((_, i) => (
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
});

// Volume control component with level indicators
const VolumeControl = memo(function VolumeControl({
  level = 0,
}: {
  level?: number;
}) {
  const levels = useMemo(() => Array.from({ length: level }), [level]);

  return (
    <div className="relative">
      <img
        src="/screen-icons/volume.svg"
        alt="Volume"
        className="max-h-[30px] invert"
      />{" "}
      {level > 0 && (
        <div className="absolute top-1/2 left-full ml-2 -translate-y-1/2 flex flex-col items-start">
          <svg width="40" height="40" style={{ display: "block" }}>
            {levels.map((_, i) => {
              const r = 1 + i * 5;
              return (
                <path
                  key={i}
                  d={`M 0 ${20 - r} A ${r} ${r} 0 0 1 -1 ${20 + r}`}
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
});

const initialCameraPosition: [number, number, number] = [-4, 2, -4];

// const MobileView = ()=>{
//   return (<div className="mobile-view flex flex-col items-center justify-center w-full h-full bg-white dark:bg-zinc-800 text-white">
//     <div className="flex flex-col items-center w-full min-h-[300px] max-w-[600px] relative">
//       <div className="z-10 w-full rounded-b-lg shadow-2xl bg-zinc-900 ">
//         <details open className=" p-3">
//           <summary className="flex gap-6 items-center cursor-pointer">
//             <div></div>
//             <div className="flex-1 flex items-center">
//               <span className="text-xl font-bold">TESLA</span>
//               <span className="material-symbols-outlined">
//                 keyboard_arrow_down
//               </span>
//             </div>
//             <span className="material-symbols-outlined">sms</span>
//             <span className="material-symbols-outlined">dehaze</span>
//           </summary>
//           <div className=" flex flex-col w-full h-full gap-2 p-2 ">
//             <div className="flex h-[100px] p-1 border-b-[1px] border-zinc-700 items-center justify-between">
//               <div className="flex flex-col justify-center flex-1">
//                 <span>TESLA</span>
//                 <span>99%</span>
//               </div>
//               <img
//                 src="/Mega-Menu-Vehicles-Model-3.avif"
//                 alt=""
//                 className=" max-w-[150px] object-contain"
//               />
//             </div>
//             <button className="self-start flex gap-2 items-center text-sm font-medium py-2">
//               <span className="material-symbols-outlined">add</span>
//               Add Product
//             </button>
//             <div className="rounded h-[4px] bg-white/30 w-1/4 self-center"></div>
//           </div>
//         </details>
//       </div>
//       <div className="absolute z-0 w-full min-h-[300px]">
//         <Scene cameraResetPosition={[-1.3, 0.5, -2]} />
//       </div>
//     </div>
//     <div className="z-10 flex-1 flex flex-col gap-4 w-full p-3">
//       <div className="car-actions flex justify-between items-center p-6 ">
//         <span className="material-symbols-outlined">lock</span>
//         <span className="material-symbols-outlined">lock</span>
//         <span className="material-symbols-outlined">lock</span>
//         <span className="material-symbols-outlined">lock</span>
//         <span className="material-symbols-outlined">lock</span>
//       </div>
//       <div className="bg-white/10 rounded flex justify-evenly items-center">
//         <span className="material-symbols-outlined p-4">lock</span>
//         <div className="flex flex-col flex-1 py-2">
//           <span className="flex-1 text-xl font-bold">New Update</span>
//           <span>V.1</span>
//         </div>
//         <span className="material-symbols-outlined p-4">lock</span>
//       </div>
//       <div className=" rounded flex justify-evenly items-center">
//         <span className="material-symbols-outlined p-4">lock</span>
//         <span className="flex-1 text-xl font-bold">Button</span>
//         <span className="material-symbols-outlined p-4">lock</span>
//       </div>
//     </div>
//   </div>)
// }

type ActiveView =
  | null
  | "location"
  | "contact"
  | "form"
  | "test-drive"
  | "test-drive-form"
  | "test-drive-confirm";

type CarAction = {
  icon: string;
  name: string;
  state: boolean;
};

const MobileView = () => {
  const [isDetailsOpen, setIsDetailsOpen] = useState<boolean>(false); // Closed by default
  const [activeView, setActiveView] = useState<ActiveView>(null);
  const [carActions, setCarActions] = useState<CarAction[]>([
    { icon: "lock", name: "Lock", state: true },
    { icon: "ac_unit", name: "Climate", state: false },
    { icon: "car_crash", name: "Trunk", state: false },
    { icon: "car_repair", name: "Frunk", state: false },
  ]);
  const detailsRef = useRef<HTMLDivElement>(null);
  const [cars, setCars] = useState<any[]>([]);
  const [selectedCar, setSelectedCar] = useState<any | null>(null);
  const [selectedDateTime, setSelectedDateTime] = useState<string>("");
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    date: "",
    message: "",
  });

  // Close details when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        isDetailsOpen &&
        detailsRef.current &&
        e.target instanceof Node &&
        !detailsRef.current.contains(e.target)
      ) {
        setIsDetailsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isDetailsOpen]);

  useEffect(() => {
    client
      .fetch(
        `*[_type == "car" && availability == true]{
          _id, name, brand, model, year, gallery, color, range, fuelType, mileage, currentPrice
        }`
      )
      .then(setCars);
  }, []);

  const toggleCarAction = (index: number) => {
    setCarActions((prev) => {
      const newActions = [...prev];
      newActions[index] = {
        ...newActions[index],
        state: !newActions[index].state,
      };
      return newActions;
    });
  };

  const renderView = () => {
    if (!activeView) return null;
    let content = null;
    // Remove backdrop-blur and use solid backgrounds
    const cardStyle =
      "bg-white dark:bg-zinc-900 rounded-xl p-6 shadow-xl";
    switch (activeView) {
      case "location":
        content = (
          <div className={cardStyle}>
            <div className="flex items-start justify-between mb-5">
              <h2 className="text-2xl font-bold text-zinc-800 dark:text-white flex items-center gap-2">
                <MapPinIcon className="w-6 h-6 text-red-500" />
                Location
              </h2>
            </div>

            <div className="h-64 w-full rounded-xl overflow-hidden mb-6 border-2 border-white/50 shadow-lg">
              <MapView onClose={() => setActiveView(null)} />
            </div>

            <div className="space-y-4">
              <div className="flex items-start">
                <div className="flex items-start">
                  <MapPinIcon className="w-5 h-5 text-blue-500 mt-1 flex-shrink-0" />
                  <span className="ml-2 text-zinc-700 dark:text-zinc-300">
                    Rruga e "Durresit", Xhafzotaj, Durres
                  </span>
                </div>
                <a
                  href="https://www.google.com/maps/search/?api=1&query=41.336260751300564,19.515695697066924"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center text-blue-600 dark:text-blue-400 font-medium transition hover:text-blue-700 dark:hover:text-blue-300"
                >
                  <ArrowTopRightOnSquareIcon className="w-5 h-5 mr-2" />
                  Open in Google Maps
                </a>
              </div>
              <div className="pt-4 border-t border-zinc-200 dark:border-zinc-700">
                <h3 className="font-semibold text-zinc-800 dark:text-zinc-100 mb-3 flex items-center gap-2">
                  <PhoneIcon className="w-5 h-5 text-green-500" />
                  Contact Information
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center">
                    <DevicePhoneMobileIcon className="w-5 h-5 text-gray-500 mr-2" />
                    <span className="text-zinc-700 dark:text-zinc-300">
                      +355 68 364 8244
                    </span>
                  </div>
                  <div className="flex items-center">
                    <EnvelopeIcon className="w-5 h-5 text-gray-500 mr-2" />
                    <span className="text-zinc-700 dark:text-zinc-300">
                      permakinat@gmail.com
                    </span>
                  </div>
                  <div className="flex items-center">
                    <ChatBubbleLeftRightIcon className="w-5 h-5 text-green-500 mr-2" />
                    <a
                      href="https://wa.me/355683648244"
                      className="text-blue-600 dark:text-blue-400 hover:underline"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      WhatsApp Chat
                    </a>
                  </div>
                </div>

                <div className="flex items-center mt-4 space-x-4">
                  <a
                    href="https://instagram.com/permakinat.al"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <div className="bg-gradient-to-r from-pink-500 to-purple-600 p-2 rounded-lg flex items-center">
                      <svg
                        className="w-5 h-5 text-white"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <rect
                          width="20"
                          height="20"
                          x="2"
                          y="2"
                          rx="5"
                          stroke="currentColor"
                          strokeWidth="2"
                          fill="none"
                        />
                        <circle
                          cx="12"
                          cy="12"
                          r="5"
                          stroke="currentColor"
                          strokeWidth="2"
                          fill="none"
                        />
                        <circle cx="17" cy="7" r="1.5" fill="currentColor" />
                      </svg>
                      <span className="ml-2 text-white">@permakinat.al</span>
                    </div>
                  </a>
                  <a
                    href="https://tiktok.com/@permakinat.al"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <div className="bg-black p-2 rounded-lg flex items-center">
                      <PlayIcon className="w-5 h-5 text-white" />
                      <span className="ml-2 text-white">@permakinat.al</span>
                    </div>
                  </a>
                </div>
              </div>
            </div>
          </div>
        );
        break;
      case "contact":
        content = (
          <div className={cardStyle}>
            <h2 className="text-2xl font-bold mb-6 text-zinc-800 dark:text-white flex items-center gap-2">
              <ChatBubbleLeftIcon className="w-6 h-6 text-blue-500" />
              Contact Options
            </h2>

            <div className="space-y-3">
              {[
                {
                  icon: <PhoneIcon className="w-5 h-5" />,
                  color:
                    "bg-green-100 dark:bg-green-900/50 text-green-600 dark:text-green-400",
                  label: "Call Us",
                  value: "+355 68 364 8244",
                  href: "tel:+355683648244",
                },
                {
                  icon: <EnvelopeIcon className="w-5 h-5" />,
                  color:
                    "bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400",
                  label: "Email Us",
                  value: "permakinat@gmail.com",
                  href: "mailto:permakinat@gmail.com",
                },
                {
                  icon: <ChatBubbleOvalLeftEllipsisIcon className="w-5 h-5" />,
                  color:
                    "bg-emerald-100 dark:bg-emerald-900/50 text-emerald-600 dark:text-emerald-400",
                  label: "WhatsApp",
                  value: "+355 68 364 8244",
                  href: "https://wa.me/355683648244",
                },
                {
                  icon: <PhotoIcon className="w-5 h-5" />,
                  color:
                    "bg-gradient-to-r from-pink-500 to-purple-600 text-white",
                  label: "Instagram",
                  value: "@permakinat.al",
                  href: "https://instagram.com/permakinat.al",
                },
                {
                  icon: <PlayIcon className="w-5 h-5" />,
                  color: "bg-black text-white",
                  label: "TikTok",
                  value: "@permakinat.al",
                  href: "https://tiktok.com/@permakinat.al",
                },
              ].map((item, index) => (
                <a
                  key={index}
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`flex items-center gap-4 p-4 rounded-xl transition-all hover:scale-[1.02] ${
                    index < 3
                      ? "bg-white/50 dark:bg-zinc-800/50 backdrop-blur-sm border border-zinc-200 dark:border-zinc-700 hover:shadow-md"
                      : "bg-white/80 dark:bg-zinc-800/80 backdrop-blur-sm hover:shadow-lg"
                  }`}
                >
                  <div className={`p-3 rounded-lg ${item.color}`}>
                    {item.icon}
                  </div>
                  <div className="flex-1">
                    <div className="font-medium text-zinc-800 dark:text-zinc-200">
                      {item.label}
                    </div>
                    <div className="text-zinc-600 dark:text-zinc-400">
                      {item.value}
                    </div>
                  </div>
                  <ChevronRightIcon className="w-5 h-5 text-zinc-400" />
                </a>
              ))}
            </div>
          </div>
        );
        break;
      case "form":
        content = (
          <div className={cardStyle}>
            <h2 className="text-2xl font-bold mb-6 text-zinc-800 dark:text-white flex items-center gap-2">
              <DocumentTextIcon className="w-6 h-6 text-blue-500" />
              Contact Form
            </h2>

            <form className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                    Category
                  </label>
                  <select className="w-full p-3 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white/70 dark:bg-zinc-800/70 text-zinc-800 dark:text-white backdrop-blur-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                    <option value="service">Service Inquiry</option>
                    <option value="info">General Information</option>
                    <option value="help">Technical Support</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                    Full Name
                  </label>
                  <input
                    type="text"
                    placeholder="John Doe"
                    className="w-full p-3 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white/70 dark:bg-zinc-800/70 text-zinc-800 dark:text-white backdrop-blur-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    placeholder="+355 00 000 0000"
                    className="w-full p-3 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white/70 dark:bg-zinc-800/70 text-zinc-800 dark:text-white backdrop-blur-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    placeholder="your@email.com"
                    className="w-full p-3 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white/70 dark:bg-zinc-800/70 text-zinc-800 dark:text-white backdrop-blur-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                  Message
                </label>
                <textarea
                  placeholder="How can we help you?"
                  className="w-full p-3 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white/70 dark:bg-zinc-800/70 text-zinc-800 dark:text-white backdrop-blur-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent min-h-[120px]"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white py-3 rounded-xl shadow-lg font-semibold transition-all transform hover:scale-[1.02] mt-4 flex items-center justify-center gap-2"
              >
                <PaperAirplaneIcon className="w-5 h-5" />
                Send Message
              </button>
            </form>
          </div>
        );
        break;
      case "test-drive":
        content = (
          <div className={cardStyle}>
            <div className="flex items-center mb-6">
              <button
                className="mr-2 text-zinc-500 hover:text-zinc-800 dark:text-zinc-400 dark:hover:text-white"
                onClick={() => setActiveView(null)}
                aria-label="Back"
              >
                <span className="material-symbols-outlined">arrow_back</span>
              </button>
              <h2 className="text-2xl font-bold text-zinc-800 dark:text-white flex items-center gap-2">
                <TruckIcon className="w-6 h-6 text-blue-500" />
                Schedule Test Drive
              </h2>
            </div>
            <div className="mb-5">
              <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-3">
                Select Vehicle:
              </label>
              <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2">
                {cars.map((car) => (
                  <label
                    key={car._id}
                    className={`flex items-center gap-4 p-4 rounded-xl cursor-pointer transition-all ${
                      selectedCar?._id === car._id
                        ? "bg-blue-50 dark:bg-blue-900/30 border-2 border-blue-500"
                        : "bg-white dark:bg-zinc-800 border-2 border-transparent hover:border-blue-300"
                    }`}
                  >
                    <img
                      src={
                        car.gallery?.[0]
                          ? urlFor(car.gallery[0])
                          : "/placeholder-car.jpg"
                      }
                      alt={car.name}
                      className="w-16 h-12 object-cover rounded-lg"
                    />
                    <div className="flex-1">
                      <div className="font-semibold text-zinc-800 dark:text-white">
                        {car.brand} {car.model}
                      </div>
                      <div className="text-xs text-zinc-600 dark:text-zinc-400 flex items-center gap-2 mt-1">
                        <span>{car.year}</span>•
                        <PaintIcon color={car.color || ""} />
                        <span>{car.fuelType}</span>
                        {car.range && <span>• {car.range}km range</span>}
                      </div>
                    </div>
                    <input
                      type="radio"
                      name="testdrivecar"
                      checked={selectedCar?._id === car._id}
                      onChange={() => setSelectedCar(car)}
                      className="h-5 w-5 text-blue-500 focus:ring-blue-400"
                    />
                  </label>
                ))}
              </div>
            </div>
            <button
              className={`w-full py-3 rounded-xl shadow font-semibold transition-all flex items-center justify-center gap-2 ${
                selectedCar
                  ? "bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white hover:scale-[1.02]"
                  : "bg-gray-200 dark:bg-zinc-700 text-gray-500 dark:text-zinc-400 cursor-not-allowed"
              }`}
              disabled={!selectedCar}
              onClick={() => setActiveView("test-drive-form")}
            >
              <ArrowRightIcon className="w-5 h-5" />
              Continue to Form
            </button>
          </div>
        );
        break;
      case "test-drive-form":
        content = (
          <div className={cardStyle}>
            <div className="flex items-center mb-6">
              <button
                className="mr-2 text-zinc-500 hover:text-zinc-800 dark:text-zinc-400 dark:hover:text-white"
                onClick={() => setActiveView("test-drive")}
                aria-label="Back"
              >
                <span className="material-symbols-outlined">arrow_back</span>
              </button>
              <h2 className="text-2xl font-bold text-zinc-800 dark:text-white flex items-center gap-2">
                <DocumentTextIcon className="w-6 h-6 text-blue-500" />
                Test Drive Form
              </h2>
            </div>
            <form
              className="space-y-4"
              onSubmit={e => {
                e.preventDefault();
                setActiveView("test-drive-confirm");
              }}
            >
              <div>
                <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={e => setFormData(f => ({ ...f, name: e.target.value }))}
                  placeholder="John Doe"
                  className="w-full p-3 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-800 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                  Phone Number
                </label>
                <input
                  type="tel"
                  required
                  value={formData.phone}
                  onChange={e => setFormData(f => ({ ...f, phone: e.target.value }))}
                  placeholder="+355 00 000 0000"
                  className="w-full p-3 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-800 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={e => setFormData(f => ({ ...f, email: e.target.value }))}
                  placeholder="your@email.com"
                  className="w-full p-3 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-800 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                  Date & Time
                </label>
                <input
                  type="datetime-local"
                  required
                  value={formData.date}
                  onChange={e => setFormData(f => ({ ...f, date: e.target.value }))}
                  className="w-full p-3 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-800 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                  Message
                </label>
                <textarea
                  value={formData.message}
                  onChange={e => setFormData(f => ({ ...f, message: e.target.value }))}
                  placeholder={`I'd like to test drive the ${selectedCar?.brand} ${selectedCar?.model}.`}
                  className="w-full p-3 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-800 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent min-h-[80px]"
                />
              </div>
              <button
                type="submit"
                className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white py-3 rounded-xl shadow-lg font-semibold transition-all transform hover:scale-[1.02] mt-4 flex items-center justify-center gap-2"
              >
                <PaperAirplaneIcon className="w-5 h-5" />
                Confirm Test Drive
              </button>
            </form>
          </div>
        );
        break;
      case "test-drive-confirm":
        content = (
          <div className={cardStyle}>
            <div className="flex items-center mb-6">
              <button
                className="mr-2 text-zinc-500 hover:text-zinc-800 dark:text-zinc-400 dark:hover:text-white"
                onClick={() => setActiveView("test-drive-form")}
                aria-label="Back"
              >
                <span className="material-symbols-outlined">arrow_back</span>
              </button>
              <h2 className="text-2xl font-bold text-zinc-800 dark:text-white flex items-center gap-2">
                <CheckIcon className="w-6 h-6 text-green-500" />
                Test Drive Scheduled!
              </h2>
            </div>
            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-5 mb-6">
              <div className="flex items-center gap-4 mb-4">
                <img
                  src={
                    selectedCar?.gallery?.[0]
                      ? urlFor(selectedCar.gallery[0])
                      : "/placeholder-car.jpg"
                  }
                  alt={selectedCar?.name || "Car"}
                  className="w-20 h-14 object-cover rounded-lg"
                />
                <div>
                  <h3 className="font-bold text-lg text-zinc-800 dark:text-white">
                    {selectedCar?.brand} {selectedCar?.model}
                  </h3>
                  <p className="text-zinc-600 dark:text-zinc-400 text-sm">
                    {selectedCar?.year} • {selectedCar?.color}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-4 border-t border-blue-100 dark:border-blue-800">
                <div>
                  <p className="text-sm text-zinc-600 dark:text-zinc-400">
                    Date & Time
                  </p>
                  <p className="font-medium text-zinc-800 dark:text-white">
                    {formData.date || "-"}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-zinc-600 dark:text-zinc-400">
                    Location
                  </p>
                  <p className="font-medium text-zinc-800 dark:text-white">
                    Rruga e Durresit, Durres
                  </p>
                </div>
              </div>
            </div>
            <div className="text-center text-sm text-zinc-600 dark:text-zinc-400 mb-6">
              Our representative will contact you at {formData.phone || "+355 XX XXX XXXX"} to confirm details
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setActiveView("test-drive-form")}
                className="flex-1 py-2.5 rounded-xl border border-zinc-300 dark:border-zinc-700 text-zinc-800 dark:text-zinc-200 font-medium hover:bg-zinc-100 dark:hover:bg-zinc-800 transition"
              >
                Back
              </button>
              <button
                onClick={() => setActiveView(null)}
                className="flex-1 bg-gradient-to-r from-blue-500 to-indigo-600 text-white py-2.5 rounded-xl font-medium shadow hover:from-blue-600 hover:to-indigo-700 transition"
              >
                Done
              </button>
            </div>
          </div>
        );
        break;
      default:
        return null;
    }
    return (
      <OverlayView
        onClose={() => setActiveView(null)}
        containerClass="w-full max-h-screen overflow-hidden p-4"
      >
        {content}
      </OverlayView>
    );
  };

  return (
    <div className="mobile-view flex flex-col items-center justify-center w-full h-full text-white relative overflow-hidden">
      <AnimatePresence initial={false} mode="wait">
        {!activeView && (
          <motion.div
            key="home"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="absolute inset-0 flex flex-col items-center justify-center w-full h-full"
            style={{ zIndex: 10 }}
          >
            <div className="flex flex-col items-center w-full max-w-[600px] fixed top-[68px] z-30">
              <div className="z-30 w-full rounded-b-lg shadow-2xl bg-zinc-900 ">
                <div className="p-4">
                  <div
                    className="flex gap-6 items-center cursor-pointer"
                    onClick={() => setIsDetailsOpen(!isDetailsOpen)}
                  >
                    <div></div>
                    <div className="flex-1 flex items-center">
                      <span className="text-xl font-bold">TESLA</span>
                      <span className="material-symbols-outlined ml-2">
                        {isDetailsOpen
                          ? "keyboard_arrow_up"
                          : "keyboard_arrow_down"}
                      </span>
                    </div>
                    <span className="material-symbols-outlined">sms</span>
                    <span className="material-symbols-outlined">dehaze</span>
                  </div>
                </div>
              </div>
              <div
                ref={detailsRef}
                className={`z-30 p-2 w-full bg-zinc-900 transition-all duration-300 overflow-hidden ${
                  isDetailsOpen
                    ? "max-h-[200px] opacity-100"
                    : "max-h-0 opacity-0"
                }`}
              >
                <div className="flex flex-col w-full h-full gap-2 p-2">
                  <div className="flex h-[100px] p-1 border-b-[1px] border-zinc-700 items-center justify-between">
                    <div className="flex flex-col justify-center flex-1">
                      <span>TESLA</span>
                      <span>99%</span>
                    </div>
                    <img
                      src="/Mega-Menu-Vehicles-Model-3.avif"
                      alt="Tesla Model 3"
                      className="max-w-[150px] object-contain"
                    />
                  </div>
                  <button className="self-start flex gap-2 items-center text-sm font-medium py-2">
                    <span className="material-symbols-outlined">add</span>
                    Add Product
                  </button>
                  <div className="rounded h-[4px] bg-white/30 w-1/4 self-center"></div>
                </div>
              </div>
            </div>
            <div className="z-10 flex-1 flex flex-col gap-4 w-full overflow-y-auto ">
              <div className="h-1/3">
                <Scene cameraResetPosition={[-1.3, 0.5, -2]} />
              </div>
              <div className="car-actions flex justify-evenly items-center  rounded-lg">
                {carActions.map((action, index) => (
                  <div
                    key={index}
                    className={`flex flex-col items-center justify-center p-2 aspect-square w-[70px] rounded-lg cursor-pointer transition-all ${
                      action.state
                        ? "bg-zinc-500/20 text-zinc-400"
                        : "opacity-60 hover:opacity-100"
                    }`}
                    onClick={() => toggleCarAction(index)}
                  >
                    <span className="material-symbols-outlined">
                      {action.icon}
                    </span>
                    <span className="text-xs mt-1">{action.name}</span>
                  </div>
                ))}
              </div>

              <div className="flex flex-col gap-3 p-2">
                {[
                  {
                    icon: "location_on",
                    title: "Location",
                    view: "location" as ActiveView,
                  },
                  {
                    icon: "contacts",
                    title: "Contact",
                    view: "contact" as ActiveView,
                  },
                  {
                    icon: "description",
                    title: "Form",
                    view: "form" as ActiveView,
                  },
                  {
                    icon: "directions_car",
                    title: "Test Drive",
                    view: "test-drive" as ActiveView,
                  },
                ].map((item) => (
                  <div
                    key={item.view}
                    onClick={() => setActiveView(item.view)}
                    className=" flex justify-evenly items-center cursor-pointer hover:bg-white/20 transition-all"
                  >
                    <span className="material-symbols-outlined p-4">
                      {item.icon}
                    </span>
                    <div className="flex flex-col flex-1 py-2">
                      <span className="flex-1 text-xl font-bold">
                        {item.title}
                      </span>
                    </div>
                    <span className="material-symbols-outlined p-4">
                      chevron_right
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
        {activeView && renderView()}
      </AnimatePresence>
    </div>
  );
};

const OverlayView = ({
  children,
  onClose,
  containerClass = "",
}: {
  children: React.ReactNode;
  onClose: () => void;
  containerClass?: string;
}) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    transition={{ duration: 0.25 }}
    className={`absolute top-0 left-0 right-0 bottom-0 z-40 flex items-stretch justify-stretch w-full h-full ${containerClass}`}
    style={{ pointerEvents: "auto" }}
    onClick={onClose}
  >
    <div
      className="relative bg-white dark:bg-zinc-900 w-full h-full flex flex-col min-h-0 max-h-full overflow-y-auto"
      onClick={(e) => e.stopPropagation()}
    >
      <button
        className="absolute top-0 right-0 text-zinc-500 hover:text-zinc-800 dark:text-zinc-400 dark:hover:text-white bg-transparent rounded-full p-2"
        onClick={onClose}
        tabIndex={0}
      >
        <span className="material-symbols-outlined">close</span>
      </button>
      {children}
    </div>
  </motion.div>
);

export default function TestDrivePage() {
  const [activeApp, setActiveApp] = useState<"contact" | "map" | "car">("map");
  const [cameraResetPosition] = useState(initialCameraPosition);
  const [driverTemp, setDriverTemp] = useState<number>(22);
  const [passengerTemp, setPassengerTemp] = useState<number>(22);
  const [driverSeatHeat, setDriverSeatHeat] = useState<number>(0);
  const [passengerSeatHeat, setPassengerSeatHeat] = useState<number>(0);
  const [volumeLevel, setVolumeLevel] = useState<number>(0);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Simple mobile detection (can be improved)
    const checkMobile = () => {
      setIsMobile(
        window.innerWidth <= 900 || /Mobi|Android/i.test(navigator.userAgent)
      );
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Memoized callbacks
  const handleDriverSeatHeat = useCallback(() => {
    setDriverSeatHeat((current) => (current + 1) % 4);
  }, []);

  const handlePassengerSeatHeat = useCallback(() => {
    setPassengerSeatHeat((current) => (current + 1) % 4);
  }, []);

  const handleVolumeUp = useCallback(() => {
    setVolumeLevel((current) => (current < 3 ? current + 1 : current));
  }, []);

  const handleVolumeDown = useCallback(() => {
    setVolumeLevel((current) => (current > 0 ? current - 1 : current));
  }, []);

  const decreaseDriverTemp = useCallback(
    () => setDriverTemp((d) => Math.max(15, d - 1)),
    []
  );

  const increaseDriverTemp = useCallback(
    () => setDriverTemp((d) => Math.min(30, d + 1)),
    []
  );

  const decreasePassengerTemp = useCallback(
    () => setPassengerTemp((p) => Math.max(15, p - 1)),
    []
  );

  const increasePassengerTemp = useCallback(
    () => setPassengerTemp((p) => Math.min(30, p + 1)),
    []
  );

  const closeApp = useCallback(() => setActiveApp("map"), []);

  return (
    <div className="w-screen h-screen min-h-screen min-w-screen bg-white dark:bg-zinc-900 snap-proximity focus:outline-none transition-colors duration-300 relative overflow-hidden">
      {!isMobile && (
        <div className="desktop-view">
          <motion.div
            initial={{ scale: 1, opacity: 0.7, y: 24, x: 15 }}
            animate={{ scale: 1.7, opacity: 1, y: 50, x: 15 }}
            transition={{ duration: 0.9, delay: 0.1, ease: [0.4, 0, 0.2, 1] }}
            className="background absolute inset-0 w-full h-full bg-[url('/model-3-screen.webp')] bg-cover z-0"
            style={{ willChange: "transform, filter" }}
          />
          <motion.div
            initial={{ scale: 0.6, opacity: 0.7 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.9, delay: 0.2, ease: [0.4, 0, 0.2, 1] }}
            className="flex items-center justify-center w-full h-full absolute inset-0 z-10"
            style={{ pointerEvents: "none" }}
          >
            <div
              className="tesla-ui aspect-[730/460] w-auto min-w-[1200px] min-h-[800px] max-w-[90vw] h-auto max-h-[90vh] rounded-2xl overflow-hidden font-universal-sans text-zinc-800 bg-white/80 dark:bg-zinc-900/80 shadow-2xl  flex flex-col justify-center items-center"
              style={{ pointerEvents: "auto" }}
            >
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
                            <rect
                              x="4"
                              y="6"
                              width={Math.round(40 * 0.44)}
                              height="12"
                              rx="1"
                              fill="#52525b"
                            />
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
                        {/* <span className="text-[1.5em] font-medium">Hello</span> */}
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
                        <div className="absolute inset-0 z-0">
                          <MapView onClose={closeApp} />
                        </div>
                        <AnimatePresence mode="wait">
                          {activeApp === "contact" && (
                            <div className="absolute inset-0 z-20 bg-transparent shadow-2xl">
                              <ContactForm key="contact" onClose={closeApp} />
                            </div>
                          )}
                          {activeApp === "car" && (
                            <div className="absolute inset-0 z-20 bg-transparent shadow-2xl">
                              <CarSettings
                                key="car-settings"
                                onClose={closeApp}
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
                        className="w-[2.5em] h-[2.5em] min-w-[1.5em] min-h-[1.5em] max-w-[3em] max-h-[3em] object-contain"
                        alt="Car"
                      />
                    </button>
                  </div>
                  <div className="flex items-center justify-evenly w-full gap-2">
                    <button
                      className="text-white/40 p-1 rounded transition-colors hover:bg-gray-700/50 active:bg-gray-700"
                      onClick={decreaseDriverTemp}
                    >
                      <span className="material-symbols-outlined">
                        chevron_left
                      </span>
                    </button>
                    <div className="">
                      <div className="text-4xl font-medium">{driverTemp}°</div>
                    </div>
                    <button
                      className="text-white/40 p-1 rounded transition-colors hover:bg-gray-700/50 active:bg-gray-700"
                      onClick={increaseDriverTemp}
                    >
                      <span className="material-symbols-outlined">
                        chevron_right
                      </span>
                    </button>
                  </div>
                  <motion.button
                    className="p-2 rounded-lg transition-colors hover:bg-gray-700/50 active:bg-gray-700"
                    onClick={handleDriverSeatHeat}
                  >
                    <SeatHeater heatLevel={driverSeatHeat} rightSide={false} />
                  </motion.button>
                  <div className="flex items-center justify-evenly w-full gap-2">
                    <button
                      onClick={() =>
                        setActiveApp(
                          activeApp === "contact" ? "map" : "contact"
                        )
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
                        className="h-[2.2em] w-[2.2em] min-h-[1.2em] min-w-[1.2em] max-h-[2.5em] max-w-[2.5em] object-contain"
                      />
                    </button>

                    <button className="p-2 rounded-lg transition-colors hover:bg-gray-700/50 active:bg-gray-700">
                      <img
                        src="/screen-icons/music-icon.png"
                        alt="Music"
                        className="h-[2.2em] w-[2.2em] min-h-[1.2em] min-w-[1.2em] max-h-[2.5em] max-w-[2.5em] object-contain"
                      />
                    </button>
                    <button className="p-2 rounded-lg transition-colors hover:bg-gray-700/50 active:bg-gray-700">
                      <img
                        src="/screen-icons/camera-icon.png"
                        alt="Camera"
                        className="h-[2.2em] w-[2.2em] min-h-[1.2em] min-w-[1.2em] max-h-[2.5em] max-w-[2.5em] object-contain"
                      />
                    </button>
                    <button className="p-2 rounded-lg transition-colors hover:bg-gray-700/50 active:bg-gray-700">
                      <img
                        src="/screen-icons/calendar-icon.png"
                        alt="Calendar"
                        className="h-[2.2em] w-[2.2em] min-h-[1.2em] min-w-[1.2em] max-h-[2.5em] max-w-[2.5em] object-contain"
                      />
                    </button>
                    <button className="p-2 rounded-lg transition-colors hover:bg-gray-700/50 active:bg-gray-700">
                      <img
                        src="/screen-icons/settings-icon.png"
                        alt="Settings"
                        className="h-[2.2em] w-[2.2em] min-h-[1.2em] min-w-[1.2em] max-h-[2.5em] max-w-[2.5em] object-contain"
                      />
                    </button>
                  </div>
                  <motion.button
                    className="p-2 rounded-lg transition-colors hover:bg-gray-700/50 active:bg-gray-700"
                    onClick={handlePassengerSeatHeat}
                  >
                    <SeatHeater
                      heatLevel={passengerSeatHeat}
                      rightSide={true}
                    />
                  </motion.button>
                  <div className="flex items-center justify-evenly w-full gap-2">
                    <button
                      className="text-white/40 p-1 rounded transition-colors hover:bg-gray-700/50 active:bg-gray-700"
                      onClick={decreasePassengerTemp}
                    >
                      <span className="material-symbols-outlined">
                        chevron_left
                      </span>
                    </button>
                    <div className="flex ">
                      <div className="text-4xl font-medium">
                                               {passengerTemp}°
                      </div>
                    </div>
                    <button
                      className="text-white/40 p-1 rounded transition-colors hover:bg-gray-700/50 active:bg-gray-700"
                      onClick={increasePassengerTemp}
                    >
                      <span className="material-symbols-outlined">
                        chevron_right
                      </span>
                    </button>
                  </div>
                  <div className="flex items-center justify-evenly w-full h-full gap-2">
                    <button
                      className="p-1 rounded transition-colors hover:bg-gray-700/50 active:bg-gray-700"
                      onClick={handleVolumeDown}
                    >
                      <span className="material-symbols-outlined text-white/40">
                        chevron_left
                      </span>
                    </button>
                    <VolumeControl level={volumeLevel} />
                    <button
                      className="p-1 rounded transition-colors hover:bg-gray-700/50 active:bg-gray-700"
                      onClick={handleVolumeUp}
                    >
                      <span className="material-symbols-outlined text-white/40">
                        chevron_right
                      </span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
      {isMobile && <MobileView />}
    </div>
  );
}
