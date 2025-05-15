# Start Docker container
Write-Host "Starting PostgreSQL container..." -ForegroundColor Green
docker-compose up -d

# Wait for PostgreSQL to be ready
Write-Host "Waiting for PostgreSQL to be ready..." -ForegroundColor Yellow
Start-Sleep -Seconds 5

# Run Prisma migrations
Write-Host "Running Prisma migrations..." -ForegroundColor Cyan
npx prisma migrate dev --name init

# Generate Prisma client
Write-Host "Generating Prisma client..." -ForegroundColor Magenta
npx prisma generate

Write-Host "Done! Your database is ready." -ForegroundColor Green
