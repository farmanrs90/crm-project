import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Navbar from './Navbar';

function Layout() {
  return (
    <div className='flex min-h-screen bg-slate-50/80 text-slate-900'>
      <Sidebar />

      <div className='flex min-w-0 flex-1 flex-col'>
        <Navbar />

        <main className='min-h-[calc(100vh-4rem)] flex-1 p-4 sm:p-6 lg:p-8'>
          <div className='mx-auto w-full max-w-7xl'>
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}

export default Layout;