import fs from 'fs';
import path from 'path';
import https from 'https';
import http from 'http';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DATA_FILE = path.join(__dirname, 'src', 'data', 'portfolioData.json');
const ASSETS_DIR = path.join(__dirname, 'src', 'assets', 'portfolio');
const CONFIG_FILE = path.join(__dirname, 'sheet-config.json');

/**
 * Robust RFC 4180 CSV parser that handles quotes, commas inside quotes, and newlines inside quotes.
 */
function parseCSV(csvText) {
  const rows = [];
  let currentRow = [];
  let currentCell = '';
  let inQuotes = false;
  
  for (let i = 0; i < csvText.length; i++) {
    const char = csvText[i];
    const nextChar = csvText[i + 1];

    if (char === '"') {
      if (inQuotes && nextChar === '"') {
        currentCell += '"';
        i++; // Skip escaped quote
      } else {
        inQuotes = !inQuotes;
      }
    } else if (char === ',' && !inQuotes) {
      currentRow.push(currentCell.trim());
      currentCell = '';
    } else if ((char === '\r' || char === '\n') && !inQuotes) {
      if (char === '\r' && nextChar === '\n') {
        i++;
      }
      currentRow.push(currentCell.trim());
      currentCell = '';
      if (currentRow.some(cell => cell.length > 0)) {
        rows.push(currentRow);
      }
      currentRow = [];
    } else {
      currentCell += char;
    }
  }

  if (currentCell.length > 0 || currentRow.length > 0) {
    currentRow.push(currentCell.trim());
    if (currentRow.some(cell => cell.length > 0)) {
      rows.push(currentRow);
    }
  }

  return rows;
}

/**
 * Convert Google Drive sharing links to direct download URLs
 */
function convertDriveUrl(url) {
  if (!url || typeof url !== 'string') return url;
  const trimmed = url.trim();
  
  // Match drive.google.com/file/d/FILE_ID or id=FILE_ID
  const fileIdMatch = trimmed.match(/drive\.google\.com\/file\/d\/([a-zA-Z0-9_-]+)/) ||
                      trimmed.match(/[?&]id=([a-zA-Z0-9_-]+)/) ||
                      trimmed.match(/drive\.google\.com\/open\?id=([a-zA-Z0-9_-]+)/);
  if (fileIdMatch && fileIdMatch[1]) {
    return `https://drive.google.com/uc?export=download&id=${fileIdMatch[1]}`;
  }
  return trimmed;
}

/**
 * Download a file from URL following redirects (up to 5 attempts)
 */
function downloadFile(url, destPath, redirects = 0) {
  return new Promise((resolve, reject) => {
    if (redirects > 5) {
      return reject(new Error('Too many redirects while downloading image'));
    }

    const convertedUrl = convertDriveUrl(url);
    const client = convertedUrl.startsWith('https://') ? https : http;

    client.get(convertedUrl, (res) => {
      // Handle redirects (HTTP 301, 302, 303, 307, 308)
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        return downloadFile(res.headers.location, destPath, redirects + 1)
          .then(resolve)
          .catch(reject);
      }

      if (res.statusCode !== 200) {
        return reject(new Error(`Failed to download ${convertedUrl}: HTTP status ${res.statusCode}`));
      }

      const fileStream = fs.createWriteStream(destPath);
      res.pipe(fileStream);

      fileStream.on('finish', () => {
        fileStream.close();
        resolve(destPath);
      });

      fileStream.on('error', (err) => {
        fs.unlink(destPath, () => {});
        reject(err);
      });
    }).on('error', (err) => {
      reject(err);
    });
  });
}

/**
 * Fetch text/CSV from URL (following redirects)
 */
function fetchUrl(url, redirects = 0) {
  return new Promise((resolve, reject) => {
    if (redirects > 5) {
      return reject(new Error('Too many redirects while fetching CSV'));
    }
    const client = url.startsWith('https://') ? https : http;
    client.get(url, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        return fetchUrl(res.headers.location, redirects + 1)
          .then(resolve)
          .catch(reject);
      }
      if (res.statusCode !== 200) {
        return reject(new Error(`HTTP ${res.statusCode} fetching ${url}`));
      }
      let data = '';
      res.on('data', chunk => { data += chunk; });
      res.on('end', () => resolve(data));
    }).on('error', reject);
  });
}

