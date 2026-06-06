import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Privacy Policy | K.K. Danny Enterprise',
  description: 'Privacy policy for K.K. Danny Enterprise — how we collect, use, and protect your personal information.',
}

export default function PrivacyPage() {
  return (
    <>
      <div style={{ background: 'var(--navy)' }} className="py-14 sm:py-20">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center">
          <span className="section-label">Legal</span>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-white mt-3 mb-4">Privacy Policy</h1>
          <p className="text-sm" style={{ color: '#8a9ba8' }}>Last updated: June 2025</p>
        </div>
      </div>

      <section className="py-14 sm:py-20 max-w-3xl mx-auto px-4 sm:px-6">
        <div className="prose-content space-y-8" style={{ color: 'var(--text-muted)', lineHeight: '1.8' }}>

          <div>
            <h2 className="text-xl font-bold mb-3" style={{ color: 'var(--heading-dark)' }}>1. Who We Are</h2>
            <p>
              K.K. Danny Enterprise is a building materials and hardware supply business based in Adeiso, Eastern Region, Ghana.
              We operate both a physical store and this website to serve our customers. This policy explains how we handle
              personal information you share with us.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-bold mb-3" style={{ color: 'var(--heading-dark)' }}>2. Information We Collect</h2>
            <p>We may collect the following information when you interact with us:</p>
            <ul className="list-disc pl-5 mt-2 space-y-1">
              <li>Your name and contact details (phone number and email address) when you submit a quote request or contact form</li>
              <li>Delivery address when you request delivery of materials</li>
              <li>Project details you voluntarily provide in quote or enquiry forms</li>
              <li>Basic usage data (pages visited) through our website analytics, which does not identify you personally</li>
            </ul>
          </div>

          <div>
            <h2 className="text-xl font-bold mb-3" style={{ color: 'var(--heading-dark)' }}>3. How We Use Your Information</h2>
            <p>We use the information you provide to:</p>
            <ul className="list-disc pl-5 mt-2 space-y-1">
              <li>Respond to your quote requests and enquiries</li>
              <li>Process and fulfil orders and deliveries</li>
              <li>Contact you about your enquiry or order</li>
              <li>Improve our products and services</li>
            </ul>
            <p className="mt-3">
              We do not use your information for unsolicited marketing, and we do not sell or rent your personal data to any third party.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-bold mb-3" style={{ color: 'var(--heading-dark)' }}>4. How We Store Your Information</h2>
            <p>
              Information submitted through this website is stored securely using Supabase, a cloud database platform with
              industry-standard encryption. Access is restricted to authorised K.K. Danny Enterprise staff only.
              We retain your information only as long as necessary to fulfil the purpose for which it was collected or as
              required by law.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-bold mb-3" style={{ color: 'var(--heading-dark)' }}>5. Sharing Your Information</h2>
            <p>
              We do not share your personal information with third parties except where necessary to deliver our services
              (such as a delivery partner who needs your address), or where required by Ghanaian law or a lawful authority.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-bold mb-3" style={{ color: 'var(--heading-dark)' }}>6. Your Rights</h2>
            <p>You have the right to:</p>
            <ul className="list-disc pl-5 mt-2 space-y-1">
              <li>Request access to the personal information we hold about you</li>
              <li>Request correction of inaccurate information</li>
              <li>Request deletion of your information where it is no longer needed</li>
            </ul>
            <p className="mt-3">
              To exercise any of these rights, please contact us using the details below.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-bold mb-3" style={{ color: 'var(--heading-dark)' }}>7. Cookies</h2>
            <p>
              This website may use essential cookies to ensure core functionality works correctly. We do not use tracking
              or advertising cookies. By using the site, you consent to any essential cookies placed.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-bold mb-3" style={{ color: 'var(--heading-dark)' }}>8. Changes to This Policy</h2>
            <p>
              We may update this privacy policy from time to time. Any changes will be posted on this page with an updated
              date. Continued use of our website after any changes constitutes your acceptance of the updated policy.
            </p>
          </div>

          <div className="card p-6">
            <h2 className="text-lg font-bold mb-2" style={{ color: 'var(--heading-dark)' }}>Contact Us</h2>
            <p>If you have any questions about this privacy policy or how we handle your data, please reach out:</p>
            <ul className="mt-3 space-y-1 text-sm">
              <li><span className="font-semibold" style={{ color: 'var(--heading-dark)' }}>Phone:</span> 0244754803</li>
              <li><span className="font-semibold" style={{ color: 'var(--heading-dark)' }}>Email:</span> kkdannyenterprise@gmail.com</li>
              <li><span className="font-semibold" style={{ color: 'var(--heading-dark)' }}>Location:</span> Adeiso, Eastern Region, Ghana</li>
            </ul>
          </div>

        </div>
      </section>
    </>
  )
}
