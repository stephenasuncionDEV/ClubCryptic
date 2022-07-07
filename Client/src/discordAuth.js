import env from "react-dotenv";
import axios from "axios"
import { loginDiscordHandler } from "./firebase"

const Redirect = async (code) => {

    const data = new URLSearchParams();
    data.append("client_id", env.DISCORD_CLIENT_ID);
    data.append("client_secret", env.DISCORD_CLIENT_SECRET);
    data.append("grant_type", "authorization_code");
    data.append("code", code);
    data.append("redirect_uri", "http://localhost:3000/");

    const headers = {
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded', 
        }
    }

    const response = await axios.post("https://discord.com/api/oauth2/token", data, headers);
    const { access_token } = response.data;

    const userHeaders = {
        headers: {
            Authorization: `Bearer ${access_token}`
        }
    }

    const userResponse = await axios.get("https://discord.com/api/v8/users/@me", userHeaders);

    const userData = userResponse.data;

    await loginDiscordHandler(userData);
}

export { Redirect };