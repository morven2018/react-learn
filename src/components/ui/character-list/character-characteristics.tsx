import React from 'react';
import style from './character-list.module.scss';
import type { Person } from '@shared/types/response-types';
import { useTranslations } from 'next-intl';

interface CharacterCharacteristicsProps {
  character: Person;
  showUnknown?: boolean;
}

const CharacterCharacteristics: React.FC<CharacterCharacteristicsProps> = ({
  character,
  showUnknown = true,
}) => {
  const t = useTranslations('Content');

  const characteristics = [
    { key: 'race', value: character.race },
    { key: 'gender', value: character.gender },
    { key: 'birth', value: character.birth },
    { key: 'death', value: character.death },
    { key: 'realm', value: character.realm },
  ] as const;

  return (
    <ul className={style.characteristics}>
      {characteristics.map(
        ({ key, value }) =>
          (value || showUnknown) && (
            <li
              key={key}
              className={value ? style.characteristicItem : style.unknownItem}
            >
              <span>{t(`labels.${key}`)}:</span>
              <span>{value || t('unknown')}</span>
            </li>
          )
      )}
    </ul>
  );
};

export default CharacterCharacteristics;
