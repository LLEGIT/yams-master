const fs = require('fs');
const path = require('path');
const USERS_PATH = path.join(__dirname, 'users.json');

const readUsers = () => {
    try {
        const data = fs.readFileSync(USERS_PATH, 'utf-8');
        return JSON.parse(data);
    } catch (err) {
        return [];
    }
};

const writeUsers = (users) => {
    fs.writeFileSync(USERS_PATH, JSON.stringify(users, null, 2));
};

module.exports = { readUsers, writeUsers };