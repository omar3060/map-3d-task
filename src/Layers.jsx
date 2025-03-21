import React from "react";

const Layers = ({ layers, updateMapTexture }) => {

  return (
    <div style={{ position: 'absolute', top: 10, left: 10, zIndex: 1 }}>
    {
      Object.entries(layers).map(([key, value]) => (
        <button key={key} onClick={() => updateMapTexture(value)}>{key.charAt(0).toUpperCase() + key.slice(1)}</button>
      ))
    }
  </div>
  );
};

export default Layers;