import Navbar from './Navbar';
import Footer from './Footer';

export default function PageShell({ children, className = '' }) {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      <main className={`flex-1 ${className}`}>
        {children}
      </main>
      <Footer />
    </div>
  );
}