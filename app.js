import express from "express";
const app = express();

const PORT = process.env.PORT || 3000;
app.listen(PORT, (req, res) => {
    console.log('Now listening for request');
})

app.get('*', (req, res) => {

    res.render('404')
})