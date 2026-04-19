import { ArrowRight, ShieldCheck, TrendingUp, Cpu } from "lucide-react";

function Landing({ setPage }) {
  return (
    <div className="min-h-[calc(100vh-80px)] flex flex-col items-center justify-center text-center px-6 max-w-6xl mx-auto py-12">
      
      {/* Hero Section */}
      <div className="mb-16 max-w-3xl">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand/10 text-brand text-xs font-bold tracking-widest mb-6">
          <span className="w-2 h-2 rounded-full bg-brand animate-pulse"></span>
          NEW PLATFORM UPDATE
        </div>
        
        <h1 className="text-5xl md:text-7xl font-extrabold text-white mb-6 leading-tight tracking-tight">
          Precision in <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand to-emerald-400">
            Prosperity.
          </span>
        </h1>
        
        <p className="text-lg text-gray-400 mb-10 max-w-2xl mx-auto">
          Automate your wealth creation with AI-driven insights. Manage your mutual funds, track market stocks in real-time, and execute smart SIPs seamlessly.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button 
            onClick={() => setPage("register")}
            className="flex items-center justify-center gap-2 bg-brand text-gray-900 px-8 py-4 rounded-xl font-bold text-lg hover:bg-brand-dark hover:text-white transition shadow-[0_0_20px_rgba(97,242,160,0.3)] hover:shadow-[0_0_30px_rgba(97,242,160,0.5)]"
          >
            Start Investing <ArrowRight className="w-5 h-5" />
          </button>
          <button 
            onClick={() => setPage("login")}
            className="px-8 py-4 rounded-xl font-bold text-lg bg-[var(--color-card-bg)] border border-gray-700 text-white hover:bg-[var(--color-card-bg-light)] transition"
          >
            Login to Dashboard
          </button>
        </div>
      </div>

      {/* Features Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full mt-12 text-left">
        <div className="bg-[var(--color-card-bg)] border border-gray-800 p-8 rounded-2xl shadow-lg relative overflow-hidden group">
          <TrendingUp className="w-10 h-10 text-brand mb-4 group-hover:scale-110 transition duration-300" />
          <h3 className="text-xl font-bold text-white mb-3">Real-time Tracking</h3>
          <p className="text-gray-400 text-sm">
            Monitor your portfolio and live market stocks with pinpoint accuracy and beautifully rendered charts.
          </p>
        </div>
        
        <div className="bg-[var(--color-card-bg)] border border-gray-800 p-8 rounded-2xl shadow-lg relative overflow-hidden group">
          <Cpu className="w-10 h-10 text-brand mb-4 group-hover:scale-110 transition duration-300" />
          <h3 className="text-xl font-bold text-white mb-3">Smart Automation</h3>
          <p className="text-gray-400 text-sm">
            Set up algorithmic SIP contributions tailored to your risk profile and let the platform do the heavy lifting.
          </p>
        </div>

        <div className="bg-[var(--color-card-bg)] border border-gray-800 p-8 rounded-2xl shadow-lg relative overflow-hidden group">
          <ShieldCheck className="w-10 h-10 text-brand mb-4 group-hover:scale-110 transition duration-300" />
          <h3 className="text-xl font-bold text-white mb-3">Bank-grade Security</h3>
          <p className="text-gray-400 text-sm">
            Your data and transactions are secured using industry-leading encryption and standard authentication flows.
          </p>
        </div>
      </div>

    </div>
  );
}

export default Landing;
