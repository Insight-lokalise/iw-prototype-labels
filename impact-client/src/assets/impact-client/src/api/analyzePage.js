const puppeteer = require('puppeteer');
const PuppeteerHar = require('puppeteer-har');
const express = require('express');
const router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('index', { title: 'Analyze' });
});

module.exports = router;

(async (url) => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    const har = new PuppeteerHar(page);

    await har.start();

    await page.goto(url);

    await har.stop();

    await browser.close();
})('https://www.insight.com/en_US/home.html');

