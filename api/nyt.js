export default async function handler(req, res) {
  try {
    const API_KEY = process.env.VITE_NYT_API_KEY;
    const API_URL = process.env.VITE_NYT_API_URL;
    
    // Получаем путь из запроса (например, /topstories.json)
    const { path } = req.query;
    
    if (!path) {
      return res.status(400).json({ error: 'Path parameter is required' });
    }
    
    // Формируем URL к NYT API
    const nytUrl = `${API_URL}${path}?api-key=${API_KEY}`;
    
    const response = await fetch(nytUrl);
    const data = await response.json();
    
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
