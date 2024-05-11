const { google } = require("googleapis");
const { envConfig } = require("../constants/config");
const oauth2Client = new google.auth.OAuth2(
  envConfig.clientID,
  envConfig.clientSecret,
  envConfig.redirectURI
);
oauth2Client.setCredentials({
  refresh_token: envConfig.refreshTokenGoogleDrive,
});
const drive = google.drive({ version: "v3", auth: oauth2Client });

module.exports = drive;
