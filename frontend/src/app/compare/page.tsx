"use client";
import { useSearchParams } from 'next/navigation';
import { useEffect, useState, Suspense } from 'react';
import Link from 'next/link';
import { ArrowLeft, Check, Sparkles, AlertCircle, Trophy, Lightbulb, Briefcase, GraduationCap } from 'lucide-react';

function SmartVerdict({ colleges }: { colleges: any[] }) {
  if (colleges.length < 2) return null;

  const lowestFees = [...colleges].sort((a, b) => a.fees - b.fees)[0];
  const highestPlacement = [...colleges].sort((a, b) => b.placement_rate - a.placement_rate)[0];
  const highestRating = [...colleges].sort((a, b) => b.rating - a.rating)[0];

  return (
    <div className="mt-12 bg-white rounded-[2rem] shadow-[0_20px_40px_-15px_rgba(37,99,235,0.1)] border border-blue-100 overflow-hidden relative animate-in fade-in slide-in-from-bottom-8 duration-700 delay-300 fill-mode-both">
      <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-blue-400 via-indigo-500 to-purple-500"></div>
      <div className="p-8 md:p-12">
        <h2 className="text-3xl font-extrabold text-slate-900 mb-8 flex items-center gap-3">
          <div className="p-2 bg-indigo-50 text-indigo-600 rounded-xl shadow-sm border border-indigo-100">
            <Lightbulb size={28} className="animate-pulse" />
          </div> 
          Smart Verdict
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <div className="bg-emerald-50/50 border border-emerald-100 p-6 rounded-2xl hover:shadow-md transition-shadow">
             <div className="flex items-center gap-2 text-emerald-700 font-bold mb-3 uppercase tracking-wider text-xs"><Trophy size={16} /> Most Affordable</div>
             <p className="text-slate-800 font-extrabold text-xl leading-tight">{lowestFees.name}</p>
             <p className="text-emerald-600 font-semibold mt-3 text-lg">Only ₹{lowestFees.fees.toLocaleString()}/yr</p>
          </div>
          <div className="bg-blue-50/50 border border-blue-100 p-6 rounded-2xl hover:shadow-md transition-shadow">
             <div className="flex items-center gap-2 text-blue-700 font-bold mb-3 uppercase tracking-wider text-xs"><Briefcase size={16} /> Best Placements</div>
             <p className="text-slate-800 font-extrabold text-xl leading-tight">{highestPlacement.name}</p>
             <p className="text-blue-600 font-semibold mt-3 text-lg">{highestPlacement.placement_rate}% Success Rate</p>
          </div>
          <div className="bg-amber-50/50 border border-amber-100 p-6 rounded-2xl hover:shadow-md transition-shadow">
             <div className="flex items-center gap-2 text-amber-700 font-bold mb-3 uppercase tracking-wider text-xs"><GraduationCap size={16} /> Highest Rated</div>
             <p className="text-slate-800 font-extrabold text-xl leading-tight">{highestRating.name}</p>
             <p className="text-amber-600 font-semibold mt-3 text-lg">{highestRating.rating}/10 Overall Score</p>
          </div>
        </div>
        
        <div className="bg-slate-50 p-8 rounded-3xl border border-slate-200/60 shadow-inner relative">
          <div className="absolute top-0 left-8 -translate-y-1/2 bg-slate-800 text-white text-xs font-bold uppercase tracking-widest px-4 py-1.5 rounded-full">
            The Final Recommendation
          </div>
          <p className="text-slate-600 leading-relaxed text-lg mt-2">
            If your primary focus is keeping costs low without compromising basic standards, <strong className="text-slate-900 border-b-2 border-emerald-200">{lowestFees.name}</strong> is the smartest financial choice. 
            However, if you're aiming for the absolute best career start and job security, <strong className="text-slate-900 border-b-2 border-blue-200">{highestPlacement.name}</strong> leads the pack. 
            Weighing all factors—academics, campus life, and outcomes—<strong className="text-slate-900 border-b-2 border-amber-200">{highestRating.name}</strong> provides the most exceptional all-around experience.
          </p>
        </div>
      </div>
    </div>
  );
}

