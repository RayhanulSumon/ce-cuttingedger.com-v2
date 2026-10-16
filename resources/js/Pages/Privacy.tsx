import React from 'react';
import { SeoHead } from '@/Components/Common/SeoHead';
import { PageHero } from '@/Components/Common/PageHero';

export default function Privacy() {
    return (
        <>
            <SeoHead
                title="Privacy Policy"
                description="CuttingEdger commitment to user privacy, data security, and zero unauthorized telemetry."
            />

            <PageHero
                eyebrow="LEGAL PROTOCOL"
                title="PRIVACY"
                highlight="POLICY."
                description="We respect your data. We collect only what is strictly required to deliver high-velocity digital craft."
            />

            <section className="py-20 bg-[#0a0b0e]">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 prose prose-invert space-y-8 text-neutral-300 leading-relaxed">
                    <div>
                        <h2 className="text-2xl font-display font-bold text-white mb-3">1. Information Collection</h2>
                        <p>When you submit a contact inquiry or subscribe to our Dispatch, we collect your name, email, and provided company details. We do not sell, rent, or trade your personal information to third parties.</p>
                    </div>

                    <div>
                        <h2 className="text-2xl font-display font-bold text-white mb-3">2. Telemetry and Analytics</h2>
                        <p>We use minimal, privacy-friendly telemetry to monitor aggregate site performance and server errors. We do not use cross-site tracking cookies or invasive third-party surveillance scripts.</p>
                    </div>

                    <div>
                        <h2 className="text-2xl font-display font-bold text-white mb-3">3. Data Retention & Rights</h2>
                        <p>You may request the deletion of your contact records or unsubscribe from the studio newsletter at any time by sending a notice to privacy@cuttingedger.com.</p>
                    </div>
                </div>
            </section>
        </>
    );
}
