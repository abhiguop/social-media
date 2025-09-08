# Social Media Backend with Docker & Jenkins CI/CD

This project is a social media backend application with Docker containerization and Jenkins CI/CD pipeline.

## Prerequisites

- Docker and Docker Compose
- Node.js (for local development)
- Jenkins (will be installed via Docker)
- Git

## Setup Instructions

### 1. Clone the repository
```bash
git clone <repository-url>
cd social-media
```

### 2. Set up environment variables
Create a `.env` file based on the example:
```bash
cp .env.example .env
```

Edit the `.env` file with your configuration.

### 3. Build and run with Docker Compose
```bash
docker-compose up --build
```

This will start:
- Your Node.js application on port 5000
- MongoDB on port 27017
- Jenkins on port 8080

## Jenkins CI/CD Setup

1. Access Jenkins at `http://localhost:8080`
2. Unlock Jenkins using the initial admin password (check the logs with `docker logs jenkins`)
3. Install suggested plugins
4. Create an admin user
5. Install required Jenkins plugins:
   - Docker Pipeline
   - Blue Ocean
   - GitHub Integration
   - Pipeline Utility Steps

### Configure Docker Hub Credentials
1. In Jenkins, go to "Manage Jenkins" > "Manage Credentials"
2. Add a new credential with type "Username with password"
3. Enter your Docker Hub username and password
4. Set the ID to `docker-hub-credentials` (matching the Jenkinsfile)

### Create a New Pipeline
1. Click "New Item"
2. Enter a name (e.g., "social-media-backend")
3. Select "Pipeline" and click OK
4. In the pipeline configuration:
   - Select "Pipeline script from SCM"
   - Choose Git
   - Enter your repository URL
   - Set credentials if needed
   - Set the branch to build (e.g., main or master)
   - Set the script path to `Jenkinsfile`
5. Save the configuration

## Development

### Run in development mode (without Docker)
```bash
cd backend
npm install
npm run dev
```

### Run tests
```bash
cd backend
npm test
```

## Deployment

The Jenkins pipeline will automatically:
1. Build the Docker image
2. Run tests
3. Push the image to Docker Hub
4. Deploy the application using Docker Compose

## Environment Variables

See `.env.example` for all available environment variables.

## Accessing Services

- Backend API: http://localhost:4000 (base path `\u002Fapi\u002Fv1`)
- Jenkins: http://localhost:8080
- MongoDB: mongodb://localhost:27017

Example health check (manual): send a GET to one of your routes under `\u002Fapi\u002Fv1` after startup.
follow and unfollow user
commment on the post
update profile, getprofile
and many more
u can definitely check it out and for any query u can reach me krishnakapoor748@gmail.com.

Happy u to help Learn, share and grow.

P.S. You have to use mailtrap.io for checking mail request for reset the password. Here is the link: https://mailtrap.io/ 
