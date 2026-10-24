# Run once in VS Code PowerShell: .\setup_demo.ps1
$ErrorActionPreference = 'Stop'
Set-Location $PSScriptRoot
if (Test-Path .env.demo) {
  Write-Host '.env.demo already exists; preserving your passwords.'
  exit 0
}
$pw = ([guid]::NewGuid().ToString('N') + [guid]::NewGuid().ToString('N'))
$pg = ([guid]::NewGuid().ToString('N'))
$secret = ([guid]::NewGuid().ToString('N') + [guid]::NewGuid().ToString('N'))
@"
DEMO_DB_PASSWORD=$pw
DEMO_PGADMIN_PASSWORD=$pg
JWT_SECRET=$secret
GRAFANA_ADMIN_PASSWORD=$pg
"@ | Set-Content -Encoding ascii .env.demo
Write-Host 'Created .env.demo with random credentials. Do not upload it to GitHub.'
Write-Host 'pgAdmin demo email: demo@local.test'
Write-Host 'pgAdmin demo password is DEMO_PGADMIN_PASSWORD in .env.demo. Keep it private.'
