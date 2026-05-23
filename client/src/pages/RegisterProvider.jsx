import { useState } from 'react';
import { useAuth } from '../context/useAuth';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { CheckCircle, Upload, ChevronRight, ChevronLeft } from 'lucide-react';
import { createProvider } from '../data/localStore';

const SERVICE_LIST = ['Driver', 'Maid', 'Cook', 'Errand', 'Queue', 'Handyman', 'Tutor', 'Care'];

const RegisterProvider = () => {
  const [step, setStep] = useState(0);
  const [phone, setPhone] = useState('+91');
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    gender: '',
    dob: '',
    location: { state: '', city: '', town: '', pincode: '', serviceRadiusKm: 10 },
    services: [],
    documents: [],
    bankDetails: { accountNo: '', ifsc: '', upiId: '' }
  });

  const navigate = useNavigate();
  const { setUser } = useAuth();
  const [submitting, setSubmitting] = useState(false);

  const nextStep = () => setStep(prev => prev + 1);
  const prevStep = () => setStep(prev => prev - 1);

  const toggleService = (service) => {
    const lower = service.toLowerCase();
    setFormData(prev => ({
      ...prev,
      services: prev.services.includes(lower)
        ? prev.services.filter(s => s !== lower)
        : [...prev.services, lower]
    }));
  };

  const handleDocumentSelect = (e, docType) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      setFormData(prev => ({
        ...prev,
        documents: [
          ...prev.documents.filter(d => d.docType !== docType),
          { docType, fileName: file.name, dataUrl: reader.result }
        ]
      }));
      toast.success(`${docType.toUpperCase()} selected`);
    };
    reader.readAsDataURL(file);
  };

  const handleFinalSubmit = () => {
    if (!formData.fullName || formData.services.length === 0) {
      toast.error('Please add your name and select at least one service.');
      return;
    }

    setSubmitting(true);
    window.setTimeout(() => {
      const provider = createProvider({ phone, formData });
      setUser(provider);
      toast.success('Provider profile saved locally.');
      setSubmitting(false);
      navigate('/provider/dashboard');
    }, 400);
  };

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-xl p-8 gold-border">
        <div className="flex justify-between mb-10">
          {[0, 1, 2, 3, 4].map((i) => (
            <div key={i} className={`h-2 flex-1 mx-1 rounded-full ${step >= i ? 'bg-primary-gold' : 'bg-gray-200'}`} />
          ))}
        </div>

        {step === 0 && (
          <div className="space-y-6">
            <h2 className="text-3xl font-playfair font-bold text-center">Phone Details</h2>
            <p className="text-sm text-center text-charcoal/60">Frontend-only mode skips OTP and saves your profile in this browser.</p>
            <input type="text" value={phone} onChange={e => setPhone(e.target.value)} className="w-full p-4 border rounded-lg outline-none focus:ring-2 focus:ring-primary-gold" />
            <button onClick={nextStep} className="gold-btn w-full py-4 text-lg">Continue</button>
          </div>
        )}

        {step === 1 && (
          <div className="space-y-6">
            <h2 className="text-3xl font-playfair font-bold">Personal Info</h2>
            <div className="grid md:grid-cols-2 gap-4">
              <input type="text" placeholder="Full Name" className="p-3 border rounded" value={formData.fullName} onChange={e => setFormData({...formData, fullName: e.target.value})} />
              <input type="email" placeholder="Email (Optional)" className="p-3 border rounded" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
              <input type="text" placeholder="Gender" className="p-3 border rounded" value={formData.gender} onChange={e => setFormData({...formData, gender: e.target.value})} />
              <input type="date" placeholder="Date of Birth" className="p-3 border rounded" value={formData.dob} onChange={e => setFormData({...formData, dob: e.target.value})} />
            </div>
            <button onClick={nextStep} className="gold-btn w-full py-3 flex items-center justify-center gap-2">Next <ChevronRight size={20}/></button>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-6">
            <h2 className="text-3xl font-playfair font-bold">Location Details</h2>
            <div className="grid md:grid-cols-2 gap-4">
              <input type="text" placeholder="State" className="p-3 border rounded" value={formData.location.state} onChange={e => setFormData({...formData, location: {...formData.location, state: e.target.value}})} />
              <input type="text" placeholder="City" className="p-3 border rounded" value={formData.location.city} onChange={e => setFormData({...formData, location: {...formData.location, city: e.target.value}})} />
              <input type="text" placeholder="Town / Locality" className="p-3 border rounded" value={formData.location.town} onChange={e => setFormData({...formData, location: {...formData.location, town: e.target.value}})} />
              <input type="text" placeholder="Pincode" className="p-3 border rounded" value={formData.location.pincode} onChange={e => setFormData({...formData, location: {...formData.location, pincode: e.target.value}})} />
            </div>
            <div className="flex gap-4">
              <button onClick={prevStep} className="border border-primary-gold text-primary-gold w-1/3 py-3 rounded-lg flex items-center justify-center gap-2"><ChevronLeft size={20}/> Back</button>
              <button onClick={nextStep} className="gold-btn flex-1 py-3 flex items-center justify-center gap-2">Next <ChevronRight size={20}/></button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-6">
            <h2 className="text-3xl font-playfair font-bold">Select Services</h2>
            <div className="grid grid-cols-2 gap-4">
              {SERVICE_LIST.map(s => {
                const isSelected = formData.services.includes(s.toLowerCase());
                return (
                  <label key={s} className={`flex items-center gap-3 p-4 border rounded-lg cursor-pointer hover:bg-primary-ivory transition-colors ${isSelected ? 'border-primary-gold bg-primary-ivory' : ''}`}>
                    <input type="checkbox" className="w-5 h-5 accent-primary-gold" checked={isSelected} onChange={() => toggleService(s)} />
                    <span className={isSelected ? 'font-bold text-primary-gold' : ''}>{s}</span>
                  </label>
                );
              })}
            </div>
            <div className="flex gap-4">
              <button onClick={prevStep} className="border border-primary-gold text-primary-gold w-1/3 py-3 rounded-lg flex items-center justify-center gap-2"><ChevronLeft size={20}/> Back</button>
              <button onClick={nextStep} className="gold-btn flex-1 py-3 flex items-center justify-center gap-2">Next <ChevronRight size={20}/></button>
            </div>
          </div>
        )}

        {step === 4 && (
          <div className="space-y-6 text-center">
            <h2 className="text-3xl font-playfair font-bold">Document Upload</h2>
            <div className="space-y-4">
              {['aadhaar', 'pan'].map(docType => {
                const doc = formData.documents.find(d => d.docType === docType);
                return (
                  <div key={docType} className="p-8 border-2 border-dashed border-primary-gold/30 rounded-xl bg-primary-ivory">
                    <Upload className="mx-auto text-primary-gold mb-4" size={48} />
                    <p className="font-medium">Upload {docType.charAt(0).toUpperCase() + docType.slice(1)} Card</p>
                    <input type="file" className="mt-4" accept="image/*,.pdf" onChange={e => handleDocumentSelect(e, docType)} />
                    {doc && <p className="mt-2 text-sm text-green-600">Selected: {doc.fileName}</p>}
                  </div>
                );
              })}
            </div>
            <div className="space-y-4">
              <input type="text" placeholder="Account Number" className="w-full p-3 border rounded" value={formData.bankDetails.accountNo} onChange={e => setFormData({...formData, bankDetails: {...formData.bankDetails, accountNo: e.target.value}})} />
              <input type="text" placeholder="IFSC Code" className="w-full p-3 border rounded" value={formData.bankDetails.ifsc} onChange={e => setFormData({...formData, bankDetails: {...formData.bankDetails, ifsc: e.target.value}})} />
              <input type="text" placeholder="UPI ID (Optional)" className="w-full p-3 border rounded" value={formData.bankDetails.upiId} onChange={e => setFormData({...formData, bankDetails: {...formData.bankDetails, upiId: e.target.value}})} />
            </div>
            <div className="flex gap-4">
              <button onClick={prevStep} className="border border-primary-gold text-primary-gold w-1/3 py-3 rounded-lg flex items-center justify-center gap-2"><ChevronLeft size={20}/> Back</button>
              <button onClick={handleFinalSubmit} disabled={submitting} className="bg-green-600 text-white flex-1 py-3 rounded-lg font-bold flex items-center justify-center gap-2 disabled:opacity-50">{submitting ? 'Submitting...' : 'Save Profile'} {!submitting && <CheckCircle size={20}/>}</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default RegisterProvider;
