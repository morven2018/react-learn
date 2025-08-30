import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { DataColumn } from '../../shared/types/types';

interface ColumnState {
  selectedColumns: DataColumn[];
}

const mandatoryColumns: DataColumn[] = [
  DataColumn.YEAR,
  DataColumn.POPULATION,
  DataColumn.CO2,
  DataColumn.CO2_PER_CAPITA,
];

const initialColumns: DataColumn[] = [...mandatoryColumns];

const initialState: ColumnState = {
  selectedColumns: initialColumns,
};

const columnSlice = createSlice({
  name: 'columns',
  initialState,
  reducers: {
    toggleColumn: (state, action: PayloadAction<DataColumn>) => {
      const column = action.payload;

      if (mandatoryColumns.includes(column)) {
        return;
      }

      const index = state.selectedColumns.indexOf(column);

      if (index > -1) {
        state.selectedColumns.splice(index, 1);
      } else {
        state.selectedColumns.push(column);
      }

      state.selectedColumns.sort((a, b) => {
        const allColumns = Object.values(DataColumn);
        return allColumns.indexOf(a) - allColumns.indexOf(b);
      });
    },

    setColumns: (state, action: PayloadAction<DataColumn[]>) => {
      const newColumns = [
        ...mandatoryColumns,
        ...action.payload.filter((col) => !mandatoryColumns.includes(col)),
      ];
      state.selectedColumns = Array.from(new Set(newColumns)).sort((a, b) => {
        const allColumns = Object.values(DataColumn);
        return allColumns.indexOf(a) - allColumns.indexOf(b);
      });
    },

    resetColumns: (state) => {
      state.selectedColumns = initialColumns;
    },
  },
});

export const { toggleColumn, setColumns, resetColumns } = columnSlice.actions;

export const isColumnMandatory = (column: DataColumn): boolean => {
  return mandatoryColumns.includes(column);
};

export default columnSlice.reducer;
