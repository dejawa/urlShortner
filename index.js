// Require express module
const express = require("express");
const shortid = require("shortid");
const validUrl = require("valid-url");
const bodyParser = require("body-parser"); 
const shortCode = require('./services/uniqueUrlCode');
const shortener = require('./services/shorten');

const PORT = 8000;
//Start server on Port 8000
const app = express();
const router =express.Router();
app.listen(PORT, () => {
 console.log(`Server started on port`, PORT);
});

app.use(bodyParser.urlencoded({extended:true})); 
app.use(bodyParser.json()); 


router.get("/", async (req, res) => {
    res.status(200);
});

//GET API for redirecting to Original URL
router.get("/url/:url", async (req, res) => {
    const shortenUrl = req.params.url
    var originUrl = await shortener.get(shortenUrl)
    res
        .status(200)
        .set('Content-Type', 'text/html')
        .redirect({ 
            url: originUrl,
         });
});
    
 
//POST API for creating short url from Original URL
router.post("/url", async (req, res) => {
    const originalUrl = req.body.originalUrl;
    const shortUrl = await shortener.insert(originalUrl)
    res
        .status(200)
        .set('Content-Type', 'text/html')
        .send({ 
            url: originalUrl,
            shortenUrl: shortUrl
         });
    });

router.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE");
    res.header(
      "Access-Control-Allow-Headers",
      "Content-type,Accept,x-access-token,X-Key"
    );
    if (req.method == "OPTIONS") {
      res.status(200).end();
    } else {
      next();
    }
  });

  app.use('/', router)