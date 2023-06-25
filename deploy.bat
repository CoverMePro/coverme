@ECHO OFF
echo updating shared project
CALL npm run update-shared

echo locating shared project
CALL cd %cd%/packages/coverme-shared

echo building share project
CALL npm run build

echo moving to root
CALL cd ..
CALL cd ..

echo updating models
CALL npm run update-shared

echo deploy %1
CALL npm run deploy:%1