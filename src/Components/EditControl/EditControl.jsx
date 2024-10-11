import axios from "axios";
import React, { useEffect, useState } from "react";
import { FeatureGroup, Circle } from "react-leaflet";
import { EditControl } from "react-leaflet-draw";
import { baseUrl } from "../Auth/constants";
import { getLatLng } from "./utils";
import { createList, updateList } from "../Home/apis";

const MapEditControl = () => {
  // State to hold the layers
  const [layers, setLayers] = useState([]);

  useEffect(() => {
    const storedLayers = localStorage.getItem("layers");
    if (storedLayers) {
      setLayers(JSON.parse(storedLayers));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("layers", JSON.stringify(layers));
  }, [layers]);

  const fetchLayers = async () => {
    const header = {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    };

    try {
      const res = await axios.get(baseUrl + "/list", { headers: header });
      console.log(res);
    } catch (error) {}
  };
  useEffect(() => {
    console.log("use effect called");
    fetchLayers();
  }, []);

  // Handler for creating new layers
  const _onCreate = (e) => {
    const { layer } = e;
    const newLayer = {
      id: layer._leaflet_id,
      layerType: e.layerType,
      latlong: getLatLng(layer),
    };

    // Update layers and save to localStorage
    setLayers((prevLayers) => {
      const updatedLayers = [...prevLayers, newLayer];
      return updatedLayers;
    });

    createList((prevLayers) => [...prevLayers, newLayer]); // Optionally send updated layers to API
    createList(newLayer.latlong);
  };

  // Handler for editing layers
  const _onEditPath = (e) => {
    const editedLayers = e.layers.getLayers().map((layer) => {
      const id = layer._leaflet_id; // Use Leaflet's _leaflet_id to identify edited layers
      return {
        id,
        latlong: getLatLng(layer), // Update latlong after edit
      };
    });

    console.log("Layer(s) edited", editedLayers);

    setLayers((prevLayers) =>
      prevLayers.map((l) =>
        editedLayers.find((el) => el.id === l.id)
          ? {
              ...l,
              layer: editedLayers.find((el) => el.id === l.id).layer,
              latlong: editedLayers.find((el) => el.id === l.id).latlong,
            }
          : l
      )
    );
    updateList(id, editedLayers);
  };

  // Handler for deleting layers
  const _onDeleted = (e) => {
    const deletedLayerIds = e.layers
      .getLayers()
      .map((layer) => layer._leaflet_id);

    setLayers((prevLayers) =>
      prevLayers.filter((l) => !deletedLayerIds.includes(l.id))
    );

    console.log("Layer(s) deleted", deletedLayerIds);
  };

  console.log("layers", layers);
  return (
    <FeatureGroup>
      <EditControl
        position="topright"
        onEdited={_onEditPath}
        onCreated={_onCreate}
        onDeleted={_onDeleted}
        draw={{
          rectangle: false, // Disabling rectangle tool
        }}
      />
      {/* <Circle center={[51.51, -0.06]} radius={200} /> */}
    </FeatureGroup>
  );
};

export default MapEditControl;
