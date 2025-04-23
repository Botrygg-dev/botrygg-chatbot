import { useEffect, useState } from 'react';
import React from 'react';
export default function AdminLogViewer() {
  const [logs, setLogs] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetchLogs = async () => {
      const res = await fetch("/chat-log.json");
      const data = await res.json();
      setLogs(data.reverse());
    };
    fetchLogs();
  }, []);

  const filtered = logs.filter(log =>
    log.question.toLowerCase().includes(search.toLowerCase()) ||
    log.answer.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div style={{ maxWidth: 800, margin: '0 auto' }}>
      <h1>Adminpanel – Loggar</h1>
      <input
        type="text"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Sök i loggar..."
        style={{ width: '100%', marginBottom: 20 }}
      />
      <div>
        {filtered.map((log, idx) => (
          <div key={idx} style={{ marginBottom: 15, padding: 10, border: '1px solid #ddd', borderRadius: 8 }}>
            <div><strong>Fråga:</strong> {log.question}</div>
            <div><strong>Svar:</strong> {log.answer}</div>
            <div style={{ fontSize: 12, color: '#888' }}>{new Date(log.timestamp).toLocaleString()}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
