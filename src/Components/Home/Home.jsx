import React, { useEffect, useState } from "react";
import {
  MapContainer,
  TileLayer,
  Circle,
  CircleMarker,
  Polyline,
  Polygon,
} from "react-leaflet";
import EditControl from "../EditControl/EditControl";
import FileUpload from "../FileUpload/FileUpload";
import toGeoJSON from "togeojson";
import { DOMParser } from "xmldom";
import { GeoJSON } from "react-leaflet"; // For rendering GeoJSON
import FloatingButton from "../common/FloatingButton";
import axios from "axios";
import { baseUrl } from "../Auth/constants";
import { getHeaderWithToken } from "../utils";
import { fetchList } from "./apis";

const convertKMLToGeoJSON = (kmlContent) => {
  const parser = new DOMParser();
  const kml = parser.parseFromString(kmlContent, "text/xml");
  return toGeoJSON.kml(kml);
};

const renderLayer = (layer) => {
  const { layerType, latlong } = layer;
  switch (layerType) {
    case "circle":
      return (
        <Circle
          key={layer.id}
          center={latlong[0]} // Circle takes one center coordinate
          radius={200} // Example radius, adjust as needed
        />
      );
    case "circlemarker":
      return (
        <CircleMarker
          key={layer.id}
          center={latlong[0]} // CircleMarker takes one center coordinate
          radius={10} // Example marker radius
          fillColor="blue"
        />
      );
    case "polyline":
      return (
        <Polyline
          key={layer.id}
          positions={latlong} // Polyline takes an array of coordinates
          color="red"
        />
      );
    case "polygon":
      return (
        <Polygon
          key={layer.id}
          positions={latlong} // Polygon takes an array of coordinates
          color="green"
        />
      );
    default:
      return null;
  }
};

const Home = () => {
  const [layers, setLayers] = useState([]);
  const [allowFileUpload, setAllowFileUpload] = useState(false);
  const [layerData, setLayerData] = useState(
    () => JSON.parse(localStorage.getItem("layers")) || []
  );

  useEffect(() => {
    fetchList().then((data) => {
      if (data) {
        // setLayerData(data);
      }
    });
  }, []);

  const handleFileUpload = (fileContent, fileType) => {
    let geojsonData;
    try {
      if (fileType === "application/geo+json") {
        geojsonData = JSON.parse(fileContent);
      } else if (fileType === "application/vnd.google-earth.kml+xml") {
        geojsonData = convertKMLToGeoJSON(fileContent);
      } else {
        const kmlGeoJSON = convertKMLToGeoJSON(fileContent);
        if (kmlGeoJSON) {
          geojsonData = kmlGeoJSON;
        }
      }

      if (geojsonData) {
        setLayers((prevLayers) => [...prevLayers, geojsonData]);
      }
    } catch (error) {
      console.error("Error parsing file:", error);
    }
  };

  return (
    <>
      {allowFileUpload && <FileUpload onFileUpload={handleFileUpload} />}

      <FloatingButton onClick={() => setAllowFileUpload(!allowFileUpload)} />

      <MapContainer
        center={[51.505, -0.09]}
        zoom={13}
        style={{ height: "100vh" }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        <EditControl />

        {layers.map((layer, index) => (
          <GeoJSON key={index} data={layer} />
        ))}
        {layerData.length > 0 && layerData.map(renderLayer)}
      </MapContainer>
    </>
  );
};

export default Home;
