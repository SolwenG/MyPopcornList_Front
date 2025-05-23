FROM node:22-alpine AS builder

# Copy and build
WORKDIR /app
COPY . .
RUN npm install
RUN npm run build

# Use Nginx
FROM nginx:alpine
COPY --from=builder /app/dist/spa /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
