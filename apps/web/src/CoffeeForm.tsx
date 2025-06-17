import { useState, useEffect } from 'react';

const baseUrl = import.meta.env.VITE_API_URL;

interface Coffee {
  requesterName: string;
  requesterEmail: string;
  requestedTime: string;
  requestedLocation: 'Longworth' | 'Rayburn' | 'Cannon';
}

export default function CoffeeForm() {
  const [formData, setFormData] = useState<Coffee>({
    requesterName: '',
    requesterEmail: '',
    requestedTime: '',
    requestedLocation: 'Longworth'
  });

  const [coffees, setCoffees] = useState<Coffee[]>([]);

  useEffect(() => {
    fetch(`${baseUrl}/api/coffees`)
      .then(res => res.json())
      .then(setCoffees);
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch(`${baseUrl}/api/coffees`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({...formData, requestedTime: new Date(formData.requestedTime).toISOString()})
    });

    if (res.ok) {
      const newCoffee = await res.json();
      setCoffees(prev => [newCoffee, ...prev]);
      setFormData({ requesterName: '', requesterEmail: '', requestedTime: '', requestedLocation: 'Longworth' });
    } else {
      alert('Error submitting coffee request');
    }
  };

  return (
    <div>
      <h2>Request a Coffee</h2>
      <form onSubmit={handleSubmit}>
        <input name="requesterName" placeholder="Your Name" value={formData.requesterName} onChange={handleChange} required />
        <input name="requesterEmail" placeholder="Your Email" value={formData.requesterEmail} onChange={handleChange} required />
        <input name="requestedTime" type="datetime-local" value={formData.requestedTime} onChange={handleChange} required />
        <select name="requestedLocation" value={formData.requestedLocation} onChange={handleChange}>
          <option value="Longworth">Longworth</option>
          <option value="Rayburn">Rayburn</option>
          <option value="Cannon">Cannon</option>
        </select>
        <button type="submit">Submit</button>
      </form>

      <h3>Scheduled Coffees</h3>
      <ul>
        {coffees.map((c, i) => (
          <li key={i}>
            {c.requesterName} – {c.requestedLocation} at {new Date(c.requestedTime).toLocaleString()}
          </li>
        ))}
      </ul>
    </div>
  );
}
