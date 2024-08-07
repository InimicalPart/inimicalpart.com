import { Divider } from "@nextui-org/react"

export default function IRISPrivacy() {
    return <>
        <h1 className="font-bold text-3xl">Privacy Policy for IRIS</h1>
        <Divider className="mt-3 mb-7"/>
        <h3 className="font-bold text-xl">1. Introduction</h3>
        IRIS (&quot;we&quot;, &quot;our&quot;, &quot;us&quot;) values your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our Discord bot. Please read this policy carefully. If you do not agree with the terms of this Privacy Policy, please do not use the bot.
        <br/><br/>

        <h3 className="font-bold text-xl">2. Information We Collect</h3>
        We may collect and store the following information:
        <br/><br/>

        <h4 className="font-bold text-lg">2.1 User Data</h4>
        <ul className="m-0 p-[revert] list-disc">
            <li><b>Discord User ID</b>: A unique identifier for each user.</li>
            <li><b>Username</b>: Your Discord username (@username).</li>
            <li><b>Server Information</b>: Information about the servers (guilds) where the bot is added, including server ID, rules created by admins using the &apos;/admin rules add&apos; command.</li>
            <li><b>User&apos;s statistics</b>: This includes, but is not limited to, game statistics (wins, losses, streaks, etc.), commands issued, and last interaction with server</li>
        </ul>
        <br/>

        <h4 className="font-bold text-lg">2.2 Usage Data</h4>
        <ul className="m-0 p-[revert] list-disc">
            <li><b>Commands Issued</b>: Logs of commands issued to the bot to improve service and troubleshoot issues.</li>
        </ul>
        <br/>

        <h3 className="font-bold text-xl">3. How We Use Your Information</h3>
        We use the information we collect in the following ways:
        <br/><br/>

        <h4 className="font-bold text-lg">3.1 To Provide and Maintain Our Service</h4>
        <ul className="m-0 p-[revert] list-disc">
            <li>To operate and maintain the bot&apos;s functionality.</li>
            <li>To process commands and requests.</li>
        </ul>
        <br/>

        <h4 className="font-bold text-lg">3.2 To Improve Our Service</h4>
        <ul className="m-0 p-[revert] list-disc">
            <li>To understand how users interact with the bot and make improvements.</li>
            <li>To troubleshoot and resolve issues.</li>
        </ul>
        <br/>

        <h4 className="font-bold text-lg">3.3 To Communicate with Users</h4>
        <ul className="m-0 p-[revert] list-disc">
            <li>To respond to user inquiries and provide support.</li>
            <li>To send updates or important information regarding the bot.</li>
        </ul>
        <br/>

        <h3 className="font-bold text-xl">4. How We Share Your Information</h3>
        We do not sell, trade, or otherwise transfer your personal information to outside parties except in the following situations:
        <br/><br/>

        <h4 className="font-bold text-lg">4.1 Legal Requirements</h4>
        We may disclose your information if required to do so by law or in response to valid requests by public authorities (e.g., a court or a government agency).
        <br/><br/>

        <h3 className="font-bold text-xl">5. Data Security</h3>
        We implement a variety of security measures to maintain the safety of your personal information. However, no method of transmission over the Internet, or method of electronic storage, is 100% secure, and we cannot guarantee its absolute security.
        <br/><br/>

        <h3 className="font-bold text-xl">6. Data Retention</h3>
        We retain your information only for as long as necessary to fulfill the purposes for which it was collected or to comply with legal obligations, resolve disputes, and enforce our agreements.
        <br/><br/>

        <h3 className="font-bold text-xl">7. Your Data Protection Rights</h3>
        You have the following rights regarding your personal information stored by IRIS
        <br/>
        <ul className="m-0 p-[revert] list-disc">
            <li><b>Access</b>: The right to request copies of your personal data.</li>
        </ul>
        <br/>
        Deletion of your personal information occurs automatically if you leave all servers associated with IRIS. Some information such as server rule offenses might not be deleted due to the requirements of the bot&apos;s functionality.
        <br/><br/>
        To request a copy of your personal data, please contact us at <a href="me@inimicalpart.com" className="font-semibold underline">me@inimicalpart.com</a>.
        <br/><br/>
        <h3 className="font-bold text-xl">8. Children&apos;s Privacy</h3>
        Our bot is not intended for use by individuals under the age of 13. We do not knowingly collect personal information from children under 13. If we become aware that we have collected personal information from a child under 13, we will take steps to delete such information.
        <br/><br/>

        <h3 className="font-bold text-xl">9. Changes to This Privacy Policy</h3>
        We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page. You are advised to review this Privacy Policy periodically for any changes.
        <br/><br/>

        <h3 className="font-bold text-xl">10. Contact Information</h3>
        If you have any questions or concerns about this Privacy Policy, or if you wish to exercise any of your data protection rights mentioned above, please contact us at:
        <br/>

        <ul className="m-0 p-[revert] list-disc">
            <li><b>Email</b>: <a href="me@inimicalpart.com" className="font-semibold underline">me@inimicalpart.com</a></li>
        </ul>
        <br/>
        <h3 className="font-bold text-xl">12. Consent</h3>
        By using IRIS, you consent to our Privacy Policy.
        <br/>
        <Divider className="my-5"/>

        <i>Effective Date: July 6th, 2024</i>

        <Divider className="my-5"/>

        <i>By using IRIS, you acknowledge that you have read, understood, and agree to be bound by this Privacy Policy.</i>
    </>
}