import React from 'react';
import style from './character-list.module.scss';
import type { Person } from '@shared/types/responseTypes';

interface CharacterCharacteristicsProps {
  character: Person;
  showUnknown?: boolean;
}

enum CharacterLabels {
  race = 'Race',
  gender = 'Gender',
  birth = 'Birth',
  death = 'Death',
  realm = 'Realm',
}

const CharacterCharacteristics: React.FC<CharacterCharacteristicsProps> = ({
  character,
  showUnknown = true,
}) => {
  const getCharacterValue = (key: string): string | null => {
    switch (key) {
      case 'race':
        return character.race;
      case 'gender':
        return character.gender;
      case 'birth':
        return character.birth;
      case 'death':
        return character.death;
      case 'realm':
        return character.realm;
      default:
        return null;
    }
  };

  return (
    <ul className={style.characteristics}>
      {Object.entries(CharacterLabels).map(([key, label]) => {
        const value = getCharacterValue(key.toLowerCase());

        return (
          (value || showUnknown) && (
            <li
              key={label}
              className={value ? style.characteristicItem : style.unknownItem}
            >
              <span>{label}:</span>
              <span>{value ?? 'unknown'}</span>
            </li>
          )
        );
      })}
    </ul>
  );
};

export default CharacterCharacteristics;
