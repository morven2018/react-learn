import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { Term } from '@services/localStorage/LSService';

export interface CharactersState {
  selectedCharacters: string[];
}

const initialState: CharactersState = {
  selectedCharacters: Term.getSelectedFromLS() ?? [],
};

export const charactersSlice = createSlice({
  name: 'characters',
  initialState,
  reducers: {
    toggleCharacterSelection: (state, action: PayloadAction<string>) => {
      const index = state.selectedCharacters.indexOf(action.payload);
      if (index === -1) {
        state.selectedCharacters.push(action.payload);
      } else {
        state.selectedCharacters.splice(index, 1);
      }
      Term.setSelectedToLS(state.selectedCharacters);
    },
    clearSelectedCharacters: (state) => {
      state.selectedCharacters = [];
      Term.setSelectedToLS([]);
    },
  },
});

export const { toggleCharacterSelection, clearSelectedCharacters } =
  charactersSlice.actions;
export default charactersSlice.reducer;
