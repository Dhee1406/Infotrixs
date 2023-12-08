import React, { useState, useEffect } from 'react';
import './App.css';
import axios from 'axios';


const QuoteOfTheDay = () => {
  const [quote, setQuote] = useState({});
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [author, setAuthor] = useState('');
  const [searchedQuotes, setSearchedQuotes] = useState([]);
  const [showSearchSection, setShowSearchSection] = useState(false);

  useEffect(() => {
    fetchRandomQuote();
  }, []);

  const fetchRandomQuote = async () => {
    try {
      const response = await fetch('https://api.quotable.io/random');
      const data = await response.json();
      setQuote(data);

      await fetch('http://localhost:3001/storeQuote', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content: data.content,
          author: data.author,
        }),
      });
    }catch (error) {
      console.error('Error fetching and storing random quote:', error);
    }
  };

  const searchByAuthor = async () => {
    try {
      const response = await fetch(`http://localhost:3001/quotesByAuthor/${searchQuery}`);
      const data = await response.json();
      setSearchResults(data);
      setShowSearchSection(true);
    } catch (error) {
      console.error('Error searching quotes by author:', error);
    }
  };

  const searchQuotesByAuthor = async () => {
    try {
      const response = await axios.get(`https://api.quotable.io/quotes?author=${author}`);
      const quotes = response.data.results.map(quote => `"${quote.content}" - ${quote.author}`);
      setSearchedQuotes(quotes);
      setShowSearchSection(true);
    } catch (error) {
      console.error('Error searching quotes:', error.message);
    }
  };

  const handleAuthorChange = (event) => {
    setAuthor(event.target.value);
  };

  const handleCopyClick1 = (textToCopy) => {
    navigator.clipboard.writeText(textToCopy);
  };

  const handleCopyClick2 = (textToCopy) => {
    navigator.clipboard.writeText(textToCopy);
  };

  const handleCopyClick3 = (textToCopy) => {
    navigator.clipboard.writeText(textToCopy);
  };

  return (

    <div class="quote-container">

      <h1>QUOTE OF THE DAY</h1>
      <div class="quote-content">
        <p>{quote.content}</p>
        <p class="author">- {quote.author}</p>
        <span
          className="copy-logo"
          onClick={() => handleCopyClick1(`${quote.content} - ${quote.author}`)}
          style={{ cursor: 'pointer' }}
          >
            📋
        </span>
      </div>

      <button onClick={fetchRandomQuote}>New Quote</button>
      <button onClick={() => setShowSearchSection(!showSearchSection)} style={{margin: '10px'}} >Search Author name</button>


      <div>        
        {/* Search Section */}
        {showSearchSection && (
          <div>
            <h3>Are you looking for quotes of any perticular author, then you must search author name below 👇</h3>
            <input type="text" placeholder="Enter author's name" value={author} onChange={handleAuthorChange}/>
            <button onClick={searchQuotesByAuthor}>🔍</button>
          </div>
        )}

        {searchedQuotes.length > 0 && (
          <div>
            <h3>Quotes by {author}:</h3>
            <ul>
              {searchedQuotes.map((quote, index) => (
              <li key={index}>{quote}
                <span
                  className="copy-logo"
                  onClick={() => handleCopyClick2(`${quote} - ${index}`)}
                  style={{ cursor: 'pointer' }}
                >
                  📋
                </span>
              </li>
              ))}
            </ul>
          </div>
        )}
      </div>
      
      <div>        
        {/* Search Section */}
        {showSearchSection && (
          <div>
            <h3>Search for Quotes of an author stored previously 👇.</h3>
            <input type="text" placeholder="Search by author" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}/>
            <button onClick={searchByAuthor}>🔍</button>
          </div>
        )}

        {/* Display Search Results */}
        {searchResults.length > 0 && (
          <div>
            <h2>Quotes of <span style={{ textTransform: 'uppercase' }}>{searchQuery}</span></h2>
            <ul>
              {searchResults.map((result) => (
              <li key={result.id}>
                {result.content} - {result.author}
                <span
                  className="copy-logo"
                  onClick={() => handleCopyClick3(`${result.content} - ${result.author}`)}
                  style={{ cursor: 'pointer' }}
                >
                  📋
                </span>
                <br />
                Posted on: {new Date(result.timestamp).toLocaleString()}
              </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default QuoteOfTheDay;
