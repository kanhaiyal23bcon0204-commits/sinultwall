// src/app/pages/PrivacyPage.tsx
export function PrivacyPage() {
  return (
    <div className="max-w-3xl mx-auto py-20 px-6 min-h-[70vh]">
      <h1 className="text-4xl font-extrabold text-gray-900 mb-6 tracking-tight">Privacy Policy</h1>
      <div className="text-lg text-gray-600 leading-relaxed space-y-6">
        <p>
          At SinultWall, your privacy is our priority. Since our platform requires no user accounts, we do not collect personal information like names, emails, or phone numbers from our standard visitors.
        </p>
        <p>
          We only track basic, anonymized metrics (such as download counts and device types) to ensure our trending feed is accurate and our UI remains optimized for your screen. Your browsing experience remains completely private and secure.
        </p>
      </div>
    </div>
  );
}