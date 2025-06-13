import { useState, useRef } from "react";

export default function ImageCarousel({
  images,
  carName,
}: {
  images: any[];
  carName: string;
}) {
  const [current, setCurrent] = useState(0);
  const [showButtons, setShowButtons] = useState(false);

  // Modal zoom state
  const [zoomOpen, setZoomOpen] = useState(false);
  const [zoom, setZoom] = useState(1);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [dragging, setDragging] = useState(false);
  const dragStart = useRef<{ x: number; y: number; ox: number; oy: number } | null>(null);

  // Pinch zoom state
  const pinchStart = useRef<{
    distance: number;
    zoom: number;
    center: { x: number; y: number };
    offset: { x: number; y: number };
  } | null>(null);

  const goToPrev = () => {
    setCurrent((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const goToNext = () => {
    setCurrent((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  // Open modal
  const openZoom = () => {
    setZoomOpen(true);
    setZoom(1);
    setOffset({ x: 0, y: 0 });
  };

  // Mouse wheel zoom
  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    let newZoom = zoom - e.deltaY * 0.001;
    newZoom = Math.max(1, Math.min(newZoom, 5));
    setZoom(newZoom);
  };

  // Mouse drag to pan
  const handleMouseDown = (e: React.MouseEvent) => {
    setDragging(true);
    dragStart.current = {
      x: e.clientX,
      y: e.clientY,
      ox: offset.x,
      oy: offset.y,
    };
  };
  const handleMouseMove = (e: React.MouseEvent) => {
    if (!dragging || !dragStart.current) return;
    const dx = e.clientX - dragStart.current.x;
    const dy = e.clientY - dragStart.current.y;
    setOffset({
      x: dragStart.current.ox + dx,
      y: dragStart.current.oy + dy,
    });
  };
  const handleMouseUp = () => {
    setDragging(false);
    dragStart.current = null;
  };

  // Touch pinch and pan
  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 2) {
      const [t1, t2] = Array.from(e.touches);
      const dx = t2.clientX - t1.clientX;
      const dy = t2.clientY - t1.clientY;
      const distance = Math.sqrt(dx * dx + dy * dy);
      const center = {
        x: (t1.clientX + t2.clientX) / 2,
        y: (t1.clientY + t2.clientY) / 2,
      };
      pinchStart.current = {
        distance,
        zoom,
        center,
        offset,
      };
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
    if (e.touches.length === 2 && pinchStart.current) {
      const [t1, t2] = Array.from(e.touches);
      const dx = t2.clientX - t1.clientX;
      const dy = t2.clientY - t1.clientY;
      const distance = Math.sqrt(dx * dx + dy * dy);
      let newZoom = pinchStart.current.zoom * (distance / pinchStart.current.distance);
      newZoom = Math.max(1, Math.min(newZoom, 5));
      setZoom(newZoom);
    } else if (e.touches.length === 1 && dragStart.current) {
      const dx = e.touches[0].clientX - dragStart.current.x;
      const dy = e.touches[0].clientY - dragStart.current.y;
      setOffset({
        x: dragStart.current.ox + dx,
        y: dragStart.current.oy + dy,
      });
    }
  };
  const handleTouchEnd = (e: React.TouchEvent) => {
    if (e.touches.length < 2) {
      pinchStart.current = null;
    }
    if (e.touches.length === 0) {
      dragStart.current = null;
    }
  };

  return (
    <>
      <div
        onMouseOver={() => setShowButtons(true)}
        onMouseLeave={() => setShowButtons(false)}
        className="relative w-full h-full flex items-center justify-center "
        style={{ maxHeight: "100vh" }}
      >
        <img
          src={images[current]}
          alt={`${carName} image ${current + 1}`}
          className="object-contain w-full h-full"
          
        />
        <button
          hidden={!showButtons}
          onClick={goToPrev}
          className="absolute top-1/2 left-0 -translate-y-1/2 bg-white/80 px-4 py-2 rounded m-2 hover:bg-gray-200"
        >
          ‹
        </button>
        <button
          hidden={!showButtons}
          onClick={goToNext}
          className="absolute top-1/2 right-0 -translate-y-1/2 bg-white/80 px-4 py-2  rounded m-2 hover:bg-gray-200"
        >
          ›
        </button>
        <button
          onClick={openZoom}
          className="absolute bottom-6 right-3 bg-white/90 dark:bg-zinc-900/90 dark:text-zinc-100 px-3 py-2 rounded shadow hover:bg-gray-200 dark:hover:bg-zinc-800 text-xs font-medium border border-gray-300 dark:border-zinc-700"
          aria-label="Open full screen"
          style={{ zIndex: 10 }}
        >
          ⛶
        </button>
      </div>
      {zoomOpen && (
        <div
          className="fixed inset-0 z-[9999] bg-black/90 flex items-center justify-center"
          style={{ touchAction: "none" }}
        >
          {/* Overlay for closing */}
          <div
            className="absolute inset-0"
            style={{ zIndex: 10000, cursor: "pointer" }}
            onClick={() => setZoomOpen(false)}
          />
          <div
            className="relative w-full h-full flex items-center justify-center"
            style={{
              width: "100vw",
              height: "100vh",
              zIndex: 10001,
            }}
            onClick={e => e.stopPropagation()}
          >
            <img
              src={images[current]}
              alt={`${carName} image zoomed`}
              className="select-none pointer-events-auto"
              draggable={false}
              style={{
                transform: `translate(${offset.x}px, ${offset.y}px) scale(${zoom})`,
                transition: dragging ? "none" : "transform 0.1s",
                maxWidth: "100vw",
                maxHeight: "100vh",
                objectFit: "contain",
                userSelect: "none",
                cursor: dragging ? "grabbing" : "grab",
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
            {/* Exit fullscreen button */}
            <button
              type="button"
              tabIndex={0}
              onClick={() => setZoomOpen(false)}
              className="absolute top-4 right-4 bg-white/90 dark:bg-zinc-900/90 dark:text-zinc-100 rounded-full px-3 py-1 text-lg font-bold shadow hover:bg-gray-200 dark:hover:bg-zinc-800"
              aria-label="Close zoom"
              style={{ zIndex: 10010, pointerEvents: "auto" }}
            >
              ×
            </button>
            <button
              type="button"
              tabIndex={0}
              onClick={() => setZoomOpen(false)}
              className="absolute bottom-4 left-4 bg-white/90 dark:bg-zinc-900/90 dark:text-zinc-100 rounded px-4 py-2 text-sm font-medium shadow hover:bg-gray-200 dark:hover:bg-zinc-800"
              aria-label="Exit fullscreen"
              style={{ zIndex: 10010, pointerEvents: "auto" }}
            >
              Exit Fullscreen
            </button>
          </div>
        </div>
      )}
    </>
  );
}
