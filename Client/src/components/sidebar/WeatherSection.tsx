import { useEffect, useState } from "react";
import axios from "axios";
import { Card } from "@/components/ui/card";

interface WeatherData {
  main: {
    temp: number;
  };
  weather: {
    icon: string;
    description: string;
  }[];
}

export default function WeatherSection() {
  const [weather, setWeather] = useState<WeatherData | null>(null);

  useEffect(() => {
    async function fetchWeather() {
      try {
        const apiKey = import.meta.env.VITE_OPENWEATHER_API_KEY;
        const res = await axios.get(
          `https://api.openweathermap.org/data/2.5/weather?q=Dublin,IE&appid=${apiKey}&units=metric`,
        );
        setWeather(res.data);
      } catch (e) {
        console.error("Failed to fetch weather", e);
      }
    }
    fetchWeather();
  }, []);

  if (!weather) return null;

  const temperature = Math.round(weather.main.temp);
  const icon = weather.weather[0].icon;
  const description = weather.weather[0].description;

  return (
    <Card className="flex items-center gap-4 rounded-xl bg-blue-100 p-4 shadow">
      <img
        src={`https://openweathermap.org/img/wn/${icon}@2x.png`}
        alt={description}
        className="h-12 w-12"
      />
      <div>
        <div className="text-xl font-bold">{temperature}°C</div>
        <div className="text-sm capitalize text-gray-700">{description}</div>
      </div>
    </Card>
  );
}
