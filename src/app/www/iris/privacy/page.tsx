import { Divider } from "@nextui-org/react"

function PrivacySection({ num, title, children }: { num: string, title: string, children: React.ReactNode }) {
  return (
    <div className="mb-6">
      <h3 className="font-serif text-xl font-semibold text-neutral-900 dark:text-neutral-100 mb-3">
        {num}. <em className="italic text-neutral-600 dark:text-neutral-400">{title}</em>
      </h3>
      <div className="text-neutral-700 dark:text-neutral-300 leading-relaxed text-sm">
        {children}
      </div>
    </div>
  )
}

export default function IRISPrivacy() {
    return <div className="max-w-2xl mx-auto">
        {/* editorial header */}
        <div className="flex flex-col items-center mb-12">
            <span className="text-[0.55rem] uppercase tracking-[0.5em] text-neutral-400 dark:text-neutral-500 mb-4 font-medium">
                IRIS
            </span>
            <h1 className="font-serif text-3xl md:text-[2.5rem] font-semibold leading-[1.15] tracking-tight text-neutral-900 dark:text-neutral-100">
                privacy <em className="italic text-neutral-500 dark:text-neutral-400">policy</em>
            </h1>
        </div>

        <div className="w-12 h-px bg-neutral-300 dark:bg-neutral-600 mx-auto mb-10" />

        <PrivacySection num="1" title="Introduction">
          IRIS (&quot;we&quot;, &quot;our&quot;, &quot;us&quot;) values your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our Discord bot. Please read this policy carefully. If you do not agree with the terms of this Privacy Policy, please do not use the bot.
        </PrivacySection>

        <PrivacySection num="2" title="Information We Collect">
          <p className="mb-3">We may collect and store the following information:</p>
          <h4 className="font-medium text-base text-neutral-800 dark:text-neutral-200 mb-2">2.1 User Data</h4>
          <ul className="list-disc pl-5 space-y-1.5 mb-4">
              <li><b>Discord User ID</b>: A unique identifier for each user.</li>
              <li><b>Username</b>: Your Discord username (@username).</li>
              <li><b>Server Information</b>: Information about the servers (guilds) where the bot is added, including server ID, rules created by admins using the &apos;/admin rules add&apos; command.</li>
              <li><b>User&apos;s statistics</b>: This includes, but is not limited to, game statistics (wins, losses, streaks, etc.), commands issued, and last interaction with server.</li>
          </ul>
          <h4 className="font-medium text-base text-neutral-800 dark:text-neutral-200 mb-2">2.2 Usage Data</h4>
          <ul className="list-disc pl-5 space-y-1.5">
              <li><b>Commands Issued</b>: Logs of commands issued to the bot to improve service and troubleshoot issues.</li>
          </ul>
        </PrivacySection>

        <PrivacySection num="3" title="How We Use Your Information">
          <p className="mb-3">We use the information we collect in the following ways:</p>
          <h4 className="font-medium text-base text-neutral-800 dark:text-neutral-200 mb-2">3.1 To Provide and Maintain Our Service</h4>
          <ul className="list-disc pl-5 space-y-1.5 mb-4">
              <li>To operate and maintain the bot&apos;s functionality.</li>
              <li>To process commands and requests.</li>
          </ul>
          <h4 className="font-medium text-base text-neutral-800 dark:text-neutral-200 mb-2">3.2 To Improve Our Service</h4>
          <ul className="list-disc pl-5 space-y-1.5 mb-4">
              <li>To understand how users interact with the bot and make improvements.</li>
              <li>To troubleshoot and resolve issues.</li>
          </ul>
          <h4 className="font-medium text-base text-neutral-800 dark:text-neutral-200 mb-2">3.3 To Communicate with Users</h4>
          <ul className="list-disc pl-5 space-y-1.5">
              <li>To respond to user inquiries and provide support.</li>
              <li>To send updates or important information regarding the bot.</li>
          </ul>
        </PrivacySection>

        <PrivacySection num="4" title="How We Share Your Information">
          We do not sell, trade, or otherwise transfer your personal information to outside parties except in the following situations:
          <h4 className="font-medium text-base text-neutral-800 dark:text-neutral-200 mb-2 mt-3">4.1 Legal Requirements</h4>
          <p>We may disclose your information if required to do so by law or in response to valid requests by public authorities (e.g., a court or a government agency).</p>
        </PrivacySection>

        <PrivacySection num="5" title="Data Security">
          We implement a variety of security measures to maintain the safety of your personal information. However, no method of transmission over the Internet, or method of electronic storage, is 100% secure, and we cannot guarantee its absolute security.
        </PrivacySection>

        <PrivacySection num="6" title="Data Retention">
          We retain your information only for as long as necessary to fulfill the purposes for which it was collected or to comply with legal obligations, resolve disputes, and enforce our agreements.
        </PrivacySection>

        <PrivacySection num="7" title="Your Data Protection Rights">
          <p className="mb-3">You have the following rights regarding your personal information stored by IRIS:</p>
          <ul className="list-disc pl-5 space-y-1.5 mb-3">
              <li><b>Access</b>: The right to request copies of your personal data.</li>
          </ul>
          <p>Deletion of your personal information occurs automatically if you leave all servers associated with IRIS. Some information such as server rule offenses might not be deleted due to the requirements of the bot&apos;s functionality.</p>
          <p className="mt-3">To request a copy of your personal data, please contact us at <a href="mailto:contact@inimicalpart.com" className="text-blue-600 dark:text-blue-400 underline underline-offset-2 font-medium">contact@inimicalpart.com</a>.</p>
        </PrivacySection>

        <PrivacySection num="8" title="Children&apos;s Privacy">
          Our bot is not intended for use by individuals under the age of 13. We do not knowingly collect personal information from children under 13. If we become aware that we have collected personal information from a child under 13, we will take steps to delete such information.
        </PrivacySection>

        <PrivacySection num="9" title="Changes to This Privacy Policy">
          We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page. You are advised to review this Privacy Policy periodically for any changes.
        </PrivacySection>

        <PrivacySection num="10" title="Contact Information">
          If you have any questions or concerns about this Privacy Policy, or if you wish to exercise any of your data protection rights mentioned above, please contact us at:
          <ul className="list-none pl-0 mt-2 pl-5 space-y-1.5">
              <li><b>Email</b>: <a href="mailto:contact@inimicalpart.com" className="text-blue-600 dark:text-blue-400 underline underline-offset-2 font-medium">contact@inimicalpart.com</a></li>
          </ul>
        </PrivacySection>

        <PrivacySection num="11" title="Consent">
          By using IRIS, you consent to our Privacy Policy.
        </PrivacySection>

        <Divider className="h-px my-8 bg-neutral-200 dark:bg-neutral-700" />

        <p className="text-sm text-neutral-500 dark:text-neutral-400 text-center pb-4">
          Effective Date: July 6th, 2024
        </p>

        <Divider className="h-px my-3 bg-neutral-200 dark:bg-neutral-700" />

        <p className="text-sm text-neutral-500 dark:text-neutral-400 italic text-center pb-8">
          By using IRIS, you acknowledge that you have read, understood, and agree to be bound by this Privacy Policy.
        </p>
    </div>
}
