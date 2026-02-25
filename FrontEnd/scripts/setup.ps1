$ErrorActionPreference = "Stop"

function Write-Info($message) {
    Write-Host "[setup] $message" -ForegroundColor Cyan
}

function Write-Warn($message) {
    Write-Host "[setup] $message" -ForegroundColor Yellow
}

function Write-Err($message) {
    Write-Host "[setup] $message" -ForegroundColor Red
}

function Command-Exists($name) {
    return [bool](Get-Command $name -ErrorAction SilentlyContinue)
}

Write-Info "Comprobando Node.js y npm..."

if (-not (Command-Exists "node") -or -not (Command-Exists "npm")) {
    Write-Warn "Node.js o npm no están instalados. Intentando instalar Node.js LTS con winget..."

    if (Command-Exists "winget") {
        try {
            winget install -e --id OpenJS.NodeJS.LTS
        } catch {
            Write-Err "No se pudo instalar Node.js con winget. Instálalo manualmente desde https://nodejs.org/es/download y vuelve a ejecutar este script."
            exit 1
        }
    } else {
        Write-Err "winget no está disponible. Instala Node.js LTS manualmente desde https://nodejs.org/es/download y vuelve a ejecutar este script."
        exit 1
    }

    Write-Warn "Cierra y vuelve a abrir la terminal para actualizar PATH, luego ejecuta este script otra vez."
    exit 0
}

Write-Info "Node.js y npm detectados."

Write-Info "Instalando dependencias del proyecto..."
Push-Location (Split-Path $PSScriptRoot -Parent)

npm install

Write-Info "Instalando EAS CLI globalmente..."
if (-not (Command-Exists "eas")) {
    npm install -g eas-cli
}

Write-Info "Instalación completada."
Write-Info "Puedes ejecutar: npx expo start o eas build --platform android"

Pop-Location
