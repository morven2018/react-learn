import { CO2Data } from '../types/types';

const API_URL =
  'https://nyc3.digitaloceanspaces.com/owid-public/data/co2/owid-co2-data.json';

let cache: CO2Data | null = null;
let promise: Promise<CO2Data> | null = null;

export const fetchCO2Data = (): CO2Data => {
  if (cache) {
    return cache;
  }

  if (!promise) {
    promise = fetch(API_URL)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then((data: CO2Data) => {
        cache = data;
        return data;
      })
      .catch((error) => {
        promise = null;
        throw error;
      });
  }

  throw promise;
};

export const preloadCO2Data = () => {
  fetchCO2Data();
};
