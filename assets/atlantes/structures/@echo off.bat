@echo off
setlocal enabledelayedexpansion

set "outputFile=image.json"
echo [ > %outputFile%

for %%f in (*.png *.jpg *.jpeg *.gif) do (
    echo "%%f", >> %outputFile%
)

REM Remove the last comma
for %%f in (*.png *.jpg *.jpeg *.gif) do set "lastFile=%%f"
set "lastFile=!lastFile:~0,-1!"
echo ] >> %outputFile%

REM Fix last comma
(for /f "delims=" %%a in ('type %outputFile%') do echo %%a) > temp.json
move /y temp.json %outputFile% >nul

echo %outputFile% ha sido creado con éxito.
