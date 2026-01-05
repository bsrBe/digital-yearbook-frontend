
import React from 'react';
import { User } from '../types';

interface StudentCardProps {
  student: User;
  onClick: (student: User) => void;
}

const StudentCard: React.FC<StudentCardProps> = ({ student, onClick }) => {
  return (
    <div
      onClick={() => onClick(student)}
      className="group flex flex-col cursor-pointer animate-in fade-in slide-in-from-bottom-4 duration-500"
    >
      <div className="relative aspect-[3/4] rounded-[32px] overflow-hidden shadow-lg group-hover:shadow-2xl group-hover:-translate-y-2 transition-all duration-700 ease-out bg-slate-100">
        <img
          src={student.profilePhoto || 'https://ui-avatars.com/api/?name=' + encodeURIComponent(student.fullName)}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          alt={student.fullName}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
        <div className="absolute bottom-6 left-6 right-6 text-white translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
          <p className="text-sm font-bold serif line-clamp-2">"{student.quote}"</p>
        </div>
      </div>
      <div className="mt-6 text-center">
        <h3 className="text-xl font-bold text-slate-900 serif group-hover:text-rose-500 transition-colors">{student.fullName}</h3>
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mt-1">{student.department}</p>
      </div>
    </div>
  );
};

export default StudentCard;
