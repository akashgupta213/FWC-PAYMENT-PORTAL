import { useAssets } from '../context/AssetsContext';
import { useAuth }   from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function Layout({ children, showSteps }) {
  const { assets }   = useAssets();
  const { user, logout } = useAuth();
  const navigate     = useNavigate();

  const handleLogout = () => { logout(); navigate('/login'); };

  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      <div className="h-1.5 bg-brand-yellow" />
      <header className="bg-white border-b-[3px] border-brand-blue shadow-sm">
        <div className="max-w-3xl mx-auto px-5 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {assets?.logo ? (
              <img src={assets.logo.url} alt={assets.logo.altText} className="h-10 rounded-md" />
            ) : (
              <div className="h-10 w-10 rounded-md bg-brand-blueLight flex items-center justify-center">
                <i className="fas fa-graduation-cap text-brand-blue text-xl" />
              </div>
            )}
            <div>
              <h1 className="font-serif text-brand-blue text-lg leading-tight">Future Wireless Communications Program</h1>
              <p className="text-xs text-gray-500 font-medium">Payment Portal — IIITB COMET Foundation</p>
            </div>
          </div>
          {user && (
            <div className="flex items-center gap-3">
              <span className="text-xs text-gray-500 hidden sm:block">{user.cometId}</span>
              <button onClick={handleLogout}
                className="text-xs text-brand-blue font-semibold border border-brand-blue rounded-lg px-3 py-1.5 hover:bg-brand-blueLight transition-colors">
                Logout
              </button>
            </div>
          )}
        </div>
      </header>
      <main className="flex-1 px-4 py-8 pb-12">{children}</main>
      <footer className="bg-slate-800 text-slate-400 text-center py-4 text-xs">
        © 2025 IIITB COMET Foundation. All Rights Reserved.
      </footer>
    </div>
  );
}