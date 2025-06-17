import React, { useState } from 'react';
import { searchFlights } from '../services/flightService';

const SearchFlights: React.FC = () => {
  const [formData, setFormData] = useState({
    route: '',
    date: '',
    class_type: '',
  });

  const [results, setResults] = useState<any[]>([]);
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      const flights = await searchFlights(formData);
      setResults(flights);
    } catch (err: any) {
      setError('Failed to fetch flights. Make sure you are logged in.');
    }
  };

  return (
    <div className="p-4 max-w-3xl mx-auto">
      <h2 className="text-xl font-bold mb-4">🔍 Search Flights</h2>
      
      <form onSubmit={handleSearch} className="space-y-4">
        <input
          type="text"
          name="route"
          placeholder="Enter Route (e.g. Nairobi-Mombasa)"
          value={formData.route}
          onChange={handleChange}
          required
          className="w-full border rounded p-2"
        />
        <input
          type="date"
          name="date"
          value={formData.date}
          onChange={handleChange}
          className="w-full border rounded p-2"
        />
        <select
          name="class_type"
          value={formData.class_type}
          onChange={handleChange}
          className="w-full border rounded p-2"
        >
          <option value="">Select Class (optional)</option>
          <option value="Economy">Economy</option>
          <option value="Business">Business</option>
        </select>

        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
          Search Flights
        </button>
      </form>

      {error && <p className="text-red-500 mt-4">{error}</p>}

      {results.length > 0 && (
        <div className="mt-6">
          <h3 className="text-lg font-semibold mb-2">✈️ Results:</h3>
          <ul className="space-y-3">
            {results.map((flight, idx) => (
              <li key={idx} className="border p-4 rounded shadow">
                <p><strong>Flight:</strong> {flight.flight_number}</p>
                <p><strong>Route:</strong> {flight.route}</p>
                <p><strong>Date:</strong> {flight.flight_date}</p>
                <p><strong>Time:</strong> {flight.flight_time}</p>
                <p><strong>Class:</strong> {flight.flight_class}</p>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default SearchFlights;

