//swEnvBuild.js - script that is separate from webpack
require('dotenv').config(); // make sure you have '.env' file in pwd
const fs = require('fs');

fs.writeFileSync(
    './public/swenv.js',
    `
const process = {
  env: {
    APP_KEY: '${process.env.REACT_APP_FB_APP_KEY}',
    AUTH_DOMAIN: '${process.env.REACT_APP_FB_AUTH_DOMAIN}',
    PROJECT_ID: '${process.env.REACT_APP_FB_PROJECT_ID}',
    STORAGE_BUCKET: '${process.env.REACT_APP_FB_STORAGE_BUCKET}',
    SENDER_ID: '${process.env.REACT_APP_FB_MSG_SENDER_ID}',
    APP_ID: '${process.env.REACT_APP_FB_APP_ID}',
    MEASUREMENT_ID: '${process.env.REACT_APP_MEASURMENT_ID}'
  }
}
`
);
