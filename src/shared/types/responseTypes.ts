export type Respionse = filmsListResultItem[] | listResultItem[];
export interface filmsListResultItem {
  properties: {
    producer: string;
    title: string;
    episode_id: string;
    director: string;
    release_date: string;
    opening_crawl: string;
  };
}

export interface listResultItem {
  uid: string;
  name: string;
  url: string;
}

export interface peopleResult {
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

export interface vehiclesResult {
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

export interface starshipsResult {
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

export interface speciesResult {
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

export interface planetResult {
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
