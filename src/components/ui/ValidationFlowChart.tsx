import { useState, useRef, useEffect } from 'react';
import { Mermaid } from './Mermaid';

interface Transform {
  x: number;
  y: number;
  scale: number;
}

const MIN_SCALE = 0.25;
const MAX_SCALE = 2.0;
const SCALE_STEP = 0.1;

export function ValidationFlowChart() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [transform, setTransform] = useState<Transform>({ x: 0, y: 0, scale: 1 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  // Handle wheel events for zooming
  const handleWheel = (e: WheelEvent) => {
    e.preventDefault();
    
    const delta = -e.deltaY;
    const scaleChange = delta > 0 ? 1 + SCALE_STEP : 1 - SCALE_STEP;
    const newScale = Math.min(Math.max(MIN_SCALE, transform.scale * scaleChange), MAX_SCALE);

    // Calculate cursor position relative to container
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;

    const cursorX = e.clientX - rect.left;
    const cursorY = e.clientY - rect.top;

    // Calculate new position to zoom towards cursor
    const x = cursorX - (cursorX - transform.x) * (newScale / transform.scale);
    const y = cursorY - (cursorY - transform.y) * (newScale / transform.scale);

    setTransform({ x, y, scale: newScale });
  };

  // Add wheel event listener to container
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    container.addEventListener('wheel', handleWheel, { passive: false });
    return () => container.removeEventListener('wheel', handleWheel);
  }, [transform]); // Add transform to dependencies since we use it in handleWheel

  // Handle mouse down for panning
  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsDragging(true);
    setDragStart({
      x: e.clientX - transform.x,
      y: e.clientY - transform.y
    });
  };

  // Handle mouse move for panning
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

  // Handle mouse up and leave
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

  // Add controls UI
  const Controls = () => (
    <div className="chart-controls" style={{ gap: '8px', display: 'flex' }}>
      <div className="chart-controls-group" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
        <button 
          className="icon-button" 
          onClick={() => setTransform(prev => ({ ...prev, scale: Math.min(MAX_SCALE, prev.scale * (1 + SCALE_STEP)) }))}
          title="Zoom In (Plus key)"
        >
          <span className="material-symbols-outlined">add</span>
        </button>
        <div className="zoom-level">
          {Math.round(transform.scale * 100)}%
        </div>
        <button 
          className="icon-button"
          onClick={() => setTransform(prev => ({ ...prev, scale: Math.max(MIN_SCALE, prev.scale * (1 - SCALE_STEP)) }))}
          title="Zoom Out (Minus key)"
        >
          <span className="material-symbols-outlined">remove</span>
        </button>
        <button 
          className="icon-button"
          onClick={() => setTransform({ x: 0, y: 0, scale: 1 })}
          title="Reset View"
          style={{ marginLeft: '4px' }}
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
    SingleName{"🔤 Is single<br/>name?"}:::decision
    MononymCheck{"🎭 Check valid<br/>mononyms"}:::decision
    WikiSearch["🔍 Search<br/>Wikipedia"]:::process
    Results{"📋 Has search<br/>results?"}:::decision
    CheckTitle{"📑 Title matches<br/>input?"}:::decision
    SingleWord{"💭 Single word<br/>name?"}:::decision
    StageCheck{"🎪 Stage name<br/>indicators?"}:::decision
    GenderCheck{"👩 Woman/Women<br/>indicators?"}:::decision
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
        >
          <div
            style={{
              transform: `translate(${transform.x}px, ${transform.y}px) scale(${transform.scale})`,
              cursor: isDragging ? 'grabbing' : 'grab',
              transition: isDragging ? 'none' : 'transform 0.1s ease',
              transformOrigin: '0 0'
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