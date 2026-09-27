# Website

This website is built using [Docusaurus](https://docusaurus.io/), a modern static website generator.

## Installation

```bash
npm install
```

**Note**: feel free to use the package manager of your choice.

## Local Development

```bash
npm run start
```

This command starts a local development server and opens up a browser window. Most changes are reflected live without having to restart the server.

### Local Development with Docker

From this directory, build and start the development container:

```bash
docker compose up --build
```

Open [http://localhost:3000](http://localhost:3000). Source files are mounted into the container, so changes are reflected automatically. Stop the container with `Ctrl+C`, or run:

```bash
docker compose down
```

Dependencies are installed inside the container and stored in a Docker volume, so `node_modules` does not need to be installed on the host machine.

## Build

```bash
npm run build
```

This command generates static content into the `build` directory and can be served using any static contents hosting service.

## Deployment

Using SSH:

```bash
USE_SSH=true npm run deploy
```

Not using SSH:

```bash
GIT_USER=<Your GitHub username> npm run deploy
```

If you are using GitHub Pages for hosting, this command is a convenient way to build the website and push to the `gh-pages` branch.
