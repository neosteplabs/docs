@echo off

set timestamp=%date:~-4%-%date:~4,2%-%date:~7,2%_%time:~0,2%-%time:~3,2%-%time:~6,2%
set timestamp=%timestamp: =0%

forfiles /p snapshots /m *.txt /d -5 /c "cmd /c del @path"
npx repomix . --output "snapshots\LLMS_%timestamp%.txt"

echo.
echo Snapshot created successfully.
pause