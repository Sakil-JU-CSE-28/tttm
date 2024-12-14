import React, { useState } from 'react';
import './App.css';

function App() {
  const [polygons, setPolygons] = useState([]); // Completed polygons
  const [currentPolygon, setCurrentPolygon] = useState([]); // Polygon being drawn
  const [isDrawing, setIsDrawing] = useState(false); // Whether we're in drawing mode
  const [isPolygonCompleted, setIsPolygonCompleted] = useState(false); // To track if polygon is completed

  // Handle the canvas click to add points to the current polygon
  const handleCanvasClick = (e) => {
    const svg = e.target.getBoundingClientRect();
    const x = e.clientX - svg.left;
    const y = e.clientY - svg.top;

    if (isPolygonCompleted) return; // Prevent drawing once polygon is completed

    if (isDrawing) {
      // Add a new vertex to the current polygon
      setCurrentPolygon((prev) => [...prev, { x, y }]);
    }
  };

  // Handle mouse move to show a dashed line preview
  const handleMouseMove = (e) => {
    if (!isDrawing || currentPolygon.length === 0) return;

    const svg = e.target.getBoundingClientRect();
    const x = e.clientX - svg.left;
    const y = e.clientY - svg.top;

    // Update the preview of the polygon as you're drawing
    setCurrentPolygon((prev) => {
      const previewPolygon = [...prev];
      previewPolygon[previewPolygon.length - 1] = { x, y }; // Update the last point with mouse position
      return previewPolygon;
    });
  };

  // Handle right-click (context menu) to close the polygon
  const handleRightClick = (e) => {
    e.preventDefault();
    if (currentPolygon.length >= 3) {
      setPolygons((prevPolygons) => [
        ...prevPolygons,
        { vertices: currentPolygon, color: getRandomColor() },
      ]);
      setIsDrawing(false);
      setIsPolygonCompleted(true); // Mark the polygon as completed
      setCurrentPolygon([]); // Reset current polygon for new drawing
    }
  };

  // Start drawing a new polygon
  const startDrawing = () => {
    setIsDrawing(true);
    setIsPolygonCompleted(false);
    setCurrentPolygon([]);
  };

  // Generate a random color for the filled polygon
  const getRandomColor = () => {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  };

  // Handle dragging of vertices
  const handleVertexDrag = (polygonIndex, vertexIndex, e) => {
    const svg = e.target.getBoundingClientRect();
    const x = e.clientX - svg.left;
    const y = e.clientY - svg.top;

    // Update the specific vertex's position in the polygons array
    const newPolygons = [...polygons];
    newPolygons[polygonIndex].vertices[vertexIndex] = { x, y };

    setPolygons(newPolygons);
  };

  // Handle mouse down for vertex dragging
  const handleVertexMouseDown = (polygonIndex, vertexIndex, e) => {
    e.preventDefault();

    const onMouseMove = (moveEvent) => handleVertexDrag(polygonIndex, vertexIndex, moveEvent);
    const onMouseUp = () => {
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
    };

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
  };

  return (
    <div className="App">
      <div className="toolbar">
        <button onClick={startDrawing}>Start Drawing Polygon</button>
      </div>

      <svg
        className="drawing-area"
        onClick={handleCanvasClick}
        onMouseMove={handleMouseMove}
        onContextMenu={handleRightClick}
      >
        {/* Render completed polygons */}
        {polygons.map((polygon, i) => (
          <g key={i}>
            <polygon
              points={polygon.vertices.map((p) => `${p.x},${p.y}`).join(' ')}
              fill={polygon.color}
              stroke="black"
            />
            {/* Render draggable vertices for completed polygons */}
            {polygon.vertices.map((vertex, index) => (
              <circle
                key={index}
                cx={vertex.x}
                cy={vertex.y}
                r={6}
                fill="red"
                onMouseDown={(e) => handleVertexMouseDown(i, index, e)}
              />
            ))}
          </g>
        ))}

        {/* Render the current polygon being drawn */}
        {currentPolygon.length > 1 && (
          <polyline
            points={currentPolygon.map((p) => `${p.x},${p.y}`).join(' ')}
            fill="none"
            stroke="black"
            strokeDasharray="4"
          />
        )}

        {/* Render vertices for the current polygon */}
        {currentPolygon.map((vertex, index) => (
          <circle key={index} cx={vertex.x} cy={vertex.y} r={6} fill="red" />
        ))}
      </svg>
    </div>
  );
}

export default App;
