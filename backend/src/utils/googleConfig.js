import google from "googleapis";

const GOOGLE_CLIENT_ID=process.env.CLIENT_ID;
const GOOGLE_CLIENT_SECRET=process.env.CLIENT_SECRET;
const REDIRECT_URI=process.env.REDIRECT_URI;

export const oauth2client= new google.Auth.OAuth2Client(
    GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET,
    REDIRECT_URI
)

