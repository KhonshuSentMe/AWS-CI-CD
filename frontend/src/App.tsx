import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [message, setMessage] = useState('');
  const [timestamp, setTimestamp] = useState('');

  const apiUrl = process.env.REACT_APP_API_URL || 'http://54.145.41.109:3001/api';

  useEffect(() => {
    console.log('API URL:', apiUrl);

    fetch(`${apiUrl}/message`)
      .then(res => res.json())
      .then(resData => {
        console.log('Message response:', resData);
        setMessage(resData.text);
      })
      .catch(err => console.error('Error fetching message:', err));

    fetch(`${apiUrl}/data`)
      .then(res => res.json())
      .then(resData => {
        console.log('Data response:', resData);

        if (Array.isArray(resData) && resData.length > 0) {
          setTimestamp(resData[0].timestamp || resData[0].now || '');
        } else {
          setTimestamp(resData.timestamp || resData.now || '');
        }
      })
      .catch(err => console.error('Error fetching data:', err));
  }, [apiUrl]);

  return (
    <div className="App">
      <header className="App-header">
        <h1>Cloud Infrastructure Project</h1>
        <p>Message from backend: {message}</p>

        <h2>Data from Database:</h2>
        <p>{timestamp}</p>
      </header>
    </div>
  );
}

export default App;