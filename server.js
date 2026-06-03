import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

// ES Module equivalent for __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
// Azure App Service sets the PORT environment variable
const PORT = process.env.PORT || 8080;

// Serve the static files from the Vite build output directory ('dist')
app.use(express.static(path.join(__dirname, 'dist')));

// React Router / SPA fallback
// Any request that doesn't match a static file in 'dist' will serve index.html
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
