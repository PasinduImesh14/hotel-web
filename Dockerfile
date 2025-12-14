# --------------------
# Stage 1: Install dependencies
# --------------------
FROM node:20-bullseye AS deps
WORKDIR /app

# Install build tools for Prisma
RUN apt-get update && apt-get install -y bash git python3 make g++ openssl ca-certificates && rm -rf /var/lib/apt/lists/*

COPY package.json package-lock.json ./
RUN npm ci

# --------------------
# Stage 2: Build the app
# --------------------
FROM node:20-bullseye AS builder
WORKDIR /app

# Copy node_modules and code
COPY --from=deps /app/node_modules ./node_modules
COPY . .

ENV NEXT_PRIVATE_TURBOPACK=0

# Generate Prisma client and build app
RUN npx prisma generate
RUN npm run build

# --------------------
# Stage 3: Production image
# --------------------
FROM node:20-bullseye AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV DATABASE_URL=mysql://root:1234@db:3306/hotel_db
ENV ADMIN_API_SECRET=MY_SUPER_SECRET

# Install runtime dependencies
RUN apt-get update && apt-get install -y openssl ca-certificates && rm -rf /var/lib/apt/lists/*

# Copy built files
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/prisma ./prisma

EXPOSE 3000

CMD ["npm", "start"]
