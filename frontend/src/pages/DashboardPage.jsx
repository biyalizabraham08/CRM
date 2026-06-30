import { useState, useEffect, useContext } from 'react';
import { Users, UserCheck, Clock, Calendar, Percent, ArrowRight, CheckCircle, UserPlus } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { toast } from 'react-toastify';
import { AuthContext } from '../context/AuthContext';

const StatCard = ({ title, value, icon: Icon, colorClass }) => (
  <div className="bg-white overflow-hidden shadow-sm rounded-xl border border-slate-200 p-5 flex items-center transition-all hover:shadow-md">
    <div className={`p-3 rounded-lg shadow-sm ${colorClass} shrink-0`}>
      <Icon className="h-6 w-6 text-white" />
    </div>
    <div className="ml-4 min-w-0 flex-1">
      <p className="text-sm font-medium text-slate-500 leading-tight">{title}</p>
      <p className="mt-1 text-2xl font-semibold text-slate-900">{value}</p>
    </div>
  </div>
);

const COLORS = ['#6366f1', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#64748b'];

const DashboardPage = () => {
  const { user } = useContext(AuthContext);
  const [stats, setStats] = useState({
    total: 0,
    convertedLeads: 0,
    pendingFollowUps: 0,
    todaysFollowUps: 0,
    recentLeads: [],
    upcomingFollowUps: [],
    statusDistribution: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await api.get('/api/dashboard');
        setStats(response.data);
      } catch (error) {
        toast.error('Failed to load dashboard statistics');
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) {
    return <div className="flex justify-center items-center h-64"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div></div>;
  }

  const conversionRate = stats.total > 0 ? ((stats.convertedLeads / stats.total) * 100).toFixed(1) : 0;

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
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-slate-900">Dashboard Overview</h1>
        {user?.role === 'admin' && (
          <Link
            to="/employees"
            state={{ openAddModal: true }}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
          >
            <UserPlus className="h-4 w-4 mr-2" />
            Add Employee
          </Link>
        )}
      </div>
      
      {/* KPI Cards */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-5 mb-8">
        {user?.role === 'admin' ? (
          <StatCard title="Total Leads" value={stats.total || 0} icon={Users} colorClass="bg-indigo-500" />
        ) : (
          <StatCard title="My Leads" value={stats.total || 0} icon={Users} colorClass="bg-indigo-500" />
        )}
        <StatCard title="Converted Leads" value={stats.convertedLeads || 0} icon={UserCheck} colorClass="bg-emerald-500" />
        <StatCard title="Pending Follow-ups" value={stats.pendingFollowUps || 0} icon={Clock} colorClass="bg-amber-500" />
        <StatCard title="Today's Follow-ups" value={stats.todaysFollowUps || 0} icon={Calendar} colorClass="bg-red-500" />
        {user?.role === 'admin' && (
          <>
            <StatCard title="Conversion Rate" value={`${conversionRate}%`} icon={Percent} colorClass="bg-violet-500" />
            <StatCard title="Total Employees" value={stats.totalEmployees || 0} icon={Users} colorClass="bg-blue-500" />
          </>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column (Chart and Recent Leads) */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Status Distribution Chart */}
          <div className="bg-white shadow-sm rounded-xl border border-slate-200 p-6">
            <h2 className="text-lg font-semibold text-slate-900 mb-6">Lead Status Distribution</h2>
            <div className="h-72">
              {stats.statusDistribution?.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={stats.statusDistribution}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      paddingAngle={5}
                      dataKey="value"
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                      {stats.statusDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => [`${value} leads`, 'Count']} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex h-full items-center justify-center text-slate-500">No data available</div>
              )}
            </div>
          </div>

          {/* Recent Leads Table */}
          <div className="bg-white shadow-sm rounded-xl border border-slate-200 overflow-hidden">
            <div className="px-6 py-5 border-b border-slate-200 flex justify-between items-center bg-slate-50">
              <h2 className="text-lg font-semibold text-slate-900">Recent Leads</h2>
              <Link to="/leads" className="text-sm font-medium text-indigo-600 hover:text-indigo-800 flex items-center">
                View All <ArrowRight className="h-4 w-4 ml-1" />
              </Link>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-slate-200">
                <thead className="bg-white">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Name</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Company</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</th>
                    <th scope="col" className="relative px-6 py-3"><span className="sr-only">Action</span></th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-slate-200">
                  {stats.recentLeads?.length > 0 ? (
                    stats.recentLeads.map((lead) => (
                      <tr key={lead._id} className="hover:bg-slate-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900">{lead.name}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">{lead.company || '-'}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          <span className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${getStatusColor(lead.status)}`}>
                            {lead.status || 'New'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <Link to={`/leads/${lead._id}`} className="text-indigo-600 hover:text-indigo-900">View</Link>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="4" className="px-6 py-8 text-center text-sm text-slate-500">No recent leads found.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right Column (Upcoming Follow-ups) */}
        <div className="lg:col-span-1 space-y-8">
          <div className="bg-white shadow-sm rounded-xl border border-slate-200 overflow-hidden h-full flex flex-col">
            <div className="px-6 py-5 border-b border-slate-200 bg-slate-50">
              <h2 className="text-lg font-semibold text-slate-900 flex items-center">
                <Calendar className="h-5 w-5 mr-2 text-indigo-600" /> Upcoming Follow-ups
              </h2>
            </div>
            <div className="p-6 flex-1 overflow-y-auto">
              {stats.upcomingFollowUps?.length > 0 ? (
                <div className="flow-root">
                  <ul className="-mb-8">
                    {stats.upcomingFollowUps.map((followup, idx) => {
                      const date = new Date(followup.followUpDate);
                      const today = new Date();
                      const tomorrow = new Date(today);
                      tomorrow.setDate(tomorrow.getDate() + 1);
                      
                      let dateLabel = date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
                      if (date.toDateString() === today.toDateString()) {
                        dateLabel = 'Today';
                      } else if (date.toDateString() === tomorrow.toDateString()) {
                        dateLabel = 'Tomorrow';
                      }

                      return (
                        <li key={followup._id}>
                          <div className="relative pb-8">
                            {idx !== stats.upcomingFollowUps.length - 1 ? (
                              <span className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-slate-200" aria-hidden="true" />
                            ) : null}
                            <div className="relative flex space-x-3">
                              <div>
                                <span className={`h-8 w-8 rounded-full flex items-center justify-center ring-8 ring-white ${dateLabel === 'Today' ? 'bg-amber-100' : 'bg-indigo-100'}`}>
                                  <Clock className={`h-4 w-4 ${dateLabel === 'Today' ? 'text-amber-600' : 'text-indigo-600'}`} aria-hidden="true" />
                                </span>
                              </div>
                              <div className="min-w-0 flex-1 pt-1.5 flex justify-between space-x-4">
                                <div>
                                  <Link to={`/leads/${followup.lead?._id}`} className="text-sm font-medium text-slate-900 hover:text-indigo-600">
                                    {followup.lead?.name || 'Unknown Lead'}
                                  </Link>
                                  <p className="mt-1 text-sm text-slate-500">{followup.notes}</p>
                                </div>
                                <div className="text-right text-xs whitespace-nowrap font-medium text-slate-500">
                                  📅 {dateLabel}
                                </div>
                              </div>
                            </div>
                          </div>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-48 text-center">
                  <div className="bg-slate-100 p-3 rounded-full mb-3">
                    <CheckCircle className="h-6 w-6 text-emerald-500" />
                  </div>
                  <p className="text-sm font-medium text-slate-900">All caught up!</p>
                  <p className="text-sm text-slate-500 mt-1">No upcoming follow-ups scheduled.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
