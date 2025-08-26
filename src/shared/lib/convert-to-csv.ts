import type { PersonWithUrl } from '@shared/types/response-types';

const convertToCSV = (
  data: PersonWithUrl[],
  locale: 'ru' | 'en' = 'en'
): string => {
  if (data.length === 0) return '';

  const separator = locale === 'ru' ? ';' : ',';

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

  const headerRow = headers.join(separator);

  const dataRows = data.map((item) => {
    return headers
      .map((header) => {
        const value = item[header];

        if (value === null || value === undefined || value === '')
          return 'unknown';

        const stringValue = String(value);

        if (stringValue.includes(separator) || stringValue.includes('"')) {
          return `"${stringValue.replace(/"/g, '""')}"`;
        }

        return stringValue;
      })
      .join(separator);
  });

  return [headerRow, ...dataRows].join('\n');
};

export default convertToCSV;
