import { CO2Data } from '../types/types';

const API_URL =
  'https://nyc3.digitaloceanspaces.com/owid-public/data/co2/owid-co2-data.json';

const TIMEOUT = 10000;

let cache: CO2Data | null = null;
let promise: Promise<CO2Data> | null = null;

const fetchWithTimeout = async (): Promise<CO2Data> => {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), TIMEOUT);

  try {
    const response = await fetch(API_URL, {
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.json();
  } catch (error) {
    clearTimeout(timeoutId);
    if (error instanceof Error && error.name === 'AbortError') {
      throw new Error(`Request timeout after`);
    }
    throw error;
  }
};

export const fetchCO2Data = (): CO2Data => {
  if (cache) {
    if (cache instanceof Error) {
      throw cache;
    }
    return cache;
  }

  if (!promise) {
    promise = fetchWithTimeout()
      .then((data: CO2Data) => {
        cache = data;
        return data;
      })
      .catch((error) => {
        promise = null;
        cache = error;
        throw error;
      });
  }

  throw promise;
};
