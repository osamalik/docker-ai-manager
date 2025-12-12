# Docker Management Platform

A full-stack TypeScript application for managing Docker containers with AI-powered diagnostics and cost optimization.

## Features

- **Container Management**: Complete lifecycle control (start, stop, restart, remove)
- **Real-time Monitoring**: Live resource usage and health tracking
- **AI Diagnostics**: Intelligent log analysis and optimization suggestions (requires OpenAI API key)
- **Cost Analysis**: Calculate infrastructure costs based on resource consumption
- **Self-Protection**: Prevents accidental deletion of the management backend itself
- **Modern Dashboard**: React-based UI with real-time updates

## Tech Stack

**Backend:**
- Node.js 18+ with TypeScript
- Express.js REST API
- Dockerode for Docker API integration
- OpenAI SDK for AI features

**Frontend:**
- React 18 with TypeScript
- TanStack Query for data fetching
- Tailwind CSS for styling
- Vite for build tooling

## Setup Instructions

### Prerequisites
- Docker Desktop installed and running
- Node.js 18+ (for local development)
- OpenAI API key (optional, for AI features)

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/YOUR-USERNAME/YOUR-REPO-NAME.git
cd docker-node
```

2. **Backend Setup**
```bash
cd backend
npm install
npm run build
```

3. **Frontend Setup**
```bash
cd ../frontend
npm install
```

4. **Configure Environment Variables**

Create `frontend/.env`:
```env
VITE_API_URL=http://localhost:3000/api
VITE_API_KEY=your-api-key-here
```

5. **Run Backend in Docker**
```bash
docker build -t docker-node-controller ./backend

docker run -d -p 3000:3000 \
  -v /var/run/docker.sock:/var/run/docker.sock \
  -e NODE_ENV=production \
  -e API_KEY=your-api-key-here \
  -e OPENAI_API_KEY=sk-your-openai-key-here \
  --name docker-node-backend \
  docker-node-controller
```

6. **Run Frontend**
```bash
cd frontend
npm run dev
```

7. **Access Application**
- Dashboard: http://localhost:5173
- API: http://localhost:3000/api

## Configuration

### API Keys

**Backend API Key**: Custom authentication key for securing API endpoints
- Set via `API_KEY` environment variable in backend container
- Must match `VITE_API_KEY` in frontend

**OpenAI API Key** (Optional): Required for AI features
- Get from: https://platform.openai.com/api-keys
- New accounts get $5 free credits
- Set via `OPENAI_API_KEY` environment variable

## Known Limitations

1. **Cost Calculation**: Uses estimated pricing ($0.04/core-hour, $0.005/GB-hour). May not reflect actual cloud provider rates.

2. **AI Features**: Require OpenAI API key and internet connection. Free tier has rate limits.

3. **Security**: Basic API key authentication implemented. Not suitable for production without additional security hardening.

4. **Container Stats**: Polling every 3 seconds may cause high API usage. Adjust `refetchInterval` in frontend components if needed.

5. **Self-Protection**: Only prevents deletion of the backend container itself. Other critical containers are not protected.

6. **Error Handling**: Force-remove required for running containers. UI shows error if attempting normal delete on running containers.

7. **Platform Support**: Tested on Linux containers. Windows containers may require adjustments.

## Development

### Backend Development
```bash
cd backend
npm run dev  # Uses ts-node-dev for hot reload
```

### Frontend Development
```bash
cd frontend
npm run dev  # Vite dev server with HMR
```

## License

MIT License - Feel free to use and modify for your projects.

## Contributing

Contributions are welcome! Please feel free to submit issues or pull requests.
