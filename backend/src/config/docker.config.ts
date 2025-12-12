import Docker from 'dockerode';

const dockerConfig: Docker.DockerOptions = {
    socketPath: '/var/run/docker.sock'
};

const docker = new Docker(dockerConfig);

export const testDockerConnection = async (): Promise<boolean> => {
    try {
        await docker.ping();
        return true;
    } catch (error) {
        const err = error as Error;
        console.error('Docker connection failed:', err.message);
        return false;
    }
};

export const getOwnContainerId = async (): Promise<string | null> => {
    try {
        const os = await import('os');
        return os.hostname().substring(0, 12);
    } catch {
        return null;
    }
};

export default docker;
