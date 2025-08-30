import { DataColumn } from '../types/types';

const getColumnLabel = (column: DataColumn): string => {
  const labels: Record<DataColumn, string> = {
    [DataColumn.YEAR]: 'Year',
    [DataColumn.POPULATION]: 'Population',
    [DataColumn.CO2]: 'CO2',
    [DataColumn.CO2_PER_CAPITA]: 'CO2 per Capita',
    [DataColumn.METHANE]: 'Methane',
    [DataColumn.OIL_CO2]: 'Oil CO2',
    [DataColumn.TEMPERATURE_CHANGE_FROM_CO2]: 'Temp Change',
    [DataColumn.CEMENT_CO2]: 'Cement CO2',
    [DataColumn.COAL_CO2]: 'Coal CO2',
    [DataColumn.GAS_CO2]: 'Gas CO2',
    [DataColumn.FLARING_CO2]: 'Flaring CO2',
    [DataColumn.LAND_USE_CHANGE_CO2]: 'Land Use CO2',
    [DataColumn.NITROUS_OXIDE]: 'Nitrous Oxide',
    [DataColumn.TOTAL_GHG]: 'Total GHG',
  };
  return labels[column] || column;
};

export default getColumnLabel;
