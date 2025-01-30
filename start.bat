@echo off

:: Percorsi specifici
set FRONTEND_PATH=.\frontend
set BACKEND_PATH=.\backend
set PROJECT_PATH=.\

:: Avvia in parallelo la procedura per il frontend:
:: 1) npm install
:: 2) npm start
start cmd /k "cd /d %FRONTEND_PATH% && npm install && npm start"

:: Avvia in parallelo la procedura per il backend:
:: 1) npm install
:: 2) node index.js
start cmd /k "cd /d %BACKEND_PATH% && npm install && node index.js"

echo Script avviato con successo!

