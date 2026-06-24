import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import api from '../services/api';

const Spinner = ({ size = 'md' }) => {
  const sizes = { sm: 'h-4 w-4 border-2', md: 'h-8 w-8 border-2', lg: 'h-12 w-12 border-4' };
  return <div className={`animate-spin rounded-full border-b-transparent border-white ${sizes[size]}`}></div>;
};

const RegisterPage = () => {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      await api.post('/api/auth/register', data);
      toast.success('Registration successful! Please login.');
      navigate('/login');
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to register');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
        <div>
          <label className="block text-sm font-medium text-slate-700">Full Name</label>
          <div className="mt-1">
            <input
              type="text"
              {...register('name', { required: 'Name is required' })}
              className={`appearance-none block w-full px-3 py-2 border ${errors.name ? 'border-red-300' : 'border-slate-300'} rounded-md shadow-sm placeholder-slate-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
            />
            {errors.name && <p className="mt-2 text-sm text-red-600">{errors.name.message}</p>}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700">Email address</label>
          <div className="mt-1">
            <input
              type="email"
              {...register('email', { required: 'Email is required' })}
              className={`appearance-none block w-full px-3 py-2 border ${errors.email ? 'border-red-300' : 'border-slate-300'} rounded-md shadow-sm placeholder-slate-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
            />
            {errors.email && <p className="mt-2 text-sm text-red-600">{errors.email.message}</p>}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700">Password</label>
          <div className="mt-1">
            <input
              type="password"
              {...register('password', { required: 'Password is required' })}
              className={`appearance-none block w-full px-3 py-2 border ${errors.password ? 'border-red-300' : 'border-slate-300'} rounded-md shadow-sm placeholder-slate-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
            />
            {errors.password && <p className="mt-2 text-sm text-red-600">{errors.password.message}</p>}
          </div>
        </div>

        <div>
          <button
            type="submit"
            disabled={loading}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-400 transition-colors"
          >
            {loading ? <Spinner size="sm" /> : 'Register'}
          </button>
        </div>
      </form>
      
      <div className="mt-6">
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-slate-300" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white text-slate-500">Already have an account?</span>
          </div>
        </div>
        <div className="mt-6">
          <Link
            to="/login"
            className="w-full flex justify-center py-2 px-4 border border-slate-300 rounded-md shadow-sm text-sm font-medium text-slate-700 bg-white hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
          >
            Log in
          </Link>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
