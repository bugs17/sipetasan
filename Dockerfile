# # Menggunakan base image Node.js
# FROM node:18-alpine

# # Set working directory
# WORKDIR /app

# # Menyalin seluruh direktori proyek ke dalam container
# COPY . .

# # Install dependencies
# RUN npm install

# # COPY .env .

# # Generate Prisma Client
# # RUN npx prisma generate

# # Build aplikasi Next.js
# RUN npm run build

# # Set environment variables
# ENV NODE_ENV production
# ENV NEXT_TELEMETRY_DISABLED 1

# # Expose port 3000
# EXPOSE 3000


FROM node:22-alpine

RUN apk add --no-cache openssl

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

# Generate Prisma Client sebelum Build
RUN npx prisma generate

# Matikan dulu migrate deploy jika masih error P3005
# RUN npx prisma migrate deploy

# Jalankan build dengan melewatkan pengecekan linting jika perlu untuk mempercepat
RUN npm run build

ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1

EXPOSE 3000

# Sebaiknya gunakan CMD agar container tetap running
# CMD ["npm", "start"]