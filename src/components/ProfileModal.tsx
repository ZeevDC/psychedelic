import React, { useState } from 'react';
import { User } from '../types';
import { X, User as UserIcon, Mail, Phone, Building, Shield, Check, Sparkles } from 'lucide-react';

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: User;
  onSaveProfile: (updated: Partial<User>) => void;
}

export const ProfileModal: React.FC<ProfileModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  onSaveProfile
}) => {
  const [name, setName] = useState(currentUser.name);
  const [phone, setPhone] = useState(currentUser.phone || '');
  const [department, setDepartment] = useState(currentUser.department || '');
  const [saved, setSaved] = useState(false);

  if (!isOpen) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveProfile({
      name,
      phone,
      department
    });
    setSaved(true);
    setTimeout(() => {
      setSaved(false);
      onClose();
    }, 800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-lg bg-white dark:bg-[#0F172A] rounded-3xl border-2 border-sky-300/40 dark:border-blue-900 shadow-2xl p-6 max-h-[90vh] overflow-y-auto">
        
        <div className="flex items-center justify-between border-b border-sky-100 dark:border-blue-900/60 pb-4 mb-4">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-sky-500 dark:text-sky-300" />
            <h2 className="text-lg font-black text-slate-900 dark:text-sky-100">
              User Profile Settings
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-sky-100 dark:hover:bg-blue-900 text-sky-500"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSave} className="space-y-4">

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-900 dark:text-sky-100 mb-1">
                Full Name
              </label>
              <div className="relative">
                <UserIcon className="w-4 h-4 absolute left-3 top-2.5 text-sky-400" />
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 rounded-xl border border-sky-200 dark:border-blue-900 bg-white dark:bg-[#0B132B] text-xs text-slate-900 dark:text-sky-100 focus:ring-2 focus:ring-sky-500 outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-900 dark:text-sky-100 mb-1">
                Email (Read-only)
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 absolute left-3 top-2.5 text-sky-400" />
                <input
                  type="text"
                  disabled
                  value={currentUser.email}
                  className="w-full pl-9 pr-3 py-2 rounded-xl border border-sky-100 dark:border-blue-900 bg-sky-50/50 dark:bg-blue-950/20 text-xs text-sky-500 cursor-not-allowed"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-900 dark:text-sky-100 mb-1">
                Phone Number
              </label>
              <div className="relative">
                <Phone className="w-4 h-4 absolute left-3 top-2.5 text-sky-400" />
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+1 (555) 000-0000"
                  className="w-full pl-9 pr-3 py-2 rounded-xl border border-sky-200 dark:border-blue-900 bg-white dark:bg-[#0B132B] text-xs text-slate-900 dark:text-sky-100 focus:ring-2 focus:ring-sky-500 outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-900 dark:text-sky-100 mb-1">
                Department
              </label>
              <div className="relative">
                <Building className="w-4 h-4 absolute left-3 top-2.5 text-sky-400" />
                <input
                  type="text"
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 rounded-xl border border-sky-200 dark:border-blue-900 bg-white dark:bg-[#0B132B] text-xs text-slate-900 dark:text-sky-100 focus:ring-2 focus:ring-sky-500 outline-none"
                />
              </div>
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-sky-100/60 dark:bg-blue-950/60 border border-sky-200 dark:border-blue-800 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-sky-500 dark:text-sky-300" />
              <span className="font-bold text-slate-900 dark:text-sky-100">System Role:</span>
            </div>
            <span className="capitalize font-black px-3 py-0.5 rounded-full bg-sky-600 text-white text-[11px]">
              {currentUser.role} Access
            </span>
          </div>

          <button
            type="submit"
            className="w-full py-3 rounded-xl bg-gradient-to-r from-sky-500 via-blue-600 to-indigo-600 hover:from-sky-600 hover:to-indigo-700 text-white font-black text-xs shadow-md shadow-sky-500/20 flex items-center justify-center gap-2 transition-all"
          >
            {saved ? (
              <>
                <Check className="w-4 h-4" />
                <span>Profile Updated!</span>
              </>
            ) : (
              <span>Save Changes</span>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};
