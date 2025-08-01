import React, { useState } from 'react';
import axios, { AxiosError } from 'axios';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';

interface ScanResult {
  url: string;
  top_words: [string, number][];
  scanned_at: string;
}

const UrlInput: React.FC = () => {
  const [url, setUrl] = useState('');
  const [result, setResult] = useState<ScanResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);
    setError(null);

    try {
      const response = await axios.post<ScanResult>(
        'http://127.0.0.1:8000/analyze-url',
        { url }
      );
      setResult(response.data);
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        const serverMessage = err.response?.data?.detail || 'Server error';
        setError(serverMessage);
      } else {
        setError('Unexpected error');
      }
    } finally {
      setLoading(false);
    }
  };

  const chartData =
    result?.top_words.map(([word, count]) => ({
      word,
      count,
    })) || [];

  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'flex-start',
      paddingTop: '80px',
      minHeight: '100vh',
      backgroundColor: '#f0f0f0',
    }}>
      <div style={{
        padding: '40px 50px',
        background: '#fff',
        borderRadius: '10px',
        boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
        minWidth: '600px',
      }}>
        <h2>Enter a URL</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://example.com"
            style={{
              padding: '10px',
              width: '100%',
              marginBottom: '20px',
              borderRadius: '5px',
              border: '1px solid #ccc',
            }}
            required
          />
          <button
            type="submit"
            style={{
              padding: '10px 20px',
              borderRadius: '5px',
              backgroundColor: '#007bff',
              color: '#fff',
              border: 'none',
              cursor: 'pointer',
            }}
          >
            {loading ? 'Analyzing...' : 'Submit'}
          </button>
        </form>

        {error && (
          <div style={{ color: 'red', marginTop: '20px' }}>
            <strong>Error:</strong> {error}
          </div>
        )}

        {result && (
          <div style={{ marginTop: '30px', textAlign: 'left' }}>
            <h3>Top 5 Words Chart</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart
                data={chartData}
                margin={{ top: 20, right: 30, left: 0, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="word" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="count" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>

            <p style={{ marginTop: '20px' }}>
              <strong>Scanned At:</strong>{' '}
              {new Date(result.scanned_at).toLocaleString()}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default UrlInput;
