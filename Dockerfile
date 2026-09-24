# ── Stage: production image ───────────────────────────────────────────────────
FROM node:20-alpine

# Set working directory inside the container
WORKDIR /usr/src/app

# Copy dependency manifests first to leverage Docker layer caching
COPY package*.json ./

# Install only production dependencies
RUN npm ci --omit=dev

# Build Tailwind CSS before copying the rest of the source
# (node_modules are already present from the step above)
COPY . .
RUN npm run build

# Expose the port the Express app listens on
EXPOSE 3000

# Start the server
CMD ["npm", "start"]
