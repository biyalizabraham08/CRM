import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { useContext, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Home, Users, LogOut, Menu, X, Briefcase, Calendar } from 'lucide-react';

const MainLayout = () => {
  const { logout, user } = useContext(AuthContext);
  const location = useLocation();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navigation = [];
  
  if (user?.role === 'admin') {
    navigation.push({ name: 'Dashboard', href: '/dashboard', icon: Home });
    navigation.push({ name: 'Employees', href: '/employees', icon: Users });
    navigation.push({ name: 'Leads', href: '/leads', icon: Briefcase });
    navigation.push({ name: 'Follow-ups', href: '/followups', icon: Calendar });
  } else {
    navigation.push({ name: 'Dashboard', href: '/dashboard', icon: Home });
    navigation.push({ name: 'My Leads', href: '/leads', icon: Briefcase });
    navigation.push({ name: 'Follow-ups', href: '/followups', icon: Calendar });
  }

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const UserFooter = () => (
    <div className="flex flex-col w-full space-y-1">
      <div className="flex items-center px-3 py-3 border-b border-slate-800 mb-1">
         <div className="flex-shrink-0">
            <div className="h-9 w-9 rounded-full bg-indigo-600 flex items-center justify-center text-white font-bold shadow-sm ring-2 ring-slate-800">
              {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
            </div>
         </div>
         <div className="ml-3 min-w-0 flex-1">
            <p className="text-sm font-medium text-white truncate">{user?.name || 'User'}</p>
            <div className="mt-1">
              {user?.role === 'admin' ? (
                <span className="inline-flex items-center rounded-md bg-indigo-400/10 px-2 py-0.5 text-xs font-medium text-indigo-400 ring-1 ring-inset ring-indigo-400/30">Administrator</span>
              ) : (
                <span className="inline-flex items-center rounded-md bg-slate-400/10 px-2 py-0.5 text-xs font-medium text-slate-400 ring-1 ring-inset ring-slate-400/30">Employee</span>
              )}
            </div>
         </div>
      </div>
      <button
        onClick={handleLogout}
        className="flex-shrink-0 group block w-full text-left"
      >
        <div className="flex items-center px-3 py-2 rounded-lg hover:bg-slate-800 transition-colors">
          <div>
            <LogOut className="inline-block h-5 w-5 text-slate-400 group-hover:text-white transition-colors" />
          </div>
          <div className="ml-3">
            <p className="text-sm font-medium text-slate-300 group-hover:text-white transition-colors">
              Logout
            </p>
          </div>
        </div>
      </button>
    </div>
  );

  return (
    <div className="h-screen flex overflow-hidden bg-slate-50">
      {/* Mobile sidebar */}
      <div className={`fixed inset-0 flex z-40 md:hidden ${isMobileMenuOpen ? '' : 'hidden'}`}>
        <div className="fixed inset-0 bg-slate-900 bg-opacity-75 transition-opacity" onClick={() => setIsMobileMenuOpen(false)}></div>
        <div className="relative flex-1 flex flex-col max-w-xs w-full bg-slate-900">
          <div className="absolute top-0 right-0 -mr-12 pt-2">
            <button
              className="ml-1 flex items-center justify-center h-10 w-10 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <X className="h-6 w-6 text-white" />
            </button>
          </div>
          <div className="flex-1 h-0 pt-5 pb-4 overflow-y-auto">
            <div className="flex-shrink-0 flex items-center px-4">
              <div className="h-8 w-8 rounded bg-indigo-500 flex items-center justify-center mr-2">
                 <span className="text-white font-bold">C</span>
              </div>
              <span className="text-white text-xl font-bold">CRM Pro</span>
            </div>
            <nav className="mt-8 px-2 space-y-2">
              {navigation.map((item) => {
                const isActive = location.pathname === item.href || (item.href !== '/' && location.pathname.startsWith(item.href));
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`${
                      isActive ? 'bg-indigo-600 text-white' : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                    } group flex items-center px-3 py-2.5 text-base font-medium rounded-lg transition-colors`}
                  >
                    <item.icon className={`mr-4 flex-shrink-0 h-6 w-6 ${isActive ? 'text-white' : 'text-slate-400 group-hover:text-white'}`} aria-hidden="true" />
                    {item.name}
                  </Link>
                )
              })}
            </nav>
          </div>
          <div className="flex-shrink-0 flex bg-slate-950 p-4">
            <UserFooter />
          </div>
        </div>
      </div>

      {/* Static sidebar for desktop */}
      <div className="hidden md:flex md:flex-shrink-0 shadow-lg">
        <div className="flex flex-col w-64">
          <div className="flex flex-col h-0 flex-1 bg-slate-900 border-r border-slate-800">
            <div className="flex-1 flex flex-col pt-5 pb-4 overflow-y-auto">
              <div className="flex items-center flex-shrink-0 px-4">
                <div className="h-8 w-8 rounded-lg bg-indigo-600 flex items-center justify-center mr-3 shadow-sm">
                   <span className="text-white font-bold text-lg">C</span>
                </div>
                <span className="text-white text-2xl font-bold tracking-tight">CRM Pro</span>
              </div>
              <nav className="mt-8 flex-1 px-3 space-y-2">
                {navigation.map((item) => {
                  const isActive = location.pathname === item.href || (item.href !== '/' && location.pathname.startsWith(item.href));
                  return (
                    <Link
                      key={item.name}
                      to={item.href}
                      className={`${
                        isActive ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                      } group flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-all duration-200`}
                    >
                      <item.icon className={`mr-3 flex-shrink-0 h-5 w-5 ${isActive ? 'text-white' : 'text-slate-400 group-hover:text-white transition-colors'}`} aria-hidden="true" />
                      {item.name}
                    </Link>
                  )
                })}
              </nav>
            </div>
            <div className="flex-shrink-0 flex bg-slate-950 p-4 border-t border-slate-800">
              <UserFooter />
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex flex-col w-0 flex-1 overflow-hidden">
        <div className="md:hidden bg-white shadow-sm border-b border-slate-200 pl-1 pt-1 sm:pl-3 sm:pt-3 flex h-14 items-center">
          <button
            className="-ml-0.5 -mt-0.5 h-10 w-10 inline-flex items-center justify-center rounded-md text-slate-500 hover:text-slate-900 focus:outline-none"
            onClick={() => setIsMobileMenuOpen(true)}
          >
            <Menu className="h-6 w-6" aria-hidden="true" />
          </button>
          <span className="ml-3 font-semibold text-slate-900 text-lg">CRM Pro</span>
        </div>
        <main className="flex-1 relative z-0 overflow-y-auto focus:outline-none scroll-smooth">
          <div className="py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
              <Outlet />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
