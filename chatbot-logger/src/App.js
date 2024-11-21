import React, { useState, useEffect } from 'react';

function App() {
  const [logs, setLogs] = useState([]);

  // Fetch logs from the backend
  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const response = await fetch('https://maurya-backend.onrender.com/logs'); // Backend URL
        const data = await response.json();
        setLogs(data);
      } catch (error) {
        console.error('Error fetching logs:', error);
      }
    };

    fetchLogs();
  }, []);

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1>Chatbot Logs</h1>
      {logs.length === 0 ? (
        <p>No logs available yet...</p>
      ) : (
        <table border="1" style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <th>User Query</th>
              <th>Intent</th>
              <th>Parameters</th>
              <th>Bot Response</th>
            </tr>
          </thead>
          <tbody>
            {logs.map((log, index) => (
              <tr key={index}>
                <td>{log.userQuery}</td>
                <td>{log.intent}</td>
                <td>
                  <pre>{JSON.stringify(log.parameters, null, 2)}</pre>
                </td>
                <td>{log.botResponse}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default App;
