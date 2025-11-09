"use client";
import React, { useEffect, useRef, useState } from "react";

interface ViewPleinEcranProps {
  src: string;           // ex: "/infra-mvp.svg" (dans /public)
  alt?: string;
  thumbHeight?: number;  // hauteur de l’aperçu (px)
}

const MAX_SCALE = 6;
const MIN_SCALE = 0.5;
const ZOOM_STEP = 0.2;

const ViewPleinEcran: React.FC<ViewPleinEcranProps> = ({
  src,
  alt = "Diagramme",
  thumbHeight = 360,
}) => {
  const [open, setOpen] = useState(false);

  // Pour le plein écran : mise à l’échelle + position (pan)
  const [scale, setScale] = useState(1);
  const [pos, setPos] = useState({ x: 0, y: 0 });

  // Drag state
  const dragging = useRef(false);
  const last = useRef({ x: 0, y: 0 });

  // Contenu SVG inline (pour rester net au zoom)
  const [svgMarkup, setSvgMarkup] = useState<string | null>(null);


  // Réinit à l’ouverture
  useEffect(() => {
    if (open) {
      setScale(1);
      setPos({ x: 0, y: 0 });
    }
  }, [open]);

  // Fermer avec ESC
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  // Empêche drag natif (ouvrir dans nouvel onglet, etc.)
  const preventNativeDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  // Zoom via boutons uniquement
  const zoomIn = () =>
    setScale((s) => Math.min(MAX_SCALE, +(s + ZOOM_STEP).toFixed(3)));
  const zoomOut = () =>
    setScale((s) => Math.max(MIN_SCALE, +(s - ZOOM_STEP).toFixed(3)));
  const resetView = () => {
    setScale(1);
    setPos({ x: 0, y: 0 });
  };

  // Pan (clic maintenu)
  const onPointerDown: React.PointerEventHandler<HTMLDivElement> = (e) => {
    dragging.current = true;
    last.current = { x: e.clientX, y: e.clientY };
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
  };
  const onPointerMove: React.PointerEventHandler<HTMLDivElement> = (e) => {
    if (!dragging.current) return;
    const dx = e.clientX - last.current.x;
    const dy = e.clientY - last.current.y;
    last.current = { x: e.clientX, y: e.clientY };
    setPos((p) => ({ x: p.x + dx, y: p.y + dy }));
  };
  const onPointerUp: React.PointerEventHandler<HTMLDivElement> = (e) => {
    dragging.current = false;
    (e.currentTarget as HTMLElement).releasePointerCapture?.(e.pointerId);
  };

  return (
    <>
      {/* Aperçu (thumbnail) */}
      <button
        onClick={() => setOpen(true)}
        className="group relative w-full rounded-2xl border border-gray-200 bg-white p-3 shadow hover:shadow-md dark:border-gray-700 dark:bg-neutral-900"
        aria-label="Afficher en plein écran"
        onDragStart={preventNativeDrag}
      >
        {/* Le thumbnail peut rester en <img>, pas besoin d’inline ici */}
        <img
          src={src}
          alt={alt}
          height={thumbHeight}
          style={{ height: `${thumbHeight}px` }}
          className="mx-auto h-auto max-w-full select-none object-contain pointer-events-none"
          draggable={false}
        />
        <span className="pointer-events-none absolute right-3 top-3 rounded-md border bg-white/80 px-2 py-1 text-xs text-neutral-700 backdrop-blur dark:bg-neutral-800/70 dark:text-neutral-300">
          Cliquer pour zoomer
        </span>
      </button>

      {/* Modale plein écran */}
      {open && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/75"
          onClick={() => setOpen(false)} // clic sur le backdrop → fermer
        >
          <div
            className="relative max-h-[92vh] max-w-[96vw] overflow-hidden rounded-xl bg-white dark:bg-neutral-950"
            onClick={(e) => e.stopPropagation()} // ne pas fermer quand on clique sur le contenu
            onDragStart={preventNativeDrag}
          >
            {/* Boutons FIXES */}
            <div className="pointer-events-auto absolute left-3 top-3 z-20 flex gap-2">
              <button
                onClick={zoomIn}
                className="rounded bg-black/60 px-3 py-1 text-white shadow hover:bg-black/80"
                aria-label="Zoomer"
              >
                +
              </button>
              <button
                onClick={zoomOut}
                className="rounded bg-black/60 px-3 py-1 text-white shadow hover:bg-black/80"
                aria-label="Dézoomer"
              >
                −
              </button>
              <button
                onClick={resetView}
                className="rounded bg-black/60 px-3 py-1 text-white shadow hover:bg-black/80"
                aria-label="Réinitialiser la vue"
              >
                Réinitialiser
              </button>
            </div>

            <button
              onClick={() => setOpen(false)}
              className="pointer-events-auto absolute right-3 top-3 z-20 rounded bg-black/60 px-3 py-1 text-white shadow hover:bg-black/80"
              aria-label="Fermer"
            >
              Fermer
            </button>

            {/* Zone interactive (pan au clic maintenu, pas de molette) */}
            <div
              className="relative flex h-[88vh] w-[94vw] touch-none items-center justify-center overflow-hidden"
              onPointerDown={onPointerDown}
              onPointerMove={onPointerMove}
              onPointerUp={onPointerUp}
              onPointerCancel={onPointerUp}
              // curseur "grabbing" pendant le drag
              style={{ cursor: dragging.current ? "grabbing" : "grab" }}
            >
              {/* Conteneur transformé : translate + scale */}
              <div
                className="will-change-transform"
                style={{
                  transform: `translate(${pos.x}px, ${pos.y}px) scale(${scale})`,
                  transformOrigin: "center center",
                }}
                // bloque le drag natif même si on clique sur le SVG
                onDragStart={preventNativeDrag}
              >
                {/* SVG inline = rendu vectoriel net au zoom */}
                {svgMarkup ? (
                  <div
                    aria-label={alt}
                    // On désactive les interactions sur le contenu pour éviter la sélection/drag
                    className="select-none pointer-events-none"
                    // Injection contrôlée : on affiche un fichier local public (pas de données user)
                    dangerouslySetInnerHTML={{ __html: svgMarkup }}
                  />
                ) : (
                  // Fallback rapide si le fetch n'est pas encore fini
                  <img
                    src={src}
                    alt={alt}
                    className="select-none pointer-events-none"
                    draggable={false}
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ViewPleinEcran;
