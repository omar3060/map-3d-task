import React, { useState, useEffect } from "react";
import { useGLTF } from "@react-three/drei";
import { Line } from "@react-three/drei";
import axios from "axios";

const Model = ({ url, position, scale, rotation }) => {
  const { scene } = useGLTF(url);
  return (
    <primitive object={scene} position={position} scale={scale} rotation={rotation} />
  );
};

const latLonToScene = (lat, lon, refLat = 30.610205, refLon = 32.277569) => {
  const x = ((lon - refLon) * 11000) + 1;
  const z = ((lat - refLat) * 11000) - .8;
  return [x, 0, z];
};

const sceneToLatLon = (x, z, refLat = 30.610205, refLon = 32.277569) => {
  const lon = (x - 1) / 11000 + refLon;
  const lat = (z + .8) / 11000 + refLat;
  return [lat, lon];
};

const Buildings = () => {
  const buildingLat = 30.610205;
  const buildingLon = 32.277569;

  const buildingPosition = [0.9, 0, -1.1];
  const buildingScale = [0.004, 0.004, 0.004];
  const buildingRotation = [0, 4, 0];

  const carPosition = [0.6, 0, 2];
  // const carPosition = [1.6, 0, 2];
  const carScale = [0.1, 0.1, 0.1];
  const carRotation = [0, 2.4, 0];

  const [trackingPoints, setTrackingPoints] = useState([]);
  const [hasFetchedRoute, setHasFetchedRoute] = useState(false);

  useEffect(() => {
    if (hasFetchedRoute) return;

    const [buildingLatPos, buildingLonPos] = sceneToLatLon(buildingPosition[0], buildingPosition[2]);
    const [carLatPos, carLonPos] = sceneToLatLon(carPosition[0], carPosition[2]);

    console.log("Building Lat and Lon:", buildingLatPos, buildingLonPos);
    console.log("Car Lat and Lon:", carLatPos, carLonPos);


    const orsApiKey = "5b3ce3597851110001cf62489c7787739b15424eb81ec00062f394a1";
    const orsUrl = "https://cors-anywhere.herokuapp.com/https://api.openrouteservice.org/v2/directions/driving-car/geojson";

    const requestBody = {
      coordinates: [
        [carLonPos, carLatPos],
        [buildingLonPos, buildingLatPos], 
      ],
    };

    console.log("Sending request to OpenRouteService with body:", requestBody);

    axios
      .post(orsUrl, requestBody, {
        headers: {
          Authorization: `Bearer ${orsApiKey}`,
          "Content-Type": "application/json",
        },
      })
      .then((response) => {
        console.log("OpenRouteService response:", response.data);
        const route = response.data.features[0]?.geometry.coordinates;
        if (!route || route.length < 2) {
          console.error("No valid route found in response");
          setTrackingPoints([carPosition, buildingPosition]);
          return;
        }

        const points = route.map(([lon, lat]) => latLonToScene(lat, lon));
        console.log("Converted tracking points:", points);
        setTrackingPoints(points);
        setHasFetchedRoute(true); 
      })
      .catch((error) => {
        console.error("Error fetching route from OpenRouteService:", error);
        if (error.response) {
          console.log("Error response:", error.response.data);
        }
        
        setTrackingPoints([carPosition, buildingPosition]);
        setHasFetchedRoute(true); 
      });
  }, [buildingPosition, carPosition, hasFetchedRoute]);

  if (trackingPoints.length < 2) {
    console.log("Not enough points to draw the line:", trackingPoints);
    return (
      <>
        <Model
          url="/models/asia_building.glb"
          position={buildingPosition}
          scale={buildingScale}
          rotation={buildingRotation}
        />
        <Model
          url="/models/lamborghini_diablo_sv.glb"
          position={carPosition}
          scale={carScale}
          rotation={carRotation}
        />
      </>
    );
  }

  return (
    <>
      <Model
        url="/models/asia_building.glb"
        position={buildingPosition}
        scale={buildingScale}
        rotation={buildingRotation}
      />
      <Model
        url="/models/lamborghini_diablo_sv.glb"
        position={carPosition}
        scale={carScale}
        rotation={carRotation}
      />
      <Line points={trackingPoints} color="red" lineWidth={5} />
    </>
  );
};

export default Buildings;