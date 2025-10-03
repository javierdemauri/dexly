# Build
FROM node:20-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Serve static
FROM pierrezemb/gostatic
COPY --from=build /app/dist/ /srv/http/