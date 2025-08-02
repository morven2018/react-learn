import type { PersonWithUrl } from '@shared/types/responseTypes';

const convertToCSV = (data: PersonWithUrl[]): string => {
  if (data.length === 0) return '';

  const headers: Array<keyof PersonWithUrl> = [
    'name',
    'url',
    'race',
    'gender',
    'birth',
    'death',
    'hair',
    'height',
    'realm',
    'spouse',
    'wikiUrl',
  ];

  const headerRow = headers.join(',');

  const dataRows = data.map((item) => {
    return headers
      .map((header) => {
        const value = item[header];

        if (value === null || value === undefined || value === '')
          return 'unknown';

        const stringValue = String(value);

        if (stringValue.includes(',') || stringValue.includes('"')) {
          return `"${stringValue.replace(/"/g, '""')}"`;
        }

        return stringValue;
      })
      .join(',');
  });

  return [headerRow, ...dataRows].join('\n');
};

export default convertToCSV;
