const puppeteer = require('puppeteer');
const PuppeteerHar = require('puppeteer-har');
const express = require('express');
const router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
    // if (req.accepts("json")) {
    //     return res.send('abc respond with a resource');
    // } else {
    let url = req.query.url;
    let cb = req.query.cb;
    let spd = req.query.spd;
    console.log("url: ",url);
    console.log("cb: ",cb);
    console.log("spd: ",spd);
    console.log("req.accepts('json')",req.accepts("json"));
    analyzePage(url).then((d) => {
        console.log("THEN...");
        if (cb) {
            res.header('Content-Type', 'application/javascript');
            res.send(cb+'('+JSON.stringify(d)+')');
        } else {
            res.header('Content-Type', 'application/json');
            res.send(JSON.stringify(d));
        }
    }).catch(next);
    //res.header('Content-Type', 'application/json');
    //    }
});

module.exports = router;

const analyzePage = async (url) => {
    console.log("analyzePage url: ",url)
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    const har = new PuppeteerHar(page);

    await har.start();

    await page.goto(url);

    const harData = await har.stop();
    console.log("back from har.stop");

    await browser.close();

    return harData;
};

