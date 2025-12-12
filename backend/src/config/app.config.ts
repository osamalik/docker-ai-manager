import dotenv from 'dotenv';

dotenv.config();

interface Config {
    port: number;
    nodeEnv: string;
    dockerSocketPath: string;
}

export const config: Config = {
    port: Number(process.env.PORT) || 3000,
    nodeEnv: process.env.NODE_ENV || 'development',
    dockerSocketPath: process.env.DOCKER_SOCKET_PATH || '/var/run/docker.sock'
};

export default config;
