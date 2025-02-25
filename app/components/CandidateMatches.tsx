'use client';

import { useState } from 'react';

interface Candidate {
  score: number;
  candidate: {
    name: string;
    email: string;
    linkedin: string;
    skills: string;
    profile: string;
  };
  feedback: string;
}

export default function CandidateMatches() {
  const [jobId, setJobId] = useState('');
  const [matches, setMatches] = useState<Candidate[]>([]);
  const [loading, setLoading] = useState(false);

  const findMatches = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await fetch('/api/match', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ jobId }),
      });
      
      if (!response.ok) throw new Error('Failed to fetch matches');
      
      const data = await response.json();
      setMatches(data.matches);
    } catch (error) {
      console.error(error);
      alert('Error finding matches');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      <form onSubmit={findMatches} className="mb-8">
        <div className="flex gap-4">
          <input
            type="text"
            value={jobId}
            onChange={(e) => setJobId(e.target.value)}
            placeholder="Enter Job ID"
            className="flex-1 p-2 border rounded"
          />
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            disabled={loading}
          >
            {loading ? 'Finding...' : 'Find Matches'}
          </button>
        </div>
      </form>

      <div className="space-y-6">
        {matches.map((match, index) => (
          <div key={index} className="border rounded p-4">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-xl font-bold">{match.candidate.name}</h3>
                <p className="text-gray-600">{match.candidate.email}</p>
                <a href={match.candidate.linkedin} className="text-blue-500 hover:underline">
                  LinkedIn Profile
                </a>
              </div>
              <div className="text-right">
                <span className="text-2xl font-bold">
                  {(match.score * 100).toFixed(1)}%
                </span>
                <p className="text-gray-600">Match Score</p>
              </div>
            </div>
            <div className="prose max-w-none">
              <h4 className="font-bold">Skills</h4>
              <p>{match.candidate.skills}</p>
              <h4 className="font-bold mt-4">AI Feedback</h4>
              <p className="whitespace-pre-line">{match.feedback}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 