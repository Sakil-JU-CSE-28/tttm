import React from "react";

const Toolbar = ({ setTool }) => {
  return (
    <div style={{ display: "flex", justifyContent: "center", gap: "10px" }}>
      <button onClick={() => setTool("pen")}>🖊️ Pen</button>
      <button onClick={() => setTool("eraser")}>🧹 Eraser</button>
    </div>
  );
};

export default Toolbar;
