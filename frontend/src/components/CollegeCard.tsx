import { MapPin, Star, IndianRupee } from 'lucide-react';
import Link from 'next/link';

export default function CollegeCard({ college }: { college: any }) {
    return (
        <div className="bg-white border border-slate-200 rounded-xl p-5 hover:shadow-lg transition-all group">
            <div className="flex justify-between items-start mb-4">
                <h3 className="text-xl font-bold text-slate-800">{college.name}</h3>
                <span className="flex items-center gap-1 bg-yellow-100 text-yellow-700 px-2 py-1 rounded-md text-sm font-bold">
                    <Star size={14} fill="currentColor" /> {college.rating}
                </span>
            </div>

            <div className="space-y-2 mb-6">
                <div className="flex items-center gap-2 text-slate-600">
                    <MapPin size={16} /> <span>{college.location}</span>
                </div>
                <div className="flex items-center gap-2 text-slate-600">
                    <IndianRupee size={16} /> <span>{college.fees.toLocaleString()} / year</span>
                </div>
            </div>

            <Link
                href={`/college/${college.id}`}
                className="block text-center w-full bg-blue-600 text-white py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors"
            >
                View Details
            </Link>
        </div>
    );
}