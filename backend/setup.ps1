# CQPM Nador — Laravel backend setup (Windows PowerShell)
# For XAMPP users, prefer: .\setup-xampp.ps1

Write-Host "=== CQPM Backend Setup ===" -ForegroundColor Cyan

if (-not (Get-Command php -ErrorAction SilentlyContinue)) {
    Write-Host "PHP not found. Install PHP 8.2+ or use XAMPP: .\setup-xampp.ps1" -ForegroundColor Red
    exit 1
}

if (-not (Get-Command composer -ErrorAction SilentlyContinue)) {
    Write-Host "Composer not found. Install from https://getcomposer.org/download/" -ForegroundColor Red
    exit 1
}

if (-not (Test-Path ".env")) {
    Copy-Item ".env.example" ".env"
    Write-Host "Created .env from .env.example" -ForegroundColor Green
}

if (-not (Test-Path "vendor")) {
    Write-Host "Installing Composer dependencies..." -ForegroundColor Yellow
    composer install --no-interaction
}

php artisan key:generate --force

Write-Host ""
Write-Host "Next steps:" -ForegroundColor Cyan
Write-Host "1. Start MySQL (XAMPP or: docker compose up -d)"
Write-Host "2. Run migrations:  php artisan migrate"
Write-Host "3. Create admin user:  php artisan db:seed"
Write-Host "4. Start API server:  php artisan serve"
Write-Host "5. Admin panel:  http://127.0.0.1:8000/admin/login"
Write-Host "6. Start React frontend:  npm run dev   (from project root)"
