@ECHO OFF

CALL npm i

CALL cd %cd%/packages/coverme-shared

CALL npm i

CALL npm run build

CALL cd ..

CALL cd ..

CALL npm run update-shared

CALL cd packages/client-web

CALL npm i

CALL cd ../functions

CALL npm i

CALL cd ..

CALL cd ..

CALL lerna bootstrap
