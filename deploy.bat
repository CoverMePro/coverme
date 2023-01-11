@ECHO OFF
echo updating shared project
CALL npm run update-shared

echo moving to functions
CALL cd %cd%/packages/functions

echo deploy %1
CALL npm run deploy:%1

echo %cd%

echo moving to client
CALL cd ../client-web

echo build %1
CALL npm run build:%1