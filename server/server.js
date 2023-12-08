const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const pool = require('./database'); // Import the database configuration

const app = express();
const port = 3001;

app.use(cors());
app.use(bodyParser.json());

app.post('/storeQuote', async (req, res) => {
  const { content, author } = req.body;

  try {
    // Insert the quote into the database
    const result = await pool.query(
      'INSERT INTO quotes (content, author, timestamp) VALUES ($1, $2, NOW()) RETURNING *',
      [content, author]
    );

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error storing quote:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.get('/quotesByAuthor/:author', async (req, res) => {
  const author = req.params.author;

  try {
    const result = await pool.query('SELECT * FROM quotes WHERE author ILIKE $1', [`%${author}%`]);
    res.json(result.rows);
  } catch (error) {
    console.error('Error retrieving quotes by author:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Other routes...

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
