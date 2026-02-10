@echo off
setlocal enabledelayedexpansion

echo ========================================
echo  Wedding Manager Build Script
echo ========================================
echo.

REM Define paths
set "ROOT_DIR=%~dp0"
set "DIST_DIR=%ROOT_DIR%dist"

REM ============================================
REM CONFIGURATION: Dossiers a compiler (JSX->JS)
REM ============================================
set "JSX_DIRS=components"

REM ============================================
REM CONFIGURATION: Dossiers a copier directement
REM ============================================
set "COPY_DIRS=api assets data modules"

REM ============================================
REM CONFIGURATION: Fichiers a copier
REM ============================================
set "COPY_FILES=index.html web-app.js app.js"

REM [1] Clean and create dist directory
echo [1/4] Cleaning dist directory...
if exist "%DIST_DIR%" rd /s /q "%DIST_DIR%"
mkdir "%DIST_DIR%"

REM Create subdirectories in dist
for %%d in (%JSX_DIRS%) do (
    if not "%%d"=="." (
        mkdir "%DIST_DIR%\%%d" 2>nul
    )
)
for %%d in (%COPY_DIRS%) do (
    mkdir "%DIST_DIR%\%%d" 2>nul
)

REM [2] Build JSX files
echo [2/4] Building JSX files...
for %%d in (%JSX_DIRS%) do (
    if "%%d"=="." (
        echo   Building: root
        cmd /c build-jsx "%ROOT_DIR%."
    ) else (
        echo   Building: %%d
        cmd /c build-jsx "%ROOT_DIR%%%d"
    )
)

REM [3] Move compiled .js files to dist
echo [3/4] Moving JS files to dist...
for %%d in (%JSX_DIRS%) do (
    if "%%d"=="." (
        move /y "%ROOT_DIR%*.js" "%DIST_DIR%\" 2>nul
    ) else (
        move /y "%ROOT_DIR%%%d\*.js" "%DIST_DIR%\%%d\" 2>nul
    )
)

REM Copy directories
for %%d in (%COPY_DIRS%) do (
    echo   Copying: %%d
    xcopy /s /y /q "%ROOT_DIR%%%d\*" "%DIST_DIR%\%%d\"
)

REM Remove server/runtime folders from dist (do not deploy local logs)
if exist "%DIST_DIR%\api\logs" rd /s /q "%DIST_DIR%\api\logs"

REM Copy files
for %%f in (%COPY_FILES%) do (
    copy /y "%ROOT_DIR%%%f" "%DIST_DIR%\" 2>nul
)

REM [4] Patch all files in dist (.jsx -> .js)
echo [4/4] Patching all files in dist...
powershell -Command "Get-ChildItem -Path '%DIST_DIR%' -Recurse -Include '*.js','*.html' | ForEach-Object { (Get-Content $_.FullName) -replace '\.jsx', '.js' | Set-Content $_.FullName }"

echo.
echo ========================================
echo  Build complete!
echo  Output: %DIST_DIR%
echo ========================================

endlocal
