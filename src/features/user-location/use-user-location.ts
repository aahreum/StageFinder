'use client';

import { useState, useCallback } from 'react';

export interface Coordinates {
  lat: number;
  lng: number;
}

export function useUserLocation() {
  const [location, setLocation] = useState<Coordinates | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getLocation = useCallback(() => {
    if (!navigator.geolocation) {
      setError('이 브라우저는 위치 조회를 지원하지 않습니다.');
      return;
    }

    setIsLoading(true);
    setError(null);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
        setIsLoading(false);
      },
      () => {
        setError('위치 권한이 거부되었거나 조회에 실패했습니다.');
        setIsLoading(false);
      },
    );
  }, []);

  return { location, isLoading, error, getLocation };
}
