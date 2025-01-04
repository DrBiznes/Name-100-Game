import { useEffect, useRef } from 'react';
import mermaid from 'mermaid';

// Initialize mermaid with our custom theme
const initializeMermaid = () => {
  try {
    mermaid.initialize({
      startOnLoad: false,
      theme: 'base',
      securityLevel: 'loose',
      themeVariables: {
        'primaryColor': '#D49BA7',
        'primaryTextColor': '#FFD6BA',
        'primaryBorderColor': '#B76E79',
        'lineColor': '#B76E79',
        'secondaryColor': '#3D2A4B',
        'tertiaryColor': '#453454',
        'fontFamily': 'Alegreya',
        'fontSize': '16px'
      }
    });
  } catch (error) {
    console.error('Error initializing mermaid:', error);
  }
};

interface MermaidProps {
  chart: string;
}

export function Mermaid({ chart }: MermaidProps) {
  const mermaidRef = useRef<HTMLDivElement>(null);
  const uniqueId = useRef(`mermaid-${Math.random().toString(36).substr(2, 9)}`);

  useEffect(() => {
    const renderChart = async () => {
      if (mermaidRef.current) {
        try {
          // Initialize mermaid
          initializeMermaid();
          
          // Clear previous content
          mermaidRef.current.innerHTML = '';
          
          // Create a new div for the chart
          const chartDiv = document.createElement('div');
          chartDiv.className = 'mermaid';
          chartDiv.textContent = chart;
          mermaidRef.current.appendChild(chartDiv);
          
          // Render the chart
          await mermaid.init(undefined, '.mermaid');
        } catch (error) {
          console.error('Error rendering mermaid chart:', error);
          if (mermaidRef.current) {
            mermaidRef.current.innerHTML = 'Error rendering chart. Please check console for details.';
          }
        }
      }
    };

    // Add a small delay to ensure the DOM is ready
    const timer = setTimeout(() => {
      renderChart();
    }, 100);

    return () => {
      clearTimeout(timer);
      if (mermaidRef.current) {
        mermaidRef.current.innerHTML = '';
      }
    };
  }, [chart]);

  return (
    <div className="mermaid-wrapper">
      <div ref={mermaidRef} id={uniqueId.current} />
    </div>
  );
} 