import {Router} from 'express';
import {Coffee} from '../models/Coffee';

const router = Router();

router.post('/', async (req, res) => {
  try {
    const coffee = new Coffee(req.body);
    const saved = await coffee.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(400).json({error: 'Validation error', details: err})
  }
})

router.get('/', async (requestAnimationFrame, res) => {
  const coffees = await Coffee.find().sort({createdAt: -1});
  res.json(coffees);
})

export default router;