import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import api from '../services/api';
import { toast } from 'react-toastify';

const LeadFormPage = () => {
  const { id } = useParams();
  const isEditMode = !!id;
  const navigate = useNavigate();
  const { register, handleSubmit, setValue, formState: { errors } } = useForm();
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(isEditMode);

  useEffect(() => {
    if (isEditMode) {
      const fetchLead = async () => {
        try {
          const response = await api.get(`/api/lead/${id}`);
          const lead = response.data;
          setValue('name', lead.name);
          setValue('email', lead.email);
          setValue('mobile', lead.mobile);
          setValue('company', lead.company);
          setValue('status', lead.status);
        } catch (error) {
          toast.error('Failed to load lead details');
          navigate('/leads');
        } finally {
          setInitialLoading(false);
        }
      };
      fetchLead();
    }
  }, [id, isEditMode, setValue, navigate]);

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      if (isEditMode) {
        await api.put(`/api/lead/${id}`, data);
        toast.success('Lead updated successfully');
      } else {
        await api.post('/api/lead', data);
        toast.success('Lead created successfully');
      }
      navigate('/leads');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to save lead');
    } finally {
      setLoading(false);
    }
  };

  if (initialLoading) {
    return <div className="flex justify-center items-center h-64"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div></div>;
  }

  return (
    <div>
      <div className="mb-6 flex items-center">
        <Link to="/leads" className="mr-4 p-2 rounded-full hover:bg-slate-200 text-slate-500 transition-colors">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-slate-900">{isEditMode ? 'Edit Lead' : 'Add New Lead'}</h1>
          <p className="mt-1 text-sm text-slate-500">
            {isEditMode ? 'Update the details for this lead.' : 'Fill in the information below to create a new lead.'}
          </p>
        </div>
      </div>

      <div className="bg-white shadow-sm rounded-xl border border-slate-200 overflow-hidden">
        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-6">
          <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-slate-700">Full Name *</label>
              <div className="mt-1">
                <input
                  type="text"
                  {...register('name', { required: 'Name is required' })}
                  className={`block w-full rounded-md border ${errors.name ? 'border-red-300' : 'border-slate-300'} px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 sm:text-sm`}
                />
                {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700">Email Address *</label>
              <div className="mt-1">
                <input
                  type="email"
                  {...register('email', { required: 'Email is required' })}
                  className={`block w-full rounded-md border ${errors.email ? 'border-red-300' : 'border-slate-300'} px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 sm:text-sm`}
                />
                {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700">Mobile Number *</label>
              <div className="mt-1">
                <input
                  type="text"
                  {...register('mobile', { required: 'Mobile number is required' })}
                  className={`block w-full rounded-md border ${errors.mobile ? 'border-red-300' : 'border-slate-300'} px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 sm:text-sm`}
                />
                {errors.mobile && <p className="mt-1 text-sm text-red-600">{errors.mobile.message}</p>}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700">Company</label>
              <div className="mt-1">
                <input
                  type="text"
                  {...register('company')}
                  className="block w-full rounded-md border border-slate-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 sm:text-sm"
                />
              </div>
            </div>

            {isEditMode && (
              <div>
                <label className="block text-sm font-medium text-slate-700">Status</label>
                <div className="mt-1">
                  <select
                    {...register('status')}
                    className="block w-full rounded-md border border-slate-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 sm:text-sm"
                  >
                    <option value="New">New</option>
                    <option value="Contacted">Contacted</option>
                    <option value="Qualified">Qualified</option>
                    <option value="Converted">Converted</option>
                    <option value="Lost">Lost</option>
                  </select>
                </div>
              </div>
            )}
          </div>

          <div className="pt-5 border-t border-slate-200 flex justify-end space-x-3">
            <Link
              to="/leads"
              className="rounded-md border border-slate-300 bg-white py-2 px-4 text-sm font-medium text-slate-700 shadow-sm hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-colors"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={loading}
              className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:bg-indigo-400 transition-colors"
            >
              {loading ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Saving...
                </div>
              ) : (
                'Save Lead'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LeadFormPage;
