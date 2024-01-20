const http = require('http');
const https = require('https');

const server = http.createServer((req, res) => {
  // create a restful handler for the /isbn/:isbn endpoint, don't care about the isbn format
  if (req.url.match(/\/isbn\/[0-9a-zA-Z]+/)) {
    // get the isbn parameter from the path
    const isbn = req.url.split('/')[2];

    // Make a request to the MongoDB API
    const options = {
      method: 'POST',
      hostname: 'ap-southeast-1.aws.data.mongodb-api.com',
      path: '/app/data-krcyu/endpoint/data/v1/action/findOne',
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Request-Headers': '*',
        'api-key': 'lV3BX1RZCn4kRJCqWZU6fBZfxZFMSUmpJLZjEFGMx3lcbDz2iW9WR39s8wNXZrg0',
        Accept: 'application/ejson',
      },
    };

    const apiReq = https.request(options, (apiRes) => {
      let data = '';

      apiRes.on('data', (chunk) => {
        data += chunk;
      });

      apiRes.on('end', () => {
        res.statusCode = 200;
        // allow access from any origin
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Content-Type', 'application/json');
        res.end(data);
      });
    });

    apiReq.on('error', (error) => {
      console.error('Error:', error);
      res.statusCode = 500;
      res.end('An error occurred');
    });

    const requestData = {
      collection: 'ppdvn',
      database: 'isbn-vn',
      dataSource: 'quantranfr-cluster',
      filter: { _id: isbn },
    };

    apiReq.write(JSON.stringify(requestData));
    apiReq.end();
  } else {
    res.statusCode = 404;
    res.end('Not found');
  }
});

const port = 3000;
server.listen(port, () => {
  console.log(`Server running at http://localhost:${port}/`);
});

