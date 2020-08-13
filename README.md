# Dockerized Deno with Mongodb

This is Deno development evnvironment setup with docker for Mongodb.

## Prerequisites
- Install docker and docker compose     
    https://docs.docker.com/docker-for-windows/install/     
    https://docs.docker.com/docker-for-windows/install-windows-home/    
    https://docs.docker.com/engine/install/ubuntu/      

## Procedures

1. Clone this git repository
1. Create `.env` and copy context of `.env.example` into `.env`
1. Start Docker Compose
   ```
   $ docker-compose up -d
   ```
1. Access API `http://localhost:5000/` (Check other APIs on `router.ts`)

## How To Debug Deno Inside Docker with vscode

1. End Docker Compose
   ```
   $ docker-compose down
   ```
1. Add `--inspect-brk=0.0.0.0:9229` in deno run command like the following:
   ```
   denon run --inspect-brk=0.0.0.0:9229 --allow-net --allow-write --allow-read --allow-env --allow-plugin --unstable  server.ts
   ```
1. Start Debug Mode `Docker: Attach to Deno` and mark breakpoints in vscode

1. Start Docker Compose Again
   ```
   $ docker-compose up
   ```

## How To Test Swagger API Testing

1. Run Dredd HTTP Testing Server
   ```
   $ docker run -it -v $PWD/swagger:/swagger -w /swagger --network host apiaryio/dredd dredd api.yml 127.0.0.1:5000 --hookfiles=./hooks*.js
   ```
