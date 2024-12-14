import React, { useState } from "react";
import Draggable from "react-draggable";

function App() {
  const getRandomPosition = () => ({
    x: Math.random() * (window.innerWidth - 100),
    y: Math.random() * (window.innerHeight - 100),
  });

  const [blocks, setBlocks] = useState([
    { id: 0, parent: null, ...getRandomPosition() },
  ]);
  const [lines, setLines] = useState([]);

  const addBlock = (parentId) => {
    const newBlock = {
      id: blocks.length,
      parent: parentId,
      ...getRandomPosition(),
    };
    setBlocks([...blocks, newBlock]);
    setLines([...lines, { parent: parentId, child: newBlock.id }]);
  };

  const updateBlockPosition = (id, x, y) => {
    setBlocks((prevBlocks) =>
      prevBlocks.map((block) =>
        block.id === id ? { ...block, x, y } : block
      )
    );
  };

  const renderLines = () => {
    return lines.map((line, index) => {
      const parent = blocks.find((b) => b.id === line.parent);
      const child = blocks.find((b) => b.id === line.child);

      if (!parent || !child) return null;

      return (
        <line
          key={index}
          x1={parent.x + 25}
          y1={parent.y + 25}
          x2={child.x + 25}
          y2={child.y + 25}
          stroke="black"
          strokeDasharray="5 5"
          strokeWidth="2"
        />
      );
    });
  };

  return (
    <div className="relative w-screen h-screen bg-pink-100 overflow-hidden">
      <svg className="absolute top-0 left-0 w-full h-full">{renderLines()}</svg>

      {blocks.map((block) => (
        <Draggable
          key={block.id}
          position={{ x: block.x, y: block.y }}
          onStop={(e, data) => updateBlockPosition(block.id, data.x, data.y)}
        >
          <div className="absolute flex flex-col justify-center items-center bg-pink-500 text-white rounded-md w-12 h-12 shadow-lg cursor-move">
            <span className="text-sm">{block.id}</span>
            <button
              className="mt-1 px-2 py-1 bg-white text-pink-500 rounded text-xs shadow"
              onClick={() => addBlock(block.id)}
            >
              +
            </button>
          </div>
        </Draggable>
      ))}
    </div>
  );
}

export default App;
