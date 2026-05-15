import { MapPin, Star, IndianRupee, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function CollegeCard({ college }: { college: any }) {
    return (
        <div className="group relative bg-white rounded-[24px] p-6 transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_20px_40px_-15px_rgba(37,99,235,0.15)] border border-slate-200/60 overflow-hidden flex flex-col h-full">
            {/* Subtle gradient background on hover */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 to-indigo-50/50 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
            
            <div className="relative z-10 flex-grow">
                <div className="flex justify-between items-start mb-6 gap-4">
                    <h3 className="text-xl font-bold text-slate-900 tracking-tight leading-snug group-hover:text-blue-700 transition-colors duration-300">
                        {college.name}
                    </h3>
                    <span className="shrink-0 flex items-center gap-1.5 bg-amber-50 text-amber-700 px-3 py-1.5 rounded-full text-sm font-bold border border-amber-100 shadow-sm">
                        <Star size={14} className="fill-amber-400 text-amber-400" /> {college.rating}
                    </span>
                </div>

                <div className="space-y-4 mb-8">
                    <div className="flex items-center gap-3 text-slate-600 text-sm font-medium">
                        <div className="p-2 bg-slate-50 rounded-xl border border-slate-100 text-slate-500 group-hover:bg-blue-50 group-hover:text-blue-500 group-hover:border-blue-100 transition-colors">
                            <MapPin size={16} />
                        </div>
                        <span className="leading-snug">{college.location}</span>
                    </div>
                    <div className="flex items-center gap-3 text-slate-600 text-sm font-medium">
                        <div className="p-2 bg-emerald-50 rounded-xl border border-emerald-100 text-emerald-600 group-hover:bg-emerald-100 transition-colors">
                            <IndianRupee size={16} />
                        </div>
                        <span className="text-slate-800 font-semibold text-base">
                            {college.fees.toLocaleString()} <span className="text-slate-400 font-normal text-sm">/ year</span>
                        </span>
                    </div>
                </div>
            </div>

            <Link
                href={`/college/${college.id}`}
                className="relative z-10 flex items-center justify-center gap-2 w-full bg-slate-900 text-white py-3.5 rounded-xl font-semibold hover:bg-blue-600 hover:shadow-lg hover:shadow-blue-600/25 transition-all duration-300 group/btn"
            >
                View Details
                <ArrowRight size={18} className="transition-transform duration-300 group-hover/btn:translate-x-1" />
            </Link>
        </div>
    );
}