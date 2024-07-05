const express = require("express");

const app = express();
const PORT = 3000;

app.get("/", (req, res) => {
    res.status(200);
    res.send("This is from root");
});

app.listen(PORT, (error) => {
    if (!error) {
        console.log(`Server is successfully running on PORT ${PORT}`);
    } else {
        console.log("Error occurred. Server can't start", error);
    }
});