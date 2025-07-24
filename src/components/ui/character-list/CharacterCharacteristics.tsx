import React from 'react';
import style from './CharacterLst.module.scss';
import type { Person } from '@shared/types/responseTypes';

interface CharacterCharacteristicsProps {
  character: Person;
  showUnknown?: boolean;
}

class CharacterCharacteristics extends React.Component<CharacterCharacteristicsProps> {
  private readonly LABELS = {
    RACE: 'Race',
    GENDER: 'Gender',
    BIRTH: 'Birth',
    DEATH: 'Death',
    REALM: 'Realm',
  };

  render() {
    const { character, showUnknown = true } = this.props;

    return (
      <ul className={style.characteristics}>
        {Object.entries(this.LABELS).map(([key, label]) => {
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
  }
}

export default CharacterCharacteristics;
