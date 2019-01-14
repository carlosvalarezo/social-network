const express = require('express');

const app = express();

app.get('/', (request, response) => response.send('Hello world inside 2'));

const port = process.env.PORT || 5000;
 
app.listen(port, ()=>console.log(`Server on port ${port}`));