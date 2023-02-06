const express = require('express');
const path = require('path');
const fs = require('fs'); //simulate dB writeFile db.json
const notes = require('./db/db.json'); // savedNotes
// Helper method for generating unique ids
const uuid = require('./helpers/uuid');

const app = express();

const PORT = 3001;

//middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//serve up public folder & files
app.use(express.static('public'));

app.get('/index', (req, res) =>
  res.sendFile(path.join(__dirname, 'public/index.html'))
);

app.get('/notes', (req, res) => 
    res.sendFile(path.join(__dirname, 'public/notes.html'))
);

//GET request for notes
app.get('/api/notes', (req, res) => res.json(notes));

// //GET request for notes
// app.get('/api/notes', (req, res) => {
//     console.info(`GET /api/notes`);
//     res.status(200).json(`${req.method} request received to get Notes`);

//     console.info(`${req.method} request received to get notes`);
// });

// // GET a single note
// app.get('/api/notes/:note_id', (req, res) => {
//     if (req.params.note_id) {
//       console.info(`${req.method} request received to get a single a note`);
//       const noteId = req.params.note_id;
//       for (let i = 0; i < notes.length; i++) {
//         const currentNote = notes[i];
//         if (currentNote.note_id === noteId) {
//           res.json(currentNote);
//           return;
//         }
//       }
//       res.status(404).send('Note not found');
//     } else {
//       res.status(400).send('Note ID not provided');
//     }
//   });


//POST request to add a note
app.post('/api/notes', (req, res) => {
    // Log that a POST request was received
    console.info(`${req.method} request received to add a note`);

    // Destructuring assignment for the items in req.body
    const { title, text } = req.body;

    // If all the required properties are present
    if (title && text) {
    // Variable for the object we will save //create a new note object from activeNote
        const newNote = {
            title,
            text,
            review_id: uuid(),
        };

// Obtain existing notes
        fs.readFile('./db/db.json', 'utf8', (err, data) => {
          if(err) {
            console.error(err);
          } else {
          // convert string into JSON object
          const parsedNotes = JSON.parse(data);
          
        //  Add new note
        parsedNotes.push(newNote);

        // Write updated notes back to the file
        fs.writeFile('./db/db.json', JSON.stringify(parsedNotes, null, 4),
            (writeErr) => 
              writeErr ? console.error(writeErr) : console.info('Successfully updated notes!')
            );
          }
        });

      const response = {
          status: 'success',
          body: newNote,
        };

      console.log(response); 
      res.status(201).json(response);
    } else {
        res.status(500).json('Error in posting note')
    }
});

app.listen(PORT, () => { // listen for specific port for incoming request
    console.log(`Express server listening for incoming requests on PORT: ${PORT}`)
});



// async function test() {
//     console.log('Ready');
//     let example = await fetch('http://localhost:3001/');
//     console.log('I will print second');
//   }
  
//   test();
//   console.log('I will print first');