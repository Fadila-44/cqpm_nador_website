# CQPM Nador — Laravel backend setup for XAMPP (Windows PowerShell)

# Prerequisites: XAMPP with Apache + MySQL started



$php = "C:\xampp\php\php.exe"



Write-Host "=== CQPM Backend Setup (XAMPP) ===" -ForegroundColor Cyan



if (-not (Test-Path $php)) {

    if (Get-Command php -ErrorAction SilentlyContinue) {

        $php = "php"

    } else {

        Write-Host "PHP not found. Start XAMPP or install PHP 8.2+." -ForegroundColor Red

        exit 1

    }

}



if (-not (Get-Command composer -ErrorAction SilentlyContinue)) {

    Write-Host "Composer not found. Install from https://getcomposer.org/download/" -ForegroundColor Red

    exit 1

}



if (-not (Test-Path ".env")) {

    Copy-Item ".env.example" ".env"

    Write-Host "Created .env from .env.example (XAMPP MySQL: root / no password)" -ForegroundColor Green

}



if (-not (Test-Path "vendor")) {

    Write-Host "Installing Composer dependencies..." -ForegroundColor Yellow

    composer install --no-interaction

}



& $php artisan key:generate --force



Write-Host ""

Write-Host "Next steps:" -ForegroundColor Cyan

Write-Host "1. Start Apache + MySQL in XAMPP Control Panel"

Write-Host "2. Create database 'cqpm_nador' in phpMyAdmin (or run database/xampp-setup.sql)"

Write-Host "3. Run migrations:  $php artisan migrate"

Write-Host "4. Create admin user + CMS:  $php artisan db:seed"

Write-Host "5. Link uploads folder:  $php artisan storage:link"

Write-Host "6. Start API server:  $php artisan serve"

Write-Host "7. Admin panel:  http://127.0.0.1:8000/admin/login"

Write-Host "8. Start React frontend:  npm run dev   (from project root)"

Write-Host ""

Write-Host "Default admin login: admin@cqpm.ma / changeme (change ADMIN_PASSWORD in .env)" -ForegroundColor Yellow

