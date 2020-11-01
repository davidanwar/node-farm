const fs = require("fs");
const http = require("http");
const url = require("url");

// const input = fs.readFileSync('./text/input.txt', 'utf-8');
// console.log(input);
// const output = `This is about ${input} and created at: ${Date.now()}`;
// fs.writeFileSync('./text/output.txt', output);
// console.log('File Written');

fs.readFile("./text/input.txt", "utf-8", (err, data) => {
  console.log(data);
});

const data = fs.readFileSync(`${__dirname}/dev-data/data.json`, 'utf-8');
const overview = fs.readFileSync(`${__dirname}/templates/overview.html`, 'utf-8');
const product = fs.readFileSync(`${__dirname}/templates/product.html`, 'utf-8');
const card = fs.readFileSync(`${__dirname}/templates/card.html`, 'utf-8');
const objectData = JSON.parse(data);

const replaceTemplate = (temp, product) => {
  let output = temp.replace(/{%PRODUCTNAME%}/g, product.productName);
  output = output.replace(/{%IMAGE%}/g, product.image);
  output = output.replace(/{%PRICE%}/g, product.price);
  output = output.replace(/{%FROM%}/g, product.from);
  output = output.replace(/{%NUTRIENTS%}/g, product.nutrients);
  output = output.replace(/{%QUANTITY%}/g, product.quantity);
  output = output.replace(/{%DESCRIPTION%}/g, product.description);
  output = output.replace(/{%ID%}/g, product.id);
  
  if(!product.organic) output = output.replace(/{%NOT_ORGANIC%}/g, 'not-organic');
  return output;
};

const server = http.createServer((req, res) => {
  const pathName = req.url;

  // Overview Page
  if (pathName === "/" || pathName === "/overview") {
    res.writeHead(200, {
      "Content-Type": "text/html",
    });
    const cardHtml = objectData.map((el) => replaceTemplate(card, el)).join('');
    const output = overview.replace('{%PRODUCT_CARDS%}', cardHtml);
    res.end(output);

    // Product Page
  } else if (pathName === "/product") {
    res.end("This is PRODUCT");

    // API Page
  } else if (pathName === "/api") {
    res.writeHead(200, {
      "Content-Type": "application/json",
    });
    res.end(data);

    // Not Found Page
  } else {
    res.writeHead(404, {
      "Content-Type": "text/html",
      "my-own-header": "Hello Word",
    });
    res.end("<h1>Page not found</h1>");
  }
});

server.listen(3000, () => {
  console.log("Server is running on port 3000..");
});
