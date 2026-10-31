import L from 'leaflet';
import { useEffect } from 'react';

function StopsLayer(props) {
  const { map } = props;

  useEffect(() => {
    const group = L.layerGroup().addTo(map);

    return () => group.remove();
  }, [map]);

  return null;
}

export default StopsLayer;
