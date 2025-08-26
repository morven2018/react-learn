import convertToCSV from '@shared/lib/convert-to-csv';
import { NextResponse } from 'next/server';
import { getCharactersByIds } from '@/services/api/character-api.server';

export async function POST(req: Request) {
  try {
    const { characterIds, locale = 'en' } = await req.json();

    const data = await getCharactersByIds(characterIds);
    const validLocale = locale === 'ru' ? 'ru' : 'en';

    if (!data || data.length === 0) {
      return NextResponse.json({ message: 'No data found' }, { status: 404 });
    }

    const csvData = convertToCSV(data, validLocale);
    const BOM = '\uFEFF';
    const csvWithBOM = BOM + csvData;

    return new NextResponse(csvWithBOM, {
      headers: {
        'Content-Type': 'text/csv',
        'Content-Disposition': `attachment; filename=${characterIds.length}_characters.csv`,
      },
    });
  } catch (error) {
    console.error('CSV generation error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}
