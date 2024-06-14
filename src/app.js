const express = require('express');
const route = require('./route')

const app = express();
const PORT = process.env.PORT || 1337;

// Middleware to parse JSON bodies
app.use(express.json());

// Start the server and load the model
app.listen(PORT, async () => {
    route(app);
    console.log(`App is running at http://localhost:${PORT}`);
});