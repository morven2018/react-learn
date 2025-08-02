import convertToCSV from '@shared/lib/convertToCSV';
import type { PersonWithUrl } from '@shared/types/responseTypes';
import { describe, expect, it } from 'vitest';

describe('convertToCSV', () => {
  const mockData: PersonWithUrl[] = [
    {
      _id: '1',
      name: 'Frodo Baggins',
      url: 'https://example.com/1',
      wikiUrl: 'https://lotr.fandom.com/frodo',
      race: 'Hobbit',
      birth: '22 September, TA 2968',
      gender: 'Male',
      death: 'Sailed West',
      hair: 'Brown',
      height: '1.20m',
      realm: 'The Shire',
      spouse: null,
    },
    {
      _id: '2',
      name: 'Galadriel',
      url: 'https://example.com/2',
      wikiUrl: 'https://lotr.fandom.com/galadriel',
      race: 'Elf',
      birth: 'Years of the Trees',
      gender: 'Female',
      death: null,
      hair: 'Golden',
      height: '1.93m',
      realm: 'Lothlórien',
      spouse: 'Celeborn',
    },
  ];

  it('convert array of JSON to CSV string', () => {
    const result = convertToCSV(mockData);

    expect(result).toContain(
      'name,url,race,gender,birth,death,hair,height,realm,spouse,wikiUrl'
    );
    expect(result).toContain(
      'Frodo Baggins,https://example.com/1,Hobbit,Male,"22 September, TA 2968",Sailed West,Brown,1.20m,The Shire,unknown,https://lotr.fandom.com/frodo'
    );
    expect(result).toContain(
      'Galadriel,https://example.com/2,Elf,Female,Years of the Trees,unknown,Golden,1.93m,Lothlórien,Celeborn,https://lotr.fandom.com/galadriel'
    );
  });

  it('return empty string for empty array', () => {
    const result = convertToCSV([]);
    expect(result).toBe('');
  });

  it('handle null/empty values as "unknown"', () => {
    const testData: PersonWithUrl[] = [
      {
        ...mockData[0],
        death: null,
        hair: '',
        spouse: null,
      },
    ];

    const result = convertToCSV(testData);
    const dataLine = result.split('\n')[1];
    const unknownCount = (dataLine.match(/unknown/g) ?? []).length;
    expect(unknownCount).toBeGreaterThanOrEqual(2);
  });

  it('escape commas and quotes', () => {
    const testData: PersonWithUrl[] = [
      {
        ...mockData[0],
        name: 'Frodo "Ringbearer" Baggins',
        birth: 'Shire, Middle-earth',
      },
    ];

    const result = convertToCSV(testData);
    expect(result).toContain('"Frodo ""Ringbearer"" Baggins"');
    expect(result).toContain('"Shire, Middle-earth"');
  });
});
