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

# Tambahkan library pendukung untuk Prisma di Alpine
RUN apk add --no-cache openssl

WORKDIR /app

# Copy package files dulu (optimasi cache layer)
COPY package*.json ./
RUN npm install

# Copy sisa file
COPY . .

# --- BAGIAN KRUSIAL ---
# Generate client harus dilakukan SEBELUM build 
#1. agar engine Prisma tersedia saat prerendering halaman dashboard
RUN npx prisma migrate resolve --applied 0_init || true

# 2. Jalankan Migrate Deploy
# Ini akan membaca folder prisma/migrations dan mengupdate database server
# tanpa menghapus data yang sudah ada di sana.
RUN npx prisma migrate deploy

# Build aplikasi
RUN rm -rf .next
RUN npm run build

ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1

EXPOSE 3000

# Sebaiknya gunakan CMD agar container tetap running
# CMD ["npm", "start"]