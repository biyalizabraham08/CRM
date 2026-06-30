import { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { Search, Calendar, CheckCircle, Clock } from 'lucide-react';
import api from '../services/api';
import { toast } from 'react-toastify';
import { AuthContext } from '../context/AuthContext';

const FollowupListPage = () => {
  const { user } = useContext(AuthContext);
  const [followups, setFollowups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  const fetchFollowups = async () => {
    setLoading(true);
    try {
      const response = await api.get('/api/followup');
      setFollowups(response.data);
    } catch (error) {
      toast.error('Failed to load follow-ups');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFollowups();
  }, []);

  const handleStatusChange = async (id, newStatus) => {
    try {
       await api.put(`/api/followup/${id}`, { status: newStatus });
       toast.success(`Follow-up marked as ${newStatus}`);
       fetchFollowups();
    } catch (error) {
       toast.error('Failed to update status');
    }
  };

  const filteredFollowups = followups.filter(f => {
    const matchesSearch = f.lead?.name?.toLowerCase().includes(searchTerm.toLowerCase()) || f.notes?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter ? f.status === statusFilter : true;
    return matchesSearch && matchesStatus;
  });

  const upcoming = filteredFollowups.filter(f => f.status === 'Pending').sort((a, b) => new Date(a.followUpDate) - new Date(b.followUpDate));
  const completed = filteredFollowups.filter(f => f.status === 'Completed').sort((a, b) => new Date(b.followUpDate) - new Date(a.followUpDate));

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900">Follow-ups</h1>
        <p className="mt-2 text-sm text-slate-700">Manage all your upcoming and completed follow-ups.</p>
      </div>

      <div className="bg-white shadow-sm rounded-xl border border-slate-200 mb-6">
        <div className="p-4 sm:p-6 sm:flex sm:items-center sm:justify-between space-y-4 sm:space-y-0">
          <div className="relative rounded-md shadow-sm max-w-sm w-full">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <Search className="h-5 w-5 text-slate-400" aria-hidden="true" />
            </div>
            <input
              type="text"
              className="block w-full rounded-md border-slate-300 pl-10 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm py-2 border"
              placeholder="Search by lead name or notes..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="w-full sm:w-64">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="block w-full rounded-md border-slate-300 py-2 pl-3 pr-10 text-base focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm border"
            >
              <option value="">All Statuses</option>
              <option value="Pending">Pending</option>
              <option value="Completed">Completed</option>
            </select>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Upcoming Timeline */}
        <div className="bg-white shadow-sm rounded-xl border border-slate-200 overflow-hidden h-full flex flex-col">
           <div className="px-6 py-5 border-b border-slate-200 bg-slate-50">
              <h2 className="text-lg font-semibold text-slate-900 flex items-center">
                <Clock className="h-5 w-5 mr-2 text-amber-500" /> Upcoming Follow-ups
              </h2>
           </div>
           <div className="p-6 flex-1 overflow-y-auto">
             {loading ? <div className="text-center py-4 text-slate-500">Loading...</div> : upcoming.length > 0 ? (
                <div className="flow-root">
                  <ul className="-mb-8">
                    {upcoming.map((followup, idx) => (
                        <li key={followup._id}>
                          <div className="relative pb-8">
                            {idx !== upcoming.length - 1 ? (
                              <span className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-slate-200" aria-hidden="true" />
                            ) : null}
                            <div className="relative flex space-x-3">
                              <div>
                                <span className="h-8 w-8 rounded-full flex items-center justify-center ring-8 ring-white bg-amber-100">
                                  <Clock className="h-4 w-4 text-amber-600" aria-hidden="true" />
                                </span>
                              </div>
                              <div className="min-w-0 flex-1 pt-1.5 flex justify-between space-x-4">
                                <div>
                                  <Link to={`/leads/${followup.lead?._id}`} className="text-sm font-medium text-slate-900 hover:text-indigo-600">
                                    {followup.lead?.name || 'Unknown Lead'}
                                  </Link>
                                  <p className="mt-1 text-sm text-slate-500">{followup.notes}</p>
                                </div>
                                <div className="text-right flex flex-col items-end">
                                  <span className="text-xs font-medium text-slate-500">
                                    {new Date(followup.followUpDate).toLocaleDateString()}
                                  </span>
                                  <button onClick={() => handleStatusChange(followup._id, 'Completed')} className="mt-2 text-xs font-medium text-indigo-600 hover:text-indigo-900">Mark Completed</button>
                                </div>
                              </div>
                            </div>
                          </div>
                        </li>
                    ))}
                  </ul>
                </div>
             ) : (
                <div className="text-center py-8 text-slate-500">No upcoming follow-ups found.</div>
             )}
           </div>
        </div>

        {/* Completed Timeline */}
        <div className="bg-white shadow-sm rounded-xl border border-slate-200 overflow-hidden h-full flex flex-col">
           <div className="px-6 py-5 border-b border-slate-200 bg-slate-50">
              <h2 className="text-lg font-semibold text-slate-900 flex items-center">
                <CheckCircle className="h-5 w-5 mr-2 text-emerald-500" /> Completed Follow-ups
              </h2>
           </div>
           <div className="p-6 flex-1 overflow-y-auto">
             {loading ? <div className="text-center py-4 text-slate-500">Loading...</div> : completed.length > 0 ? (
                <div className="flow-root">
                  <ul className="-mb-8">
                    {completed.map((followup, idx) => (
                        <li key={followup._id}>
                          <div className="relative pb-8">
                            {idx !== completed.length - 1 ? (
                              <span className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-slate-200" aria-hidden="true" />
                            ) : null}
                            <div className="relative flex space-x-3">
                              <div>
                                <span className="h-8 w-8 rounded-full flex items-center justify-center ring-8 ring-white bg-emerald-100">
                                  <CheckCircle className="h-4 w-4 text-emerald-600" aria-hidden="true" />
                                </span>
                              </div>
                              <div className="min-w-0 flex-1 pt-1.5 flex justify-between space-x-4">
                                <div>
                                  <Link to={`/leads/${followup.lead?._id}`} className="text-sm font-medium text-slate-900 hover:text-indigo-600">
                                    {followup.lead?.name || 'Unknown Lead'}
                                  </Link>
                                  <p className="mt-1 text-sm text-slate-500">{followup.notes}</p>
                                </div>
                                <div className="text-right flex flex-col items-end">
                                  <span className="text-xs font-medium text-slate-500">
                                    {new Date(followup.followUpDate).toLocaleDateString()}
                                  </span>
                                  <button onClick={() => handleStatusChange(followup._id, 'Pending')} className="mt-2 text-xs font-medium text-slate-500 hover:text-slate-700">Reopen</button>
                                </div>
                              </div>
                            </div>
                          </div>
                        </li>
                    ))}
                  </ul>
                </div>
             ) : (
                <div className="text-center py-8 text-slate-500">No completed follow-ups found.</div>
             )}
           </div>
        </div>
      </div>
    </div>
  );
};

export default FollowupListPage;
