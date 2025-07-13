import React from 'react';
import type { Person } from '@shared/types/responseTypes';

interface CharacterCharacteristicsProps {
  character: Person;
  showUnknown?: boolean;
}

const CharacterCharacteristics: React.FC<CharacterCharacteristicsProps> = ({
  character,
  showUnknown = true,
}) => {
  const characteristics = [
    { label: 'Race', value: character.race },
    { label: 'Gender', value: character.gender },
    { label: 'Birth', value: character.birth },
    { label: 'Death', value: character.death },
    { label: 'Realm', value: character.realm },
  ];

  return (
    <ul>
      {characteristics.map(({ label, value }) => {
        const displayValue = value || (showUnknown ? 'unknown' : null);
        return displayValue ? (
          <li key={label}>
            <span>{label}:</span>
            <span>{displayValue}</span>
          </li>
        ) : null;
      })}
    </ul>
  );
};

export default CharacterCharacteristics;
