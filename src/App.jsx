import React, { useState, useRef, useCallback } from 'react';
import AiAssistant from './components/Aiassistent';
import Sidebar from './components/Sidebar';

function App() {
  const [leftWidth, setLeftWidth] = useState(240);
  const [rightWidth, setRightWidth] = useState(240);
  const [isDraggingLeft, setIsDraggingLeft] = useState(false);
  const [isDraggingRight, setIsDraggingRight] = useState(false);
  
  const containerRef = useRef(null);

  const handleMouseMove = useCallback((e) => {
    if (!containerRef.current) return;
    
    const rect = containerRef.current.getBoundingClientRect();
    
    if (isDraggingLeft) {
      const newWidth = Math.max(150, Math.min(500, e.clientX - rect.left));
      setLeftWidth(newWidth);
    }
    
    if (isDraggingRight) {
      const newWidth = Math.max(150, Math.min(500, rect.right - e.clientX));
      setRightWidth(newWidth);
    }
  }, [isDraggingLeft, isDraggingRight]);

  const handleMouseUp = useCallback(() => {
    setIsDraggingLeft(false);
    setIsDraggingRight(false);
  }, []);

  React.useEffect(() => {
    if (isDraggingLeft || isDraggingRight) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = 'col-resize';
      document.body.style.userSelect = 'none';
      
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
        document.body.style.cursor = '';
        document.body.style.userSelect = '';
      };
    }
  }, [isDraggingLeft, isDraggingRight, handleMouseMove, handleMouseUp]);

  return (<>

   
    <div ref={containerRef} className="flex h-screen w-full bg-gray-900">
      
      {/* Left Panel */}
      <div 
        className="bg-gray-900 border-r border-gray-700" 
        style={{ width: `${leftWidth}px` }}
      >
         <Sidebar/>
      </div>

      {/* Left Resizer */}
      <div 
        className="w-px bg-gray-700 hover:bg-blue-500 cursor-col-resize hover:w-0.5 transition-all"
        onMouseDown={() => setIsDraggingLeft(true)}
      />

      {/* Center Panel */}
      <div className="flex-1 bg-gray-800 border-r border-gray-700">
      </div>

      {/* Right Resizer */}
      <div 
        className="w-px bg-gray-700 hover:bg-blue-500 cursor-col-resize hover:w-0.5 transition-all"
        onMouseDown={() => setIsDraggingRight(true)}
      />

      {/* Right Panel */}
      <div 
        className="bg-gray-900 flex justify-center items-center min-w-96" 
        style={{ width: `${rightWidth}px` }}
      >
        <AiAssistant/>
      </div>

    </div>
  </>
  );
}

export default App;