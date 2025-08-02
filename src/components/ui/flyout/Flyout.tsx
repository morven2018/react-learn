import CharacterApiService from '@services/api/apiService';
import React from 'react';
import convertToCSV from '@shared/lib/convertToCSV';
import style from './Flyout.module.scss';
import { useAppDispatch, useAppSelector } from '@redux/store';
import { clearSelectedCharacters } from '@shared/features/charactersSlice';

export const Flyout: React.FC = () => {
  const dispatch = useAppDispatch();
  const selectedCharacters = useAppSelector(
    (state) => state.characters.selectedCharacters
  );

  const handleUnselectAll = () => {
    dispatch(clearSelectedCharacters());
  };

  const handleDownload = async () => {
    try {
      const data =
        await CharacterApiService.getCharactersByIds(selectedCharacters);
      const csvData = convertToCSV(data);

      const fileName = `${selectedCharacters.length}_characters.csv`;

      const BOM = '\uFEFF';
      const blob = new Blob([BOM + csvData], {
        type: 'text/csv;charset=utf-8;',
      });

      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', fileName);

      document.body.appendChild(link);
      link.click();

      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      console.log(`Downloaded ${fileName}`);
    } catch (error) {
      console.error('Error downloading characters:', error);
    }
  };

  if (selectedCharacters.length === 0) return null;

  return (
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
          className={`${style.downloadButton}`}
          onClick={handleDownload}
          aria-label="Download selected characters"
          title="Download selected characters"
        >
          Download
        </button>
      </div>
    </div>
  );
};
