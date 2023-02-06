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
app.use(express.static('public'));

//serve up public folder & files
app.get('/', (req, res) => res.send('Navigate to /send our /routes'));

app.get('/index', (req, res) =>
  res.sendFile(path.join(__dirname, 'public/index.html'))
);

app.get('/notes', (req, res) => 
    res.sendFile(path.join(__dirname, 'public/notes.html'))
);
       
//GET request for notes
app.get('/api/notes', (req, res) => res.json(notes));

// GET request for a single note
app.get('/api/notes/:noteId', (req, res) => {
//   return res.json(req.params.noteId);
// });

    if (req.params.noteId) {
      console.info(`${req.method} request received to get a single a note`);
      const noteId = req.params.noteId;
      for (let i = 0; i < notes.length; i++) {
        const currentNote = notes[i];
        if (currentNote.noteId === noteId) {
          res.json(currentNote);
          return;
        }
      }
      res.status(404).send('Note not found');
    } else {
      res.status(400).send('Note ID not provided');
    };
  });

//PUSH request for newNote
app.post('/api/notes', (req, res) => {
    const { title, text } = req.body;

    if (title && text) {
        const newNote = {
            title,
            text,
            noteId: uuid(),
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


  app.delete('/api/notes/:noteId', (req, res) => {
    console.log("Delete Request Called for /api/notes/noteId endpoint")
    res.send("Delete Request Called")
  })


app.listen(PORT, () => { // listen for specific port for icmoing request
    console.log(`Express server listening for incoming requests on PORT: ${PORT}`)
});

