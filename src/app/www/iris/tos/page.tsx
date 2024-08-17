import { Divider } from "@nextui-org/react"

export default function IRISToS() {
    return <>
        <h1 className="font-bold text-3xl">Terms of Service for IRIS</h1>
        <Divider className="mt-3 mb-7"/>
        <h3 className="font-bold text-xl">1. Introduction</h3>
        Welcome to IRIS! By using this bot, you agree to comply with and be bound by the following Terms of Service. Please review these terms carefully. If you do not agree to these terms, you should not use the bot.
        <br/><br/>
        <h3 className="font-bold text-xl">2. Acceptance of Terms</h3>
        By using IRIS, you indicate your acceptance of these Terms of Service. If you do not agree to these terms, please do not use the bot.
        <br/><br/>
        <h3 className="font-bold text-xl">3. Changes to Terms</h3>
        We reserve the right to modify these terms at any time. Any updates to the Terms of Service will be announced through IRIS to the server administrators. The most current version of the Terms of Service can always be found <a href="https://www.inimicalpart.com/iris/tos">here</a>. Your continued use of the bot after changes are posted constitutes your acceptance of the modified terms.
        <br/><br/>

        <h3 className="font-bold text-xl">4. Description of Service</h3>
        IRIS provides users with moderation tools, games, statistics, and more. The service is provided &quot;as is&quot; and &quot;as available&quot;. We do not guarantee that the service will be uninterrupted or error-free.
        <br/><br/>

        <h3 className="font-bold text-xl">5. User Responsibilities</h3>
        <ul className="m-0 p-[revert] list-disc">
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
        <br/>

        <h3 className="font-bold text-xl">6. Privacy</h3>
        Your privacy is important to us. Please review our <a href="https://www.inimicalpart.com/iris/policy" className="font-semibold underline">Privacy Policy</a> to understand how we collect, use, and protect your information.
        <br/><br/>

        <h3 className="font-bold text-xl">7. Content</h3>
        You are responsible for any content that you submit or transmit using the bot. We do not claim ownership of your content, but by using the bot, you grant us a worldwide, non-exclusive, royalty-free license to use, distribute, reproduce, modify, adapt, and publicly display such content.
        <br/><br/>

        <h3 className="font-bold text-xl">8. Termination</h3>
        We reserve the right to terminate or suspend your access to the bot at our discretion, without notice, for conduct that we believe violates these terms or is harmful to other users of the bot or the service.
        <br/><br/>

        <h3 className="font-bold text-xl">9. Disclaimers</h3>
        The service is provided &quot;as is&quot; and &quot;as available&quot; without warranties of any kind, either express or implied, including but not limited to warranties of merchantability, fitness for a particular purpose, and non-infringement. We do not warrant that the service will be uninterrupted, error-free, or free of harmful components.
        <br/><br/>

        <h3 className="font-bold text-xl">10. Limitation of Liability</h3>
        To the fullest extent permitted by applicable law, in no event shall IRIS or its creators be liable for any indirect, incidental, special, consequential, or punitive damages, or any loss of profits or revenues, whether incurred directly or indirectly, or any loss of data, use, goodwill, or other intangible losses, resulting from:
        <br/>
        <ul className="m-0 p-[revert] list-disc">
        <li>Your use or inability to use the bot</li>
        <li>Any unauthorized access to or use of our servers and/or any personal information stored therein</li>
        <li>Any interruption or cessation of transmission to or from the service</li>
        </ul>
        <br/>
        <h3 className="font-bold text-xl">11. Governing Law</h3>
        These terms and your use of the bot are governed by and construed in accordance with the laws of Sweden, without regard to its conflict of law principles.
        <br/><br/>

        <h3 className="font-bold text-xl">12. Contact Information</h3>
        If you have any questions about these Terms of Service, please contact us at <a href="mailto:contact@inimicalpart.com" className="font-semibold underline">contact@inimicalpart.com</a>.

        <Divider className="h-1 my-5"/>

        <i>By using IRIS, you acknowledge that you have read, understood, and agree to be bound by these Terms of Service.</i>
    </>
}