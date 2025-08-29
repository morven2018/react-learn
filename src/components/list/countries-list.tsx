import { Country } from '../../shared/types/types';

interface CountriesListProps {
  countries: Country[];
}

const CountriesList: React.FC<CountriesListProps> = ({ countries }) => {
  return (
    <ul>
      {countries.map((country, index) => (
        <li key={`${country.name}-${index}`}>
          <div>{country.name}</div>
          <div>{country.iso_code && `ISO: ${country.iso_code}`}</div>
          <div>
            {country.population &&
              `Population: ${country.population.toLocaleString()}`}
          </div>
        </li>
      ))}
    </ul>
  );
};

export default CountriesList;
