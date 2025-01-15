import fs from 'fs/promises'

// city type stored in request history
type City = {
  name: string;
  id: number;
}

class HistoryService {
  // read searchHistory.json and return an array of City
  private async read(): Promise<City[]> {
    console.log(process.cwd())
    const data: string = await fs.readFile('db/searchHistory.json', 'utf8');
    return JSON.parse(data);
  }

  // write array of City to searchHistory.json
  private async write(cities: City[]) {
    await fs.writeFile('db/searchHistory.json', JSON.stringify(cities))
  }

  // get search history
  async getCities() { 
    const cities: City[] = await this.read();
    return cities; 
  }

  // add a city to search history if it is not already present
  async addCity(city: string) {
    const cities: City[] = await this.read();
      // check if city is already in search history
    const existing: number = cities.findIndex((element: City) => 
          element.name.toLowerCase() === city.toLowerCase())
    if (existing < 0) {
        // add city to search history and write to disk
      let newId: number = 1;
      for (const lastCity of cities) {
        newId = lastCity.id + 1;
      }
      cities.push({name: city, id: newId});
      this.write(cities);
    }
  }

  // remove a city with specified id from history
  async removeCity(id: number) {
    const cities: City[] = await this.read();
      // look for existing city with specified id
    const existing: number = cities.findIndex((element: City) => 
          element.id == id)
    console.log('removeCity', id, existing)
    if (existing >= 0) {
        // remove from array
      cities.splice(existing, 1)
        // write to disk
      await this.write(cities)
    }

  }
}

export default new HistoryService();
