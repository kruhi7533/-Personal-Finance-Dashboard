'use client';
import { LifeBuoy, FileText, MessageSquare, Phone, ArrowUpRight } from 'lucide-react';

function SupportCard({ icon, title, description, badge }) {
  return (
    <div className="bg-[var(--surface-card)] rounded-[32px] p-6 border border-[var(--surface-border)]/20 space-y-4 hover:border-[#a3e635]/30 transition-colors group cursor-pointer">
      <div className="flex items-center justify-between">
        <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center text-[var(--text-primary)] group-hover:scale-110 group-hover:bg-[#a3e635]/10 group-hover:text-[#a3e635] transition-all">{icon}</div>
        {badge && <span className="text-[9px] font-black uppercase tracking-widest px-2 py-1 bg-white/10 rounded-lg text-slate-400">{badge}</span>}
      </div>
      <div>
        <h3 className="text-sm font-bold text-[var(--text-primary)]">{title}</h3>
        <p className="text-xs text-slate-500 font-medium mt-1 leading-relaxed">{description}</p>
      </div>
    </div>
  );
}

function FAQItem({ question, answer }) {
  return (
    <div className="p-6 bg-white/[0.02] border border-[var(--surface-border)]/20 rounded-3xl space-y-3">
      <h4 className="text-sm font-bold text-[var(--text-primary)]">{question}</h4>
      <p className="text-xs text-slate-500 font-medium leading-relaxed">{answer}</p>
    </div>
  );
}

export default function SupportPage() {
  return (
    <div className="space-y-10 pb-10 max-w-5xl">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold font-display text-[var(--text-primary)]">Help & Support Center</h1>
          <p className="text-sm text-slate-500 font-medium mt-1">Get assistance with your financial dashboard and wealth tracking tools.</p>
        </div>
        <div className="px-4 py-2 bg-[#a3e635]/10 border border-[#a3e635]/20 rounded-xl flex items-center gap-2">
          <div className="w-1.5 h-1.5 bg-[#a3e635] rounded-full animate-pulse" />
          <span className="text-[10px] font-black uppercase tracking-widest text-[#a3e635]">Servers Online</span>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <SupportCard icon={<FileText size={22} />} title="Documentation" description="Detailed guides on how to use all FinFlow features." />
        <SupportCard icon={<MessageSquare size={22} />} title="Live Chat" description="Speak with our dedicated support agents now." badge="Instant" />
        <SupportCard icon={<Phone size={22} />} title="Phone Support" description="Available 24/7 for our premium portfolio members." />
        <SupportCard icon={<ArrowUpRight size={22} />} title="Success Center" description="Best practices for wealth management strategies." />
      </div>

      <div className="space-y-6">
        <h2 className="text-lg font-bold text-[var(--text-primary)]">Frequently Asked Questions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FAQItem question="How do I connect my bank account?" answer="FinFlow uses secure open banking APIs to fetch your transaction data. You can link your institution from the Settings page." />
          <FAQItem question="Can I export my data to Excel?" answer="Yes! Visit the Transactions page and click on Export PDF. We are currently working on adding CSV and XLSX export options." />
          <FAQItem question="How is my data secured?" answer="We use bank-grade 256-bit encryption for all stored data. Your financial credentials are never stored directly on our servers." />
          <FAQItem question="How are insights generated?" answer="Our machine learning models analyze your spending habits across 50+ categories to provide personalized advice." />
        </div>
      </div>

      <div className="p-8 bg-gradient-to-br from-[#a3e635]/10 to-transparent border border-[#a3e635]/20 rounded-[40px] flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-2 text-center md:text-left">
          <h2 className="text-xl font-bold text-[var(--text-primary)]">Still need help with your wealth journey?</h2>
          <p className="text-xs text-slate-500 font-medium">Our expert consultants are available for 1:1 strategy calls every Friday.</p>
        </div>
        <button className="bg-[#a3e635] text-[#0a0f1e] px-8 py-3 rounded-2xl text-sm font-bold shadow-lg shadow-[#a3e635]/20 hover:scale-105 active:scale-95 transition-all">Schedule a Free Call</button>
      </div>
    </div>
  );
}
