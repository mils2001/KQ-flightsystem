import React, { useState } from 'react';
import { searchFlights } from '../services/flightService';

interface Flight {
  id: number;
  flight_number: string;
  route: string;
  flight_class: string;
  flight_date: string;
  flight_time: string;
  price: number;
}

const SearchFlights: React.FC = () => {
  const [route, setRoute] = useState('');
  const [date, setDate] = useState('');
  const [classType, setClassType] = useState('');
  const [flights, setFlights] = useState<Flight[]>([]);
  const [error, setError] = useState('');

  const handleSearch = async () => {
    try {
      const data = await searchFlights({ route, date, class_type: classType });
      setFlights(data);
      setError('');
    } catch (err: any) {
      console.error(err);
      setError('Failed to fetch flights. Please check your token or try again.');
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold mb-4">Search Flights</h2>

      <div className="space-y-3 mb-4">
        <input
          type="text"
          placeholder="Route (e.g., Nairobi-Mombasa)"
          value={route}
          onChange={(e) => setRoute(e.target.value)}
          className="border p-2 w-full rounded"
        />

        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="border p-2 w-full rounded"
        />

        <select
          value={classType}
          onChange={(e) => setClassType(e.target.value)}
          className="border p-2 w-full rounded"
        >
          <option value="">Select Class</option>
          <option value="Economy">Economy</option>
          <option value="Business">Business</option>
        </select>

        <button
          onClick={handleSearch}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Search
        </button>
      </div>

      {error && <p className="text-red-500">{error}</p>}

      {flights.length > 0 && (
        <table className="w-full border mt-4">
          <thead>
            <tr className="bg-gray-200">
              <th className="p-2 border">Flight Number</th>
              <th className="p-2 border">Route</th>
              <th className="p-2 border">Class</th>
              <th className="p-2 border">Date</th>
              <th className="p-2 border">Time</th>
              <th className="p-2 border">Price</th>
            </tr>
          </thead>
          <tbody>
            {flights.map((flight) => (
              <tr key={flight.id} className="text-center">
                <td className="p-2 border">{flight.flight_number}</td>
                <td className="p-2 border">{flight.route}</td>
                <td className="p-2 border">{flight.flight_class}</td>
                <td className="p-2 border">{flight.flight_date}</td>
                <td className="p-2 border">{flight.flight_time}</td>
                <td className="p-2 border">{flight.price}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default SearchFlights;

