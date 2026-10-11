
const express = require('express');
const client = require('prom-client');

const authRoutes = require('./routes/auth.routes');
const {
  notFound,
  errorHandler
} = require('./middleware/error.middleware');

// ========================================
// 1. KHOI TAO EXPRESS
// ========================================

const app = express();

app.disable('x-powered-by');
app.use(express.json({ limit: '1mb' }));

// ========================================
// 2. KHOI TAO PROMETHEUS
// ========================================

const register = new client.Registry();

client.collectDefaultMetrics({
  register
});

// ========================================
// 3. DEM SO LUONG HTTP REQUESTS
// ========================================

const httpRequestsTotal = new client.Counter({
  name: 'http_requests_total',
  help: 'Total number of HTTP requests',
  labelNames: ['method', 'route', 'status_code'],
  registers: [register]
});

// ========================================
// 4. DO THOI GIAN PHAN HOI API
// ========================================

const httpRequestDuration = new client.Histogram({
  name: 'http_request_duration_seconds',
  help: 'HTTP request duration in seconds',
  labelNames: ['method', 'route', 'status_code'],
  buckets: [
    0.005,
    0.01,
    0.025,
    0.05,
    0.1,
    0.25,
    0.5,
    1,
    2,
    5
  ],
  registers: [register]
});

// ========================================
// 5. MIDDLEWARE THEO DOI HTTP REQUESTS
// ========================================

app.use((req, res, next) => {

  // Khong tinh request Prometheus
  if (req.path === '/metrics') {
    return next();
  }

  const start = process.hrtime.bigint();

  res.on('finish', () => {

    const duration =
      Number(process.hrtime.bigint() - start) / 1e9;

    // Lay ten route sau khi Express xu ly
    const routePath = req.route?.path;

    const route = routePath
      ? `${req.baseUrl}${routePath}`
      : 'unmatched';

    const labels = {
      method: req.method,
      route,
      status_code: String(res.statusCode)
    };

    // Tang so luong HTTP requests
    httpRequestsTotal.inc(labels);

    // Ghi nhan thoi gian phan hoi
    httpRequestDuration.observe(labels, duration);

  });

  next();
});

// ========================================
// 6. API DANG NHAP
// ========================================

app.use('/api/auth', authRoutes);

// ========================================
// 7. API KIEM TRA BACKEND
// ========================================

app.get('/health', (req, res) => {

  res.status(200).json({
    status: 'UP',
    service: 'expense-tracker-backend',
    timestamp: new Date().toISOString()
  });

});

// ========================================
// 8. API PROMETHEUS METRICS
// ========================================

app.get('/metrics', async (req, res, next) => {

  try {

    res.set('Content-Type', register.contentType);

    const metrics = await register.metrics();

    res.end(metrics);

  } catch (error) {

    next(error);

  }

});

// ========================================
// 9. XU LY LOI
// ========================================

app.use(notFound);
app.use(errorHandler);

// ========================================
// 10. EXPORT APP
// ========================================

module.exports = app;
