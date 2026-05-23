import { useCallback, useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import api from '../services/api';
import toast from 'react-hot-toast';
import { ShieldCheck, Eye, CheckCircle, XCircle, FileText, ExternalLink } from 'lucide-react';

const AdminDashboard = () => {
  const [pendingProviders, setPendingProviders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedProvider, setSelectedProvider] = useState(null);

  const fetchPending = useCallback(async () => {
    try {
      setLoading(true);
      const res = await api.get('/providers/pending');
      setPendingProviders(res.data);
    } catch {
      toast.error("Failed to load pending queue");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    queueMicrotask(() => {
      void fetchPending();
    });
  }, [fetchPending]);

  const handleVerify = async (id, status, reason = "") => {
    try {
      await api.put(`/providers/${id}/verify`, { status, rejectionReason: reason });
      toast.success(`Provider ${status} successfully`);
      setSelectedProvider(null);
      fetchPending();
    } catch {
      toast.error("Verification update failed");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <main className="max-w-7xl mx-auto p-6">
        <div className="flex items-center gap-3 mb-8">
          <ShieldCheck className="text-primary-gold" size={32} />
          <h1 className="text-3xl font-playfair font-bold text-charcoal">Admin Verification Queue</h1>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* List Section */}
          <div className="lg:col-span-1 space-y-4">
            <h2 className="text-sm font-bold uppercase tracking-widest text-charcoal/40 mb-4">Pending Providers ({pendingProviders.length})</h2>
            {loading ? (
              <p>Loading queue...</p>
            ) : pendingProviders.length > 0 ? (
              pendingProviders.map(p => (
                <div 
                  key={p._id}
                  onClick={() => setSelectedProvider(p)}
                  className={`p-4 rounded-xl border cursor-pointer transition-all ${
                    selectedProvider?._id === p._id 
                    ? 'bg-primary-gold text-white border-primary-gold shadow-lg' 
                    : 'bg-white border-gray-100 hover:border-primary-gold'
                  }`}
                >
                  <p className="font-bold">{p.fullName}</p>
                  <p className={`text-xs ${selectedProvider?._id === p._id ? 'text-white/70' : 'text-charcoal/50'}`}>
                    {(p.services || []).map(s => s.type).join(', ')} • {p.location?.city || ''}
                  </p>
                </div>
              ))
            ) : (
              <div className="bg-white p-8 rounded-xl border border-dashed border-gray-200 text-center">
                <CheckCircle className="mx-auto text-green-500 mb-2 opacity-20" size={32} />
                <p className="text-sm text-charcoal/40">Queue is empty. Good job!</p>
              </div>
            )}
          </div>

          {/* Details Section */}
          <div className="lg:col-span-2">
            {selectedProvider ? (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-8 border-b border-gray-50">
                  <div className="flex justify-between items-start">
                    <div className="flex gap-6 items-center">
                      <img src={selectedProvider.profilePhoto || 'https://via.placeholder.com/100'} className="w-20 h-20 rounded-2xl object-cover border" alt="" />
                      <div>
                        <h2 className="text-2xl font-bold">{selectedProvider.fullName}</h2>
                        <p className="text-charcoal/50">{selectedProvider.phone} • {selectedProvider.email || 'No Email'}</p>
                        <p className="text-xs mt-1 bg-gray-100 px-2 py-1 rounded inline-block">Registered on: {new Date(selectedProvider.createdAt).toLocaleDateString()}</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button 
                        onClick={() => handleVerify(selectedProvider._id, 'approved')}
                        className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 hover:bg-green-700"
                      >
                        <CheckCircle size={16} /> Approve
                      </button>
                      <button 
                        onClick={() => {
                          const reason = prompt("Reason for rejection:");
                          if(reason) handleVerify(selectedProvider._id, 'rejected', reason);
                        }}
                        className="bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 hover:bg-red-700"
                      >
                        <XCircle size={16} /> Reject
                      </button>
                    </div>
                  </div>
                </div>

                <div className="p-8 space-y-8">
                  {/* Documents */}
                  <div>
                    <h3 className="font-bold mb-4 flex items-center gap-2 text-charcoal/60 uppercase text-xs tracking-widest">
                      <FileText size={16} /> Identity Documents
                    </h3>
                    <div className="grid md:grid-cols-2 gap-4">
                      {(selectedProvider.documents || []).map((doc, i) => (
                        <div key={i} className="border rounded-xl p-4 bg-gray-50 group">
                          <div className="flex justify-between items-center mb-4">
                            <span className="text-sm font-bold uppercase">{doc.docType.replace('_', ' ')}</span>
                            <a href={doc.fileUrl} target="_blank" rel="noreferrer" className="text-primary-gold hover:underline flex items-center gap-1 text-xs">
                              View Full <ExternalLink size={12} />
                            </a>
                          </div>
                          <div className="aspect-video bg-gray-200 rounded-lg overflow-hidden relative">
                             {doc.fileUrl?.endsWith('.pdf') ? (
                               <div className="w-full h-full flex items-center justify-center text-charcoal/30 font-bold">PDF DOCUMENT</div>
                             ) : (
                               <img src={doc.fileUrl} className="w-full h-full object-cover" alt="" />
                             )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Other Info */}
                  <div className="grid md:grid-cols-2 gap-8 pt-4 border-t border-gray-50">
                    <div>
                      <h3 className="font-bold mb-2 uppercase text-xs tracking-widest text-charcoal/40">Location</h3>
                      <p className="text-sm">{selectedProvider.location?.town || ''}, {selectedProvider.location?.city || ''}, {selectedProvider.location?.state || ''} - {selectedProvider.location?.pincode || ''}</p>
                    </div>
                    <div>
                      <h3 className="font-bold mb-2 uppercase text-xs tracking-widest text-charcoal/40">Bank Details</h3>
                      <p className="text-sm"><b>Acc:</b> {selectedProvider.bankDetails?.accountNo || 'N/A'}</p>
                      <p className="text-sm"><b>IFSC:</b> {selectedProvider.bankDetails?.ifsc || 'N/A'}</p>
                      <p className="text-sm"><b>UPI:</b> {selectedProvider.bankDetails?.upiId || 'N/A'}</p>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-2xl border-2 border-dashed border-gray-200 p-20 text-center flex flex-col items-center justify-center">
                <Eye className="text-charcoal/10 mb-4" size={64} />
                <p className="text-charcoal/40 font-medium">Select a provider from the queue to view their documents and verify profile.</p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
