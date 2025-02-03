# FAQ System

This project is a FAQ system built with TypeScript, Express, and MongoDB.

Have used Swagger for UI
## Prerequisites

Ensure you have the following installed:

- Node.js
- npm
- Docker
- Make

### Verifying `make`

Make sure the `make` command is working on your system. If it's not, you can install it using these steps:

```bash
# On Debian/Ubuntu
sudo apt update && sudo apt install -y make

# On macOS (using Homebrew)
brew install make

# On Windows (using Chocolatey)
choco install make

# On Windows (using Scoop)
scoop install make

# On Windows (using MSYS2)
pacman -S make

# Or simply
npm install make -g
```

## Getting Started

### Clone the repository

```bash
git clone https://github.com/riishabhraj/BharatFD-Assignment.git
cd BharatFD-Assignment
```

### Install dependencies

```bash
npm install
```

### Build the project

```bash
npm run build
```

### Set up environment variables

The `.env.dev` file is pre-configured, so you don't need to change anything unless necessary. When running the command to start the development server, `.env.dev` is copied to `.env`.

```dotenv
PORT=3000
ENV=development
MONGODB_URI=mongodb://username:password@localhost:27017
REDIS_URL=redis-ds://localhost:6379
JWT_SECRET=dkfjads9i3290ijKDFKkdjfka
```

### Start Docker for MongoDB and Redis

Before running this, make sure the network is created:

```bash
docker network create rishabh
```

Then start the services:

```bash
make helper-start env=dev
```

To stop the services, run:

```bash
make helper-stop env=dev
```

Once started, you can access:

- **MongoDB UI** at [http://localhost:4441](http://localhost:4441)
- **Redis UI** at [http://localhost:4442](http://localhost:4442)

### Configure Redis UI

To add a database in Redis UI, use the following configuration:

- **Database alias**: `redis-ds:6379`
- **Host**: `redis-ds`
- **Port**: `6379`
- **Username**: Default
- **Password**: Default

### Start the development server

```bash
make run target=dev
```

The server will be available at [http://localhost:3000](http://localhost:3000).

### API Documentation

You can view the API documentation at [http://localhost:3000/api-docs](http://localhost:3000/api-docs).

## Running Tests

To run tests, use:

```bash
npm test
```

