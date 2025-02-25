'use client';

import { useState } from 'react';

export default function JobForm() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/jobs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, description }),
      });
      
      if (!response.ok) throw new Error('Failed to submit job');
      
      setTitle('');
      setDescription('');
      alert('Job posted successfully!');
    } catch (error) {
      console.error(error);
      alert('Error posting job');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-2xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Post a New Job</h2>
      <div>
        <label className="block mb-2">Job Title</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full p-2 border rounded"
          required
        />
      </div>
      <div>
        <label className="block mb-2">Job Description</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full p-2 border rounded h-32"
          required
        />
      </div>
      <button
        type="submit"
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
      >
        Post Job
      </button>
    </form>
  );
} 