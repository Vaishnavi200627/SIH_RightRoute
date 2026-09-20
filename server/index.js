import express from 'express';
import cors from 'cors';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const RULES_PATH = join(__dirname, '..', 'src', 'data', 'crisis-rules.json');
const rules = JSON.parse(readFileSync(RULES_PATH, 'utf-8'));

const app = express();
const PORT = process.env.PORT || 3000;

const ALLOWED_ORIGINS = [
  'http://localhost:5173',
  'http://localhost:4173',
  process.env.FRONTEND_URL
].filter(Boolean);

app.use(cors({
  origin: (origin, cb) => {
    if (!origin) return cb(null, true);
    if (ALLOWED_ORIGINS.includes(origin) || origin.endsWith('.vercel.app')) {
      return cb(null, true);
    }
    cb(new Error('Not allowed by CORS'));
  }
}));

app.use(express.json({ limit: '4kb' }));

// Anonymous counters only. No PII, no user data, no intake answers.
const store = {
  startedAt: new Date().toISOString(),
  totalEvents: 0,
  byCategory: {},
  byLanguage: {}
};

app.get('/api/rules', (req, res) => {
  res.json(rules);
});

app.post('/api/event', (req, res) => {
  const { category, language } = req.body || {};

  const validCategories = ['ncii', 'fraud', 'account', 'stalking'];
  const validLanguages = ['en', 'hi', 'mr', 'ta', 'bn', 'es', 'fr', 'ar', 'zh', 'pt', 'ru'];

  if (category && validCategories.includes(category)) {
    store.byCategory[category] = (store.byCategory[category] || 0) + 1;
  }
  if (language && validLanguages.includes(language)) {
    store.byLanguage[language] = (store.byLanguage[language] || 0) + 1;
  }
  store.totalEvents++;

  res.json({ ok: true });
});

app.get('/api/stats', (req, res) => {
  res.json({
    startedAt: store.startedAt,
    totalEvents: store.totalEvents,
    byCategory: store.byCategory,
    byLanguage: store.byLanguage,
    rulesetVersion: rules.version
  });
});

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.listen(PORT, () => {
  console.log(`RightRoute server on :${PORT}`);
});