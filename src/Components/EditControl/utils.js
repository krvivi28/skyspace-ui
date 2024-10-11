// Function to extract latlong from the layer based on the layer type

export const getLatLng = (layer) => {
  if (layer.getLatLng) {
    // For point layers (e.g., marker or circle)
    const { lat, lng } = layer.getLatLng();
    return [[lat, lng]];
  } else if (layer.getLatLngs) {
    // For polyline/polygon layers
    const latlngs = layer.getLatLngs();
    return L.LineUtil.isFlat(latlngs) // Check if the coordinates are flat
      ? latlngs.map(({ lat, lng }) => [lat, lng])
      : latlngs.flat().map(({ lat, lng }) => [lat, lng]); // Flatten in case of multi-polygons
  }
  return [];
};
