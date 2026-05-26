export default function Footer() {
  return (
    <footer style={{ background: '#1a3a8f', padding: '16px 24px', textAlign: 'center' }}>
      <div className="max-w-6xl mx-auto px-5 flex flex-col sm:flex-row items-center justify-between gap-2">
        <p style={{ fontSize: '12px', color: '#93b4e8', margin: 0 }}>© 2025 IIITB COMET Foundation. All Rights Reserved.</p>
        <div className="flex items-center gap-4">
          <a href="mailto:fwc@iiitb.ac.in" style={{ fontSize: '12px', color: '#93b4e8' }} className="hover:text-blue-200 transition-colors">
            <i className="fas fa-envelope mr-1" />&nbsp; fwc@iiitb.ac.in
          </a>
          <span style={{ fontSize: '12px', color: '#93b4e8' }}>&nbsp;|&nbsp;</span>
          <span style={{ fontSize: '12px', color: '#93b4e8' }} className="flex items-center gap-1">
            <i className="fas fa-lock" /> &nbsp; Secure Transactions
          </span>
        </div>
      </div>
    </footer>
  );
}