export const ONE_SOLAR_KWH = 4913;
export const RAYS_PER_SOLAR = 10_000;

export const kwhToSolar = (kwh: number) => kwh / ONE_SOLAR_KWH;
export const kwhToRays  = (kwh: number) => Math.round(kwhToSolar(kwh) * RAYS_PER_SOLAR);
export const fmtSolar   = (s: number) => s.toFixed(4);
export const fmtRays    = (r: number) => (r/1).toLocaleString(undefined,{maximumFractionDigits:0});
