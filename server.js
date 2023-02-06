const { notDeepStrictEqual } = require('assert');
const express = require('express');
const path = require('path');
const fs = require('fs'); //simulate dB writeFile db.json
const notes = require('./db/db.json')
// Helper method for generating unique ids
const uuid = require('./helpers/uuid');

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
       
//GET request for notes
app.get('/api/notes', (req, res) => res.json(notes));

//PUSH request for newNote
app.post('/api/notes', (req, res) => {
    const { title, text } = req.body;

    if (title && text) {
        const newNote = {
            title,
            text,
            review_id: uuid(),
        };

       const response = {
        status: 'success',
        body: newNote,
       };

    //
       fs.readFile('./db/db.json', 'utf8', (err, data) => {
        if(err) {
          console.error(err);
        } else {
        // convert string into JSON object
        const parsedNotes = JSON.parse(data);
        
      //  Add new note
      parsedNotes.push(newNote);

      // Write updated notes back to the file
      fs.writeFile('./db/db.json', JSON.stringify(parsedNotes, null, 10),
          (writeErr) => 
            writeErr ? console.error(writeErr) : console.info('Successfully updated notes!')
          );
        }
      });
       

       console.log(response);
       res.json(response);
    } else {
        res.json('Error in posting note');
    }
});

    
app.listen(PORT, () => { // listen for specific port for icmoing request
    console.log(`Express server listening for incoming requests on PORT: ${PORT}`)
});

