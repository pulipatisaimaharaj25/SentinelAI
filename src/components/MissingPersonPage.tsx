import React, { useState } from 'react';
import { Users, UserPlus, Phone, MapPin, Copy, Check, Sparkles, AlertCircle, Search, ShieldCheck } from 'lucide-react';
import { MissingPerson, Language } from '../types';
import { getTranslation } from '../i18n';

interface MissingPersonPageProps {
  missingPersons: MissingPerson[];
  onAddMissingPerson: (newPerson: MissingPerson) => void;
  onUpdateStatus: (id: string, status: 'Searching' | 'Found') => void;
  lang: Language;
}

export const MissingPersonPage: React.FC<MissingPersonPageProps> = ({
  missingPersons,
  onAddMissingPerson,
  onUpdateStatus,
  lang,
}) => {
  const t = getTranslation(lang);

  const [showForm, setShowForm] = useState<boolean>(false);
  const [name, setName] = useState<string>('');
  const [age, setAge] = useState<string>('');
  const [lastSeenLocation, setLastSeenLocation] = useState<string>('');
  const [contactNumber, setContactNumber] = useState<string>('');
  const [additionalDetails, setAdditionalDetails] = useState<string>('');
  const [photoUrl, setPhotoUrl] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const defaultMissingPhoto = 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&auto=format&fit=crop&q=80';

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !lastSeenLocation || !contactNumber) return;

    setIsGenerating(true);

    try {
      const res = await fetch('/api/generate-missing-person-alert', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          age,
          lastSeenLocation,
          contactNumber,
          additionalDetails,
        }),
      });

      const alertData = await res.json();

      const newPerson: MissingPerson = {
        id: `MP-${Math.floor(100 + Math.random() * 900)}`,
        name,
        age: age || 'N/A',
        lastSeenLocation,
        contactNumber,
        photoUrl: photoUrl || defaultMissingPhoto,
        additionalDetails,
        reportedAt: 'Just now',
        alertEn: alertData.alertEn,
        alertTe: alertData.alertTe,
        status: 'Searching',
      };

      onAddMissingPerson(newPerson);
      setIsGenerating(false);
      setShowForm(false);

      // Reset form
      setName('');
      setAge('');
      setLastSeenLocation('');
      setContactNumber('');
      setAdditionalDetails('');
      setPhotoUrl('');
    } catch (err) {
      console.error('Missing person alert error:', err);
      setIsGenerating(false);
    }
  };

  const handleCopyAlert = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="space-y-6 sm:space-y-8 pb-12">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-purple-700 to-sky-700 rounded-3xl p-6 sm:p-8 text-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-sm">
        <div className="space-y-2 max-w-xl">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-white/10 rounded-xl">
              <Users className="w-6 h-6 text-white" />
            </div>
            <h2 className="text-2xl sm:text-3xl font-black">{t.missingTitle}</h2>
          </div>
          <p className="text-sky-100 text-xs sm:text-sm">{t.missingSubtitle}</p>
        </div>

        <button
          onClick={() => setShowForm(!showForm)}
          className="py-3 px-5 rounded-2xl bg-white text-sky-900 font-extrabold text-xs sm:text-sm hover:bg-sky-50 transition-all flex items-center gap-2 shadow-sm cursor-pointer shrink-0"
          id="toggle-missing-person-form-btn"
        >
          <UserPlus className="w-4 h-4 text-sky-700" />
          <span>{t.reportMissingButton}</span>
        </button>
      </div>

      {/* Report Form Drawer/Card */}
      {showForm && (
        <form 
          onSubmit={handleSubmit}
          className="bg-white rounded-3xl p-6 sm:p-8 border border-purple-200 shadow-md space-y-5 animate-in slide-in-from-top duration-200"
          id="missing-person-report-form"
        >
          <div className="flex items-center justify-between border-b border-gray-100 pb-4">
            <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
              <UserPlus className="w-5 h-5 text-purple-600" />
              <span>{t.reportMissingButton}</span>
            </h3>
            <span className="text-xs text-purple-700 font-semibold bg-purple-50 px-3 py-1 rounded-full border border-purple-200">
              Gemini AI Auto Alert Broadcast
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-700 block">{t.fullNameLabel} *</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g., Ramesh Kumar"
                className="w-full p-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-purple-500 text-sm"
                id="missing-name-input"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-700 block">{t.ageLabel}</label>
              <input
                type="text"
                value={age}
                onChange={(e) => setAge(e.target.value)}
                placeholder="e.g., 68"
                className="w-full p-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-purple-500 text-sm"
                id="missing-age-input"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-700 block">{t.lastSeenLabel} *</label>
              <input
                type="text"
                required
                value={lastSeenLocation}
                onChange={(e) => setLastSeenLocation(e.target.value)}
                placeholder="e.g., Near Sunrise Apartments, Sector 4"
                className="w-full p-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-purple-500 text-sm"
                id="missing-last-seen-input"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-700 block">{t.contactNumberLabel} *</label>
              <input
                type="tel"
                required
                value={contactNumber}
                onChange={(e) => setContactNumber(e.target.value)}
                placeholder="+91 98765 43210"
                className="w-full p-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-purple-500 text-sm"
                id="missing-contact-input"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-gray-700 block">{t.extraDetailsLabel}</label>
            <input
              type="text"
              value={additionalDetails}
              onChange={(e) => setAdditionalDetails(e.target.value)}
              placeholder="e.g., Wearing blue shirt, grey pants, carrying black bag..."
              className="w-full p-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-purple-500 text-sm"
              id="missing-details-input"
            />
          </div>

          {/* Photo Upload */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-gray-700 block">Upload Photo (Optional)</label>
            <input
              type="file"
              accept="image/*"
              onChange={handlePhotoUpload}
              className="text-xs text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-purple-50 file:text-purple-700 hover:file:bg-purple-100 cursor-pointer"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-3">
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="px-4 py-2.5 rounded-xl bg-gray-100 text-gray-700 text-xs font-bold hover:bg-gray-200 transition-colors cursor-pointer"
            >
              {t.close}
            </button>

            <button
              type="submit"
              disabled={isGenerating}
              className="px-6 py-2.5 rounded-xl bg-purple-700 hover:bg-purple-800 text-white font-extrabold text-xs sm:text-sm transition-all shadow-sm flex items-center gap-2 cursor-pointer"
              id="submit-missing-person-btn"
            >
              <Sparkles className="w-4 h-4 text-purple-200" />
              <span>{isGenerating ? 'Generating Public Alert...' : t.submitMissingReport}</span>
            </button>
          </div>
        </form>
      )}

      {/* Gallery / Cards Feed */}
      <div className="space-y-4">
        <h3 className="text-xl font-bold text-gray-900">{t.activeAlertsTitle}</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {missingPersons.map((person) => {
            const activeAlert = lang === 'te' ? person.alertTe : person.alertEn;

            return (
              <div
                key={person.id}
                className="bg-white rounded-3xl p-6 border border-gray-200 shadow-xs space-y-5 flex flex-col justify-between"
                id={`missing-card-${person.id}`}
              >
                <div className="space-y-4">
                  {/* Card Header Profile */}
                  <div className="flex items-start gap-4">
                    <img
                      src={person.photoUrl || defaultMissingPhoto}
                      alt={person.name}
                      className="w-20 h-20 rounded-2xl object-cover shrink-0 border border-gray-200 shadow-2xs"
                    />

                    <div className="space-y-1.5 flex-1">
                      <div className="flex items-center justify-between gap-2">
                        <h4 className="text-lg font-black text-gray-900">{person.name}</h4>
                        <span className={`px-3 py-0.5 rounded-full text-xs font-bold border ${
                          person.status === 'Searching' 
                            ? 'bg-amber-50 text-amber-800 border-amber-200' 
                            : 'bg-emerald-50 text-emerald-800 border-emerald-200'
                        }`}>
                          {person.status === 'Searching' ? t.searchingStatus : t.foundStatus}
                        </span>
                      </div>

                      <p className="text-xs text-gray-600 font-medium">Age: <strong>{person.age}</strong></p>

                      <p className="text-xs text-gray-500 flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-purple-600 shrink-0" />
                        <span>{person.lastSeenLocation}</span>
                      </p>

                      <a
                        href={`tel:${person.contactNumber}`}
                        className="inline-flex items-center gap-1.5 text-xs font-bold text-sky-700 hover:text-sky-800"
                      >
                        <Phone className="w-3.5 h-3.5" />
                        <span>{person.contactNumber}</span>
                      </a>
                    </div>
                  </div>

                  {/* Gemini Generated Public Alert Box */}
                  <div className="bg-purple-50/70 rounded-2xl p-4 border border-purple-100 space-y-2">
                    <div className="flex items-center justify-between text-xs text-purple-900 font-bold">
                      <span className="flex items-center gap-1">
                        <Sparkles className="w-3.5 h-3.5 text-purple-600" />
                        <span>Gemini Public Broadcast Alert</span>
                      </span>
                    </div>

                    <p className="text-xs text-purple-950 leading-relaxed font-medium bg-white p-3 rounded-xl border border-purple-100">
                      {activeAlert || person.alertEn}
                    </p>
                  </div>
                </div>

                {/* Footer Action Controls */}
                <div className="pt-3 border-t border-gray-100 flex items-center justify-between gap-2">
                  <button
                    onClick={() => handleCopyAlert(person.id, activeAlert)}
                    className="py-2 px-3.5 rounded-xl bg-sky-50 hover:bg-sky-100 text-sky-800 text-xs font-bold border border-sky-200 transition-colors flex items-center gap-1.5 cursor-pointer"
                  >
                    {copiedId === person.id ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                        <span>{t.alertCopied}</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5 text-sky-600" />
                        <span>{t.copyAlert}</span>
                      </>
                    )}
                  </button>

                  {person.status === 'Searching' && (
                    <button
                      onClick={() => onUpdateStatus(person.id, 'Found')}
                      className="py-2 px-3.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-xs font-bold border border-emerald-200 transition-colors flex items-center gap-1.5 cursor-pointer"
                    >
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                      <span>{t.markAsFound}</span>
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
