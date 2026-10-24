import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { exec } from 'child_process';
import { syncPortfolio } from './sync-portfolio.js';

// ES Module equivalent for __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
// Azure App Service sets the PORT environment variable
const PORT = process.env.PORT || 8080;

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Serve the static files from the Vite build output directory ('dist')
app.use(express.static(path.join(__dirname, 'dist')));

// Webhook endpoint to sync portfolio from Google Sheets and optionally trigger a rebuild
const handleSyncRequest = async (req, res) => {
  try {
    console.log('[Server] Webhook triggered: Syncing portfolio...');
    const { csvUrl, csvText, rows, triggerBuild = true } = req.body || req.query || {};
    const result = await syncPortfolio({ csvUrl, csvText, rows });
    
    // If running in a production setting or triggerBuild requested, run `npm run build`
    if (triggerBuild && (process.env.NODE_ENV === 'production' || req.query.build === 'true' || req.body?.build)) {
      console.log('[Server] Running vite build to update production bundle...');
      exec('npm run build', { cwd: __dirname }, (error, stdout, stderr) => {
        if (error) {
          console.error(`[Server] Build error: ${error.message}`);
          return;
        }
        console.log(`[Server] Build output: ${stdout}`);
      });
    }

    res.status(200).json({
      success: true,
      message: 'Portfolio sync completed successfully',
      result
    });
  } catch (error) {
    console.error('[Server] Sync failed:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

app.post('/api/webhook/sync-portfolio', handleSyncRequest);
app.get('/api/sync-portfolio', handleSyncRequest);

// React Router / SPA fallback
// Any request that doesn't match a static file in 'dist' will serve index.html
app.use((req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

