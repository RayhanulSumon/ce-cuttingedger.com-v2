import React, { useState } from 'react';
import { Head, Link } from '@inertiajs/react';
import { Upload, CheckCircle2, ArrowRight, ShieldCheck, Zap, Star } from 'lucide-react';

interface HomeConversionProps {
  clients?: any[];
}

export function HomeConversion({ clients = [] }: HomeConversionProps) {
  const [submitted, setSubmitted] = useState(false);

  return (
    <div className="min-h-screen bg-white text-[#0F172A] selection:bg-[#de4a2c] selection:text-white font-sans antialiased overflow-x-hidden">
      <Head>
        <title>CuttingEdger — Scale Your E-Commerce Visuals</title>
      </Head>

      {/* Hero Conversion Header */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-8">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#de4a2c]/10 text-[#de4a2c] text-xs font-bold uppercase tracking-wider mb-4">
            <Zap className="w-3.5 h-3.5" />
            <span>Over 2,400,000+ Product Images Delivered</span>
          </div>
          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-neutral-900 leading-tight">
            Flawless Product Cutouts & Retouching.{' '}
            <span className="text-[#de4a2c]">Delivered in 4 Hours.</span>
          </h1>
          <p className="mt-4 text-neutral-600 text-base sm:text-lg">
            Stop waiting days for catalog assets. Get hand-drawn clipping paths, invisible mannequins, and color matching with zero risk.
          </p>
        </div>

        {/* Hero Dropzone Card */}
        <div className="max-w-2xl mx-auto p-8 rounded-3xl bg-neutral-50 border border-neutral-200 shadow-xl">
          {!submitted ? (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                setSubmitted(true);
              }}
              className="space-y-4"
            >
              <div className="p-8 rounded-2xl border-2 border-dashed border-[#de4a2c]/40 hover:border-[#de4a2c] bg-white text-center cursor-pointer transition-colors">
                <Upload className="w-8 h-8 text-[#de4a2c] mx-auto mb-2" />
                <div className="text-sm font-bold text-neutral-800">Drop 1-3 Sample Files Here</div>
                <div className="text-xs text-neutral-500 mt-1">Get free retouched files in hours</div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <input
                  type="text"
                  required
                  placeholder="Your Name"
                  className="px-4 py-3 rounded-xl border border-neutral-300 text-sm focus:outline-none focus:border-[#de4a2c]"
                />
                <input
                  type="email"
                  required
                  placeholder="Work Email"
                  className="px-4 py-3 rounded-xl border border-neutral-300 text-sm focus:outline-none focus:border-[#de4a2c]"
                />
              </div>

              <button
                type="submit"
                className="w-full py-4 rounded-full bg-[#de4a2c] hover:bg-[#c2381c] text-white font-extrabold text-sm tracking-wide transition-colors shadow-lg flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Get Free Sample Batch</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          ) : (
            <div className="p-8 text-center space-y-3">
              <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto" />
              <h3 className="text-2xl font-bold">Files Queued for Free Retouching</h3>
              <p className="text-sm text-neutral-600">Our studio team is working on your batch right now.</p>
              <button
                type="button"
                onClick={() => setSubmitted(false)}
                className="text-xs font-bold text-[#de4a2c] underline"
              >
                Upload more images
              </button>
            </div>
          )}
        </div>

        {/* 5 Layout Preview Link */}
        <div className="mt-8 text-center">
          <Link
            href="/services/ecommerce-catalog-optimization/clipping-path-service?v=4"
            className="text-xs font-bold text-[#de4a2c] hover:underline inline-flex items-center gap-1"
          >
            <span>Preview Conversion Service Layout (Variant 04)</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </section>
    </div>
  );
}

