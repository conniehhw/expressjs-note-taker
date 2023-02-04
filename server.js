const express = require('express');
const path = require('path');

const app = express();

const PORT = 3001;

//middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//serve up public folder & files
app.use(express.static('public'));

app.get('/', (req, res) => res.send('Navigate to /send our /routes'));

app.get('/index', (req, res) =>
  res.sendFile(path.join(__dirname, 'public/index.html'))
);

app.get('/notes', (req, res) => 
    res.sendFile(path.join(__dirname, 'public/notes.html'))
);
       

app.listen(PORT, () => { // listen for specific port for icmoing request
    console.log(`Express server listening for incoming requests on PORT: ${PORT}`)
});