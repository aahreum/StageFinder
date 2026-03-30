import { fetchPerformances, type FetchPerformancesParams } from '@/shared';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);

  const params: FetchPerformancesParams = {
    stdate: searchParams.get('stdate') ?? '',
    eddate: searchParams.get('eddate') ?? '',
    cpage: Number(searchParams.get('cpage') ?? 1),
    rows: Number(searchParams.get('rows') ?? 20),
    ...(searchParams.get('signgucode') && {
      signgucode: searchParams.get('signgucode')!,
    }),
    ...(searchParams.get('shcate') && {
      shcate: searchParams.get('shcate')!,
    }),
    ...(searchParams.get('prfstate') && {
      prfstate: searchParams.get(
        'prfstate',
      ) as FetchPerformancesParams['prfstate'],
    }),
    ...(searchParams.get('shprfnm') && { shprfnm: searchParams.get('shprfnm')! }),
  };

  try {
    const data = await fetchPerformances(params);
    return NextResponse.json(data);
  } catch (error) {
    const message = error instanceof Error ? error.message : '알 수 없는 오류';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
