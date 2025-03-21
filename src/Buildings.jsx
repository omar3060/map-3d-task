import React from "react";
import { useGLTF } from "@react-three/drei";

const Model = React.memo(({ url, position, scale }) => {
  const { scene } = useGLTF(url);
  return (
      <primitive object={scene} position={position} scale={scale} />
  );
})

const Buildings = React.memo(() => {
  const buildingLat = 30.609445;
  const buildingLon = 32.275026;

  const buildingX = (buildingLon / 180) * 5;

  const buildingScale = [0.005, 0.005, 0.005];

  return (
    <>
      <Model
        url="/public/models/asia_building.glb"
        position={[buildingX, 0, 0]}
        scale={buildingScale}
      />
    </>
  );
});

export default Buildings;
