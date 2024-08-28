const express = require('express');

const app = express();
const PORT = process.env.PORT || 5065;

app.get('/', (req, res) => {
    res.send('Hello World!')
})

app.listen(PORT, () => {
    console.log(`Example app listening at http://localhost:${PORT}`)
}).on("error", (e) => {
    if (e.code == "EADDRINUSE") {
        console.log("Port already in use");
    } else {
        console.log(e)
    }
})
