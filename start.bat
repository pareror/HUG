@echo off

:: Percorsi specifici
set FRONTEND_PATH=.\frontend
set BACKEND_PATH=.\backend
set PROJECT_PATH=.\

:: Apri terminale per React
start cmd /k "cd /d %FRONTEND_PATH% && npm start"

:: Apri terminale per Express
start cmd /k "cd /d %BACKEND_PATH% && node index.js"

echo Script avviato con successo!
