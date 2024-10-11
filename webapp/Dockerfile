# Stage 1: Build the Node.js application
FROM registry-innersource.soprasteria.com/alexandre.petit/docker-image-puller/docker.io-library-node:18 AS build-stage

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Use BuildKit to pass the secret token securely
RUN --mount=type=secret,id=access_token,dst=/kaniko/access_token \
    sh -c 'npm config set @design-system-etat:registry https://innersource.soprasteria.com/api/v4/projects/154980/packages/npm/ && \
           npm config set //innersource.soprasteria.com/api/v4/projects/154980/packages/npm/:_authToken $(cat /kaniko/access_token) && \
           npm install'

# Copy the rest of the application
COPY . .

# Build the project
RUN npm run build

# Stage 2: Use the unprivileged Nginx image
FROM registry-innersource.soprasteria.com/alexandre.petit/docker-image-puller/nginxinc-nginx-unprivileged:1.27-alpine

# Switch to root user to perform privileged operations
USER root

# Copy nginx configuration
COPY ./nginx.conf /etc/nginx/nginx.conf

# Create a directory for the PID file and set ownership
RUN mkdir -p /var/run/nginx && \
    chown nginx:nginx /var/run/nginx

# Remove default nginx index page
RUN rm -rf /usr/share/nginx/html/*

# Copy built application from the build-stage and set ownership
COPY --from=build-stage /app/dist /usr/share/nginx/html

# Ensure ownership and permissions are correct
RUN chown -R nginx:nginx /usr/share/nginx/html && \
    chmod -R u+rwX /usr/share/nginx/html

# Copy the environment runtime editor script
COPY ./env_runtime_editor.sh /env_runtime_editor.sh
RUN sed -i 's/\r$//' /env_runtime_editor.sh
RUN chmod +x /env_runtime_editor.sh

# Switch back to the non-root user provided by the image
USER nginx

EXPOSE 80

# Set the entrypoint to the runtime editor script
ENTRYPOINT ["/env_runtime_editor.sh"]
