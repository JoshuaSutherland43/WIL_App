// Centralized map configuration and helpers
// Customize the default map region here. You can later drive this from Redux or hooks.

export type LatLng = {
  latitude: number;
  longitude: number;
};

export type Region = LatLng & {
  latitudeDelta: number;
  longitudeDelta: number;
};

// defaults to the beach
export const DEFAULT_REGION: Region = {
  latitude: -34.033130004432124,
  longitude: 25.498116965895196,
  latitudeDelta: 0.05,
  longitudeDelta: 0.05,
};

export const buildRegion = (
  lat: number,
  lng: number,
  latitudeDelta = 0.05,
  longitudeDelta = 0.05
): Region => ({
  latitude: lat,
  longitude: lng,
  latitudeDelta,
  longitudeDelta,
});

export const DEFAULT_MAP_OPTIONS = {
  showsCompass: true,
  showsMyLocationButton: true,
  toolbarEnabled: true,
};

