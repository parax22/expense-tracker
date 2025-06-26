@echo off

REM Start Django backend
start cmd /k "cd /d E:\expense-tracker\backend && venv\Scripts\activate && python manage.py runserver"

REM Start React frontend
start cmd /k "cd /d E:\expense-tracker\frontend && npm run dev"
