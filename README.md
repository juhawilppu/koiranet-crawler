# koiranet-crawler
Script that crawls KoiraNet (https://jalostus.kennelliitto.fi) website to parse information about litters. To make development faster and to make sure that the data doesn't get lost, I downloaded the website content and parsed them locally.

All the original data is saved into `/data` folder. Results are saved into `/results`.

## Running locally

Prerequirements: [Node.js](http://nodejs.org/) installed.

```sh
git clone git@github.com:juhawilppu/koiranet-crawler.git
cd koiranet-crawler
npm install
npm start
```

This will start ts-node and calculate the results.

## Test
```
npm test
```