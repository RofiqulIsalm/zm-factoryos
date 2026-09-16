# ZM FactoryOS - Windows Startup Script
# Run this from the project root to start the full stack.

$env:PATH = "C:\pg17\pgsql\bin;C:\Program Files\nodejs;C:\Users\OS\AppData\Roaming\npm;" + $env:PATH

# ── Environment Variables ────────────────────────────────────────────────────
$env:DATABASE_URL    = "postgresql://postgres@localhost:5432/factoryos"
$env:PORT            = "8080"
$env:SESSION_SECRET  = "zm-factoryos-dev-secret-change-in-production"
$env:INITIAL_MD_USERNAME = "admin"
$env:INITIAL_MD_PASSWORD = "changeme123!"
$env:INITIAL_MD_NAME     = "Managing Director"
$env:NODE_ENV        = "development"

$root = Split-Path -Parent $MyInvocation.MyCommand.Path

# ── 1. Ensure PostgreSQL is running ─────────────────────────────────────────
$pgStatus = & pg_ctl.exe -D "C:\pg17\data" status 2>&1
if ($pgStatus -notmatch "server is running") {
    Write-Host "Starting PostgreSQL..." -ForegroundColor Yellow
    & pg_ctl.exe -D "C:\pg17\data" -l "C:\pg17\pg.log" start
    Start-Sleep 3
}
Write-Host "PostgreSQL: running" -ForegroundColor Green

# ── 2. Start API server (background job) ────────────────────────────────────
Write-Host "Starting API server on :8080..." -ForegroundColor Yellow
$apiJob = Start-Job -ScriptBlock {
    param($root, $dbUrl, $port, $secret, $user, $pass, $name, $env)
    $env:DATABASE_URL    = $dbUrl
    $env:PORT            = $port
    $env:SESSION_SECRET  = $secret
    $env:INITIAL_MD_USERNAME = $user
    $env:INITIAL_MD_PASSWORD = $pass
    $env:INITIAL_MD_NAME     = $name
    $env:NODE_ENV        = $env
    $env:PATH = "C:\pg17\pgsql\bin;C:\Program Files\nodejs;C:\Users\OS\AppData\Roaming\npm;" + $env:PATH
    node --enable-source-maps "$root\artifacts\api-server\dist\index.mjs"
} -ArgumentList $root, $env:DATABASE_URL, $env:PORT, $env:SESSION_SECRET, $env:INITIAL_MD_USERNAME, $env:INITIAL_MD_PASSWORD, $env:INITIAL_MD_NAME, $env:NODE_ENV

Start-Sleep 2
Write-Host "API server: running" -ForegroundColor Green

# ── 3. Start frontend dev server (background job) ───────────────────────────
Write-Host "Starting frontend on :5173..." -ForegroundColor Yellow
$feJob = Start-Job -ScriptBlock {
    param($root)
    $env:PATH = "C:\Program Files\nodejs;C:\Users\OS\AppData\Roaming\npm;" + $env:PATH
    $env:PORT = "5173"
    Set-Location $root
    pnpm --filter @workspace/zm-factoryos run dev
} -ArgumentList $root

Start-Sleep 3
Write-Host "Frontend: running" -ForegroundColor Green

# ── 4. Open browser ─────────────────────────────────────────────────────────
Write-Host ""
Write-Host "================================================" -ForegroundColor Cyan
Write-Host "  ZM FactoryOS is running!" -ForegroundColor Cyan
Write-Host "  Frontend : http://localhost:5173" -ForegroundColor Cyan
Write-Host "  API      : http://localhost:8080" -ForegroundColor Cyan
Write-Host "  Login    : admin / changeme123!" -ForegroundColor Cyan
Write-Host "================================================" -ForegroundColor Cyan
Write-Host ""
Start-Process "http://localhost:5173"

Write-Host "Press Ctrl+C to stop all servers." -ForegroundColor Gray
try {
    Wait-Job $apiJob, $feJob
} finally {
    Stop-Job $apiJob, $feJob -ErrorAction SilentlyContinue
    Remove-Job $apiJob, $feJob -ErrorAction SilentlyContinue
    Write-Host "Servers stopped."
}
