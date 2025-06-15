import { useState, useRef, useEffect, useCallback } from "react";
import ReactDOM from "react-dom";

export default function ImageCarousel({
  images,
  carName,
}: {
  images: string[];
  carName: string;
}) {
  const [current, setCurrent] = useState(0);
  const [zoomOpen, setZoomOpen] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const zoomTimeout = useRef<NodeJS.Timeout | null>(null);

  // Navigation functions
  const goToPrev = useCallback(() => {
    setCurrent((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  }, [images.length]);

  const goToNext = useCallback(() => {
    setCurrent((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  }, [images.length]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") goToPrev();
      if (e.key === "ArrowRight") goToNext();
      if (e.key === "Escape" && zoomOpen) closeZoom();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [goToPrev, goToNext, zoomOpen]);

  // Open zoom with animation
  const openZoom = () => {
    setIsAnimating(true);
    setZoomOpen(true);
  };

  // Close zoom with animation
  const closeZoom = useCallback(() => {
    setIsAnimating(false);
    if (zoomTimeout.current) clearTimeout(zoomTimeout.current);
    zoomTimeout.current = setTimeout(() => setZoomOpen(false), 300);
  }, []);

  return (
    <>
      <div className="relative w-full h-full flex items-center justify-center max-h-[calc(100vh-68px)] group">
        <div className="relative w-full h-full overflow-hidden">
          <img
            src={images[current]}
            alt={`${carName} image ${current + 1}`}
            className="object-cover w-full h-full transition-opacity duration-300"
          />

          {/* Navigation Arrows */}
          <button
            onClick={goToPrev}
            className="absolute top-1/2 left-0 -translate-y-1/2 bg-white/80 px-4 py-2 rounded m-2 hover:bg-gray-200 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            aria-label="Previous image"
          >
            ‹
          </button>
          <button
            onClick={goToNext}
            className="absolute top-1/2 right-0 -translate-y-1/2 bg-white/80 px-4 py-2 rounded m-2 hover:bg-gray-200 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            aria-label="Next image"
          >
            ›
          </button>

          {/* Zoom Button */}
          <button
            onClick={openZoom}
            className="absolute bottom-6 right-3 bg-white/90 dark:bg-zinc-900/90 dark:text-zinc-100 px-3 py-2 rounded shadow hover:bg-gray-200 dark:hover:bg-zinc-800 text-xs font-medium border border-gray-300 dark:border-zinc-700"
            aria-label="Open full screen"
          >
            ⛶
          </button>

          {/* Thumbnail Navigation */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
            {images.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrent(idx)}
                className={`w-2 h-2 rounded-full transition-all ${
                  current === idx
                    ? "bg-white scale-125"
                    : "bg-white/50 hover:bg-white/80"
                }`}
                aria-label={`Go to image ${idx + 1}`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Zoom Modal using React Portal */}
      {zoomOpen && (
        <ZoomModal
          image={images[current]}
          carName={carName}
          isVisible={isAnimating}
          onClose={closeZoom}
        />
      )}
    </>
  );
}

// Zoom Modal Component
function ZoomModal({
  image,
  carName,
  isVisible,
  onClose,
}: {
  image: string;
  carName: string;
  isVisible: boolean;
  onClose: () => void;
}) {
  const [zoom, setZoom] = useState(1);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const dragStart = useRef<{
    x: number;
    y: number;
    ox: number;
    oy: number;
  } | null>(null);
  const imgRef = useRef<HTMLImageElement>(null);

  // Reset zoom and position on image change
  useEffect(() => {
    setZoom(1);
    setOffset({ x: 0, y: 0 });
  }, [image]);

  // Mouse wheel zoom
  const handleWheel = useCallback((e: React.WheelEvent) => {
    e.preventDefault();
    setZoom((prev) => {
      const newZoom = Math.max(1, Math.min(prev - e.deltaY * 0.001, 5));

      // Adjust offset to zoom towards cursor
      if (imgRef.current) {
        const rect = imgRef.current.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const ratioX = x / rect.width;
        const ratioY = y / rect.height;

        setOffset((prevOffset) => ({
          x: prevOffset.x + rect.width * (prev - newZoom) * ratioX,
          y: prevOffset.y + rect.height * (prev - newZoom) * ratioY,
        }));
      }

      return newZoom;
    });
  }, []);

  // Mouse drag to pan
  const handleMouseDown = (e: React.MouseEvent) => {
    dragStart.current = {
      x: e.clientX,
      y: e.clientY,
      ox: offset.x,
      oy: offset.y,
    };
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!dragStart.current) return;
    const dx = e.clientX - dragStart.current.x;
    const dy = e.clientY - dragStart.current.y;
    setOffset({
      x: dragStart.current.ox + dx,
      y: dragStart.current.oy + dy,
    });
  };

  const handleMouseUp = () => {
    dragStart.current = null;
  };

  // Touch pinch and pan
  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 2) {
      e.preventDefault();
      const [t1, t2] = Array.from(e.touches);
      const dx = t2.clientX - t1.clientX;
      const dy = t2.clientY - t1.clientY;
      const distance = Math.sqrt(dx * dx + dy * dy);

      // Store initial state for pinch
      dragStart.current = {
        x: (t1.clientX + t2.clientX) / 2,
        y: (t1.clientY + t2.clientY) / 2,
        ox: offset.x,
        oy: offset.y,
        distance,
        zoom,
      } as any;
    } else if (e.touches.length === 1) {
      dragStart.current = {
        x: e.touches[0].clientX,
        y: e.touches[0].clientY,
        ox: offset.x,
        oy: offset.y,
      };
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!dragStart.current) return;

    if (e.touches.length === 2) {
      e.preventDefault();
      const [t1, t2] = Array.from(e.touches);
      const dx = t2.clientX - t1.clientX;
      const dy = t2.clientY - t1.clientY;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if ("distance" in dragStart.current) {
        const scale = distance / (dragStart.current as any).distance;
        const newZoom = Math.max(
          1,
          Math.min((dragStart.current as any).zoom * scale, 5)
        );
        setZoom(newZoom);
      }
    } else if (e.touches.length === 1) {
      const dx = e.touches[0].clientX - dragStart.current.x;
      const dy = e.touches[0].clientY - dragStart.current.y;
      setOffset({
        x: dragStart.current.ox + dx,
        y: dragStart.current.oy + dy,
      });
    }
  };

  const handleTouchEnd = () => {
    dragStart.current = null;
  };

  // Reset zoom
  const resetZoom = () => {
    setZoom(1);
    setOffset({ x: 0, y: 0 });
  };

  // Create portal target
  const portalRoot = document.getElementById("portal-root");
  if (!portalRoot) return null;

  return ReactDOM.createPortal(
    <div
      className={`fixed inset-0 z-[9999] bg-black/90 flex items-center justify-center transition-opacity duration-300 ${
        isVisible ? "opacity-100" : "opacity-0"
      }`}
      style={{ touchAction: "none" }}
      onClick={onClose}
    >
      <div
        className="relative w-full h-full flex items-center justify-center"
        onClick={(e) => e.stopPropagation()}
      >
        <img
          ref={imgRef}
          src={image}
          alt={`${carName} image zoomed`}
          className="select-none pointer-events-auto"
          draggable={false}
          style={{
            transform: `translate(${offset.x}px, ${offset.y}px) scale(${zoom})`,
            maxWidth: "100vw",
            maxHeight: "100vh",
            objectFit: "contain",
            userSelect: "none",
            cursor: dragStart.current ? "grabbing" : "grab",
          }}
          onWheel={handleWheel}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        />

        {/* Zoom Controls */}
        <div className="absolute bottom-4 right-4 flex gap-2 z-[10010]">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setZoom((prev) => Math.max(1, prev - 0.5));
            }}
            className="bg-white/90 dark:bg-zinc-900/90 dark:text-zinc-100 rounded-full w-10 h-10 flex items-center justify-center text-lg shadow hover:bg-gray-200 dark:hover:bg-zinc-800"
            aria-label="Zoom out"
          >
            -
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              resetZoom();
            }}
            className="bg-white/90 dark:bg-zinc-900/90 dark:text-zinc-100 rounded-full w-10 h-10 flex items-center justify-center text-sm shadow hover:bg-gray-200 dark:hover:bg-zinc-800"
            aria-label="Reset zoom"
          >
            1:1
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              setZoom((prev) => Math.min(5, prev + 0.5));
            }}
            className="bg-white/90 dark:bg-zinc-900/90 dark:text-zinc-100 rounded-full w-10 h-10 flex items-center justify-center text-lg shadow hover:bg-gray-200 dark:hover:bg-zinc-800"
            aria-label="Zoom in"
          >
            +
          </button>
        </div>

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 bg-white/90 dark:bg-zinc-900/90 dark:text-zinc-100 rounded-full w-10 h-10 flex items-center justify-center text-xl font-bold shadow hover:bg-gray-200 dark:hover:bg-zinc-800"
          aria-label="Close zoom"
        >
          ×
        </button>
      </div>
    </div>,
    portalRoot
  );
}

// Add portal root to DOM (do this once in your app)
if (
  typeof document !== "undefined" &&
  !document.getElementById("portal-root")
) {
  const portalRoot = document.createElement("div");
  portalRoot.id = "portal-root";
  document.body.appendChild(portalRoot);
}
