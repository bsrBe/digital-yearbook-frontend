import React, { useState } from 'react';
import { Camera, Save, ExternalLink, MessageSquareQuote, Heart } from 'lucide-react';
import { userApi } from '../services/api';

interface User {
  _id?: string;
  id?: string;
  fullName: string;
  department: string;
  studentId: string;
  graduationYear: number;
  profilePhoto: string;
  quote: string;
  bio: string;
  rememberMeFor: string;
  hobbies: string[];
  achievements: string[];
  phoneNumber?: string;
  telegram?: string;
  instagram?: string;
  twitter?: string;
}

interface ProfileEditorProps {
  user: User;
  onSave: (updatedUser: User) => void;
}

const ProfileEditor: React.FC<ProfileEditorProps> = ({ user, onSave }) => {
  const [formData, setFormData] = useState<User>({ ...user });
  const [saving, setSaving] = useState(false);

  const updateField = (field: keyof User, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await userApi.updateMe({
        quote: formData.quote,
        bio: formData.bio,
        rememberMeFor: formData.rememberMeFor,
        hobbies: formData.hobbies,
        achievements: formData.achievements,
        phoneNumber: formData.phoneNumber,
        telegram: formData.telegram,
        instagram: formData.instagram,
        twitter: formData.twitter,
      });
      onSave(formData);
    } catch (error) {
      alert('Failed to save: ' + (error as Error).message);
    } finally {
      setSaving(false);
    }
  };

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const result = await userApi.uploadPhoto(file);
      setFormData(prev => ({ ...prev, profilePhoto: result.profilePhoto }));
    } catch (error) {
      alert('Failed to upload photo: ' + (error as Error).message);
    }
  };

  return (
    <div className="max-w-5xl mx-auto bg-white rounded-[40px] shadow-2xl border border-slate-100 overflow-hidden">
      <div className="md:flex">
        {/* Left Sidebar - Visuals */}
        <div className="md:w-1/3 bg-slate-50/50 p-10 flex flex-col items-center border-r border-slate-100">
          <div className="relative group mb-8">
            <div className="absolute -inset-4 bg-indigo-100 rounded-full blur-xl opacity-20 group-hover:opacity-40 transition-opacity"></div>
            <img
              src={formData.profilePhoto || 'https://ui-avatars.com/api/?name=' + encodeURIComponent(formData.fullName)}
              alt=""
              className="relative w-48 h-48 rounded-full object-cover ring-8 ring-white shadow-2xl"
            />
            <label className="absolute bottom-2 right-2 bg-white p-3 rounded-full shadow-lg text-slate-500 hover:text-indigo-600 transition-all hover:scale-110 cursor-pointer">
              <Camera size={20} />
              <input type="file" accept="image/*" onChange={handlePhotoUpload} className="hidden" />
            </label>
          </div>
          <div className="text-center space-y-2 mb-10 w-full">
            <h2 className="text-2xl font-bold text-slate-900 serif">{formData.fullName}</h2>
            <p className="text-xs font-bold text-indigo-600 uppercase tracking-widest">{formData.department}</p>
            <div className="flex flex-wrap justify-center gap-2 mt-4">
              <span className="text-[10px] font-bold bg-white border border-slate-100 text-slate-400 px-3 py-1 rounded-full">{formData.studentId}</span>
              <span className="text-[10px] font-bold bg-white border border-slate-100 text-slate-400 px-3 py-1 rounded-full">Class of {formData.graduationYear}</span>
            </div>
          </div>
        </div>

        {/* Right - Form Content */}
        <div className="md:w-2/3 p-10 space-y-10">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold serif text-slate-900">Your Legacy</h1>
              <p className="text-slate-400 text-sm mt-1">Shape how others remember your university journey.</p>
            </div>
            <button
              onClick={handleSave}
              disabled={saving}
              className="flex items-center gap-2 bg-indigo-600 text-white px-8 py-3 rounded-2xl font-bold shadow-xl shadow-indigo-100 hover:bg-indigo-700 transition-all hover:-translate-y-1 disabled:opacity-50"
            >
              <Save size={18} /> {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>

          <div className="space-y-8">
            <Section title="Graduation Quote" icon={<MessageSquareQuote size={18} />}>
              <textarea
                value={formData.quote || ''}
                onChange={(e) => updateField('quote', e.target.value)}
                className="w-full bg-slate-50 border-none rounded-3xl p-6 focus:ring-2 focus:ring-indigo-500 min-h-[120px] text-lg italic text-slate-700"
                placeholder="The perfect parting words..."
              />
            </Section>

            <Section title="Remember Me For..." icon={<Heart size={18} />}>
              <input
                type="text"
                value={formData.rememberMeFor || ''}
                onChange={(e) => updateField('rememberMeFor', e.target.value)}
                className="w-full bg-slate-50 border-none rounded-2xl px-6 py-4 focus:ring-2 focus:ring-indigo-500 text-slate-700 font-medium"
                placeholder="E.g. Best coffee in the dorms, always late but passed..."
              />
              <p className="text-[10px] text-slate-400 mt-2 uppercase font-bold tracking-widest pl-2">This will be featured prominently on your public profile</p>
            </Section>

            <Section title="Contact & Socials" icon={<ExternalLink size={18} />}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  type="text"
                  value={formData.phoneNumber || ''}
                  onChange={(e) => updateField('phoneNumber', e.target.value)}
                  className="w-full bg-slate-50 border-none rounded-2xl px-6 py-4 focus:ring-2 focus:ring-indigo-500 text-slate-700 text-sm"
                  placeholder="Phone Number (Optional)"
                />
                <input
                  type="text"
                  value={formData.telegram || ''}
                  onChange={(e) => updateField('telegram', e.target.value)}
                  className="w-full bg-slate-50 border-none rounded-2xl px-6 py-4 focus:ring-2 focus:ring-indigo-500 text-slate-700 text-sm"
                  placeholder="Telegram Username (Optional)"
                />
                <input
                  type="text"
                  value={formData.instagram || ''}
                  onChange={(e) => updateField('instagram', e.target.value)}
                  className="w-full bg-slate-50 border-none rounded-2xl px-6 py-4 focus:ring-2 focus:ring-indigo-500 text-slate-700 text-sm"
                  placeholder="Instagram Username (Optional)"
                />
                <input
                  type="text"
                  value={formData.twitter || ''}
                  onChange={(e) => updateField('twitter', e.target.value)}
                  className="w-full bg-slate-50 border-none rounded-2xl px-6 py-4 focus:ring-2 focus:ring-indigo-500 text-slate-700 text-sm"
                  placeholder="Twitter Username (Optional)"
                />
              </div>
            </Section>

            <Section title="Biographical Sketch">
              <textarea
                value={formData.bio || ''}
                onChange={(e) => updateField('bio', e.target.value)}
                className="w-full bg-slate-50 border-none rounded-3xl p-6 focus:ring-2 focus:ring-indigo-500 min-h-[160px] text-slate-600 leading-relaxed"
                placeholder="A few paragraphs about your achievements, friends, and future plans..."
              />
            </Section>

            <div className="pt-6 border-t border-slate-100">
              <p className="text-xs text-slate-400 flex items-center gap-2">
                <ExternalLink size={14} /> Official university data like your Major and Student ID can only be modified via the Registrar.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const Section = ({ title, children, icon }: { title: string, children: React.ReactNode, icon?: React.ReactNode }) => (
  <div className="space-y-4">
    <label className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-widest px-2">
      {icon} {title}
    </label>
    {children}
  </div>
);

export default ProfileEditor;
