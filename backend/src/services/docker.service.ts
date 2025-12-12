import docker from '../config/docker.config.js';
import Docker from 'dockerode';

interface ContainerResult {
    containerId: string;
    status: string;
    name?: string;
}

class DockerService {
    async listContainers(all = true): Promise<Docker.ContainerInfo[]> {
        try {
            return await docker.listContainers({ all });
        } catch (error) {
            const err = error as Error;
            throw new Error(`Failed to list containers: ${err.message}`);
        }
    }

    async listImages(): Promise<Docker.ImageInfo[]> {
        try {
            return await docker.listImages();
        } catch (error) {
            const err = error as Error;
            throw new Error(`Failed to list images: ${err.message}`);
        }
    }

    async getDockerInfo(): Promise<any> {
        try {
            return await docker.info();
        } catch (error) {
            const err = error as Error;
            throw new Error(`Failed to get Docker info: ${err.message}`);
        }
    }

    getContainer(containerId: string): Docker.Container {
        return docker.getContainer(containerId);
    }

    async startContainer(containerId: string): Promise<ContainerResult> {
        try {
            const container = this.getContainer(containerId);
            await container.start();
            return { containerId, status: 'started' };
        } catch (error) {
            const err = error as Error;
            throw new Error(`Failed to start container: ${err.message}`);
        }
    }

    async stopContainer(containerId: string): Promise<ContainerResult> {
        try {
            const container = this.getContainer(containerId);
            await container.stop();
            return { containerId, status: 'stopped' };
        } catch (error) {
            const err = error as Error;
            throw new Error(`Failed to stop container: ${err.message}`);
        }
    }

    async restartContainer(containerId: string): Promise<ContainerResult> {
        try {
            const container = this.getContainer(containerId);
            await container.restart();
            return { containerId, status: 'restarted' };
        } catch (error) {
            const err = error as Error;
            throw new Error(`Failed to restart container: ${err.message}`);
        }
    }

    async getContainerStats(containerId: string): Promise<Docker.ContainerStats> {
        try {
            const container = this.getContainer(containerId);
            const stats = await container.stats({ stream: false });
            return stats;
        } catch (error) {
            const err = error as Error;
            throw new Error(`Failed to get container stats: ${err.message}`);
        }
    }

    async createContainer(options: Docker.ContainerCreateOptions): Promise<ContainerResult> {
        try {
            const container = await docker.createContainer(options);
            await container.start();
            return {
                containerId: container.id,
                status: 'created and started',
                name: options.name
            };
        } catch (error) {
            const err = error as Error;
            throw new Error(`Failed to create container: ${err.message}`);
        }
    }

    async removeContainer(containerId: string, force = false): Promise<ContainerResult> {
        try {
            const container = this.getContainer(containerId);
            await container.remove({ force });
            return { containerId, status: 'removed' };
        } catch (error) {
            const err = error as Error;
            throw new Error(`Failed to remove container: ${err.message}`);
        }
    }

    async getContainerLogs(containerId: string): Promise<string> {
        try {
            const container = this.getContainer(containerId);
            const logs = await container.logs({
                stdout: true,
                stderr: true,
                tail: 100
            });
            return logs.toString('utf8');
        } catch (error) {
            const err = error as Error;
            throw new Error(`Failed to get container logs: ${err.message}`);
        }
    }

    async listNetworks(): Promise<Docker.NetworkInspectInfo[]> {
        try {
            return await docker.listNetworks();
        } catch (error) {
            const err = error as Error;
            throw new Error(`Failed to list networks: ${err.message}`);
        }
    }

    async createNetwork(name: string, driver = 'bridge'): Promise<Docker.Network> {
        try {
            return await docker.createNetwork({ Name: name, Driver: driver });
        } catch (error) {
            const err = error as Error;
            throw new Error(`Failed to create network: ${err.message}`);
        }
    }

    async removeNetwork(networkId: string): Promise<void> {
        try {
            const network = docker.getNetwork(networkId);
            await network.remove();
        } catch (error) {
            const err = error as Error;
            throw new Error(`Failed to remove network: ${err.message}`);
        }
    }

    async listVolumes(): Promise<any> {
        try {
            return await docker.listVolumes();
        } catch (error) {
            const err = error as Error;
            throw new Error(`Failed to list volumes: ${err.message}`);
        }
    }

    async createVolume(name: string): Promise<any> {
        try {
            return await docker.createVolume({ Name: name });
        } catch (error) {
            const err = error as Error;
            throw new Error(`Failed to create volume: ${err.message}`);
        }
    }

    async removeVolume(volumeName: string): Promise<void> {
        try {
            const volume = docker.getVolume(volumeName);
            await volume.remove();
        } catch (error) {
            const err = error as Error;
            throw new Error(`Failed to remove volume: ${err.message}`);
        }
    }

    async pruneVolumes(): Promise<any> {
        try {
            return await docker.pruneVolumes();
        } catch (error) {
            const err = error as Error;
            throw new Error(`Failed to prune volumes: ${err.message}`);
        }
    }

    async bulkStopContainers(containerIds: string[]): Promise<ContainerResult[]> {
        const results = await Promise.allSettled(
            containerIds.map(id => this.stopContainer(id))
        );
        
        return results.map((result, index) => {
            if (result.status === 'fulfilled') {
                return result.value;
            }
            return {
                containerId: containerIds[index],
                status: 'failed',
                error: result.reason.message
            };
        });
    }

    async bulkRemoveContainers(containerIds: string[], force = false): Promise<ContainerResult[]> {
        const results = await Promise.allSettled(
            containerIds.map(id => this.removeContainer(id, force))
        );
        
        return results.map((result, index) => {
            if (result.status === 'fulfilled') {
                return result.value;
            }
            return {
                containerId: containerIds[index],
                status: 'failed',
                error: result.reason.message
            };
        });
    }

    async inspectContainer(containerId: string): Promise<Docker.ContainerInspectInfo> {
        try {
            const container = this.getContainer(containerId);
            return await container.inspect();
        } catch (error) {
            const err = error as Error;
            throw new Error(`Failed to inspect container: ${err.message}`);
        }
    }

    async pruneContainers(): Promise<any> {
        try {
            return await docker.pruneContainers();
        } catch (error) {
            const err = error as Error;
            throw new Error(`Failed to prune containers: ${err.message}`);
        }
    }

    async pruneImages(): Promise<any> {
        try {
            return await docker.pruneImages();
        } catch (error) {
            const err = error as Error;
            throw new Error(`Failed to prune images: ${err.message}`);
        }
    }
}

export default new DockerService();
