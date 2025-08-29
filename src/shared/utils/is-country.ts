const isCountry = (value: string): boolean => {
  return !(
    value.startsWith('OWID_') ||
    value.includes('(GCP)') ||
    value.includes('(BP)') ||
    value === 'Africa' ||
    value.includes('Asia') ||
    value.includes('Europ') ||
    value === 'OECD (Jones et al.)' ||
    value.includes('North America') ||
    value === 'South America' ||
    value === 'Oceania' ||
    value === 'World' ||
    value.includes('countries') ||
    value.includes('International') ||
    value.includes('Fires')
  );
};

export default isCountry;
