import { useState, useRef, useEffect } from 'react';
import { Mermaid } from './Mermaid';

interface Transform {
  x: number;
  y: number;
  scale: number;
}

interface TouchState {
  initialDistance: number;
  initialScale: number;
}

const MIN_SCALE = 0.25;
const MAX_SCALE = 2.0;
const SCALE_STEP = 0.1;

export function ValidationFlowChart() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [transform, setTransform] = useState<Transform>({ x: 0, y: 0, scale: 1 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const touchStateRef = useRef<TouchState>({ initialDistance: 0, initialScale: 1 });

  // Calculate distance between two touch points
  const getTouchDistance = (touch1: React.Touch, touch2: React.Touch) => {
    const dx = touch1.clientX - touch2.clientX;
    const dy = touch1.clientY - touch2.clientY;
    return Math.sqrt(dx * dx + dy * dy);
  };

  // Handle touch start for panning and pinch zoom
  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 1) {
      // Single touch - start panning
      setIsDragging(true);
      setDragStart({
        x: e.touches[0].clientX - transform.x,
        y: e.touches[0].clientY - transform.y
      });
    } else if (e.touches.length === 2) {
      // Two touches - start pinch zoom
      const distance = getTouchDistance(e.touches[0], e.touches[1]);
      touchStateRef.current = {
        initialDistance: distance,
        initialScale: transform.scale
      };
    }
  };

  // Handle touch move for panning and pinch zoom
  const handleTouchMove = (e: React.TouchEvent) => {
    e.preventDefault(); // Prevent scrolling while interacting with the chart

    if (e.touches.length === 1 && isDragging) {
      // Single touch - panning
      const newX = e.touches[0].clientX - dragStart.x;
      const newY = e.touches[0].clientY - dragStart.y;

      setTransform(prev => ({
        ...prev,
        x: newX,
        y: newY
      }));
    } else if (e.touches.length === 2) {
      // Two touches - pinch zoom
      const distance = getTouchDistance(e.touches[0], e.touches[1]);
      const scale = Math.min(
        MAX_SCALE,
        Math.max(
          MIN_SCALE,
          (touchStateRef.current.initialScale * distance) / touchStateRef.current.initialDistance
        )
      );

      // Calculate the center point between the two touches
      const centerX = (e.touches[0].clientX + e.touches[1].clientX) / 2;
      const centerY = (e.touches[0].clientY + e.touches[1].clientY) / 2;

      // Get container position
      const rect = containerRef.current?.getBoundingClientRect();
      if (!rect) return;

      // Calculate cursor position relative to container
      const cursorX = centerX - rect.left;
      const cursorY = centerY - rect.top;

      // Calculate new position to zoom towards center point
      const x = cursorX - (cursorX - transform.x) * (scale / transform.scale);
      const y = cursorY - (cursorY - transform.y) * (scale / transform.scale);

      setTransform({ x, y, scale });
    }
  };

  // Handle touch end
  const handleTouchEnd = () => {
    setIsDragging(false);
  };

  // Handle wheel events for zooming (desktop)
  const handleWheel = (e: WheelEvent) => {
    e.preventDefault();
    
    const delta = -e.deltaY;
    const scaleChange = delta > 0 ? 1 + SCALE_STEP : 1 - SCALE_STEP;
    const newScale = Math.min(Math.max(MIN_SCALE, transform.scale * scaleChange), MAX_SCALE);

    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;

    const cursorX = e.clientX - rect.left;
    const cursorY = e.clientY - rect.top;

    const x = cursorX - (cursorX - transform.x) * (newScale / transform.scale);
    const y = cursorY - (cursorY - transform.y) * (newScale / transform.scale);

    setTransform({ x, y, scale: newScale });
  };

  // Add wheel event listener
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    container.addEventListener('wheel', handleWheel, { passive: false });
    return () => container.removeEventListener('wheel', handleWheel);
  }, [transform]);

  // Handle mouse events (desktop)
  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsDragging(true);
    setDragStart({
      x: e.clientX - transform.x,
      y: e.clientY - transform.y
    });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    e.preventDefault();

    const newX = e.clientX - dragStart.x;
    const newY = e.clientY - dragStart.y;

    setTransform(prev => ({
      ...prev,
      x: newX,
      y: newY
    }));
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleMouseLeave = () => {
    setIsDragging(false);
  };

  // Add keyboard controls for zoom
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === '+' || (e.ctrlKey && e.key === '=')) {
        e.preventDefault();
        setTransform(prev => ({
          ...prev,
          scale: Math.min(MAX_SCALE, prev.scale * (1 + SCALE_STEP))
        }));
      } else if (e.key === '-') {
        e.preventDefault();
        setTransform(prev => ({
          ...prev,
          scale: Math.max(MIN_SCALE, prev.scale * (1 - SCALE_STEP))
        }));
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Controls UI
  const Controls = () => (
    <div className="chart-controls">
      <div className="chart-controls-group">
        <button 
          className="icon-button" 
          onClick={() => setTransform(prev => ({ ...prev, scale: Math.min(MAX_SCALE, prev.scale * (1 + SCALE_STEP)) }))}
          aria-label="Zoom In"
        >
          <span className="material-symbols-outlined">add</span>
        </button>
        <div className="zoom-level" aria-label="Zoom Level">
          {Math.round(transform.scale * 100)}%
        </div>
        <button 
          className="icon-button"
          onClick={() => setTransform(prev => ({ ...prev, scale: Math.max(MIN_SCALE, prev.scale * (1 - SCALE_STEP)) }))}
          aria-label="Zoom Out"
        >
          <span className="material-symbols-outlined">remove</span>
        </button>
        <button 
          className="icon-button"
          onClick={() => setTransform({ x: 0, y: 0, scale: 1 })}
          aria-label="Reset View"
        >
          <span className="material-symbols-outlined">restart_alt</span>
        </button>
      </div>
    </div>
  );

  const mermaidChart = `
flowchart TB
    Input["✍️ User enters name"]:::input
    LocalDB{"📚 Check local<br/>database"}:::decision
    SingleName{"🔤 Is mononym?"}:::decision
    MononymCheck{"🎭 Check valid<br/>mononyms"}:::decision
    WikiSearch["🔍 Search<br/>Wikipedia"]:::process
    Results{"📋 Has search<br/>results?"}:::decision
    CheckTitle{"📑 Title matches<br/>input?"}:::decision
    SingleWord{"💭 Single word<br/>name?"}:::decision
    StageCheck{"🎪 Stage name<br/>indicators?"}:::decision
    GenderCheck{"👩 Women<br/>indicators?"}:::decision
    Valid["✅ Valid"]:::valid
    Invalid["❌ Invalid"]:::invalid

    Input --> LocalDB
    LocalDB -->|"Found ✨"| Valid
    LocalDB -->|"Not found 🔄"| SingleName
    SingleName -->|"No 📝"| WikiSearch
    SingleName -->|"Yes 💫"| MononymCheck
    MononymCheck -->|"Valid ✨"| WikiSearch
    MononymCheck -->|"Invalid ❌"| Invalid
    WikiSearch --> Results
    Results -->|"No 🚫"| Invalid
    Results -->|"Yes ✅"| CheckTitle
    CheckTitle -->|"No ❌"| Invalid
    CheckTitle -->|"Yes ✨"| SingleWord
    SingleWord -->|"No 📝"| GenderCheck
    SingleWord -->|"Yes 💫"| StageCheck
    StageCheck -->|"Found ✨"| GenderCheck
    StageCheck -->|"Not found 🚫"| Invalid
    GenderCheck -->|"Found ✨"| Valid
    GenderCheck -->|"Not found 🚫"| Invalid

    classDef default fill:#3D2A4B,stroke:#B76E79,stroke-width:2px,color:#FFD6BA
    classDef input fill:#D49BA7,stroke:#B76E79,stroke-width:3px,color:#2D1B3B
    classDef process fill:#453454,stroke:#B76E79,stroke-width:2px,color:#FFD6BA
    classDef decision fill:#8E5761,stroke:#B76E79,stroke-width:2px,color:#FFD6BA
    classDef valid fill:#2D4B3B,stroke:#4CAF50,stroke-width:3px,color:#FFD6BA
    classDef invalid fill:#4B2D2D,stroke:#FF8674,stroke-width:3px,color:#FFD6BA
    linkStyle default stroke:#B76E79,stroke-width:2px
`;

  return (
    <div className="validation-chart-outer">
      <div 
        ref={containerRef}
        className="validation-chart-container"
      >
        <h4 className="validation-chart-title">
          Name Validation Flow
        </h4>
        <div
          className="validation-chart-content"
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseLeave}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          onTouchCancel={handleTouchEnd}
        >
          <div
            style={{
              transform: `translate(${transform.x}px, ${transform.y}px) scale(${transform.scale})`,
              cursor: isDragging ? 'grabbing' : 'grab',
              transition: isDragging ? 'none' : 'transform 0.1s ease',
              transformOrigin: '0 0',
              touchAction: 'none' // Prevent browser touch actions
            }}
          >
            <Mermaid chart={mermaidChart} />
          </div>
        </div>
      </div>
      <Controls />
    </div>
  );
} 