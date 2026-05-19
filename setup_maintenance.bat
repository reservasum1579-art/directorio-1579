@echo off
REM ------------------------------------------------------------
REM  Setup script for "Mantenimiento del Edificio" module
REM  Requires Supabase CLI installed and logged in.
REM  Run this script from the project root:
REM    c:\Users\Patricio\Documents\portal directorio\directorio-1579
REM ------------------------------------------------------------

REM 1. Push database migrations (creates tables, RLS, triggers)
supabase db push

IF %ERRORLEVEL% NEQ 0 (
  echo [ERROR] supabase db push failed. Check the output above.
  exit /b %ERRORLEVEL%
)

REM 2. Load seed data (optional – adds demo maintenance tasks)
psql "$(cat .supabase/config.json | jq -r .db_url)" -f "documentación\sql\13_seeds.sql"

IF %ERRORLEVEL% NEQ 0 (
  echo [WARNING] Seed loading failed (psql may not be installed). You can run the statements manually in the Supabase SQL editor.
)

REM 3. Deploy Edge Functions
supabase functions deploy schedule_maintenance
IF %ERRORLEVEL% NEQ 0 (echo [ERROR] Failed to deploy schedule_maintenance && exit /b %ERRORLEVEL%)

supabase functions deploy alert_handler
IF %ERRORLEVEL% NEQ 0 (echo [ERROR] Failed to deploy alert_handler && exit /b %ERRORLEVEL%)

REM 4. Install Excel export library (SheetJS)
npm install xlsx

echo ------------------------------------------------------------
echo Setup completed. You can now run "npm run dev" and access the Maintenance module.
pause
