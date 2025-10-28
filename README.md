# Athena

Personal self-hosted services, deployed to a VPS.

## Services

- **Caddy** - Reverse proxy
- **Pocket ID** - SSO provider
- **Portainer** - Container management
- **Glance** - Personal dashboard
- **Open WebUI** - LLM chat

## Network

All services run on the `athena` external Docker network.

## Usage

Each service has its own directory with a `docker-compose.yml` file. Start services with:

```bash
docker compose up -d
```
