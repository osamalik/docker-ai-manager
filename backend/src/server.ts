import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import config from './config/app.config.js';
import routes from './routes/index.js';
import { requestLogger } from './middlewares/logger.middleware.js';
import { errorHandler, notFoundHandler } from './middlewares/error.middleware.js';
import { authenticateApiKey } from './middlewares/security.middleware.js';
import { testDockerConnection } from './config/docker.config.js';

const app = express();

app.use(helmet());

// CORS must be applied BEFORE rate limiting to ensure headers on 429 responses
app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    credentials: true
}));

// More lenient rate limiting for dashboard polling (1000 requests per 15 min = ~1 req/sec sustained)
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 1000,
    message: 'Too many requests from this IP, please try again later.',
    standardHeaders: true,
    legacyHeaders: false,
    skipSuccessfulRequests: false,
});

app.use(limiter);
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));
app.use(requestLogger);

app.get('/', (_req, res) => {
    res.status(200).json({
        success: true,
        message: 'Docker Node Controller API - AI-Powered Edition',
        version: '3.0.0',
        features: [
            'AI-Powered Log Analysis & Diagnostics',
            'Smart Cost Optimization & Savings Calculator',
            'Natural Language Docker Commands',
            'Predictive Health Monitoring',
            'Complete Container Lifecycle Management',
            'Docker Networks & Volumes Management',
            'Bulk Operations & Resource Pruning'
        ],
        endpoints: {
            health: '/api/health',
            containers: '/api/containers',
            images: '/api/images',
            networks: '/api/networks',
            volumes: '/api/volumes',
            docker: '/api/docker',
            ai: '/api/ai'
        }
    });
});

if (process.env.API_KEY) {
    console.log('API Key authentication enabled');
    app.use('/api', authenticateApiKey);
}

app.use('/api', routes);

app.use(notFoundHandler);
app.use(errorHandler);

const startServer = async () => {
    try {
        const dockerConnected = await testDockerConnection();
        
        if (!dockerConnected) {
            console.error('Warning: Docker connection failed. Make sure Docker socket is mounted.');
        } else {
            console.log('Docker connection established');
        }

        app.listen(config.port, () => {
            console.log(`\nServer running on port ${config.port}`);
            console.log(`Environment: ${config.nodeEnv}`);
            console.log(`\nAPI Documentation:`);
            console.log(`   Root:       http://localhost:${config.port}/`);
            console.log(`   Health:     http://localhost:${config.port}/api/health`);
            console.log(`   Containers: http://localhost:${config.port}/api/containers`);
            console.log(`   Images:     http://localhost:${config.port}/api/images`);
            console.log(`   Docker:     http://localhost:${config.port}/api/docker/info`);
            console.log(`\nDocker Node Controller is ready!\n`);
        });
    } catch (error) {
        const err = error as Error;
        console.error('Failed to start server:', err.message);
        process.exit(1);
    }
};

process.on('uncaughtException', (error: Error) => {
    console.error('UNCAUGHT EXCEPTION! Shutting down...');
    console.error(error.name, error.message);
    process.exit(1);
});

process.on('unhandledRejection', (error: Error) => {
    console.error('UNHANDLED REJECTION! Shutting down...');
    console.error(error.name, error.message);
    process.exit(1);
});

startServer();

export default app;
