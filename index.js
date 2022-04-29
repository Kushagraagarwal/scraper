//use cheerio to scrape a given url 

const cheerio = require("cheerio");
const url = 'https://www.myntra.com/tshirts/allen-solly-tribe/allen-solly-tribe-men-olive-green-brand-logo-printed-applique-t-shirt/17184680/buy'
const request = require("request");
const fs = require("fs");
const csv = require('fast-csv')
var csvStream = csv.createWriteStream({headers: true}),
writableStream = fs.createWriteStream("my.csv");
csvStream.pipe(writableStream);

 
writableStream.on("finish", function(){
  console.log("DONE!");
});
//write json into a csv 


// request the url and then pass the html to cheerio
//add user agent in request header
request({
    url: url,
    headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/81.0.4044.138 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9',
        'Accept-Language': 'en-US,en;q=0.9',
        'Connection': 'keep-alive',
        'Upgrade-Insecure-Requests': '1',
    }
}, function (error, response, html) {
    // console.log(response)
    if(!error && response.statusCode == 200) {
        const $ = cheerio.load(html);
        let r = $.html();
        // get script tag and save it to a variable 
        let scripts = $('script')
        // get second script tag and convert it to json
        let script = scripts[1].children[0].data
        let json = JSON.parse(script)
        csvStream.write({
            name: json.name,
            price: json.price,
            image: json.image,
            description: json.description,
        })

        // console.log(scripts)
        // console.log(r);
    // console.log(r);
    }
    else{
        console.log(error);
    }
})