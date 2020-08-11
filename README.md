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
1. Start Docker compose 
    ```
    $ docker-compose up
    ```
1. Access API `http://localhost:5000/` (Check other APIs on `router.ts`)


