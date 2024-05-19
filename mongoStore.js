const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session');
const mongoStore = MongoDBStore(session);

const store = new mongoStore({
    collection: "userSessions",
    uri: process.env.DATABASE,
    expires: 1000,
});

module.exports = store;