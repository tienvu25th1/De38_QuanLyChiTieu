$ErrorActionPreference = 'Stop'
Set-Location $PSScriptRoot
if (!(Test-Path .env.demo)) { throw 'Run .\setup_demo.ps1 first' }
Get-Content .env.demo | ForEach-Object {
  if ($_ -match '^([A-Z_]+)=(.*)$') { [Environment]::SetEnvironmentVariable($matches[1],$matches[2],'Process') }
}
$env:DB_HOST='127.0.0.1'
$env:POSTGRES_PORT='5435'
$env:POSTGRES_DB='expense_tracker_demo'
$env:POSTGRES_USER='expense_demo'
$env:POSTGRES_PASSWORD=$env:DEMO_DB_PASSWORD
$env:DB_PASSWORD=$env:DEMO_DB_PASSWORD
$env:PORT='3000'
Set-Location backend
if (!(Test-Path node_modules)) { npm ci; if ($LASTEXITCODE -ne 0) { throw 'npm ci failed' } }
node src/server.js
