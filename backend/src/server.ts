import 'dotenv/config';
import express, { Request, Response } from 'express';
import cors from 'cors';
import { getSupabaseClient } from './supabase';
import type { Restaurant, RestaurantList } from '@shared/types';

const app = express();
app.use(cors());
app.use(express.json());

// Health check
app.get('/health', (req: Request, res: Response) => {
  res.json({ status: 'ok' });
});

// Mock chat endpoint (no DB calls)
app.post('/chat', (req: Request, res: Response) => {
  const { message = '' } = req.body || {};

  // Simple mock assistant response
  const assistant = message
    ? `Got it — here are some ideas for: "${String(message).slice(0, 120)}"`
    : 'Here are some restaurants you might like!';

  // Generate a small mock list on the fly
  const cuisines = ['Italian', 'Thai', 'Japanese', 'Mexican', 'Indian', 'Mediterranean', 'American'];
  const cities = [
    { city: 'Seattle', state: 'WA' },
    { city: 'San Francisco', state: 'CA' },
    { city: 'Austin', state: 'TX' },
    { city: 'New York', state: 'NY' },
    { city: 'Chicago', state: 'IL' },
  ];
  const names = ['Bistro', 'Kitchen', 'House', 'Grill', 'Café', 'Tavern', 'Diner'];

  function rand<T>(arr: T[]): T { return arr[Math.floor(Math.random() * arr.length)]; }
  function slug(): string { return Math.random().toString(36).slice(2, 10); }

  const count = 4 + Math.floor(Math.random() * 3); // 4–6
  const restaurants: RestaurantList = Array.from({ length: count }).map((_, i) => {
    const cuisine = rand(cuisines);
    const loc = rand(cities);
    const id = `${Date.now()}_${i}_${slug()}`;
    const name = `${rand(['The', ''])} ${cuisine} ${rand(names)}`.replace(/\s+/g, ' ').trim();
    const rating = Math.round((3 + Math.random() * 2) * 10) / 10; // 3.0–5.0
    const r: Restaurant = {
      id,
      name,
      city: loc.city,
      state: loc.state,
      cuisine,
      rating,
      website: `https://example.com/${slug()}`,
      address: `${100 + Math.floor(Math.random() * 900)} Main St`,
    };
    return r;
  });

  res.json({ assistant, restaurants });
});

// Restaurants CRUD
app.get('/restaurants', async (_req: Request, res: Response) => {
  const supabase = getSupabaseClient();
  const { data, error } = await supabase
    .from('restaurants')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) return res.status(500).json({ error: error.message });
  res.json((data || []) as RestaurantList);
});

app.get('/restaurants/:id', async (req: Request, res: Response) => {
  const { id } = req.params;
  const supabase = getSupabaseClient();
  const { data, error } = await supabase
    .from('restaurants')
    .select('*')
    .eq('id', id)
    .single();

  if (error) return res.status(404).json({ error: error.message });
  res.json(data as Restaurant);
});

app.post('/restaurants', async (req: Request, res: Response) => {
  const supabase = getSupabaseClient();
  const { name, address, city, state, phone, cuisine, website, rating } = req.body || {};
  if (!name) return res.status(400).json({ error: 'name is required' });

  const now = new Date().toISOString();
  const { data, error } = await supabase
    .from('restaurants')
    .insert([
      { name, address, city, state, phone, cuisine, website, rating, created_at: now, updated_at: now },
    ])
    .select()
    .single();

  if (error) return res.status(500).json({ error: error.message });
  res.status(201).json(data as Restaurant);
});

app.put('/restaurants/:id', async (req: Request, res: Response) => {
  const { id } = req.params;
  const supabase = getSupabaseClient();
  const update = { ...req.body, updated_at: new Date().toISOString() };

  const { data, error } = await supabase
    .from('restaurants')
    .update(update)
    .eq('id', id)
    .select()
    .single();

  if (error) return res.status(400).json({ error: error.message });
  res.json(data as Restaurant);
});

app.delete('/restaurants/:id', async (req: Request, res: Response) => {
  const { id } = req.params;
  const supabase = getSupabaseClient();
  const { error } = await supabase
    .from('restaurants')
    .delete()
    .eq('id', id);

  if (error) return res.status(400).json({ error: error.message });
  res.status(204).send();
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server listening on http://localhost:${port}`);
});
