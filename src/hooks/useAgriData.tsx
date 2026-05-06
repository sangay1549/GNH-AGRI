import { useQuery } from '@tanstack/react-query';
import { createClient } from '@supabase/supabase-js';

const WEATHER_API_KEY = import.meta.env.VITE_WEATHER_API_KEY;
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

/**
 * 1. Fixed Weather Hook
 * Now fetches Lat/Lon from Supabase first to ensure 100% accuracy for Bhutan.
 */

    
 export const useWeather = (dzongkhag: string) => {
  return useQuery({
    queryKey: ['weather', dzongkhag],
    queryFn: async () => {
      // 1. Clean the input to remove any hidden characters causing 404s
      const cleanName = dzongkhag.trim();

      // 2. Lookup exact coordinates from your new table
      const { data: geo, error: geoError } = await supabase
        .from('dzongkhagweather')
        .select('latitude, longitude')
        .ilike('name', cleanName)
        .maybeSingle(); // maybeSingle prevents 404 crashes if a city isn't found

      if (geoError) throw geoError;
      if (!geo) throw new Error(`Dzongkhag "${cleanName}" not found in database.`);

      // 3. Fetch weather using Lat/Lon for high-altitude accuracy
      const response = await fetch(
        `https://api.weatherapi.com/v1/current.json?key=${WEATHER_API_KEY}&q=${geo.latitude},${geo.longitude}&aqi=no`
      );
      
      if (!response.ok) throw new Error('Weather API failed');
      return response.json();
    },
    enabled: !!dzongkhag && dzongkhag.length > 2,
  });
};

export const useSoilMetrics = (dzongkhag: string) => {
  return useQuery({
    queryKey: ['soilMetrics', dzongkhag],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('soil_metrics')
        .select('*')
        .eq('dzongkhag', dzongkhag)
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      if (error && error.code !== 'PGRST116') throw error;
      return data;
    },
    enabled: !!dzongkhag,
  });
};

/**
 * 3. Fixed Crop Advice Hook
 * Added better logic and ensured it watches the temperature for changes.
 */
export const useCropAdvice = (locationName: string, currentTemp: number | null) => {
  return useQuery({
    queryKey: ['cropAdvice', locationName, currentTemp], 
    queryFn: async () => {
      if (currentTemp === null) return [];

      const { data, error } = await supabase
        .from('agricultural_products')
        .select('*')
        .lte('min_temp', currentTemp)
        .gte('max_temp', currentTemp);

      if (error) throw error;
      return data || [];
    },
    // Only runs when the weather API successfully returns a temperature
    enabled: currentTemp !== null && !!locationName, 
  });
};

/**
 * 4. Cultivation Guide & 5. Global Market Hooks
 * (Included to keep your file complete)
 */
export const useCultivationGuide = (cropName: string) => {
  return useQuery({
    queryKey: ['cropGuide', cropName],
    queryFn: async () => {
      if (!cropName || cropName === "Analyzing...") return null;
      const { data, error } = await supabase
        .from('agricultural_products')
        .select('*')
        .eq('name', cropName)
        .single();
      if (error) throw error;
      return data;
    },
    enabled: !!cropName && cropName !== "Analyzing...",
  });
};

export const useGlobalCommodities = () => {
  return useQuery({
    queryKey: ['globalMarket'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('market_prices')
        .select('*');
      if (error) throw error;
      return (data || []).map(item => ({
        name: item.crop_name,
        price: item.price_nu
      }));
    }
  });
};