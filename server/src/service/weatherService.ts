import dotenv from 'dotenv';
dotenv.config();

// map coordinates for communcation with openweathermap
type Coordinates = {
  lat: number;
  lon: number;
};

// Weather type with fields expected by client
type Weather = { 
  city?: string, // city and date only will be defined 
  date?: string, // in first element of response array
  icon: string, 
  iconDescription: string, 
  tempF: number, 
  windSpeed: number, 
  humidity: number 
}

class WeatherService {
  private baseURL: string;
  private apiKey: string;

  constructor() {
    // retrieve base url and api key from environment
    this.baseURL = process.env.API_BASE_URL!;
    this.apiKey = process.env.API_KEY!;
  }

  // retrieve map coordinates for city name
  private async fetchLocationData(city: string): Promise<Coordinates> {
    const url:string = `${this.baseURL}/geo/1.0/direct?q=${city}&limit=1&appid=${this.apiKey}`;
    console.log ('fetching', url)
    const s = await fetch(url);
    const d = await s.json();
    console.log (d);
    return { lat: d[0].lat, lon: d[0].lon }

  }

  // translate weather data from structure returned by
  // openweathermap to structure expected by client.
  // structure expected by client is specified in 
  //     /client/src/main.ts renderCurrentWeather function
  // to examine data structure returned by openweathermap check 
  //     https://api.openweathermap.org/data/2.5/weather?lat={}&lon={}&appid={}&units=imperial (current weather) and
  //     https://api.openweathermap.org/data/2.5/forecast/?lat={}&lon={}&units=imperial&cnt=5&appid={} (forecast)
  private buildResult(d: any, city: any, dt: any): Weather {
    return { 
      city: city, 
      date: dt, 
      icon: d.weather[0].icon, 
      iconDescription: d.weather[0].description, 
      tempF: d.main.temp, 
      windSpeed: d.wind.speed, 
      humidity: d.main.humidity 
    }
  } 

  // retrieve today's weatcher for map coordinates.
  private async fetchWeatherData(c: Coordinates): Promise<Weather> {
    const url = `${this.baseURL}/data/2.5/weather?lat=${c.lat}&lon=${c.lon}&units=imperial&appid=${this.apiKey}`;
    console.log('fetching', url)
    const s = await fetch(url)
    const d = await s.json();
    console.log(d);
      // today's weather will be first element of array;
      // specify city name and today's date.
    return this.buildResult(d, d.name, (new Date()).toDateString());
  }

  // retrieve forecast data for map coordinates. Return an array
  // of Weather structures with today's weather in position 0.
  private async fetchForecastData(c: Coordinates, today: Weather): Promise<Weather[]> {
  const url = `${this.baseURL}/data/2.5/forecast/?lat=${c.lat}&lon=${c.lon}&units=imperial&cnt=5&appid=${this.apiKey}`
  console.log('fetching', url)
     const s = await fetch(url)
     const d = await s.json();
     console.log(d);
     const result: Weather[] = [today];
     const dt = new Date();
     for (const w of d.list) {
        // increment date
      dt.setDate(dt.getDate() + 1);
      result.push(this.buildResult(w, null, dt.toDateString()));
     }
     return result;
   }
  
   // retrieve today's weather and forecast data for named city
  async getWeatherForCity(city: string): Promise<Weather[]> {
    const c: Coordinates = await this.fetchLocationData(city);
    console.log(c);
    const today: Weather = await this.fetchWeatherData(c);
    const forecast = await this.fetchForecastData(c, today);
    return forecast;
  }
}

export default new WeatherService();
