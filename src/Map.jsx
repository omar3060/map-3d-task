import React, { useState, useEffect, Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import Buildings from './Buildings';
import Layers from './Layers';

function latLonToTile(lat, lon, zoom) {
  const x = Math.floor((lon + 180) / 360 * Math.pow(2, zoom));
  const y = Math.floor((1 - Math.log(Math.tan(lat * Math.PI / 180) + 1 / Math.cos(lat * Math.PI / 180)) / Math.PI) / 2 * Math.pow(2, zoom));
  return { x, y };
}

function Map() {
  const textureLoader = new THREE.TextureLoader();
  const [mapTexture, setMapTexture] = useState(null);

  const lat = 30.609445;
  const lon = 32.275026;
  const zoom = 19;

  const { x, y } = latLonToTile(lat, lon, zoom);
  console.log(x, y)

  const layers = {
    standard: `https://tile.openstreetmap.org/${zoom}/${x}/${y}.png`,
    topo: `https://a.tile-cyclosm.openstreetmap.fr/cyclosm/${zoom}/${x}/${y}.png`,
    transport: `https://a.tile.thunderforest.com/transport/${zoom}/${x}/${y}.png?apikey=9adc1e329d354046bcb4c9cec92f71cf`,
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