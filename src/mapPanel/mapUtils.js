import { DEAFULT_CIRCLE_COLOR, DEAFULT_POLYGON_COLOR } from 'app/costants/colors';
import { EN, JA, LANGUAGES_LIST } from 'app/costants/languages';
import L from 'leaflet';

export function getTileUrl(lang) {
  if (lang === JA) {
    return 'https://{s}.tile.openstreetmap.jp/{z}/{x}/{y}.png';
  } else if (lang === EN) {
    const MAPTILER_API_KEY = 'eH50A7634ifNKGruznOU';
    return `https://api.maptiler.com/maps/openstreetmap/{z}/{x}/{y}.jpg?key=${MAPTILER_API_KEY}&language=en`;
    return `https://api.maptiler.com/maps/hybrid-v4/{z}/{x}/{y}.jpg?key=${MAPTILER_API_KEY}&language=en`;
    return `https://api.maptiler.com/maps/outdoor-v4/{z}/{x}/{y}.jpg?key=${MAPTILER_API_KEY}&language=en`;
    return `https://api.maptiler.com/maps/base-v4/{z}/{x}/{y}.jpg?key=${MAPTILER_API_KEY}&language=en`;
    return `https://api.maptiler.com/maps/jp-gsi-standard/{z}/{x}/{y}.jpg?key=${MAPTILER_API_KEY}&language=en`;
  }
  return 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
}

export function getJawgTileUrl(lang) {
  const accessToken = '';
  const supportedLang = LANGUAGES_LIST.includes(lang) ? lang : 'en';

  return `https://tile.jawg.io/jawg-sunny/{z}/{x}/{y}.png?lang=${supportedLang}&access-token=${accessToken}`;
}

/* STOPS */

export function createPinIcon(label, color) {
  const L = window.L;
  return L.divIcon({
    className: 'custom-map-pin',
    html: `
          <div style="
            background-color: ${color};
            color: white;
            font-weight: bold;
            border-radius: 50%;
            width: 32px;
            height: 32px;
            display: flex;
            align-items: center;
            justify-content: center;
            border: 2px solid white;
            box-shadow: 0 4px 10px rgba(0,0,0,0.4);
            font-size: 13px;
          ">
            ${label}
          </div>
        `,
    iconSize: [32, 32],
    iconAnchor: [16, 16],
  });
}

export function buildPinPopupHtml(stop, color) {
  return `
        <div style="font-family: sans-serif; min-width: 180px;">
          <div style="font-size: 10px; font-weight: 700; color: ${color}; text-transform: uppercase;">${stop.category}</div>
          <div style="font-size: 14px; font-weight: bold; margin-bottom: 2px;">${stop.name}</div>
          <div style="font-size: 11px; color: #666;">Lat: ${stop.lat}, Lng: ${stop.lng}</div>
          <div style="font-size: 12px; color: #444; margin-top: 4px;">Time: ${stop.startTime} (${stop.durationMin} mins)</div>
          ${stop.cost ? `<div style="font-size: 12px; font-weight: 600; color: #10b981;">Cost: €${stop.cost.toLocaleString()}</div>` : ''}
          ${stop.notes ? `<div style="font-size: 11px; margin-top: 6px; color: #333; background: #f3f4f6; padding: 4px; border-radius: 4px;">${stop.notes}</div>` : ''}
        </div>
      `;
}

export function addMarker(idx, stop, color, group) {
  L.marker([stop.lat, stop.lng], { icon: createPinIcon(idx, color) })
    .bindPopup(buildPinPopupHtml(stop, color))
    .addTo(group);
}

/* DISTRICTS */

export function buildShapePopupHtml(district, color) {
  return `
        <div style="font-family: sans-serif; min-width: 180px;">
          <div style="font-size: 14px; font-weight: bold; color: ${color}; margin-bottom: 2px;">${district.name}</div>
          ${district.notes ? `<div style="font-size: 11px; margin-top: 6px; color: #333; background: #f3f4f6; padding: 4px; border-radius: 4px;">${district.notes}</div>` : ''}
        </div>
      `;
}

export function addDistrictShape(district, group, color = null, enablePopup = true) {
  console.log(district, color, group, enablePopup)

  let shape = null;
  let shapeColor = null;
  if (district.type === 'circle' && district.center && district.radius) {
    shapeColor = color || DEAFULT_CIRCLE_COLOR;
    shape = L.circle(district.center, {
      color,
      fillColor: color,
      fillOpacity: 0.15,
      radius: district.radius,
      weight: 2,
    });
  } else if (district.type === 'polygon' && district.polygon?.length > 2) {
    shapeColor = color || DEAFULT_POLYGON_COLOR;
    shape = L.polygon(district.polygon, {
      color,
      fillColor: color,
      fillOpacity: 0.2,
      weight: 2,
    });
  }

  if (shape && shapeColor) {
    if (enablePopup) {
      shape = shape.bindPopup(buildShapePopupHtml(district, shapeColor));
    }
    shape.addTo(group);
  }

  return null;
}
