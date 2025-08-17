'use client';
import React, { useRef } from 'react';
import convertToCSV from '@shared/lib/convert-to-csv';
import style from './flyout.module.scss';
import { clearSelectedCharacters } from '@redux/slices/characters-slice';
import { useAppDispatch, useAppSelector } from '@redux/store';
import { useLazyGetCharactersByIdsQuery } from '@services/api/character-api';

export const Flyout: React.FC = () => {
  const downloadLinkRef = useRef<HTMLAnchorElement>(null);
  const dispatch = useAppDispatch();
  const selectedCharacters = useAppSelector(
    (state) => state.characters.selectedCharacters
  );

  const [fetchCharacters] = useLazyGetCharactersByIdsQuery();

  const handleUnselectAll = () => {
    dispatch(clearSelectedCharacters());
  };

  const handleDownload = async () => {
    try {
      const response = await fetch('/api/generate-csv', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          characterIds: selectedCharacters,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate CSV');
      }

      const blob = await response.blob();
      const url = URL.createObjectURL(blob);

      if (downloadLinkRef.current) {
        downloadLinkRef.current.href = url;
        downloadLinkRef.current.download = `${selectedCharacters.length}_characters.csv`;
        downloadLinkRef.current.click();
        URL.revokeObjectURL(url);
      }
    } catch (error) {
      console.error('Error downloading CSV:', error);
    }
  };

  if (selectedCharacters.length === 0) return null;

  return (
    <div className={style.flyoutWrapper}>
      <div className={style.flyout}>
        <div className={style.info}>
          <span className={style.countBadge}>{selectedCharacters.length}</span>
          <span className={style.countText}>
            {selectedCharacters.length === 1 ? 'Item' : 'Items'} selected
          </span>
        </div>

        <div className={style.buttonList}>
          <button
            className={style.selectButton}
            onClick={handleUnselectAll}
            aria-label="Unselect all"
            title="Unselect all"
          >
            Unselect all
          </button>

          <button
            className={style.downloadButton}
            onClick={handleDownload}
            aria-label="Download selected characters"
            title="Download selected characters"
          >
            Download
          </button>
          <a ref={downloadLinkRef} style={{ display: 'none' }} />
        </div>
      </div>
    </div>
  );
};
