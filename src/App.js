import React, { useState } from "react";
import axios from "axios";
import "./App.css";

function App() {
  const [query, setQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [searchHistory, setSearchHistory] = useState([]);
  const [error, setError] = useState(null);
  const [showMore, setShowMore] = useState(false); // State to control showing additional info

  const apiBaseUrl = "https://otonomovieapptask.onrender.com";

  const searchMovie = async () => {
    try {
      const response = await axios.get(
        `${apiBaseUrl}/api/Movie/search/${query}`
      );
      const { data } = response;

      if (data.succeeded) {
        setSearchResults([data.data] || []);
        setSelectedMovie(null);
        setError(null);
      } else {
        setError(
          data.message ||
            "We ran into a problem fetching search results. Please try again."
        );
      }
    } catch (error) {
      handleAxiosError(
        error,
        "We ran into a problem fetching search results. Please try again."
      );
    }
  };

  const getSearchHistory = async () => {
    try {
      const response = await axios.get(`${apiBaseUrl}/api/Movie/searchHistory`);
      const { data } = response;

      if (data.succeeded) {
        setSearchHistory(data.data || []);
        setError(null);
      } else {
        setError(data.message || "Its not you, its us. Please try again.");
      }
    } catch (error) {
      handleAxiosError(error, "Its not you, its us. Please try again.");
    }
  };

  const handleAxiosError = (error, defaultMessage) => {
    if (error.response) {
      console.error("Axios Response Error:", error.response.data);
      setError(
        `Server Error: ${error.response.data.message || defaultMessage}`
      );
    } else if (error.request) {
      console.error("Axios Request Error:", error.request);
      setError("Network Error: Unable to reach the server.");
    } else {
      console.error("Axios General Error:", error.message);
      setError("Error: Something went wrong. Please try again.");
    }
  };

  const toggleShowMore = () => {
    setShowMore(!showMore); // Toggle showMore state
  };

  return (
    <>
    <div className="banner">
      <div className="header">
        <h1>Search a Movie</h1>
      </div>
      <div className="main-search-container">
        <div className="search-container">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Enter movie title"
          />
          <button className="search-button" onClick={searchMovie}>
            Search
          </button>
        </div>
      </div>
      <div className="movie-list">
        {searchResults.map((movie) => (
          <div key={movie.imdbID} className="movie-card">
            <img src={movie.poster} alt={movie.title} />
            <h2>{movie.title}</h2>
            <p>{movie.plot}</p>
            {showMore && (
              <div className="movie-details">
                <div className="column">
                  <p>IMDB Score: {movie.imdbRating}</p>
                  <p>Awards: {movie.awards}</p>
                  <p>Released: {movie.released}</p>
                  <p>Genre: {movie.genre}</p>
                </div>
                <div className="column">
                  <p>Runtime: {movie.runtime}</p>
                  <p>Director: {movie.director}</p>
                  <p>Writer: {movie.writer}</p>
                  <p>Actors: {movie.actors}</p>
                </div>
              </div>
            )}
            <button className="more-link" onClick={toggleShowMore}>
              {showMore ? "Click to close" : "Click to read more..."}
            </button>
          </div>
        ))}
      </div>

      <div className="search-history">
        <button onClick={getSearchHistory} className="search-button">
          Search History
        </button>
        <ul>
          {searchHistory.map((history, index) => (
            <li key={index}>{history}</li>
          ))}
        </ul>
      </div>
      {error && <p className="error-message">{error}</p>}
      
    </div>
    </>
  );
}

export default App;
