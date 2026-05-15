import { Search, Bell } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Navbar() {
  return (
    <header className="fixed top-0 w-full z-50 bg-background/80 backdrop-blur-lg border-b border-white/10 shadow-[0_4px_20px_rgba(56,189,248,0.1)] flex justify-between items-center px-6 h-16">
      <div className="flex items-center gap-3">
        <img 
          alt="SportSphere Logo" 
          className="h-8 w-8 object-contain" 
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuBPtUEGxRleNHcRUlBOSOAqRKOtP-rATJ-2xBPfqrPd-SNDos1g5ziLPPnswOBuVJt-vV6idOvRdLJ7mmpyeqsEoThqk_3UFo_ff1Zxhgbe3YnNOhfTFgltI4kSW8VjQ0hgbtMppXXzY-I29oZxUkCqwdJpcjyL9Jl5iGJmNzpCcs8RteeWg-7jhZet1xtPuotEz13L70okVLlf3UFM9H2Hpl128wLZHCT5bMkF84wae992xEtsEZINCcYmIAZFTwF-8-u-ch-dT2A" 
        />
        <Link to="/" className="font-bold text-2xl text-primary tracking-tighter">SportSphere</Link>
      </div>
      
      <div className="flex items-center gap-6">
        <button className="text-on-surface-variant hover:text-primary transition-all">
          <Search className="w-6 h-6" />
        </button>
        <button className="text-on-surface-variant hover:text-primary transition-all">
          <Bell className="w-6 h-6" />
        </button>
        <div className="h-8 w-8 rounded-full bg-surface-container-high border border-outline-variant overflow-hidden">
          <img 
            alt="User Profile" 
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuCpTNIiZAx_3eXpPw0yAWk0yKkB5kW2LhZ-KsS-PwBeRHWFKT2Vg1LhJmIncftiMGXmQkHNWGJHBvLHQC75IByZC_RQ9AJNqtyVo5XpmHnbiA3UewHyi84SxCwHyofnGPts_crQf42vJJWnbbXfn_kbLGbDR0rfGdNjoVBguEVIKILPE6yFyvHTx5hYhz7b05tNSB8krhd1Gl4_1Yf3VxNvr7_y1ZjdnhucitggVgUhD4q1ACqdwh9gqjZWITKki3sIjdpMNLxiFsQ" 
          />
        </div>
      </div>
    </header>
  );
}
