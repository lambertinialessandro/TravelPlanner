import { selectMapLang } from 'app/store/slice/mapSlice';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { getTileUrl } from './mapUtils';

function useLeafletMap() {
  const containerRef = useRef(null);
  const tileLayerRef = useRef(null);
  const [map, setMap] = useState(null);
  const mapLang = useSelector(selectMapLang);

  useEffect(() => {
    const instance = L.map(containerRef.current, {
      zoomControl: true,
      attributionControl: false,
    }).setView([35.6762, 139.6503], 13);

    setMap(instance);
    return () => {
      instance.remove();
      setMap(null);
    };
  }, []);

  useEffect(() => {
    if (!map) return;
    tileLayerRef.current?.remove();
    tileLayerRef.current = L.tileLayer(getTileUrl(mapLang), { maxZoom: 19 }).addTo(map);
  }, [map, mapLang]);

  return { containerRef, map };
}

export default useLeafletMap;
