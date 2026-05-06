import { useQuery } from '@tanstack/react-query';

const WEATHER_KEY = import.meta.env.VITE_WEATHER_API_KEY;

export const useWeather = (dzongkhag: string) => {
  return useQuery({
    queryKey: ['weather', dzongkhag],
    queryFn: async () => {
      // Endpoint and key param updated for WeatherAPI
      const response = await fetch(
        `https://api.weatherapi.com/v1/current.json?key=${WEATHER_KEY}&q=${dzongkhag}&aqi=no`
      );
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error?.message || 'Weather fetch failed');
      }
      
      return response.json();
    },
    staleTime: 1000 * 60 * 15, 
    enabled: !!dzongkhag && !!WEATHER_KEY,
  });
};