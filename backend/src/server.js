require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { getSupabaseClient } = require('./supabase');

const app = express();
app.use(cors());
app.use(express.json());

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Restaurants CRUD
app.get('/restaurants', async (req, res) => {
  const supabase = getSupabaseClient();
  const { data, error } = await supabase
    .from('restaurants')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

app.get('/restaurants/:id', async (req, res) => {
  const { id } = req.params;
  const supabase = getSupabaseClient();
  const { data, error } = await supabase
    .from('restaurants')
    .select('*')
    .eq('id', id)
    .single();

  if (error) return res.status(404).json({ error: error.message });
  res.json(data);
});

app.post('/restaurants', async (req, res) => {
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
  res.status(201).json(data);
});

app.put('/restaurants/:id', async (req, res) => {
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
  res.json(data);
});

app.delete('/restaurants/:id', async (req, res) => {
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

