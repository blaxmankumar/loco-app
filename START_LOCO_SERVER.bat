@echo off
title LOCO — Localhost Demo Server
cd /d "C:\Users\MSI\.gemini\antigravity\scratch\rail_connect\web-demo"
echo ===================================================
echo   Starting LOCO Admin Portal ^& Android Crew App
echo   Local URL: http://localhost:5173/
echo ===================================================
start "" "http://localhost:5173/"
npm run dev
pause
