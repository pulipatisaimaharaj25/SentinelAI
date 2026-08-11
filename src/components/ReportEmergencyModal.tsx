import React, { useState } from 'react';
import { 
  X, Camera, MapPin, ArrowRight, ArrowLeft, Loader2, Upload, AlertTriangle, 
  Car, CloudRain, ShieldAlert, UserX, CheckCircle2, Sparkles, Phone 
} from 'lucide-react';
import { IncidentType, Incident, Language } from '../types';
import { getTranslation } from '../i18n';
import { samplePhotos } from '../data/mockData';

interface ReportEmergencyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmitSuccess: (newIncident: Incident) => void;
  lang: Language;
}

export const ReportEmergencyModal: React.FC<ReportEmergencyModalProps> = ({
  isOpen,
  onClose,
  onSubmitSuccess,
  lang,
}) => {
  if (!isOpen) return null;

  const t = getTranslation(lang);

  const [step, setStep] = useState<number>(1);
  const [incidentType, setIncidentType] = useState<IncidentType>('Road Accident');
  const [description, setDescription] = useState<string>('');
  const [location, setLocation] = useState<string>('');
  const [photoUrl, setPhotoUrl] = useState<string>('');
  const [reporterPhone, setReporterPhone] = useState<string>('');
  const [isLocating, setIsLocating] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>('');

  const incidentTypes: { type: IncidentType; labelKey: string; icon: React.FC<{ className?: string }>; color: string }[] = [
    { type: 'Road Accident', labelKey: t.incidentTypeRoadAccident, icon: Car, color: 'bg-red-50 text-red-700 border-red-200 hover:bg-red-100' },
    { type: 'Flood/Water Hazard', labelKey: t.incidentTypeFlood, icon: CloudRain, color: 'bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100' },
    { type: 'Road Hazard', labelKey: t.incidentTypeHazard, icon: AlertTriangle, color: 'bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100' },
    { type: 'Missing Person', labelKey: t.incidentTypeMissing, icon: UserX, color: 'bg-purple-50 text-purple-700 border-purple-200 hover:bg-purple-100' },
    { type: 'Other Emergency', labelKey: t.incidentTypeOther, icon: ShieldAlert, color: 'bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100' },
  ];

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAutoLocation = () => {
    setIsLocating(true);
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setIsLocating(false);
          const lat = position.coords.latitude.toFixed(4);
          const lng = position.coords.longitude.toFixed(4);
          setLocation(`Detected GPS: (${lat}, ${lng}) near Central Junction`);
        },
        () => {
          setIsLocating(false);
          setLocation('Near MG Road, Main City Sector');
        },
        { timeout: 5000 }
      );
    } else {
      setIsLocating(false);
      setLocation('Near MG Road, Main City Sector');
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setErrorMessage('');

    try {
      const res = await fetch('/api/analyze-incident', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          incidentType,
          description: description || `${incidentType} reported by citizen`,
          location: location || 'Current Region',
          imageBase64: photoUrl,
        }),
      });

      const aiResult = await res.json();

      const newIncident: Incident = {
        id: `INC-${Math.floor(1000 + Math.random() * 9000)}`,
        type: incidentType,
        description: description || `${incidentType} reported near ${location || 'local area'}`,
        location: location || 'Current Location',
        severity: aiResult.severity || 'Medium',
        status: 'New',
        timestamp: 'Just now',
        createdAt: Date.now(),
        photoUrl: photoUrl || undefined,
        titleEn: aiResult.titleEn || `${incidentType} reported near ${location || 'Current Location'}`,
        titleTe: aiResult.titleTe || `${location || 'ప్రాంతం'} లో ${incidentType} నివేదించబడింది`,
        reassuranceEn: aiResult.reassuranceEn || 'Emergency teams notified.',
        reassuranceTe: aiResult.reassuranceTe || 'అత్యవసర బృందాలకు సమాచారం అందించబడింది.',
        adviceEn: aiResult.adviceEn || ['Stay safe', 'Keep emergency numbers handy'],
        adviceTe: aiResult.adviceTe || ['సురక్షితంగా ఉండండి', 'అత్యవసర నంబర్లను సిద్ధంగా ఉంచుకోండి'],
        estimatedResponseTime: aiResult.estimatedResponseTime || '5-10 mins',
        reporterContact: reporterPhone,
      };

      setIsSubmitting(false);
      onSubmitSuccess(newIncident);
      onClose();
    } catch (err: any) {
      console.error('Submit error:', err);
      setIsSubmitting(false);
      setErrorMessage('Unable to process AI analysis. Please check network and try again.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-gray-900/60 backdrop-blur-xs animate-in fade-in duration-200 overflow-y-auto">
      <div 
        className="w-full max-w-xl bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden my-auto"
        id="report-emergency-modal"
      >
        {/* Top Modal Header */}
        <div className="px-6 py-5 bg-sky-600 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-white/10 rounded-xl">
              <AlertTriangle className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-bold">{t.reportTitle}</h3>
              <p className="text-xs text-sky-100">Step {step} of 4</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-white/80 hover:text-white hover:bg-white/10 rounded-xl transition-colors cursor-pointer"
            id="close-report-modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-sky-100 h-1.5">
          <div 
            className="bg-sky-600 h-1.5 transition-all duration-300" 
            style={{ width: `${(step / 4) * 100}%` }}
          />
        </div>

        {/* Form Body */}
        <div className="p-6 sm:p-8 space-y-6">
          {/* STEP 1: Select Incident Type */}
          {step === 1 && (
            <div className="space-y-4">
              <div className="space-y-1">
                <h4 className="text-base font-bold text-gray-900">{t.step1Title}</h4>
                <p className="text-xs text-gray-500">Tap the category that best matches your situation</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {incidentTypes.map((item) => {
                  const Icon = item.icon;
                  const isSelected = incidentType === item.type;

                  return (
                    <button
                      key={item.type}
                      type="button"
                      id={`type-btn-${item.type.replace(/\s+/g, '-').toLowerCase()}`}
                      onClick={() => setIncidentType(item.type)}
                      className={`p-4 rounded-2xl border text-left transition-all flex items-center gap-3 cursor-pointer ${
                        isSelected
                          ? 'border-sky-600 bg-sky-50 ring-2 ring-sky-600/20'
                          : `${item.color} border-gray-200 hover:border-sky-300`
                      }`}
                    >
                      <div className={`p-2.5 rounded-xl ${isSelected ? 'bg-sky-600 text-white' : 'bg-white shadow-2xs'}`}>
                        <Icon className="w-6 h-6" />
                      </div>
                      <span className="text-sm font-bold text-gray-900">{item.labelKey}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* STEP 2: Photo & Description */}
          {step === 2 && (
            <div className="space-y-5">
              <div className="space-y-1">
                <h4 className="text-base font-bold text-gray-900">{t.step2Title}</h4>
                <p className="text-xs text-gray-500">Photos help AI assess urgency accurately</p>
              </div>

              {/* Photo Upload Area */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-700 block">{t.photoOptional}</label>
                
                {photoUrl ? (
                  <div className="relative rounded-2xl overflow-hidden border border-gray-200 group max-h-48">
                    <img src={photoUrl} alt="Incident preview" className="w-full h-48 object-cover" />
                    <button
                      type="button"
                      onClick={() => setPhotoUrl('')}
                      className="absolute top-2 right-2 p-1.5 bg-black/60 text-white rounded-full hover:bg-black/80 transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <label className="border-2 border-dashed border-gray-300 hover:border-sky-500 rounded-2xl p-6 flex flex-col items-center justify-center text-center cursor-pointer bg-gray-50 hover:bg-sky-50/50 transition-all">
                    <Camera className="w-8 h-8 text-sky-600 mb-2" />
                    <span className="text-xs font-bold text-gray-800">{t.photoHint}</span>
                    <input 
                      type="file" 
                      accept="image/*" 
                      onChange={handleFileUpload} 
                      className="hidden" 
                      id="incident-photo-file-input"
                    />
                  </label>
                )}

                {/* Quick Sample Photos for Fast Testing */}
                <div className="pt-2">
                  <p className="text-xs text-gray-500 mb-2 font-medium">{t.useSamplePhotos}</p>
                  <div className="flex gap-2 overflow-x-auto pb-1">
                    {samplePhotos.map((sample) => (
                      <button
                        key={sample.id}
                        type="button"
                        onClick={() => setPhotoUrl(sample.url)}
                        className="flex items-center gap-2 p-1.5 rounded-xl border border-gray-200 hover:border-sky-500 bg-white text-xs shrink-0 cursor-pointer"
                      >
                        <img src={sample.url} alt={sample.name} className="w-8 h-8 rounded-lg object-cover" />
                        <span className="font-semibold text-gray-700">{sample.name}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Text Description */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-700 block">{t.descriptionLabel}</label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder={t.descriptionPlaceholder}
                  className="w-full p-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-sky-500 focus:border-sky-500 text-sm"
                  id="incident-description-textarea"
                />
              </div>
            </div>
          )}

          {/* STEP 3: Confirm Location */}
          {step === 3 && (
            <div className="space-y-5">
              <div className="space-y-1">
                <h4 className="text-base font-bold text-gray-900">{t.step3Title}</h4>
                <p className="text-xs text-gray-500">Provide the nearest landmark or street name</p>
              </div>

              <div className="space-y-3">
                <button
                  type="button"
                  onClick={handleAutoLocation}
                  disabled={isLocating}
                  className="w-full py-3 px-4 rounded-xl bg-sky-50 hover:bg-sky-100 text-sky-800 border border-sky-200 text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-colors cursor-pointer"
                  id="auto-gps-button"
                >
                  {isLocating ? (
                    <Loader2 className="w-4 h-4 animate-spin text-sky-600" />
                  ) : (
                    <MapPin className="w-4 h-4 text-sky-600" />
                  )}
                  <span>{t.autoDetectLocation}</span>
                </button>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-700 block">{t.locationLabel}</label>
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder={t.locationPlaceholder}
                    className="w-full p-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-sky-500 focus:border-sky-500 text-sm"
                    id="incident-location-input"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-700 block">{t.reporterPhoneLabel}</label>
                  <input
                    type="tel"
                    value={reporterPhone}
                    onChange={(e) => setReporterPhone(e.target.value)}
                    placeholder="+91 98765 43210"
                    className="w-full p-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-sky-500 focus:border-sky-500 text-sm"
                    id="reporter-phone-input"
                  />
                </div>
              </div>
            </div>
          )}

          {/* STEP 4: Summary & Submit */}
          {step === 4 && (
            <div className="space-y-5">
              <div className="space-y-1">
                <h4 className="text-base font-bold text-gray-900">{t.step4Title}</h4>
                <p className="text-xs text-gray-500">Gemini AI will immediately analyze urgency and issue safety advice</p>
              </div>

              <div className="bg-gray-50 rounded-2xl p-4 border border-gray-200 space-y-3 text-xs sm:text-sm">
                <div className="flex justify-between border-b border-gray-200 pb-2">
                  <span className="text-gray-500">Type:</span>
                  <span className="font-bold text-gray-900">{incidentType}</span>
                </div>
                <div className="flex justify-between border-b border-gray-200 pb-2">
                  <span className="text-gray-500">Location:</span>
                  <span className="font-bold text-gray-900">{location || 'Not specified'}</span>
                </div>
                <div className="flex justify-between border-b border-gray-200 pb-2">
                  <span className="text-gray-500">Photo Attached:</span>
                  <span className="font-bold text-gray-900">{photoUrl ? 'Yes' : 'No'}</span>
                </div>
                <div>
                  <span className="text-gray-500 block mb-1">Description:</span>
                  <p className="font-medium text-gray-800 bg-white p-2.5 rounded-xl border border-gray-200">
                    {description || 'No extra text description provided.'}
                  </p>
                </div>
              </div>

              {errorMessage && (
                <div className="p-3 rounded-xl bg-red-50 text-red-700 text-xs border border-red-200 font-medium">
                  {errorMessage}
                </div>
              )}
            </div>
          )}

          {/* Bottom Navigation Buttons */}
          <div className="pt-4 border-t border-gray-100 flex items-center justify-between gap-3">
            {step > 1 ? (
              <button
                type="button"
                onClick={() => setStep(step - 1)}
                disabled={isSubmitting}
                className="px-4 py-2.5 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>{t.previous}</span>
              </button>
            ) : <div />}

            {step < 4 ? (
              <button
                type="button"
                onClick={() => setStep(step + 1)}
                className="px-5 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-700 text-white text-xs sm:text-sm font-bold transition-colors flex items-center gap-1.5 cursor-pointer ml-auto"
                id="next-step-btn"
              >
                <span>{t.next}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                type="button"
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="px-6 py-3 rounded-xl bg-red-600 hover:bg-red-700 text-white text-sm font-extrabold shadow-md transition-all flex items-center gap-2 cursor-pointer ml-auto"
                id="final-submit-report-btn"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-white" />
                    <span>{t.submitting}</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 fill-white" />
                    <span>{t.submitReport}</span>
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
