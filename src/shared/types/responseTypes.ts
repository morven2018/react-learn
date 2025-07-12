export type Respionse = FilmsListResultItem[] | ListResultItem[];
export interface FilmsListResultItem {
  properties: {
    producer: string;
    title: string;
    episode_id: string;
    director: string;
    release_date: string;
    opening_crawl: string;
  };
}

export interface ListResultItem {
  uid: string;
  name: string;
  url: string;
}

export interface PeopleResult {
  properties: {
    name: string;
    gender: string;
    skin_color: string;
    hair_color: string;
    height: string;
    eye_color: string;
    mass: string;
    homeworld: string;
    birth_year: string;
  };
}

export interface VehiclesResult {
  properties: {
    consumables: string;
    name: string;
    cargo_capacity: string;
    passengers: string;
    max_atmosphering_speed: string;
    crew: string;
    length: string;
    model: string;
    cost_in_credits: string;
    manufacturer: string;
    vehicle_class: string;
  };
}

export interface StarshipsResult {
  properties: {
    consumables: string;
    name: string;
    cargo_capacity: string;
    passengers: string;
    max_atmosphering_speed: string;
    crew: string;
    length: string;
    model: string;
    cost_in_credits: string;
    manufacturer: string;
    MGLT: string;
    starship_class: string;
    hyperdrive_rating: string;
  };
}

export interface SpeciesResult {
  properties: {
    classification: string;
    name: string;
    designation: string;
    eye_colors: string;
    skin_colors: string;
    language: string;
    hair_colors: string;
    homeworld: string;
    average_lifespan: string;
    average_height: string;
  };
}

export interface PlanetResult {
  properties: {
    climate: string;
    surface_water: string;
    name: string;
    diameter: string;
    rotation_period: string;
    terrain: string;
    gravity: string;
    orbital_period: string;
    population: string;
  };
}
