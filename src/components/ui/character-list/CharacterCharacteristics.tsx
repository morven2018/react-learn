import React from 'react';
import style from './CharacterLst.module.scss';
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
  return (
    <ul className={style.characteristics}>
      {Object.entries(CharacterLabels).map(([key, label]) => {
        const value = character[key.toLowerCase() as keyof Person];

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
