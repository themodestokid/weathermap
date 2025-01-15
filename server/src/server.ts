import dotenv from 'dotenv';
import express, {Request, Response}  from 'express';
dotenv.config();

// Import the routes
import routes from './routes/index.js';

const app = express();

const PORT = process.env.PORT || 3001;

app.use(express.json())
app.use(express.urlencoded({ extended: true }));

// Serve static files of entire client dist folder
app.use(express.static('../client/dist'))

function logger(req: Request, _rsp: Response, next: any) {
    console.log(`${req.method} ${req.url}`)
    next()
}

// log incoming requests to console
app.use(logger)

// use server routes
app.use(routes);
// unexpected: log any incoming requests that are not handled
app.get('*', (_req, _rsp) => { console.log ("hit fallback")})

// Start the server on the port
app.listen(PORT, () => console.log(`Listening on PORT: ${PORT}`));
