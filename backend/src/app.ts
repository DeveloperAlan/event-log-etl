import express from 'express';
import cors  from 'cors';
import eventsRouter from './routes';

const app = express();

const corsOptions = {
    origin: 'http://localhost:3000',
    optionsSuccessStatus: 200,
  };

app.use(cors(corsOptions))
app.use('/events', eventsRouter);

export default app;
