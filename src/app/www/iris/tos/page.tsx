import { Divider } from "@nextui-org/react"
import GlassOrbs from "@/components/main/glass-orbs"

export default function IRISToS() {
    return (<>
        <div className="text-center -mt-2 flex flex-col max-w-2xl mx-auto relative">
            <GlassOrbs />
            {/* editorial header */}
            <div className="flex flex-col items-center mb-10 relative z-10">
                <span className="text-[0.55rem] uppercase tracking-[0.5em] text-neutral-400 dark:text-neutral-500 mb-4 font-medium">
                    iris documentation
                </span>
                <h1 className="font-serif text-3xl md:text-[2.8rem] font-semibold leading-[1.15] tracking-tight text-neutral-900 dark:text-neutral-100">
                    terms of <em className="italic text-neutral-500 dark:text-neutral-400">service</em>
                </h1>
            </div>

            <div className="space-y-5 text-left text-neutral-700 dark:text-neutral-300 leading-relaxed">
                <h3 className="font-serif text-xl font-semibold mt-8 text-neutral-900 dark:text-neutral-100">1. Introduction</h3>
                <p>Welcome to IRIS! By using this bot, you agree to comply with and be bound by the following Terms of Service. Please review these terms carefully. If you do not agree to these terms, you should not use the bot.</p>

                <h3 className="font-serif text-xl font-semibold mt-8 text-neutral-900 dark:text-neutral-100">2. Acceptance of Terms</h3>
                <p>By using IRIS, you indicate your acceptance of these Terms of Service. If you do not agree to these terms, please do not use the bot.</p>

                <h3 className="font-serif text-xl font-semibold mt-8 text-neutral-900 dark:text-neutral-100">3. Changes to Terms</h3>
                <p>We reserve the right to modify these terms at any time. Any updates to the Terms of Service will be announced through IRIS to the server administrators. The most current version of the Terms of Service can always be found <a href="https://www.inimicalpart.com/iris/tos" className="text-blue-600 dark:text-blue-400 underline">here</a>. Your continued use of the bot after changes are posted constitutes your acceptance of the modified terms.</p>

                <h3 className="font-serif text-xl font-semibold mt-8 text-neutral-900 dark:text-neutral-100">4. Description of Service</h3>
                <p>IRIS provides users with moderation tools, games, statistics, and more. The service is provided &quot;as is&quot; and &quot;as available&quot;. We do not guarantee that the service will be uninterrupted or error-free.</p>

                <h3 className="font-serif text-xl font-semibold mt-8 text-neutral-900 dark:text-neutral-100">5. User Responsibilities</h3>
                <ul className="m-0 p-[revert] list-disc space-y-1">
                    <li><b>Compliance</b>: Users must comply with all applicable laws and Discord&apos;s Terms of Service.</li>
                    <li><b>Prohibited Activities</b>: Users must not use the bot for any illegal or unauthorized purpose, including but not limited to:
                        <ul className="m-[revert] p-[revert] list-disc">
                            <li>Harassment or abuse of other users</li>
                            <li>Spamming</li>
                            <li>Sharing or distributing harmful or malicious content</li>
                            <li>Attempting to disrupt or compromise the bot&apos;s functionality</li>
                        </ul>
                    </li>
                </ul>

                <h3 className="font-serif text-xl font-semibold mt-8 text-neutral-900 dark:text-neutral-100">6. Privacy</h3>
                <p>Your privacy is important to us. Please review our <a href="https://www.inimicalpart.com/iris/policy" className="text-blue-600 dark:text-blue-400 underline font-medium">Privacy Policy</a> to understand how we collect, use, and protect your information.</p>

                <h3 className="font-serif text-xl font-semibold mt-8 text-neutral-900 dark:text-neutral-100">7. Content</h3>
                <p>You are responsible for any content that you submit or transmit using the bot. We do not claim ownership of your content, but by using the bot, you grant us a worldwide, non-exclusive, royalty-free license to use, distribute, reproduce, modify, adapt, and publicly display such content.</p>

                <h3 className="font-serif text-xl font-semibold mt-8 text-neutral-900 dark:text-neutral-100">8. Termination</h3>
                <p>We reserve the right to terminate or suspend your access to the bot at our discretion, without notice, for conduct that we believe violates these terms or is harmful to other users of the bot or the service.</p>

                <h3 className="font-serif text-xl font-semibold mt-8 text-neutral-900 dark:text-neutral-100">9. Disclaimers</h3>
                <p>The service is provided &quot;as is&quot; and &quot;as available&quot; without warranties of any kind, either express or implied, including but not limited to warranties of merchantability, fitness for a particular purpose, and non-infringement. We do not warrant that the service will be uninterrupted, error-free, or free of harmful components.</p>

                <h3 className="font-serif text-xl font-semibold mt-8 text-neutral-900 dark:text-neutral-100">10. Limitation of Liability</h3>
                <p>To the fullest extent permitted by applicable law, in no event shall IRIS or its creators be liable for any indirect, incidental, special, consequential, or punitive damages, or any loss of profits or revenues, whether incurred directly or indirectly, or any loss of data, use, goodwill, or other intangible losses, resulting from:</p>
                <ul className="m-0 p-[revert] list-disc space-y-1">
                    <li>Your use or inability to use the bot</li>
                    <li>Any unauthorized access to or use of our servers and/or any personal information stored therein</li>
                    <li>Any interruption or cessation of transmission to or from the service</li>
                </ul>

                <h3 className="font-serif text-xl font-semibold mt-8 text-neutral-900 dark:text-neutral-100">11. Governing Law</h3>
                <p>These terms and your use of the bot are governed by and construed in accordance with the laws of Sweden, without regard to its conflict of law principles.</p>

                <h3 className="font-serif text-xl font-semibold mt-8 text-neutral-900 dark:text-neutral-100">12. Contact Information</h3>
                <p>If you have any questions about these Terms of Service, please contact us at <a href="mailto:contact@inimicalpart.com" className="text-blue-600 dark:text-blue-400 underline font-medium">contact@inimicalpart.com</a>.</p>
            </div>

            <Divider className="h-px my-8 bg-neutral-200/60 dark:bg-neutral-700/60" />
            <p className="text-sm text-neutral-500 dark:text-neutral-400 italic pb-8">By using IRIS, you acknowledge that you have read, understood, and agree to be bound by these Terms of Service.</p>
        </div>
    </>)
}
