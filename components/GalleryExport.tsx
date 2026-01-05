import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';

interface Student {
    id: string;
    fullName: string;
    profilePhoto: string;
    quote: string;
    department: string;
    studentId: string;
}

interface GalleryExportProps {
    students: Student[];
    onClose: () => void;
}

const GalleryExport: React.FC<GalleryExportProps> = ({ students, onClose }) => {
    useEffect(() => {
        // Auto-trigger print dialog after a short delay to ensure rendering
        const timer = setTimeout(() => {
            window.print();
        }, 800);

        // Add a body class to help with print isolation
        document.body.classList.add('is-printing-yearbook');

        return () => {
            clearTimeout(timer);
            document.body.classList.remove('is-printing-yearbook');
        };
    }, []);

    const content = (
        <div className="fixed inset-0 z-[99999] bg-white overflow-auto yearbook-export-portal">
            {/* Screen View - Close Button */}
            <div className="print:hidden fixed top-8 right-8 z-[100000]">
                <button
                    onClick={onClose}
                    className="bg-slate-900 text-white px-10 py-5 rounded-[24px] font-bold hover:bg-slate-800 transition-all shadow-2xl flex items-center gap-3 hover:-translate-y-1 active:scale-95 border border-white/10"
                >
                    <span className="text-xl">✕</span> Close Preview
                </button>
            </div>

            {/* Export Content */}
            <div className="max-w-[1200px] mx-auto p-20 print:p-0 print:m-0 print:max-w-none export-content-wrapper">
                {/* Cover Page */}
                <div className="flex flex-col justify-center items-center h-screen print:h-screen print:flex text-center print:mb-0 yearbook-cover-page">
                    <div className="mb-12">
                        <div className="inline-block px-8 py-3 bg-slate-900 text-white rounded-2xl mb-12 font-bold tracking-[0.3em] uppercase text-sm print:bg-black">
                            Memories Forever
                        </div>
                        <h1 className="text-[10rem] font-bold text-slate-900 serif mb-8 print:text-[8rem] leading-[0.8]">
                            Class <span className="block text-slate-300 print:text-slate-400">of 2025</span>
                        </h1>
                        <div className="w-64 h-2 bg-rose-500 mx-auto mt-16 mb-12"></div>
                        <p className="text-4xl text-slate-400 font-light serif italic">Digital Alumni Network</p>
                    </div>
                    <div className="mt-32 text-slate-300 uppercase tracking-[0.6em] font-black text-xs">
                        {students.length} GRADUATES • THE LEGACY CONTINUES
                    </div>
                </div>

                {/* Student Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-20 print:grid-cols-3 print:gap-x-12 print:gap-y-20 print:pt-24 print:px-4 student-grid-wrapper">
                    {students.map((student) => (
                        <div
                            key={student.id}
                            className="text-center space-y-6 student-card-export print:break-inside-avoid print:mb-12"
                        >
                            {/* Photo */}
                            <div className="aspect-[3/4] rounded-[60px] overflow-hidden shadow-[0_40px_80px_-15px_rgba(0,0,0,0.2)] bg-slate-50 print:shadow-none print:border print:border-slate-100 relative group">
                                <img
                                    src={student.profilePhoto || `https://ui-avatars.com/api/?name=${encodeURIComponent(student.fullName)}&size=600`}
                                    alt={student.fullName}
                                    className="w-full h-full object-cover grayscale-[0.2] transition-all duration-700"
                                    crossOrigin="anonymous"
                                />
                            </div>

                            <div className="space-y-3">
                                <p className="text-[10px] text-rose-500 uppercase tracking-[0.4em] font-black print:text-[9px]">
                                    Graduate • {student.department}
                                </p>
                                <h3 className="font-bold text-slate-900 text-3xl serif leading-tight print:text-2xl">
                                    {student.fullName}
                                </h3>
                            </div>

                            {/* Quote */}
                            {student.quote && (
                                <div className="relative px-8">
                                    <span className="absolute -top-4 left-0 text-6xl text-slate-100 serif font-black select-none print:text-slate-200">"</span>
                                    <p className="text-lg text-slate-500 italic leading-relaxed print:text-sm print:line-clamp-none relative z-10">
                                        {student.quote}
                                    </p>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>

            {/* Force print to only show this portal */}
            <style>{`
                @media print {
                    /* EXTREME ISOLATION: Hide everything that isn't the portal */
                    body > * {
                        display: none !important;
                    }
                    
                    body > .yearbook-export-portal {
                        display: block !important;
                        position: static !important;
                        visibility: visible !important;
                        opacity: 1 !important;
                    }

                    @page {
                        size: A4;
                        margin: 0; /* Full bleed control */
                    }
                    
                    body {
                        background-color: white !important;
                        margin: 0 !important;
                        padding: 0 !important;
                        box-sizing: border-box !important;
                        -webkit-print-color-adjust: exact !important;
                        print-color-adjust: exact !important;
                    }* { box-sizing: inherit !important; }

                    .export-content-wrapper {
                        padding: 0 !important;
                        margin: 0 !important;
                    }

                    .yearbook-cover-page {
                        height: 100vh !important;
                        width: 100vw !important;
                        display: flex !important;
                        flex-direction: column !important;
                        justify-content: center !important;
                        align-items: center !important;
                        margin: 0 !important;
                        padding: 2cm !important;
                        break-after: page;
                        page-break-after: always;
                    }

                    .student-grid-wrapper {
                        padding: 2cm !important;
                        width: 100% !important;
                    }

                    .student-card-export {
                        break-inside: avoid;
                        page-break-inside: avoid;
                    }

                    /* Reset all interactive colors to black for best print quality */
                    h1, h2, h3, p {
                        color: black !important;
                    }
                    
                    .text-slate-300, .text-slate-400 {
                        color: #94a3b8 !important; /* Keep some gray for aesthetic */
                    }

                    .text-rose-500 {
                        color: #f43f5e !important;
                    }
                }

                /* Custom scrollbar for preview */
                .yearbook-export-portal {
                    scrollbar-width: thin;
                    scrollbar-color: #0f172a transparent;
                }
                .yearbook-export-portal::-webkit-scrollbar {
                    width: 6px;
                }
                .yearbook-export-portal::-webkit-scrollbar-thumb {
                    background: #0f172a;
                    border-radius: 10px;
                }
            `}</style>
        </div>
    );

    return createPortal(content, document.body);
};

export default GalleryExport;
