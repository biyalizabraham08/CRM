import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, User, Phone, Mail, Building, Briefcase, Calendar, CheckCircle } from 'lucide-react';
import { useForm } from 'react-hook-form';
import api from '../services/api';
import { toast } from 'react-toastify';

const LeadDetailsPage = () => {
  const { id } = useParams();
  const [lead, setLead] = useState(null);
  const [followups, setFollowups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [addingFollowup, setAddingFollowup] = useState(false);
  const { register, handleSubmit, reset, formState: { errors } } = useForm();

  const fetchData = async () => {
    try {
      const [leadRes, followupsRes] = await Promise.all([
        api.get(`/api/lead/${id}`),
        api.get(`/api/followup/lead/${id}`)
      ]);
      setLead(leadRes.data);
      setFollowups(followupsRes.data || []);
    } catch (error) {
      toast.error('Failed to load details');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [id]);

  const onAddFollowup = async (data) => {
    setAddingFollowup(true);
    try {
      await api.post('/api/followup', { ...data, lead: id });
      toast.success('Follow-up added successfully');
      reset();
      fetchData(); // Refresh list
    } catch (error) {
      toast.error('Failed to add follow-up');
    } finally {
      setAddingFollowup(false);
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center h-64"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div></div>;
  }

  if (!lead) {
    return <div className="text-center py-10">Lead not found</div>;
  }

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'new': return 'bg-blue-100 text-blue-800';
      case 'contacted': return 'bg-amber-100 text-amber-800';
      case 'qualified': return 'bg-indigo-100 text-indigo-800';
      case 'converted': return 'bg-emerald-100 text-emerald-800';
      case 'lost': return 'bg-red-100 text-red-800';
      default: return 'bg-slate-100 text-slate-800';
    }
  };

  return (
    <div>
      <div className="mb-6 flex items-center">
        <Link to="/leads" className="mr-4 p-2 rounded-full hover:bg-slate-200 text-slate-500 transition-colors">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-slate-900">{lead.name}</h1>
          <p className="mt-1 text-sm text-slate-500">View detailed information and follow-up history.</p>
        </div>
        <div className="ml-auto">
          <Link
            to={`/leads/${id}/edit`}
            className="inline-flex items-center rounded-md border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm hover:bg-slate-50 focus:outline-none transition-colors"
          >
            Edit Lead
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Lead Info */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white shadow-sm rounded-xl border border-slate-200 p-6">
            <h2 className="text-lg font-semibold text-slate-900 mb-4 border-b pb-2">Contact Information</h2>
            <div className="space-y-4">
              <div className="flex items-start">
                <User className="h-5 w-5 text-slate-400 mt-0.5 mr-3 flex-shrink-0" />
                <div>
                  <p className="text-xs font-medium text-slate-500 uppercase">Name</p>
                  <p className="text-sm text-slate-900 font-medium">{lead.name}</p>
                </div>
              </div>
              <div className="flex items-start">
                <Mail className="h-5 w-5 text-slate-400 mt-0.5 mr-3 flex-shrink-0" />
                <div>
                  <p className="text-xs font-medium text-slate-500 uppercase">Email</p>
                  <a href={`mailto:${lead.email}`} className="text-sm text-indigo-600 hover:underline">{lead.email}</a>
                </div>
              </div>
              <div className="flex items-start">
                <Phone className="h-5 w-5 text-slate-400 mt-0.5 mr-3 flex-shrink-0" />
                <div>
                  <p className="text-xs font-medium text-slate-500 uppercase">Mobile</p>
                  <a href={`tel:${lead.mobile}`} className="text-sm text-slate-900 hover:underline">{lead.mobile}</a>
                </div>
              </div>
              <div className="flex items-start">
                <Building className="h-5 w-5 text-slate-400 mt-0.5 mr-3 flex-shrink-0" />
                <div>
                  <p className="text-xs font-medium text-slate-500 uppercase">Company</p>
                  <p className="text-sm text-slate-900">{lead.company || '-'}</p>
                </div>
              </div>
              <div className="flex items-start">
                <Briefcase className="h-5 w-5 text-slate-400 mt-0.5 mr-3 flex-shrink-0" />
                <div>
                  <p className="text-xs font-medium text-slate-500 uppercase">Status</p>
                  <span className={`mt-1 inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold ${getStatusColor(lead.status)}`}>
                    {lead.status || 'New'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Follow-ups */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white shadow-sm rounded-xl border border-slate-200 p-6">
            <h2 className="text-lg font-semibold text-slate-900 mb-4 border-b pb-2">Add Follow-up</h2>
            <form onSubmit={handleSubmit(onAddFollowup)} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700">Notes *</label>
                <div className="mt-1">
                  <textarea
                    rows={3}
                    {...register('notes', { required: 'Notes are required' })}
                    className={`block w-full rounded-md border ${errors.notes ? 'border-red-300' : 'border-slate-300'} shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 focus:outline-none focus:ring-1`}
                    placeholder="Enter discussion notes or details..."
                  />
                  {errors.notes && <p className="mt-1 text-sm text-red-600">{errors.notes.message}</p>}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700">Follow-up Date *</label>
                <div className="mt-1">
                  <input
                    type="date"
                    {...register('followUpDate', { required: 'Date is required' })}
                    className={`block w-full rounded-md border ${errors.followUpDate ? 'border-red-300' : 'border-slate-300'} shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 focus:outline-none focus:ring-1 max-w-xs`}
                  />
                  {errors.followUpDate && <p className="mt-1 text-sm text-red-600">{errors.followUpDate.message}</p>}
                </div>
              </div>
              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={addingFollowup}
                  className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:bg-indigo-400 transition-colors"
                >
                  {addingFollowup ? 'Saving...' : 'Add Follow-up'}
                </button>
              </div>
            </form>
          </div>

          <div className="bg-white shadow-sm rounded-xl border border-slate-200 p-6">
            <h2 className="text-lg font-semibold text-slate-900 mb-6 border-b pb-2">Follow-up History</h2>
            <div className="flow-root">
              <ul className="-mb-8">
                {followups.length === 0 ? (
                  <li className="pb-8 text-sm text-slate-500 text-center">No follow-ups recorded yet.</li>
                ) : (
                  followups.map((followup, eventIdx) => (
                    <li key={followup._id}>
                      <div className="relative pb-8">
                        {eventIdx !== followups.length - 1 ? (
                          <span className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-slate-200" aria-hidden="true" />
                        ) : null}
                        <div className="relative flex space-x-3">
                          <div>
                            <span className="h-8 w-8 rounded-full bg-indigo-50 flex items-center justify-center ring-8 ring-white">
                              <CheckCircle className="h-5 w-5 text-indigo-600" aria-hidden="true" />
                            </span>
                          </div>
                          <div className="min-w-0 flex-1 pt-1.5 flex justify-between space-x-4">
                            <div>
                              <p className="text-sm text-slate-500 whitespace-pre-wrap">{followup.notes}</p>
                              {followup.nextFollowupDate && (
                                <p className="mt-2 text-xs font-medium text-slate-400 flex items-center">
                                  <Calendar className="mr-1 h-3.5 w-3.5" />
                                  Next Action: {new Date(followup.nextFollowupDate).toLocaleDateString()}
                                </p>
                              )}
                            </div>
                            <div className="text-right text-xs whitespace-nowrap text-slate-500">
                              {new Date(followup.createdAt || followup.date).toLocaleDateString()}
                            </div>
                          </div>
                        </div>
                      </div>
                    </li>
                  ))
                )}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LeadDetailsPage;
