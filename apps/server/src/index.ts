import express from 'express';
import logger from 'morgan';
import mongoose from 'mongoose';

import coffeesRouter from './routes/coffees'

const app = express();
const PORT = process.env.PORT || 3001;

app.use(logger('dev'));
app.use(express.json());

app.get('/', (_req, res) => {
  res.json('Hello strange one!');
});

app.use('/api/coffees', coffeesRouter)

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/hill-scheduler';

mongoose.connect(MONGO_URI)
  .then(() => console.log('✅ Connected to MongoDB'))
  .catch((err) => console.error('❌ MongoDB connection error:', err));

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});


