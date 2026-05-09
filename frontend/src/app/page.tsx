"use client";
import { useEffect, useState } from 'react';
import CollegeCard from '@/components/CollegeCard';
import { Search } from 'lucide-react';

export default function CollegeListing() {
  const [colleges, setColleges] = useState([]);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchColleges = async () => {
      setLoading(true);
      try {
        const res = await fetch(`http://localhost:5000/api/colleges?search=${query}`);
        const data = await res.json();
        setColleges(data);
      } catch (error) {
        console.error("Failed to fetch colleges", error);
      } finally {
        setLoading(false);
      }
    };

    // Debouncing: Wait 300ms after user stops typing before calling API
    const timeoutId = setTimeout(() => fetchColleges(), 300);
    return () => clearTimeout(timeoutId);
  }, [query]);

  return (
    <div className="bg-gray-50 min-h-screen pb-20">
      {/* Hero Section with Search */}
      <section className="bg-blue-700 py-16 px-4 text-center text-white">
        <h1 className="text-4xl font-bold mb-4">Discover Your Future College</h1>
        <div className="max-w-2xl mx-auto relative">
          <Search className="absolute left-4 top-3.5 text-gray-400" size={20} />
          <input
            type="text"
            className="w-full p-4 pl-12 rounded-full text-gray-900 outline-none focus:ring-4 focus:ring-blue-300 transition"
            placeholder="Search by name (e.g. Pioneer)..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
      </section>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 mt-10">
        {loading ? (
          <div className="text-center py-20 text-gray-500">Loading colleges...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {colleges.map((college: any) => (
              <CollegeCard key={college.id} college={college} />
            ))}
          </div>
        )}

        {!loading && colleges.length === 0 && (
          <div className="text-center py-20">
            <p className="text-xl text-gray-500">No colleges found. Try a different search!</p>
          </div>
        )}
      </main>
    </div>
  );
}