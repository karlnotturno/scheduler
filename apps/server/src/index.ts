import express from 'express';

import dotenv from 'dotenv';

import logger from 'morgan';
import cors from 'cors';
import mongoose from 'mongoose';

dotenv.config();

import coffeesRouter from './routes/coffees'
import emailsRouter from './routes/emails'


const app = express();
const PORT = process.env.PORT || 3001;

app.use(logger('dev'));
app.use(cors({origin: ['https://coffee.kstreet.show', 'http://localhost:5173'], credentials: true}))
app.use(express.json());

app.get('/', (_req, res) => {
  res.json('Hello strange one!');
});

app.use('/api/coffees', coffeesRouter);
app.use('/api/emails', emailsRouter);

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/hill-scheduler';

mongoose.connect(MONGO_URI)
  .then(() => console.log('✅ Connected to MongoDB'))
  .catch((err) => console.error('❌ MongoDB connection error:', err));

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});


