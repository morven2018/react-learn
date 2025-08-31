import { DataColumn } from '../types/types';

const getAvailableColumns = (): DataColumn[] => {
  return [
    DataColumn.YEAR,
    DataColumn.POPULATION,
    DataColumn.CO2,
    DataColumn.CO2_PER_CAPITA,
    DataColumn.METHANE,
    DataColumn.OIL_CO2,
    DataColumn.TEMPERATURE_CHANGE_FROM_CO2,
    DataColumn.CEMENT_CO2,
    DataColumn.COAL_CO2,
    DataColumn.GAS_CO2,
    DataColumn.FLARING_CO2,
    DataColumn.LAND_USE_CHANGE_CO2,
    DataColumn.NITROUS_OXIDE,
    DataColumn.TOTAL_GHG,
  ];
};

export default getAvailableColumns;
