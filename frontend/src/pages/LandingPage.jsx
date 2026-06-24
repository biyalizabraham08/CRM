import React, { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Play, CheckCircle, TrendingUp, Users, UserPlus, Calendar, Award, BarChart2 } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';
import { toast } from 'react-toastify';
import api from '../services/api';

const Spinner = ({ size = 'md' }) => {
  const sizes = { sm: 'h-4 w-4 border-2', md: 'h-8 w-8 border-2', lg: 'h-12 w-12 border-4' };
  return <div className={`animate-spin rounded-full border-b-transparent border-current ${sizes[size]}`}></div>;
};

const LandingPage = () => {
  const { isAuthenticated, login } = useContext(AuthContext);
  const [isDemoLoading, setIsDemoLoading] = useState(false);
  const navigate = useNavigate();

  const handleDemoLogin = async () => {
    setIsDemoLoading(true);
    try {
      const response = await api.post('/api/auth/demo');
      login(response.data.token);
      toast.success('Welcome to the Demo Sandbox!');
      navigate('/dashboard');
    } catch (error) {
      toast.error('Failed to launch demo mode');
    } finally {
      setIsDemoLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      {/* Navigation */}
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex justify-between items-center relative z-10">
        <div className="flex items-center">
          <div className="h-8 w-8 rounded-lg bg-indigo-600 flex items-center justify-center mr-2 shadow-sm">
             <span className="text-white font-bold text-lg">C</span>
          </div>
          <span className="text-slate-900 text-xl font-bold tracking-tight">CRM Pro</span>
        </div>
        <div className="flex space-x-4 items-center">
          {isAuthenticated ? (
            <Link to="/dashboard" className="bg-indigo-600 text-white hover:bg-indigo-700 px-5 py-2 rounded-md font-medium shadow-sm transition-colors">
              Go to Dashboard
            </Link>
          ) : (
            <>
              <Link to="/login" className="text-slate-600 hover:text-slate-900 font-medium px-3 py-2 transition-colors">
                Log in
              </Link>
              <Link to="/register" className="bg-indigo-600 text-white hover:bg-indigo-700 px-5 py-2 rounded-md font-medium shadow-sm transition-colors">
                Get Started
              </Link>
            </>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-24 md:pt-24 md:pb-32 relative">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-8 items-center">
          
          {/* Left Content */}
          <div className="max-w-xl relative z-10">
            <h1 className="text-5xl md:text-6xl font-extrabold text-slate-900 leading-tight tracking-tight mb-6">
              Building Stronger <br className="hidden md:block"/>Connections with <br className="hidden md:block"/>Customers
            </h1>
            <p className="text-lg text-slate-500 mb-8 leading-relaxed">
              Unlocking customer insights, streamlining sales processes, and enhancing customer satisfaction through effective CRM Implementation.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 mb-8">
              {isAuthenticated ? (
                <Link to="/dashboard" className="bg-blue-600 text-white hover:bg-blue-700 px-8 py-3.5 rounded-lg font-medium shadow-md text-center transition-colors">
                  Go to Dashboard
                </Link>
              ) : (
                <Link to="/register" className="bg-blue-600 text-white hover:bg-blue-700 px-8 py-3.5 rounded-lg font-medium shadow-md text-center transition-colors">
                  Start Free Trial
                </Link>
              )}
              <button 
                onClick={handleDemoLogin}
                disabled={isDemoLoading}
                className="bg-white text-slate-700 border border-slate-300 hover:bg-slate-50 px-8 py-3.5 rounded-lg font-medium shadow-sm flex items-center justify-center transition-colors disabled:bg-slate-100 disabled:text-slate-400"
              >
                {isDemoLoading ? (
                  <Spinner size="sm" />
                ) : (
                  <>
                    <Play className="h-5 w-5 text-blue-600 mr-2" fill="currentColor" />
                    Watch Demo
                  </>
                )}
              </button>
            </div>
            
            <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-8 text-sm font-medium text-slate-600">
              <div className="flex items-center">
                <CheckCircle className="h-5 w-5 text-blue-600 mr-2" />
                Free for 15 users
              </div>
              <div className="flex items-center">
                <CheckCircle className="h-5 w-5 text-blue-600 mr-2" />
                No credit card required
              </div>
            </div>
          </div>

          {/* Right Content / Image with Floating Cards */}
          <div className="relative mx-auto w-full max-w-lg lg:max-w-none">
            {/* Background Decor */}
            <div className="absolute top-10 -right-10 w-64 h-8 bg-green-200 rounded-full mix-blend-multiply opacity-70 transform rotate-3"></div>
            <div className="absolute -bottom-10 left-10 w-16 h-64 bg-green-200 rounded-full mix-blend-multiply opacity-70"></div>
            
            <div className="relative">
              <img 
                src="/hero-image.png" 
                alt="Professional CRM User" 
                className="w-full h-auto object-cover object-top rounded-2xl z-0 relative shadow-xl border border-slate-100 bg-white"
              />
              
              {/* Floating Card 1: Active Deals */}
              <div className="absolute top-1/4 -left-12 bg-white p-5 rounded-xl shadow-lg border border-slate-100 animate-bounce" style={{ animationDuration: '3s' }}>
                <p className="text-xs font-semibold text-slate-500 mb-1">Active Deals</p>
                <p className="text-2xl font-bold text-slate-900">$270,000</p>
                <div className="mt-2 flex items-center text-xs font-medium text-emerald-600 bg-emerald-50 px-2 py-1 rounded-md inline-flex">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  2.5%
                  <span className="text-slate-400 ml-2 font-normal">$250K</span>
                </div>
              </div>

              {/* Floating Card 2: Users Help */}
              <div className="absolute bottom-1/4 -right-8 bg-blue-600 p-5 rounded-xl shadow-lg border border-blue-500 text-white transform hover:scale-105 transition-transform duration-300">
                <div className="flex justify-between items-start mb-2">
                  <p className="text-xs font-medium text-blue-100">Users help</p>
                  <Users className="h-6 w-6 text-blue-300 opacity-50 absolute right-4 top-4" />
                </div>
                <p className="text-3xl font-bold">10K</p>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* How it Works Section */}
      <div className="bg-white py-24 sm:py-32 border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-base font-semibold text-indigo-600 tracking-wide uppercase mb-2">Workflow</h2>
            <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-slate-900 sm:text-4xl">
              How CRM Pro Works
            </p>
            <p className="mt-4 max-w-2xl text-xl text-slate-500 mx-auto">
              Everything you need to turn prospects into loyal customers, organized in one seamless workflow.
            </p>
          </div>

          <div className="relative">
            {/* Connection line for desktop */}
            <div className="hidden lg:block absolute top-12 left-0 w-full h-0.5 bg-slate-100" aria-hidden="true"></div>

            <div className="grid grid-cols-1 gap-12 lg:grid-cols-4 lg:gap-8 relative">
              {/* Step 1 */}
              <div className="relative group">
                <div className="h-24 w-24 rounded-full bg-slate-50 border-4 border-white shadow-sm flex items-center justify-center mx-auto mb-6 relative z-10 group-hover:scale-110 group-hover:bg-indigo-50 transition-all duration-300">
                  <UserPlus className="h-10 w-10 text-indigo-600" />
                </div>
                <div className="bg-white rounded-xl p-5 pb-6 shadow-sm border border-slate-100 group-hover:shadow-md transition-shadow duration-300 text-center">
                  <div className="inline-flex items-center justify-center bg-indigo-100 text-indigo-700 text-xs font-bold px-2 py-1 rounded mb-4">Step 1</div>
                  <h3 className="text-lg font-bold text-slate-900 mb-2">Add Leads</h3>
                  <p className="text-slate-500 text-sm">Capture customer information and manage prospects in one place.</p>
                </div>
              </div>

              {/* Step 2 */}
              <div className="relative group">
                <div className="h-24 w-24 rounded-full bg-slate-50 border-4 border-white shadow-sm flex items-center justify-center mx-auto mb-6 relative z-10 group-hover:scale-110 group-hover:bg-indigo-50 transition-all duration-300">
                  <Calendar className="h-10 w-10 text-indigo-600" />
                </div>
                <div className="bg-white rounded-xl p-5 pb-6 shadow-sm border border-slate-100 group-hover:shadow-md transition-shadow duration-300 text-center">
                  <div className="inline-flex items-center justify-center bg-indigo-100 text-indigo-700 text-xs font-bold px-2 py-1 rounded mb-4">Step 2</div>
                  <h3 className="text-lg font-bold text-slate-900 mb-2">Track Follow-ups</h3>
                  <p className="text-slate-500 text-sm">Schedule follow-ups, add notes, and stay organized.</p>
                </div>
              </div>

              {/* Step 3 */}
              <div className="relative group">
                <div className="h-24 w-24 rounded-full bg-slate-50 border-4 border-white shadow-sm flex items-center justify-center mx-auto mb-6 relative z-10 group-hover:scale-110 group-hover:bg-indigo-50 transition-all duration-300">
                  <Award className="h-10 w-10 text-indigo-600" />
                </div>
                <div className="bg-white rounded-xl p-5 pb-6 shadow-sm border border-slate-100 group-hover:shadow-md transition-shadow duration-300 text-center">
                  <div className="inline-flex items-center justify-center bg-indigo-100 text-indigo-700 text-xs font-bold px-2 py-1 rounded mb-4">Step 3</div>
                  <h3 className="text-lg font-bold text-slate-900 mb-2">Convert Opportunities</h3>
                  <p className="text-slate-500 text-sm">Move leads through the sales pipeline and track conversions.</p>
                </div>
              </div>

              {/* Step 4 */}
              <div className="relative group">
                <div className="h-24 w-24 rounded-full bg-slate-50 border-4 border-white shadow-sm flex items-center justify-center mx-auto mb-6 relative z-10 group-hover:scale-110 group-hover:bg-indigo-50 transition-all duration-300">
                  <BarChart2 className="h-10 w-10 text-indigo-600" />
                </div>
                <div className="bg-white rounded-xl p-5 pb-6 shadow-sm border border-slate-100 group-hover:shadow-md transition-shadow duration-300 text-center">
                  <div className="inline-flex items-center justify-center bg-indigo-100 text-indigo-700 text-xs font-bold px-2 py-1 rounded mb-4">Step 4</div>
                  <h3 className="text-lg font-bold text-slate-900 mb-2">Monitor Performance</h3>
                  <p className="text-slate-500 text-sm">Use dashboard analytics to monitor lead growth and follow-up activity.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Footer */}
      <footer className="bg-slate-900 border-t border-slate-800 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            
            {/* Logo */}
            <div className="flex items-center">
              <div className="h-6 w-6 rounded border border-indigo-500 bg-indigo-600 flex items-center justify-center mr-2 shadow-sm">
                <span className="text-white font-bold text-xs">C</span>
              </div>
              <span className="text-white font-bold tracking-tight text-lg">CRM Pro</span>
            </div>

            {/* Copyright */}
            <div className="text-slate-400 text-sm">
              &copy; {new Date().getFullYear()} CRM Pro. All rights reserved.
            </div>

            {/* Links */}
            <div className="flex space-x-6 text-sm">
              <Link to="#" className="text-slate-400 hover:text-white transition-colors">Privacy</Link>
              <Link to="#" className="text-slate-400 hover:text-white transition-colors">Terms</Link>
              <Link to="#" className="text-slate-400 hover:text-white transition-colors">Contact</Link>
            </div>
            
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
