const express = require("express");
const cors = require("cors");
const fetch = require("node-fetch");

const app = express();//initialize express app
app.use(cors());//middleware to allow cross-origin requests
app.use(express.json());//middleware to parse json data

const OKTA_DOMAIN = "https://dev-93076686-admin.okta.com/";
const API_TOKEN = "00CwZ9HwAqbM2r2stUe9pOStTJBuWM3q_jOxeYVroA";

app.post("/signup", async (req, res) => {
    try {
        const response = await fetch(`${OKTA_DOMAIN}/api/v1/users?activate=true`, {
            method: "POST",
            headers: {
                "Authorization": `SSWS ${API_TOKEN}`,
                "Content-Type": "application/json",
                "Accept": "application/json"
            },
            body: JSON.stringify(req.body)
        });

        const data = await response.json();//convert response to json
        res.status(response.status).json(data);//to frontend
    } catch (error) {
        console.error("Server Error:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});
app.post('/update-profile', async (req, res) => {
    const { firstName, lastName, username, email, mobile, city, state, country } = req.body;

    try {
        // Fetch user from Okta by email
        const userSearchResponse = await fetch(`${OKTA_DOMAIN}/api/v1/users?search=profile.email eq \"${email}\"`, {
            headers: {
                'Authorization': `SSWS ${API_TOKEN}`,
                'Accept': 'application/json'
            }
        });

        const users = await userSearchResponse.json();
        console.log(users);
        if (!users.length) {
            return res.status(404).json({ message: 'User not found in Okta' });
        }
        const userId = users[0].id;

        // Update user profile in Okta
        const updateResponse = await fetch(`${OKTA_DOMAIN}api/v1/users/${userId}`, {
            method: 'POST',
            headers: {
                'Authorization': `SSWS ${API_TOKEN}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                profile: {
                    login: email,
                    email: email,
                    firstName: firstName,
                    lastName: lastName,
                    mobilePhone: mobile,
                    city: city,
                    state: state,
                    countryCode: country,
                }
            })
        });
        if (!updateResponse.ok) {
            return res.status(updateResponse.status).json({ message: 'Failed to update user in Okta' });
        }

        res.json({ message: 'Profile updated successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

const PORT = 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));