/**
 * Main sync routine
 */
export async function syncPortfolio({ csvUrl, csvText, rows } = {}) {
  console.log('[Sync] Starting portfolio sync...');

  // 1. Determine data source (rows, csvText, or fetch from csvUrl / sheet-config.json)
  if (!rows && !csvText) {
    let url = csvUrl || process.env.SHEET_CSV_URL;
    if (!url && fs.existsSync(CONFIG_FILE)) {
      try {
        const cfg = JSON.parse(fs.readFileSync(CONFIG_FILE, 'utf-8'));
        url = cfg.csvUrl;
      } catch (err) {
        console.warn('[Sync] Could not read sheet-config.json:', err.message);
      }
    }
    if (!url) {
      throw new Error('No CSV URL provided. Please set sheet-config.json, SHEET_CSV_URL env var, or pass csvUrl/rows.');
    }
    console.log(`[Sync] Fetching CSV from URL: ${url}`);
    csvText = await fetchUrl(url);
  }

  if (!rows && csvText) {
    rows = parseCSV(csvText);
  }

  if (!rows || rows.length < 2) {
    console.log('[Sync] No data rows found in CSV/sheet payload.');
    return { success: true, updatedCount: 0 };
  }

  // 2. Parse headers
  const headers = rows[0].map(h => h.trim().toLowerCase());
  const getIndex = (possibleNames) => headers.findIndex(h => possibleNames.includes(h));

  const idxPortfolio = getIndex(['portfolio title', 'portfolio', 'collection', 'category']);
  const idxNested = getIndex(['is nested', 'nested', 'isnested']);
  const idxSubPortfolio = getIndex(['sub-portfolio title', 'sub-portfolio', 'subportfolio', 'item name', 'subtitle_folder']);
  const idxSubtitle = getIndex(['subtitle']);
  const idxDimensions = getIndex(['dimensions', 'dimension']);
  const idxDescription = getIndex(['description', 'desc']);
  const idxList = getIndex(['list items', 'list', 'bullets']);
  const idxImages = getIndex(['image urls', 'images', 'image links', 'image url']);
  const idxDisplayImage = getIndex(['display image url', 'display image', 'thumbnail', 'cover image']);

  if (idxPortfolio === -1) {
    throw new Error('Could not find required column: "Portfolio Title" (or "Portfolio") in CSV headers.');
  }

  // Load existing data to merge or start fresh
  let portfolioData = {};
  if (fs.existsSync(DATA_FILE)) {
    try {
      portfolioData = JSON.parse(fs.readFileSync(DATA_FILE, 'utf-8'));
    } catch (e) {
      console.warn('[Sync] Existing portfolioData.json invalid, starting fresh.');
    }
  }

  let downloadedImagesCount = 0;

  // 3. Process each data row
  for (let r = 1; r < rows.length; r++) {
    const row = rows[r];
    const portfolioTitle = row[idxPortfolio]?.trim();
    if (!portfolioTitle) continue;

    const isNestedVal = idxNested !== -1 ? row[idxNested]?.trim().toLowerCase() : '';
    const isNested = isNestedVal === 'true' || isNestedVal === '1' || isNestedVal === 'yes' || isNestedVal === 'y';
    const subPortfolioTitle = idxSubPortfolio !== -1 ? row[idxSubPortfolio]?.trim() : '';

    const subtitle = idxSubtitle !== -1 ? row[idxSubtitle]?.trim() : '';
    const dimensions = idxDimensions !== -1 ? row[idxDimensions]?.trim() : '';
    const descriptionRaw = idxDescription !== -1 ? row[idxDescription]?.trim() : '';
    const listRaw = idxList !== -1 ? row[idxList]?.trim() : '';
    const imagesRaw = idxImages !== -1 ? row[idxImages]?.trim() : '';
    const displayImageRaw = idxDisplayImage !== -1 ? row[idxDisplayImage]?.trim() : '';

    // Split paragraphs/lists by newline or pipe '|'
    const description = descriptionRaw ? descriptionRaw.split(/\r?\n|\|/).map(s => s.trim()).filter(Boolean) : [];
    const list = listRaw ? listRaw.split(/\r?\n|\|/).map(s => s.trim()).filter(Boolean) : [];

    // Initialize portfolio
    if (!portfolioData[portfolioTitle]) {
      portfolioData[portfolioTitle] = {
        title: portfolioTitle,
        isNested: isNested || !!subPortfolioTitle,
        textData: {},
        subPortfolios: {}
      };
    } else if (isNested || !!subPortfolioTitle) {
      portfolioData[portfolioTitle].isNested = true;
    }

    const targetObj = (portfolioData[portfolioTitle].isNested && subPortfolioTitle)
      ? (portfolioData[portfolioTitle].subPortfolios[subPortfolioTitle] = portfolioData[portfolioTitle].subPortfolios[subPortfolioTitle] || { title: subPortfolioTitle, textData: {} })
      : portfolioData[portfolioTitle];

    // Update textData if provided
    if (subtitle) targetObj.textData.subtitle = subtitle;
    if (dimensions) targetObj.textData.dimensions = dimensions;
    if (description.length > 0) targetObj.textData.description = description;
    if (list.length > 0) targetObj.textData.list = list;

    // 4. Download images if URLs provided
    const targetDir = (portfolioData[portfolioTitle].isNested && subPortfolioTitle)
      ? path.join(ASSETS_DIR, portfolioTitle, subPortfolioTitle)
      : path.join(ASSETS_DIR, portfolioTitle);

    fs.mkdirSync(targetDir, { recursive: true });

    if (displayImageRaw) {
      const ext = path.extname(displayImageRaw.split('?')[0]) || '.jpg';
      const destPath = path.join(targetDir, `DISPLAY IMAGE${ext}`);
      try {
        console.log(`[Sync] Downloading display image for ${portfolioTitle}/${subPortfolioTitle || ''}...`);
        await downloadFile(displayImageRaw, destPath);
        downloadedImagesCount++;
      } catch (err) {
        console.error(`[Sync] Failed to download display image ${displayImageRaw}:`, err.message);
      }
    }

    if (imagesRaw) {
      const imageUrls = imagesRaw.split(/[\r\n,]+/).map(u => u.trim()).filter(Boolean);
      for (let idx = 0; idx < imageUrls.length; idx++) {
        const imgUrl = imageUrls[idx];
        const ext = path.extname(imgUrl.split('?')[0]) || '.jpg';
        const destPath = path.join(targetDir, `${idx + 1}${ext}`);
        try {
          console.log(`[Sync] Downloading image ${idx + 1} for ${portfolioTitle}/${subPortfolioTitle || ''}...`);
          await downloadFile(imgUrl, destPath);
          downloadedImagesCount++;
        } catch (err) {
          console.error(`[Sync] Failed to download image ${imgUrl}:`, err.message);
        }
      }
    }
  }

  // 5. Write updated data JSON
  fs.mkdirSync(path.dirname(DATA_FILE), { recursive: true });
  fs.writeFileSync(DATA_FILE, JSON.stringify(portfolioData, null, 2), 'utf-8');
  console.log(`[Sync] Successfully updated ${DATA_FILE}. Downloaded ${downloadedImagesCount} images.`);

  return { success: true, downloadedImagesCount, portfolioCount: Object.keys(portfolioData).length };
}

// Allow standalone execution via `node sync-portfolio.js`
if (process.argv[1] && path.resolve(process.argv[1]) === path.resolve(__filename)) {
  syncPortfolio()
    .then(res => {
      console.log('[Sync CLI] Finished successfully:', res);
      process.exit(0);
    })
    .catch(err => {
      console.error('[Sync CLI] Error:', err);
      process.exit(1);
    });
}
