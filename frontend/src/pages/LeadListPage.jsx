import { useState, useEffect, useContext } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Search, Edit, CalendarPlus, Trash2, Plus } from 'lucide-react';
import api from '../services/api';
import { toast } from 'react-toastify';
import { AuthContext } from '../context/AuthContext';

const LeadListPage = () => {
  const { user } = useContext(AuthContext);
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchParams] = useSearchParams();
  const assignedTo = searchParams.get('assignedTo');

  const fetchLeads = async () => {
    setLoading(true);
    try {
      let url = '/api/lead';
      let params = { page, limit: 10 };
      
      if (assignedTo) {
        params.assignedTo = assignedTo;
      }

      if (searchTerm) {
        url = '/api/lead/search';
        params = { name: searchTerm, email: searchTerm, mobile: searchTerm, ...(assignedTo && { assignedTo }) };
      } else if (statusFilter) {
        url = '/api/lead/status';
        params = { status: statusFilter, ...(assignedTo && { assignedTo }) };
      }

      const response = await api.get(url, { params });
      const data = response.data;
      setLeads(data.data || (Array.isArray(data) ? data : []));
      setTotalPages(data.pages || 1);
    } catch (error) {
      toast.error('Failed to load leads');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeads();
  }, [searchTerm, statusFilter, page, assignedTo]);

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this lead?')) {
      try {
        await api.delete(`/api/lead/${id}`);
        toast.success('Lead deleted successfully');
        fetchLeads();
      } catch (error) {
        toast.error('Failed to delete lead');
      }
    }
  };

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
      <div className="sm:flex sm:items-center sm:justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Leads</h1>
          <p className="mt-2 text-sm text-slate-700">A list of all the leads in your account including their name, company, and status.</p>
        </div>
        <div className="mt-4 sm:mt-0">
          <Link
            to="/leads/new"
            className="inline-flex items-center justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:w-auto transition-colors"
          >
            <Plus className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
            Add Lead
          </Link>
        </div>
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
              placeholder="Search by name, email or mobile..."
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
              <option value="New">New</option>
              <option value="Contacted">Contacted</option>
              <option value="Qualified">Qualified</option>
              <option value="Converted">Converted</option>
              <option value="Lost">Lost</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200">
            <thead className="bg-slate-50">
              <tr>
                <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-slate-900 sm:pl-6">Name</th>
                <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-slate-900">Email</th>
                <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-slate-900">Mobile</th>
                <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-slate-900">Company</th>
                <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-slate-900">Status</th>
                {user?.role === 'admin' && (
                  <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-slate-900">Assigned To</th>
                )}
                <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                  <span className="sr-only">Actions</span>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 bg-white">
              {loading ? (
                <tr>
                  <td colSpan="6" className="py-10 text-center">
                    <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
                  </td>
                </tr>
              ) : leads.length === 0 ? (
                <tr>
                  <td colSpan="6" className="py-10 text-center text-slate-500 text-sm">
                    No leads found.
                  </td>
                </tr>
              ) : (
                leads.map((lead) => (
                  <tr key={lead._id} className="hover:bg-slate-50 transition-colors">
                    <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-slate-900 sm:pl-6">
                      {lead.name}
                    </td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-slate-500">
                      {lead.email}
                    </td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-slate-500">
                      {lead.mobile}
                    </td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-slate-500">{lead.company}</td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm">
                      <span className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${getStatusColor(lead.status)}`}>
                        {lead.status || 'New'}
                      </span>
                    </td>
                    {user?.role === 'admin' && (
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-slate-500">
                        {lead.assignedTo ? (lead.assignedTo.name || lead.assignedTo.username) : 'Unassigned'}
                      </td>
                    )}
                    <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6 space-x-3">
                      <Link to={`/leads/${lead._id}`} className="text-indigo-600 hover:text-indigo-900 inline-flex" title="Follow-up Details">
                        <CalendarPlus className="h-5 w-5" />
                      </Link>
                      <Link to={`/leads/${lead._id}/edit`} className="text-slate-600 hover:text-slate-900 inline-flex" title="Edit">
                        <Edit className="h-5 w-5" />
                      </Link>
                      <button onClick={() => handleDelete(lead._id)} className="text-red-600 hover:text-red-900 inline-flex" title="Delete">
                        <Trash2 className="h-5 w-5" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        
        {/* Pagination could go here */}
        <div className="bg-white px-4 py-3 border-t border-slate-200 sm:px-6 flex items-center justify-between rounded-b-xl">
          <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-slate-700">
                Showing page <span className="font-medium">{page}</span> of <span className="font-medium">{totalPages}</span>
              </p>
            </div>
            <div>
              <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                <button
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-slate-300 bg-white text-sm font-medium text-slate-500 hover:bg-slate-50 disabled:bg-slate-100 disabled:text-slate-400"
                >
                  Previous
                </button>
                <button
                  onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages || totalPages === 0}
                  className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-slate-300 bg-white text-sm font-medium text-slate-500 hover:bg-slate-50 disabled:bg-slate-100 disabled:text-slate-400"
                >
                  Next
                </button>
              </nav>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LeadListPage;
