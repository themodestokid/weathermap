import { Router, type Request, type Response } from 'express';
const router = Router();

import HistoryService from '../../service/historyService.js';
import WeatherService from '../../service/weatherService.js';

// POST / returns weather for the city named in request body
router.post('/', async (req: Request, rsp: Response) => {
  console.log ("weather POST", req.url, req.body);
  try {
    // retrieve weather for city
  rsp.json(await WeatherService.getWeatherForCity(req.body.cityName!))
    // add city to request history
    await HistoryService.addCity(req.body.cityName!)
  }
  catch(err) {
    rsp.status(500).send(err)
  }
});

// GET /history to retrieve history of requests
router.get('/history', async (req: Request, rsp: Response) => {
  console.log("history GET", req.url);
  rsp.json(await HistoryService.getCities())
});

// * BONUS TODO: DELETE city from search history
router.delete('/history/:id', async (req: Request, rsp: Response) => {
  console.log("history DELETE", req.params)
  await HistoryService.removeCity(Number.parseInt(req.params.id!))
  rsp.end();
});

export default router;
