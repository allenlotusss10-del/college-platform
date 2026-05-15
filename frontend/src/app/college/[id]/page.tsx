"use client";
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { MapPin, IndianRupee, GraduationCap, Briefcase, Star, ArrowLeft, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';

export default function CollegeDetailPage() {
  const params = useParams();
  const [college, setCollege] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCollege = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/colleges/${params.id}`);
        const data = await res.json();
        setCollege(data);
      } catch (error) {
        console.error("Error fetching college details:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchCollege();
  }, [params.id]);

  if (loading) return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center">
      <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mb-4"></div>
      <p className="text-slate-500 font-medium tracking-wide">Loading college details...</p>
    </div>
  );
  
  if (!college) return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center">
      <div className="bg-white p-10 rounded-3xl shadow-xl text-center max-w-md">
        <h2 className="text-2xl font-bold text-slate-800 mb-4">College Not Found</h2>
        <Link href="/" className="text-blue-600 font-semibold hover:underline">← Return Home</Link>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      {/* Premium Header Banner */}
      <div className="relative bg-[#0B1120] text-white pt-12 pb-32 px-6 overflow-hidden">
        {/* Background glow */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-96 h-96 bg-blue-600 rounded-full mix-blend-screen filter blur-[120px] opacity-30"></div>
        </div>

        <div className="max-w-6xl mx-auto relative z-10">
          <Link href="/" className="inline-flex items-center gap-2 text-slate-400 hover:text-white mb-10 font-medium transition-colors group">
            <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" /> Back to Search
          </Link>
          
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8">
            <div className="max-w-3xl">
              <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight mb-4 leading-tight">{college.name}</h1>
              <div className="flex flex-wrap items-center gap-6 text-slate-300 font-medium text-lg">
                <p className="flex items-center gap-2">
                  <MapPin size={20} className="text-blue-400" /> {college.location}
                </p>
                <div className="w-1.5 h-1.5 rounded-full bg-slate-600 hidden md:block"></div>
                <p className="text-slate-400">Est. 1990 (Mock Data)</p>
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-xl border border-white/20 p-6 rounded-3xl text-center shrink-0 shadow-2xl">
              <div className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-2">Overall Rating</div>
              <div className="text-5xl font-black flex items-center justify-center gap-2">
                {college.rating} <Star size={32} className="fill-amber-400 text-amber-400 mb-1" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area (Pulled up over the banner) */}
      <main className="max-w-6xl mx-auto px-6 -mt-16 relative z-20 grid grid-cols-1 md:grid-cols-12 gap-8">
        
        {/* Sidebar Info */}
        <div className="md:col-span-4 space-y-6">
          <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-200/60 hover:shadow-lg transition-shadow duration-300">
            <div className="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center mb-6 border border-emerald-100">
              <IndianRupee size={24} className="text-emerald-600" />
            </div>
            <h3 className="text-slate-500 font-semibold mb-1 tracking-wide uppercase text-sm">Fees Structure</h3>
            <p className="text-4xl font-extrabold text-slate-900 mb-2">₹{college.fees.toLocaleString()}</p>
            <p className="text-slate-400 text-sm font-medium">Average annual tuition fee</p>
          </div>

          <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-200/60 hover:shadow-lg transition-shadow duration-300">
            <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center mb-6 border border-blue-100">
              <Briefcase size={24} className="text-blue-600" />
            </div>
            <h3 className="text-slate-500 font-semibold mb-1 tracking-wide uppercase text-sm">Placements</h3>
            <p className="text-4xl font-extrabold text-slate-900 mb-2">{college.placement_rate}%</p>
            <p className="text-slate-400 text-sm font-medium">Placement success rate</p>
          </div>
        </div>

        {/* Main Details */}
        <div className="md:col-span-8 space-y-8">
          <div className="bg-white p-10 rounded-3xl shadow-sm border border-slate-200/60">
            <h2 className="text-2xl font-extrabold text-slate-900 mb-6">About the Institute</h2>
            <p className="text-slate-600 leading-loose text-lg font-light">{college.basic_info}</p>
          </div>

          <div className="bg-white p-10 rounded-3xl shadow-sm border border-slate-200/60">
            <h2 className="text-2xl font-extrabold text-slate-900 mb-8 flex items-center gap-3">
              <div className="p-2 bg-indigo-50 rounded-xl text-indigo-600"><GraduationCap size={24} /></div>
              Courses Offered
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {college.courses?.map((course: string, index: number) => (
                <div key={index} className="flex items-start gap-3 p-4 rounded-2xl bg-slate-50 border border-slate-100 hover:border-blue-200 hover:bg-blue-50/50 transition-colors">
                  <CheckCircle2 className="text-blue-500 shrink-0 mt-0.5" size={20} />
                  <span className="font-semibold text-slate-700">{course}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

      </main>
    </div>
  );
}
