import { NextRequest, NextResponse } from 'next/server';

interface NominatimAddress {
  city?: string;
  county?: string;
  city_district?: string;
  borough?: string;
  suburb?: string;
  neighbourhood?: string;
  quarter?: string;
  town?: string;
  village?: string;
}

// Nominatim 응답에서 "OO시 OO구 OO동" 형식으로 파싱
function parseAddress(address: NominatimAddress): string {
  const city =
    address.city ?? address.county ?? address.town ?? address.village ?? '';
  const district = address.city_district ?? address.borough ?? '';
  const dong = address.suburb ?? address.neighbourhood ?? address.quarter ?? '';

  return [city, district, dong].filter(Boolean).join(' ');
}

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const lat = searchParams.get('lat');
  const lng = searchParams.get('lng');

  if (!lat || !lng) {
    return NextResponse.json({ error: '좌표가 필요합니다.' }, { status: 400 });
  }

  const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&accept-language=ko`;

  const res = await fetch(url, {
    headers: {
      'User-Agent': 'StageFinder/1.0 (https://github.com/aahreum/StageFinder)',
    },
    next: { revalidate: 86400 }, // 주소는 하루 캐시
  });

  if (!res.ok) {
    return NextResponse.json(
      { error: '주소 조회에 실패했습니다.' },
      { status: 502 },
    );
  }

  const data = await res.json();
  const address = parseAddress(data.address ?? {});

  return NextResponse.json({ address });
}
