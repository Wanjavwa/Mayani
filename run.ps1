$ErrorActionPreference = "Stop"
Set-Location $PSScriptRoot

function Require-Command($name) {
  if (-not (Get-Command $name -ErrorAction SilentlyContinue)) {
    Write-Host "Missing '$name'."
    Write-Host "Install Node.js LTS from https://nodejs.org then reopen the terminal."
    exit 1
  }
}

Require-Command node
Require-Command npm

Write-Host "Node $(node -v) / npm $(npm -v)"
if (-not (Test-Path "node_modules")) {
  Write-Host "Installing dependencies..."
  npm install
} else {
  Write-Host "Dependencies already installed."
}

Write-Host "Starting http://localhost:5173"
npm run dev
