$ErrorActionPreference = 'Stop'
Set-Location $PSScriptRoot
if (!(Test-Path .env.demo)) { throw 'Run .\setup_demo.ps1 first' }
docker compose --env-file .env.demo -f docker-compose.yml -f docker-compose.demo.yml up -d postgres_demo pgadmin_demo nginx
Write-Host 'Demo PostgreSQL: 127.0.0.1:5435 ; pgAdmin: http://localhost:5051'
Write-Host 'Website via Nginx: http://localhost:8080 (do NOT use Live Server :5500 for PostgreSQL mode)'
