import React from 'react';
import { SeoHead } from '@/Components/Common/SeoHead';
import { PageHero } from '@/Components/Common/PageHero';
import { Cookie, Shield, Eye, Database } from 'lucide-react';

export default function CookiePolicy() {
    return (
        <>
            <SeoHead
                title="Cookie & Tracking Policy"
                description="Understand how Cutting Edger uses essential, performance, and analytics cookies to optimize client visual workflows."
                breadcrumbs={[
                    { name: 'Home', url: '/' },
                    { name: 'Cookie Policy', url: '/cookie-policy' },
                ]}
            />

            <PageHero
                eyebrow="TRANSPARENT GOVERNANCE"
                title="COOKIE & TRACKING"
                highlight="DISCLOSURE."
                description="We believe in zero covert tracking. Learn how cookies and telemetry tokens function across our platform."
            />

            <section className="py-20 bg-[#f2f2f1]">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
                    <div className="p-8 rounded-3xl bg-white border border-[#16191f]/10 space-y-6">
                        <div className="flex items-center gap-3 pb-4 border-b border-[#16191f]/10">
                            <Cookie className="w-5 h-5 text-[#c4540a]" />
                            <h2 className="text-xl font-display font-bold text-[#16191f]">1. Scope and Objective</h2>
                        </div>
                        <p className="text-[#2f333a] text-sm leading-relaxed">
                            This Cookie Policy outlines how Cutting Edger (&quot;we&quot;, &quot;our&quot;, or &quot;us&quot;) uses cookies, local storage tokens, and web beacons when you navigate cuttingedger.com. This policy is aligned with GDPR, UK Data Protection Act 2018, and California Consumer Privacy Act (CCPA) regulations.
                        </p>
                    </div>

                    <div className="p-8 rounded-3xl bg-white border border-[#16191f]/10 space-y-6">
                        <div className="flex items-center gap-3 pb-4 border-b border-[#16191f]/10">
                            <Database className="w-5 h-5 text-[#c4540a]" />
                            <h2 className="text-xl font-display font-bold text-[#16191f]">2. Categorization of Cookies Deployed</h2>
                        </div>
                        <div className="space-y-4 text-sm text-[#2f333a]">
                            <div className="p-4 rounded-2xl bg-[#16191f]/[0.03] border border-[#16191f]/10 space-y-1">
                                <h3 className="font-bold text-[#16191f]">A. Strictly Necessary (Essential)</h3>
                                <p className="text-xs text-[#4a505b]">
                                    Required for the core functionality of the website, including session authentication, CSRF security verification, and the preservation of theme and consent preferences. These cannot be disabled.
                                </p>
                            </div>

                            <div className="p-4 rounded-2xl bg-[#16191f]/[0.03] border border-[#16191f]/10 space-y-1">
                                <h3 className="font-bold text-[#16191f]">B. Analytical & Performance Telemetry</h3>
                                <p className="text-xs text-[#4a505b]">
                                    Measures aggregated visitor metrics (such as Google Analytics 4 and Microsoft Clarity session analytics) to detect edge loading bottlenecks, core web vitals, and checkout drop-offs. No individual identity is linked.
                                </p>
                            </div>

                            <div className="p-4 rounded-2xl bg-[#16191f]/[0.03] border border-[#16191f]/10 space-y-1">
                                <h3 className="font-bold text-[#16191f]">C. Marketing & Attribution Tokens</h3>
                                <p className="text-xs text-[#4a505b]">
                                    Tracks first-touch campaign attribution (UTMs and Google/Bing click identifiers) so our agency can understand which acquisition channels produce enterprise B2B inquiries.
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="p-8 rounded-3xl bg-white border border-[#16191f]/10 space-y-6">
                        <div className="flex items-center gap-3 pb-4 border-b border-[#16191f]/10">
                            <Shield className="w-5 h-5 text-[#c4540a]" />
                            <h2 className="text-xl font-display font-bold text-[#16191f]">3. Specific Cookie Inventory</h2>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-xs font-mono text-[#2f333a]">
                                <thead className="border-b border-[#16191f]/10 text-[#16191f] font-bold uppercase tracking-wider">
                                    <tr>
                                        <th className="py-3 px-4">Cookie Token</th>
                                        <th className="py-3 px-4">Provider</th>
                                        <th className="py-3 px-4">Purpose</th>
                                        <th className="py-3 px-4">Lifespan</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-[#16191f]/10">
                                    <tr>
                                        <td className="py-3 px-4 text-[#c4540a]">XSRF-TOKEN</td>
                                        <td className="py-3 px-4">Cutting Edger</td>
                                        <td className="py-3 px-4">Cross-Site Request Forgery security shield</td>
                                        <td className="py-3 px-4">2 Hours</td>
                                    </tr>
                                    <tr>
                                        <td className="py-3 px-4 text-[#c4540a]">cuttingedger_session</td>
                                        <td className="py-3 px-4">Cutting Edger</td>
                                        <td className="py-3 px-4">Encrypted client session state & trial dropzone</td>
                                        <td className="py-3 px-4">Session</td>
                                    </tr>
                                    <tr>
                                        <td className="py-3 px-4 text-[#c4540a]">_ga / _ga_*</td>
                                        <td className="py-3 px-4">Google Analytics</td>
                                        <td className="py-3 px-4">Anonymized session traffic aggregation</td>
                                        <td className="py-3 px-4">2 Years</td>
                                    </tr>
                                    <tr>
                                        <td className="py-3 px-4 text-[#c4540a]">_clck / _clsk</td>
                                        <td className="py-3 px-4">Microsoft Clarity</td>
                                        <td className="py-3 px-4">Heatmap & UI rendering diagnostics</td>
                                        <td className="py-3 px-4">1 Year</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>

                    <div className="p-8 rounded-3xl bg-white border border-[#16191f]/10 space-y-4">
                        <h2 className="text-lg font-display font-bold text-[#16191f]">4. Controlling Cookie Preferences</h2>
                        <p className="text-[#2f333a] text-sm leading-relaxed">
                            You can adjust or revoke your cookie choices at any time via the Cookie Consent Banner or by clearing your browser cache. For inquiries regarding cookie telemetry, contact <a href="mailto:privacy@cuttingedger.com" className="text-[#c4540a] underline">privacy@cuttingedger.com</a>.
                        </p>
                    </div>
                </div>
            </section>
        </>
    );
}
