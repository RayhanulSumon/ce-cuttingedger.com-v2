import React, { useState } from 'react';
import { Link } from '@inertiajs/react';
import { Service, Project } from '@/types/models';
import {
  ArrowUpRight,
  Upload,
  CheckCircle2,
  Star,
  ShieldCheck,
  Zap,
  Clock,
  Sparkles,
  ChevronDown,
  Check,
  Calendar,
  Layers,
  ArrowRight
} from 'lucide-react';

interface VariantProps {
  service: Service & {
    parent?: Service;
    children?: Service[];
    problem_statement?: string;
    solution_statement?: string;
    process_steps?: { step: string; title: string; description: string }[];
    faqs?: { question: string; answer: string }[];
    h1_title?: string;
  };
  otherServices: Service[];
  relatedProjects: Project[];
  calendlyUrl: string;
}

export const VariantHighConversion: React.FC<VariantProps> = ({
  service,
  otherServices = [],
  relatedProjects = [],
  calendlyUrl
}) => {
  const [sliderPos, setSliderPos] = useState(50);
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [sampleSubmitted, setSampleSubmitted] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setUploadedFiles((prev) => [...prev, ...Array.from(e.target.files!)]);
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSampleSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-white text-[#0F172A] antialiased selection:bg-emerald-500 selection:text-white pb-36">
      {/* 1. TOP ANNOUNCEMENT & TRUST BANNER */}
      <div className="bg-[#0F172A] text-white py-2.5 px-4 text-center text-xs font-semibold flex items-center justify-center gap-2">
        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
        <span>Try Before You Commit: 3 Free Pilot Assets Returned in Under 12 Hours.</span>
        <a href="#trial-box" className="underline font-bold text-emerald-300 hover:text-white transition-colors">
          Upload Free Batch →
        </a>
      </div>

      {/* 2. HIGH-CONVERSION SPLIT HERO */}
      <section className="pt-12 sm:pt-16 pb-16 px-4 sm:px-8 border-b border-neutral-100 bg-[#F8FAFC]">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            {/* Left Value Proposition (7 Cols) */}
            <div className="lg:col-span-7 space-y-6">
              {/* Trust Badge */}
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white border border-neutral-200 shadow-xs text-xs font-bold text-neutral-700">
                <div className="flex text-amber-400">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-current" />
                  ))}
                </div>
                <span>4.9/5 from 350+ Enterprise E-Commerce Brands</span>
              </div>

              {/* Main Headline */}
              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-[#0F172A] leading-[1.08]">
                {service.h1_title || service.title}
              </h1>

              <p className="text-base sm:text-lg text-neutral-600 leading-relaxed font-normal max-w-xl">
                {service.subtitle ||
                  'Turn raw studio shoots into ready-to-sell catalog assets in under 12 hours. 100% hand-crafted vector accuracy, zero automated fuzziness.'}
              </p>

              {/* High-Impact Proof Points */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                {[
                  '100% Hand-Drawn Pen Tool Vectors',
                  'Guaranteed 12-Hour SLA Turnaround',
                  'Calibrated Delta-E Swatch Consistency',
                  'Dedicated Senior Retoucher Pod'
                ].map((feat, i) => (
                  <div key={i} className="flex items-center gap-2.5 text-xs font-bold text-[#0F172A]">
                    <div className="w-4 h-4 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0">
                      <Check className="w-2.5 h-2.5 stroke-[3]" />
                    </div>
                    <span>{feat}</span>
                  </div>
                ))}
              </div>

              {/* Client Avatars */}
              <div className="flex items-center gap-4 pt-4 border-t border-neutral-200">
                <div className="flex -space-x-2">
                  {[
                    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80',
                    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&q=80',
                    'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=120&q=80'
                  ].map((src, i) => (
                    <img
                      key={i}
                      src={src}
                      alt="Client"
                      className="w-8 h-8 rounded-full border-2 border-white object-cover"
                    />
                  ))}
                </div>
                <div className="text-xs text-neutral-500">
                  Trusted by Art Directors at <span className="font-bold text-[#0F172A]">Nike, Farfetch, SSENSE, and Kith</span>
                </div>
              </div>
            </div>

            {/* Right Above-the-Fold Free Sample Ingest Card (5 Cols) */}
            <div id="trial-box" className="lg:col-span-5">
              <div className="rounded-3xl bg-white border border-neutral-200 p-6 sm:p-8 shadow-xl space-y-5">
                <div className="space-y-1">
                  <div className="inline-block px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-700 text-[10px] font-extrabold uppercase tracking-wide">
                    ZERO COST PILOT
                  </div>
                  <h3 className="text-xl font-extrabold text-[#0F172A]">
                    Test 3 Free Assets Now
                  </h3>
                  <p className="text-xs text-neutral-500">
                    Upload your toughest RAW files. Receive full PSD masters within 12h.
                  </p>
                </div>

                {!sampleSubmitted ? (
                  <form onSubmit={handleFormSubmit} className="space-y-3.5">
                    {/* Drag and Drop Zone */}
                    <label className="block p-5 border-2 border-dashed border-neutral-300 hover:border-emerald-500 rounded-2xl text-center cursor-pointer transition-colors bg-neutral-50/50">
                      <input
                        type="file"
                        multiple
                        className="hidden"
                        onChange={handleFileChange}
                      />
                      <div className="w-10 h-10 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto mb-2">
                        <Upload className="w-5 h-5" />
                      </div>
                      <span className="text-xs font-extrabold text-[#0F172A] block">
                        {uploadedFiles.length > 0
                          ? `${uploadedFiles.length} file(s) attached`
                          : 'Drop RAW, PSD, TIFF or JPG here'}
                      </span>
                      <span className="text-[10px] text-neutral-400 mt-0.5 block">
                        Up to 3 free sample assets • Protected under NDA
                      </span>
                    </label>

                    <input
                      type="email"
                      required
                      placeholder="Your work email..."
                      className="w-full px-4 py-3 rounded-xl bg-neutral-50 border border-neutral-200 text-xs text-[#0F172A] placeholder-neutral-400 focus:outline-none focus:border-emerald-500 font-medium"
                    />

                    <button
                      type="submit"
                      className="w-full py-4 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-white font-extrabold text-xs uppercase tracking-wider transition-all shadow-lg flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <Sparkles className="w-4 h-4" />
                      <span>Request Free Sample Retouch</span>
                    </button>

                    <div className="flex items-center justify-center gap-2 text-[10px] text-neutral-400 font-medium pt-1">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                      <span>No credit card required • Strict confidentiality guarantee</span>
                    </div>
                  </form>
                ) : (
                  <div className="p-6 rounded-2xl bg-emerald-50 border border-emerald-200 text-center space-y-3">
                    <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto" />
                    <h4 className="font-extrabold text-base text-[#0F172A]">Sample Batch Received</h4>
                    <p className="text-xs text-neutral-600">
                      Our senior retouching desk has queued your sample for 12h turnaround.
                    </p>
                    <button
                      type="button"
                      onClick={() => {
                        setSampleSubmitted(false);
                        setUploadedFiles([]);
                      }}
                      className="text-xs font-bold text-emerald-600 underline"
                    >
                      Upload another sample
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. PERFORMANCE STATS RIBBON */}
      <section className="py-8 bg-white border-b border-neutral-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 text-center">
            <div className="space-y-1">
              <div className="text-3xl sm:text-4xl font-extrabold text-[#0F172A]">99.8%</div>
              <div className="text-xs font-bold text-neutral-500 uppercase tracking-wide">First-Pass Approval</div>
            </div>
            <div className="space-y-1">
              <div className="text-3xl sm:text-4xl font-extrabold text-emerald-600">12 Hours</div>
              <div className="text-xs font-bold text-neutral-500 uppercase tracking-wide">Contractual SLA</div>
            </div>
            <div className="space-y-1">
              <div className="text-3xl sm:text-4xl font-extrabold text-[#0F172A]">15,000+</div>
              <div className="text-xs font-bold text-neutral-500 uppercase tracking-wide">Daily SKU Bandwidth</div>
            </div>
            <div className="space-y-1">
              <div className="text-3xl sm:text-4xl font-extrabold text-[#0F172A]">$0.00</div>
              <div className="text-xs font-bold text-neutral-500 uppercase tracking-wide">Setup or Ingest Fee</div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. BEFORE & AFTER CONVERSION SLIDER */}
      <section className="py-16 px-4 sm:px-8 bg-[#F8FAFC] border-b border-neutral-100">
        <div className="max-w-5xl mx-auto space-y-8">
          <div className="text-center space-y-2">
            <span className="text-xs font-extrabold uppercase tracking-widest text-emerald-600 block">
              RESULTS PROVEN
            </span>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-[#0F172A]">
              Drag to Inspect the Quality Leap
            </h2>
            <p className="text-xs sm:text-sm text-neutral-500 max-w-md mx-auto">
              Compare unretouched studio camera raw against our hand-crafted, production-ready master.
            </p>
          </div>

          <div
            className="relative h-[360px] sm:h-[460px] rounded-3xl overflow-hidden cursor-ew-resize select-none border border-neutral-200 shadow-lg bg-neutral-100"
            onMouseMove={(e) => {
              const rect = e.currentTarget.getBoundingClientRect();
              const pos = ((e.clientX - rect.left) / rect.width) * 100;
              setSliderPos(Math.max(5, Math.min(pos, 95)));
            }}
          >
            {/* After Image */}
            <div className="absolute inset-0 bg-white flex items-center justify-center p-6">
              <img
                src="https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=1400&q=85"
                alt="Retouched"
                className="max-h-full max-w-full object-contain filter drop-shadow-[0_28px_24px_rgba(15,15,18,0.22)]"
              />
            </div>

            {/* Before Image */}
            <div
              className="absolute inset-0 bg-[#E5E5E2] overflow-hidden flex items-center justify-center p-6 border-r-2 border-white"
              style={{ width: `${sliderPos}%` }}
            >
              <img
                src="https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=1400&q=80"
                alt="Raw"
                className="max-h-full max-w-full object-contain filter brightness-75 contrast-75 saturate-50"
              />
            </div>

            {/* Handle */}
            <div
              className="absolute top-0 bottom-0 w-0.5 bg-white shadow-lg pointer-events-none"
              style={{ left: `${sliderPos}%` }}
            >
              <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-10 h-10 rounded-full bg-emerald-500 text-white font-bold text-xs flex items-center justify-center shadow-xl border-2 border-white">
                ↔
              </div>
            </div>

            <div className="absolute top-4 left-4 px-3 py-1 bg-black/70 text-white rounded-full text-xs font-bold">
              Camera RAW
            </div>
            <div className="absolute top-4 right-4 px-3 py-1 bg-emerald-500 text-white rounded-full text-xs font-bold shadow-md">
              CuttingEdger Master
            </div>
          </div>
        </div>
      </section>

      {/* 5. THE COMPARISON: IN-HOUSE VS CUTTINGEDGER */}
      <section className="py-16 px-4 sm:px-8 border-b border-neutral-100">
        <div className="max-w-5xl mx-auto space-y-8">
          <div className="text-center space-y-2">
            <span className="text-xs font-extrabold uppercase tracking-widest text-emerald-600 block">
              ROI & EFFICIENCY
            </span>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-[#0F172A]">
              In-House Bottlenecks vs CuttingEdger Advantage
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-6 sm:p-8 rounded-3xl bg-neutral-50 border border-neutral-200 space-y-4">
              <span className="text-xs font-bold text-red-500 uppercase tracking-wide">
                Doing It In-House or Generic Platforms
              </span>
              <ul className="space-y-3 text-xs sm:text-sm text-neutral-600 font-medium">
                <li className="flex items-start gap-2.5">
                  <span className="text-red-500 font-bold shrink-0">✕</span>
                  <span>Photographers & retouchers burn hours on manual clipping instead of creative shoots</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="text-red-500 font-bold shrink-0">✕</span>
                  <span>Seasonal drop spikes create multi-week catalog publication delays</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="text-red-500 font-bold shrink-0">✕</span>
                  <span>High payroll overhead for idle retouchers between campaign launches</span>
                </li>
              </ul>
            </div>

            <div className="p-6 sm:p-8 rounded-3xl bg-emerald-50/50 border border-emerald-200 space-y-4">
              <span className="text-xs font-bold text-emerald-600 uppercase tracking-wide">
                With CuttingEdger Retouching Retainer
              </span>
              <ul className="space-y-3 text-xs sm:text-sm text-[#0F172A] font-medium">
                <li className="flex items-start gap-2.5">
                  <span className="text-emerald-600 font-bold shrink-0">✓</span>
                  <span>Guaranteed 12-hour turnaround so new collections hit Shopify on schedule</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="text-emerald-600 font-bold shrink-0">✓</span>
                  <span>Elastic capacity: scale from 20 to 10,000 SKUs overnight without hiring</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="text-emerald-600 font-bold shrink-0">✓</span>
                  <span>Zero setup fees, transparent volume pricing, and contractual NDA safety</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* 6. CONVERSION FAQS */}
      {service.faqs && service.faqs.length > 0 && (
        <section className="py-16 px-4 sm:px-8 border-b border-neutral-100 bg-[#F8FAFC]">
          <div className="max-w-3xl mx-auto space-y-6">
            <div className="text-center space-y-2">
              <span className="text-xs font-extrabold uppercase tracking-widest text-emerald-600 block">
                FREQUENTLY ASKED
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0F172A]">
                Common Questions
              </h2>
            </div>

            <div className="space-y-3">
              {service.faqs.map((faq, idx) => {
                const isOpen = openFaq === idx;
                return (
                  <div
                    key={idx}
                    className="p-5 rounded-2xl bg-white border border-neutral-200 shadow-xs"
                  >
                    <button
                      type="button"
                      onClick={() => setOpenFaq(isOpen ? null : idx)}
                      className="w-full text-left flex items-center justify-between gap-4 font-bold text-sm text-[#0F172A]"
                    >
                      <span>{faq.question}</span>
                      <ChevronDown
                        className={`w-4 h-4 text-neutral-400 transition-transform ${
                          isOpen ? 'rotate-180 text-emerald-600' : ''
                        }`}
                      />
                    </button>
                    {isOpen && (
                      <p className="text-xs text-neutral-600 leading-relaxed pt-3 border-t border-neutral-100 mt-3 font-normal">
                        {faq.answer}
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* 7. STICKY BOTTOM CONVERSION DOCK */}
      <div className="fixed bottom-20 inset-x-0 z-40 pointer-events-none px-4 flex justify-center">
        <div className="pointer-events-auto bg-[#0F172A] text-white px-5 py-3 rounded-full shadow-2xl border border-white/20 flex items-center gap-4 text-xs">
          <span className="hidden sm:inline font-bold">
            Ready to test with 3 free assets?
          </span>
          <a
            href="#trial-box"
            className="px-4 py-2 rounded-full bg-emerald-400 hover:bg-emerald-300 text-black font-extrabold transition-all flex items-center gap-1.5 shadow-md"
          >
            <span>Upload Free Sample Batch</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>
    </div>
  );
};

