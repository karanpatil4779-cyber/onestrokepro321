import { useState, useEffect } from 'react';
import { useAuth } from '../context/useAuth';
import { RecaptchaVerifier, signInWithPhoneNumber } from 'firebase/auth';
import { auth } from '../services/firebase';
import api from '../services/api';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { CheckCircle, Upload, ChevronRight, ChevronLeft } from 'lucide-react';

const SERVICE_LIST = ['Driver', 'Maid', 'Cook', 'Errand', 'Queue', 'Handyman', 'Tutor', 'Care'];

const RegisterProvider = () => {
  const [step, setStep] = useState(0);
  const [phone, setPhone] = useState('+91');
  const [otp, setOtp] = useState('');
  const [confirmationResult, setConfirmationResult] = useState(null);
  
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
  const [firebaseUser, setFirebaseUser] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    return () => {
      if (window.recaptchaVerifier) {
        try { window.recaptchaVerifier.clear(); } catch { /* ignore */ }
        delete window.recaptchaVerifier;
      }
    };
  }, []);

  const handleFallbackRegister = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...formData,
        phone,
        services: formData.services.map((service) => ({ type: service })),
      };
      const res = await api.post('/auth/register/provider', payload);
      localStorage.setItem('token', res.data.token);
      setUser(res.data.user);
      toast.success('Provider registration successful!');
      navigate('/provider/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.msg || 'Registration failed');
    }
  };

  if (!auth) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-primary-beige p-4">
        <div className="bg-white p-8 rounded-xl shadow-lg max-w-md w-full">
          <h2 className="text-3xl font-bold mb-4 text-center text-primary-gold">Quick Provider Registration</h2>
          <p className="text-sm text-charcoal/70 mb-6 text-center">
            Firebase OTP is not configured. Use this quick form to register with your phone number.
          </p>
          <form onSubmit={handleFallbackRegister} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Phone Number</label>
              <input type="text" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+91XXXXXXXXXX" className="w-full p-3 border rounded-md" required />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Full Name</label>
              <input type="text" value={formData.fullName} onChange={(e) => setFormData({ ...formData, fullName: e.target.value })} className="w-full p-3 border rounded-md" required />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Email</label>
              <input type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} className="w-full p-3 border rounded-md" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Gender</label>
              <input type="text" value={formData.gender} onChange={(e) => setFormData({ ...formData, gender: e.target.value })} className="w-full p-3 border rounded-md" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Date of Birth</label>
              <input type="date" value={formData.dob} onChange={(e) => setFormData({ ...formData, dob: e.target.value })} className="w-full p-3 border rounded-md" />
            </div>
            <button type="submit" className="gold-btn w-full py-3">Register Provider</button>
          </form>
        </div>
      </div>
    );
  }

  const nextStep = () => setStep(prev => prev + 1);
  const prevStep = () => setStep(prev => prev - 1);

  const setupRecaptcha = () => {
    if (!window.recaptchaVerifier) {
      window.recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', { 'size': 'invisible' });
    }
  };

  const sendOTP = async () => {
    try {
      setupRecaptcha();
      const result = await signInWithPhoneNumber(auth, phone, window.recaptchaVerifier);
      setConfirmationResult(result);
      toast.success('OTP sent!');
    } catch (err) {
      const msg = err.code === 'auth/too-many-requests'
        ? 'Too many attempts. Please try again later.'
        : 'Error sending OTP';
      toast.error(msg);
    }
  };

  const verifyOTP = async () => {
    try {
      const credential = await confirmationResult.confirm(otp);
      setFirebaseUser(credential.user);
      nextStep();
      toast.success('Phone verified!');
    } catch {
      toast.error('Invalid OTP');
    }
  };

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

  const handleFinalSubmit = async () => {
    try {
      setSubmitting(true);
      let idToken;
      if (firebaseUser) {
        idToken = await firebaseUser.getIdToken();
      }
      const res = await api.post('/auth/register/provider', { ...formData, phone, idToken });
      const token = res.data.token;
      const provider = res.data.user;
      localStorage.setItem('token', token);

      // Upload documents if any were selected
      if (formData.documents.length > 0) {
        for (const doc of formData.documents) {
          try {
            const blob = await fetch(doc.dataUrl).then(r => r.blob());
            const file = new File([blob], doc.fileName, { type: blob.type });
            const uploadData = new FormData();
            uploadData.append('document', file);
            uploadData.append('docType', doc.docType);
            uploadData.append('providerId', provider._id);
            await api.post('/providers/upload-doc', uploadData, {
              headers: { 'Content-Type': 'multipart/form-data' }
            });
          } catch (uploadErr) {
            console.error(`Failed to upload ${doc.docType}:`, uploadErr);
          }
        }
      }

      setUser(provider);
      toast.success('Registration submitted for review!');
      navigate('/provider/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.msg || 'Registration failed');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-primary-beige p-6">
      <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-xl p-8 gold-border">
        {/* Progress Bar */}
        <div className="flex justify-between mb-10">
          {[0, 1, 2, 3, 4, 5].map((i) => (
            <div key={i} className={`h-2 flex-1 mx-1 rounded-full ${step >= i ? 'bg-primary-gold' : 'bg-gray-200'}`} />
          ))}
        </div>

        {step === 0 && (
          <div className="space-y-6">
            <h2 className="text-3xl font-playfair font-bold text-center">Verify Phone / फ़ोन सत्यापन</h2>
            {!confirmationResult ? (
              <div className="space-y-4">
                <input type="text" value={phone} onChange={e => setPhone(e.target.value)} className="w-full p-4 border rounded-lg outline-none focus:ring-2 focus:ring-primary-gold" />
                <div id="recaptcha-container"></div>
                <button onClick={sendOTP} className="gold-btn w-full py-4 text-lg">Send OTP</button>
              </div>
            ) : (
              <div className="space-y-4">
                <input type="text" value={otp} onChange={e => setOtp(e.target.value)} placeholder="Enter 6-digit OTP" className="w-full p-4 border rounded-lg outline-none focus:ring-2 focus:ring-primary-gold text-center tracking-widest text-xl" />
                <button onClick={verifyOTP} className="gold-btn w-full py-4 text-lg">Verify & Continue</button>
              </div>
            )}
          </div>
        )}

        {step === 1 && (
          <div className="space-y-6">
            <h2 className="text-3xl font-playfair font-bold">Personal Info / व्यक्तिगत जानकारी</h2>
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
            <h2 className="text-3xl font-playfair font-bold">Location Details / स्थान का विवरण</h2>
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
            <h2 className="text-3xl font-playfair font-bold">Select Services / सेवा का चयन</h2>
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
            <h2 className="text-3xl font-playfair font-bold">Document Upload / दस्तावेज़ अपलोड</h2>
            <div className="space-y-4">
              {['aadhaar', 'pan'].map(docType => {
                const doc = formData.documents.find(d => d.docType === docType);
                return (
                  <div key={docType} className="p-8 border-2 border-dashed border-primary-gold/30 rounded-xl bg-primary-ivory">
                    <Upload className="mx-auto text-primary-gold mb-4" size={48} />
                    <p className="font-medium">Upload {docType.charAt(0).toUpperCase() + docType.slice(1)} Card</p>
                    <input type="file" className="mt-4" accept="image/*,.pdf" onChange={e => handleDocumentSelect(e, docType)} />
                    {doc && <p className="mt-2 text-sm text-green-600">✓ {doc.fileName}</p>}
                  </div>
                );
              })}
            </div>
            <div className="flex gap-4">
              <button onClick={prevStep} className="border border-primary-gold text-primary-gold w-1/3 py-3 rounded-lg flex items-center justify-center gap-2"><ChevronLeft size={20}/> Back</button>
              <button onClick={nextStep} className="gold-btn flex-1 py-3 flex items-center justify-center gap-2">Next <ChevronRight size={20}/></button>
            </div>
          </div>
        )}

        {step === 5 && (
          <div className="space-y-6">
            <h2 className="text-3xl font-playfair font-bold">Bank Details / बैंक विवरण</h2>
            <div className="space-y-4">
              <input type="text" placeholder="Account Number" className="w-full p-3 border rounded" value={formData.bankDetails.accountNo} onChange={e => setFormData({...formData, bankDetails: {...formData.bankDetails, accountNo: e.target.value}})} />
              <input type="text" placeholder="IFSC Code" className="w-full p-3 border rounded" value={formData.bankDetails.ifsc} onChange={e => setFormData({...formData, bankDetails: {...formData.bankDetails, ifsc: e.target.value}})} />
              <input type="text" placeholder="UPI ID (Optional)" className="w-full p-3 border rounded" value={formData.bankDetails.upiId} onChange={e => setFormData({...formData, bankDetails: {...formData.bankDetails, upiId: e.target.value}})} />
            </div>
            <div className="flex gap-4">
              <button onClick={prevStep} className="border border-primary-gold text-primary-gold w-1/3 py-3 rounded-lg flex items-center justify-center gap-2"><ChevronLeft size={20}/> Back</button>
              <button onClick={handleFinalSubmit} disabled={submitting} className="bg-green-600 text-white flex-1 py-3 rounded-lg font-bold flex items-center justify-center gap-2 disabled:opacity-50">{submitting ? 'Submitting...' : 'Submit for Review'} {!submitting && <CheckCircle size={20}/>}</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default RegisterProvider;
