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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-purple-950/40 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-lg bg-white dark:bg-[#1A112E] rounded-3xl border border-purple-100 dark:border-purple-800 shadow-2xl p-6 max-h-[90vh] overflow-y-auto">
        
        <div className="flex items-center justify-between border-b border-purple-100 dark:border-purple-900/60 pb-4 mb-4">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-purple-600 dark:text-purple-400" />
            <h2 className="text-lg font-bold text-purple-950 dark:text-purple-100">
              User Profile Settings
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-purple-100 dark:hover:bg-purple-900 text-purple-500"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSave} className="space-y-4">

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-purple-900 dark:text-purple-200 mb-1">
                Full Name
              </label>
              <div className="relative">
                <UserIcon className="w-4 h-4 absolute left-3 top-2.5 text-purple-400" />
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 rounded-xl border border-purple-200 dark:border-purple-800 bg-white dark:bg-[#120B24] text-xs text-purple-950 dark:text-purple-100 focus:ring-2 focus:ring-purple-500 outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-purple-900 dark:text-purple-200 mb-1">
                Email (Read-only)
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 absolute left-3 top-2.5 text-purple-400" />
                <input
                  type="text"
                  disabled
                  value={currentUser.email}
                  className="w-full pl-9 pr-3 py-2 rounded-xl border border-purple-100 dark:border-purple-900 bg-purple-50/50 dark:bg-purple-950/20 text-xs text-purple-500 cursor-not-allowed"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-purple-900 dark:text-purple-200 mb-1">
                Phone Number
              </label>
              <div className="relative">
                <Phone className="w-4 h-4 absolute left-3 top-2.5 text-purple-400" />
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+63 917 123 4567"
                  className="w-full pl-9 pr-3 py-2 rounded-xl border border-purple-200 dark:border-purple-800 bg-white dark:bg-[#120B24] text-xs text-purple-950 dark:text-purple-100 focus:ring-2 focus:ring-purple-500 outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-purple-900 dark:text-purple-200 mb-1">
                Department
              </label>
              <div className="relative">
                <Building className="w-4 h-4 absolute left-3 top-2.5 text-purple-400" />
                <input
                  type="text"
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 rounded-xl border border-purple-200 dark:border-purple-800 bg-white dark:bg-[#120B24] text-xs text-purple-950 dark:text-purple-100 focus:ring-2 focus:ring-purple-500 outline-none"
                />
              </div>
            </div>
          </div>

          <div className="p-3 rounded-2xl bg-purple-100/60 dark:bg-purple-900/40 border border-purple-200 dark:border-purple-800 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-purple-600 dark:text-purple-400" />
              <span className="font-semibold text-purple-900 dark:text-purple-200">System Role:</span>
            </div>
            <span className="capitalize font-bold px-2.5 py-0.5 rounded-full bg-purple-600 text-white text-[11px]">
              {currentUser.role} Access
            </span>
          </div>

          <button
            type="submit"
            className="w-full py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-semibold text-xs shadow-md shadow-purple-500/20 flex items-center justify-center gap-2 transition-all"
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