function CompareTable() {
  const searchParams = useSearchParams();
  const ids = searchParams.get('ids')?.split(',') || [];
  const [colleges, setColleges] = useState<any[]>([]);

  useEffect(() => {
    const fetchSelected = async () => {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
      const results = await Promise.all(
        ids.map(id => fetch(`${apiUrl}/api/colleges/${id}`).then(res => res.json()))
      );
      setColleges(results);
    };
    if (ids.length > 0) fetchSelected();
  }, [searchParams]);

  if (colleges.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-32">
        <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
      </div>
    );
  }

  const bestFees = Math.min(...colleges.map(c => c.fees));
  const bestPlacement = Math.max(...colleges.map(c => c.placement_rate));
  const bestRating = Math.max(...colleges.map(c => c.rating));

  return (
    <>
      <div className="animate-in fade-in slide-in-from-bottom-8 duration-700 ease-out">
        <Link href="/" className="inline-flex items-center gap-2 text-slate-500 hover:text-blue-600 mb-8 font-semibold transition-colors group">
          <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" /> Back to Search
        </Link>
        
        <div className="flex items-center gap-3 mb-10">
          <div className="p-3 bg-blue-100 rounded-2xl text-blue-600">
            <Sparkles size={28} />
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight">Side-by-Side Comparison</h1>
        </div>

        <div className="bg-white rounded-[2rem] shadow-[0_20px_40px_-15px_rgba(0,0,0,0.05)] border border-slate-200/60 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr>
                  <th className="p-8 text-slate-400 font-bold uppercase tracking-widest text-sm w-1/4 bg-slate-50/50">Feature Overview</th>
                  {colleges.map((c, index) => (
                    <th key={c.id} className={`p-8 border-l border-slate-100 min-w-[300px] ${index % 2 === 0 ? 'bg-white' : 'bg-slate-50/30'}`}>
                      <h3 className="font-extrabold text-2xl text-slate-900 leading-tight mb-2">{c.name}</h3>
                      <p className="text-slate-500 font-medium text-sm">{c.location}</p>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                
                {/* Fees Row */}
                <tr className="group transition-colors hover:bg-blue-50/30">
                  <td className="p-6 md:p-8 font-semibold text-slate-600 bg-slate-50/50 group-hover:bg-transparent">Annual Fees</td>
                  {colleges.map((c, index) => (
                    <td key={c.id} className={`p-6 md:p-8 border-l border-slate-100 ${index % 2 === 0 ? '' : 'bg-slate-50/30'} group-hover:bg-transparent`}>
                      <div className="flex items-center gap-3">
                        <span className="text-2xl font-bold text-slate-800">₹{c.fees.toLocaleString()}</span>
                        {c.fees === bestFees && (
                          <span className="inline-flex items-center gap-1 text-xs font-bold bg-emerald-100 text-emerald-700 px-2.5 py-1 rounded-full">
                            <Check size={12} /> Best Value
                          </span>
                        )}
                      </div>
                    </td>
                  ))}
                </tr>

                {/* Placement Row */}
                <tr className="group transition-colors hover:bg-blue-50/30">
                  <td className="p-6 md:p-8 font-semibold text-slate-600 bg-slate-50/50 group-hover:bg-transparent">Placement Rate</td>
                  {colleges.map((c, index) => (
                    <td key={c.id} className={`p-6 md:p-8 border-l border-slate-100 ${index % 2 === 0 ? '' : 'bg-slate-50/30'} group-hover:bg-transparent`}>
                      <div className="flex items-center gap-3">
                        <div className="w-full max-w-[120px] bg-slate-100 rounded-full h-2.5">
                          <div className="bg-blue-500 h-2.5 rounded-full" style={{ width: `${c.placement_rate}%` }}></div>
                        </div>
                        <span className="text-xl font-bold text-slate-800">{c.placement_rate}%</span>
                        {c.placement_rate === bestPlacement && (
                          <span className="inline-flex items-center gap-1 text-xs font-bold bg-blue-100 text-blue-700 px-2.5 py-1 rounded-full">
                            <Check size={12} /> Top
                          </span>
                        )}
                      </div>
                    </td>
                  ))}
                </tr>

                {/* Rating Row */}
                <tr className="group transition-colors hover:bg-blue-50/30">
                  <td className="p-6 md:p-8 font-semibold text-slate-600 bg-slate-50/50 group-hover:bg-transparent">Overall Rating</td>
                  {colleges.map((c, index) => (
                    <td key={c.id} className={`p-6 md:p-8 border-l border-slate-100 ${index % 2 === 0 ? '' : 'bg-slate-50/30'} group-hover:bg-transparent`}>
                      <div className="flex items-center gap-3">
                        <span className="text-2xl font-black text-slate-900">{c.rating}</span>
                        <span className="text-slate-400 font-medium">/ 10</span>
                        {c.rating === bestRating && (
                          <span className="inline-flex items-center gap-1 text-xs font-bold bg-amber-100 text-amber-700 px-2.5 py-1 rounded-full ml-2">
                            ★ Highest
                          </span>
                        )}
                      </div>
                    </td>
                  ))}
                </tr>

              </tbody>
            </table>
          </div>
          
          <div className="bg-slate-50 p-6 border-t border-slate-100 flex items-center gap-3 text-slate-500 text-sm font-medium">
            <AlertCircle size={16} className="text-blue-500" /> This data is automatically compiled based on recent statistics.
          </div>
        </div>
      </div>

      <SmartVerdict colleges={colleges} />
    </>
  );
}

export default function ComparePage() {
  return (
    <div className="min-h-screen bg-slate-50/50 py-16 px-6 font-sans">
      <div className="max-w-7xl mx-auto">
        <Suspense fallback={
          <div className="flex flex-col items-center justify-center py-32">
            <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
          </div>
        }>
          <CompareTable />
        </Suspense>
      </div>
    </div>
  );
}
