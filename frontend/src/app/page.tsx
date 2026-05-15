"use client";
import { useEffect, useState } from 'react';
import CollegeCard from '@/components/CollegeCard';
import { Search, Scale, Sparkles } from 'lucide-react';
import Link from 'next/link';

export default function CollegeListing() {
  const [colleges, setColleges] = useState([]);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [compareList, setCompareList] = useState<any[]>([]);

  useEffect(() => {
    const fetchColleges = async () => {
      setLoading(true);
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
        const res = await fetch(`${apiUrl}/api/colleges?search=${query}`);
        const data = await res.json();
        setColleges(data);
      } catch (error) {
        console.error("Failed to fetch colleges", error);
      } finally {
        setLoading(false);
      }
    };

    const timeoutId = setTimeout(() => fetchColleges(), 300);
    return () => clearTimeout(timeoutId);
  }, [query]);

  const toggleCompare = (college: any) => {
    if (compareList.find(c => c.id === college.id)) {
      setCompareList(compareList.filter(c => c.id !== college.id));
    } else if (compareList.length < 3) {
      setCompareList([...compareList, college]);
    } else {
      alert("You can only compare up to 3 colleges at a time!");
    }
  };

  return (
    <div className="bg-slate-50 min-h-screen pb-32 font-sans selection:bg-blue-500/30">
      {/* Premium Hero Section */}
      <section className="relative bg-[#0B1120] py-28 px-4 text-center overflow-hidden border-b border-white/10">
        {/* Glowing Orbs Background */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -left-40 w-96 h-96 bg-blue-600 rounded-full mix-blend-screen filter blur-[100px] opacity-40 animate-pulse"></div>
          <div className="absolute top-20 -right-20 w-80 h-80 bg-indigo-500 rounded-full mix-blend-screen filter blur-[100px] opacity-30"></div>
        </div>

        <div className="relative z-10 max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-blue-300 text-sm font-semibold tracking-wide mb-8 backdrop-blur-md">
            <Sparkles size={16} className="text-blue-400" /> Discover Excellence
          </div>
          <h1 className="text-5xl md:text-7xl font-extrabold text-white tracking-tight mb-6 leading-[1.1]">
            Find Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400">Perfect Fit</span>
          </h1>
          <p className="text-slate-400 text-lg md:text-xl mb-12 max-w-2xl mx-auto font-light leading-relaxed">
            Explore, compare, and choose from the best colleges that align seamlessly with your career aspirations and goals.
          </p>

          {/* Glassmorphic Search Bar */}
          <div className="max-w-2xl mx-auto relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-2xl blur opacity-25 group-hover:opacity-40 transition duration-1000 group-hover:duration-200"></div>
            <div className="relative bg-white/10 backdrop-blur-2xl border border-white/20 p-2 rounded-2xl flex items-center shadow-2xl transition-all duration-300 focus-within:bg-white/15">
              <div className="pl-5 pr-3 text-slate-400 group-focus-within:text-blue-400 transition-colors"><Search size={24} /></div>
              <input
                type="text"
                className="w-full bg-transparent p-4 text-white placeholder-slate-400 outline-none text-lg font-medium tracking-wide"
                placeholder="Search by college name or city..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 mt-16 relative z-10">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-32 opacity-60">
            <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mb-4"></div>
            <p className="text-slate-500 font-medium tracking-wide">Curating colleges...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {colleges.map((college: any) => (
              <div key={college.id} className="relative flex flex-col h-full group/wrapper">
                <CollegeCard college={college} />
                <button 
                  onClick={() => toggleCompare(college)}
                  className={`mt-4 w-full py-3 rounded-xl text-sm font-bold tracking-wide transition-all duration-300 border-2 ${
                    compareList.find(c => c.id === college.id) 
                    ? "bg-emerald-50 border-emerald-500 text-emerald-700 shadow-sm shadow-emerald-500/20" 
                    : "bg-transparent border-slate-200 text-slate-500 hover:border-blue-300 hover:text-blue-600 hover:bg-blue-50"
                  }`}
                >
                  {compareList.find(c => c.id === college.id) ? "✓ Selected for Comparison" : "+ Add to Compare"}
                </button>
              </div>
            ))}
          </div>
        )}

        {!loading && colleges.length === 0 && (
          <div className="text-center py-32">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-slate-100 text-slate-400 mb-4">
              <Search size={32} />
            </div>
            <h3 className="text-2xl font-bold text-slate-800 mb-2">No matches found</h3>
            <p className="text-slate-500">Try adjusting your search terms or filters.</p>
          </div>
        )}
      </main>

      {/* Floating Premium Compare Tray */}
      {compareList.length > 0 && (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 w-[95%] max-w-4xl bg-[#0B1120]/80 backdrop-blur-3xl border border-white/10 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.5)] p-4 rounded-2xl z-50 animate-in slide-in-from-bottom-16 fade-in duration-500 ease-out">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6 px-4">
            <div className="flex items-center gap-6">
              <div className="flex flex-col">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Comparison Tray</span>
                <p className="font-bold text-white text-lg">{compareList.length}/3 Selected</p>
              </div>
              <div className="hidden md:flex gap-3">
                {compareList.map(c => (
                  <div key={c.id} className="bg-white/5 border border-white/10 text-slate-200 px-4 py-2 rounded-xl text-sm font-medium shadow-inner flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-blue-400 animate-pulse"></div>
                    <span className="max-w-[120px] truncate">{c.name}</span>
                  </div>
                ))}
              </div>
            </div>
            <Link 
              href={{ pathname: '/compare', query: { ids: compareList.map(c => c.id).join(',') } }}
              className="group bg-white text-[#0B1120] px-8 py-3.5 rounded-xl flex items-center gap-2 hover:bg-blue-50 font-extrabold shadow-[0_0_20px_rgba(255,255,255,0.1)] transition-all hover:scale-105 shrink-0"
            >
              <Scale size={20} className="group-hover:-rotate-12 transition-transform duration-300" /> 
              Compare Now
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}