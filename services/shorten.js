const validUrl = require('valid-url');
const shortCode = require('./uniqueUrlCode');
const pg = require('pg');
const pg_info = require('../config/postgres');
const cache = require('./cache');

var exports = module.exports = {};


const client = new pg.Client(pg_info.postgres);
client.connect(err => {
    if (err) throw err;
    else {
        dml();
    }
});
function generate(){
    const shortUrl =  shortCode.generate();
    return shortUrl;
}
function dml() {
    const query = `
        DROP TABLE IF EXISTS inventory;
        CREATE TABLE inventory (id serial PRIMARY KEY, url VARCHAR(200), shortenUrl VARCHAR(50));
    `;
    // INSERT INTO inventory (url, quantity) VALUES ('banana', 150);
    // INSERT INTO inventory (url, quantity) VALUES ('orange', 154);
    // INSERT INTO inventory (url, quantity) VALUES ('apple', 100);
    client
        .query(query)
        .then(()=>{
            console.log("working");
            client.end(console.log("success"));
        })
        .catch(err=>console.log(err))
        .then(()=> {
            console.log("finishied")
        })

      }    

module.exports = {
  insert : async function (url) {
    const shortenUrl = generate()
    const sql = "INSERT INTO inventory (url, shortenUrl) VALUES($1, $2) RETURNING *";
    const values = [url, shortenUrl];
    const client = new pg.Client(pg_info.postgres);
    client.connect()
    await client.query(sql, values).then(res => {
      console.log("insert works")
    })
    return shortenUrl;
  },

  get : async function (shortenurl) {
    const queryOptions = { shortenurl };
    
    let urlData;
    try {
      // Find the item is in the cache
      urlData = await cache.getFromCache('shortenurl', JSON.stringify(queryOptions));
      if (!urlData) {
        // Find the item is in the database
        const sql = "SELECT url, shortenUrl FROM inventory WHERE shortenurl=$1";
        const values = [shortenurl];
        const client = new pg.Client(pg_info.postgres);
        client.connect();
        let result = await client.query(sql, values)   
        console.log("get works");
        originUrl = result.rows[0].url
        
        //insert into Redis
        const updatedAt = new Date();
        const itemToBeSaved = {originUrl, shortenurl, updatedAt};
        console.log("add to redis cache")
        cache.addToCache('shortenurl', JSON.stringify(queryOptions), itemToBeSaved);
        return originUrl;
      }

      if (urlData) {
        console.log("redis cache hit!!")
        return urlData;
      }
    } catch (err) {
      console.log(err)
    }  
  }
}
/*
  app.get('/api/item/:code', async (req, res) => {
    const urlCode = req.params.code;
    const item = await UrlShorten.findOne({ urlCode: urlCode });
    if (item) {
      return res.redirect(item.originalUrl);
    } else {
      return res.redirect(constants.errorUrl);
    }
  });

  app.post('/api/item', async (req, res) => {
    const { shortBaseUrl, originalUrl } = req.body;
    if (validUrl.isUri(shortBaseUrl)) {
    } else {
      return res.status(404).json('Invalid Base Url format');
    }

    const updatedAt = new Date();
    const queryOptions = { originalUrl };
    if (validUrl.isUri(originalUrl)) {
      let urlData;
      try {
        // Find the item is in the cache
        urlData = await cache.getFromCache('originalUrl', JSON.stringify(queryOptions));
        if (!urlData) {
          // Find the item is in the database
          urlData = await UrlShorten.findOne(queryOptions).exec();
        }

        if (urlData) {
          res.status(200).json(urlData);
        } else {
          const urlCode = shortCode.generate();
          shortUrl = shortBaseUrl + '/' + urlCode;
          const itemToBeSaved = { originalUrl, shortUrl, urlCode, updatedAt };

          // Add the item to db
          const item = new UrlShorten(itemToBeSaved);
          await item.save();
          // Add the item to cache
          cache.addToCache('originalUrl', JSON.stringify(queryOptions), itemToBeSaved);
          res.status(200).json(itemToBeSaved);
        }
      } catch (err) {
        res.status(401).json('Invalid User Id');
      }
    } else {
      return res.status(401).json('Invalid Original Url.');
    }
  });
  */