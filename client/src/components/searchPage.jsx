import React, { useState } from 'react';
import axios from 'axios';
// import './App.css';

function SearchPage() {
  const [query, setQuery] = useState('');
  const [ads, setAds] = useState([]);

  const handleSearch = async (event) => {
    event.preventDefault();
    const response = await axios.get(`http://localhost:5000/api/ads?q=${query}`);
    console.log(response)
    setAds(response.data);
  };

  const handleInputChange=(event)=>{
    setQuery(event.target.value);
    handleSearch(event)
  }
  return (
    <div className="App">
      <h3>Click on the search button to get the results</h3>
      <form onSubmit={handleSearch}>
        <input type="text" value={query} onChange={handleInputChange} />
        <button type="submit">Search</button>
      </form>
      <div className="grid">
        {ads.map((ad) => (
          <div key={ad._id} className="card">
            <img src={ad.imageUrl} alt={ad.headline} />
            <div className="company">{ad.companyId}</div>
            <div className="headline">{ad.headline}</div>
            <div className="primary-text">{ad.primaryText}</div>
            <div className="description">{ad.description}</div>
            <div className="cta">{ad.CTA}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default SearchPage;
