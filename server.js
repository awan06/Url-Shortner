const express = require('express');
require('dotenv').config();
const mongoose = require('mongoose');
const ShortUrl = require('./models/urlmodel');

const app = express();

app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: false }))

app.get('/', async (req, res) => {
    const shortUrls = await ShortUrl.find()
    res.render('index', { shortUrls: shortUrls })
});

app.post('/shortUrls', async (req, res) => {
    await ShortUrl.create({ full: req.body.fullUrl })

    res.redirect('/')
});

app.get('/:shortUrl', async (req, res) => {
    const shortUrl = await ShortUrl.findOne({ short: req.params.shortUrl })
    if (shortUrl == null) return res.sendStatus(404)

    shortUrl.clicks++
    shortUrl.save()

    res.redirect(shortUrl.full)
});


const start = async () => {
    try {
        await mongoose.connect(process.env.DB, {
            useNewUrlParser: true,
            // useCreateIndex: true,
            // useFindAndModify: false,
            useUnifiedTopology: true,
        });
        app.listen(process.env.PORT, () => {
            console.log(`Server is running`);
        });
    } catch (err) {
        console.log(err);
    }
}

start();



// const port = 8000;
