import React, { useState, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import Buildings from './Buildings';
import Layers from './Layers';
import { latLonToTile } from './utils';


function Map() {
  const textureLoader = new THREE.TextureLoader();
  const [mapTexture, setMapTexture] = useState(null);

  const lat = 30.610205;
  const lon = 32.277569;
  const zoom = 18;

  const { x, y } = latLonToTile(lat, lon, zoom);
  console.log(x, y)

  const layers = {
    standard: `https://tile.openstreetmap.org/${zoom}/${x}/${y}.png`,
    topo: `https://a.tile-cyclosm.openstreetmap.fr/cyclosm/${zoom}/${x}/${y}.png`,
    transport: `https://a.tile.thunderforest.com/transport/${zoom}/${x}/${y}.png?apikey=9adc1e329d354046bcb4c9cec92f71cf`,
        transport_dark: `https://tile.thunderforest.com/transport-dark/${zoom}/${x}/${y}.png?apikey=9adc1e329d354046bcb4c9cec92f71cf`
  };

  const updateMapTexture = (layerUrl) => {
    textureLoader.load(
      `${layerUrl}`,
      (texture) => setMapTexture(texture),
      undefined,
      (err) => console.error('Error loading texture:', err)
    );
  };

  useEffect(() => {
    updateMapTexture(layers.standard);
  }, []);

  return (
    <>
    <Layers layers={layers} updateMapTexture={updateMapTexture}/>

      <Canvas
        style={{ height: '100vh', width: '100%' }}
        camera={{ position: [0, 5, 5], fov: 50 }}
      >
        <ambientLight intensity={0.5} />

        {mapTexture && (
          <mesh rotation={[-Math.PI / 2, 0, 0]}>
            <planeGeometry args={[5, 5]} />
            <meshBasicMaterial map={mapTexture} />
          </mesh>
        )}

        
        <Buildings />

        <OrbitControls minPolarAngle={0} maxPolarAngle={Math.PI / 2} />
      </Canvas>
    </>
  );
}

export default Map;