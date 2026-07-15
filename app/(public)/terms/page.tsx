import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Terms & Conditions | K.K. Danny Enterprise',
  description: 'Terms and conditions for purchasing from and using K.K. Danny Enterprise.',
}

export default function TermsPage() {
  return (
    <>
      <div style={{ background: 'var(--navy)' }} className="py-14 sm:py-20">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center">
          <span className="section-label">Legal</span>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-white mt-3 mb-4">Terms &amp; Conditions</h1>
          <p className="text-sm" style={{ color: '#8a9ba8' }}>Last updated: June 2025</p>
        </div>
      </div>

      <section className="py-14 sm:py-20 max-w-3xl mx-auto px-4 sm:px-6">
        <div className="space-y-8" style={{ color: 'var(--text-muted)', lineHeight: '1.8' }}>

          <div>
            <h2 className="text-xl font-bold mb-3" style={{ color: 'var(--heading-dark)' }}>1. About These Terms</h2>
            <p>
              These terms and conditions govern your use of the K.K. Danny Enterprise website and any purchase you make from us,
              whether in person, by phone, or through this website. By using our services, you agree to these terms.
              K.K. Danny Enterprise is located in Adeiso, Eastern Region, Ghana.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-bold mb-3" style={{ color: 'var(--heading-dark)' }}>2. Products and Pricing</h2>
            <ul className="list-disc pl-5 space-y-2">
              <li>All prices are quoted in Ghana Cedis (₵) and are inclusive of applicable taxes unless stated otherwise.</li>
              <li>Prices are subject to change without prior notice due to market fluctuations, currency changes, or supplier costs.</li>
              <li>The price applicable to your order is the price confirmed at the time your order is accepted.</li>
              <li>We make every effort to display product information accurately, but specifications, availability, and pricing on the website may differ from in-store. Please confirm with our staff before placing a large order.</li>
            </ul>
          </div>

          <div>
            <h2 className="text-xl font-bold mb-3" style={{ color: 'var(--heading-dark)' }}>3. Orders and Payment</h2>
            <ul className="list-disc pl-5 space-y-2">
              <li>Orders may be placed in person, by phone, or by submitting a quote request through this website.</li>
              <li>A quote request is not a confirmed order. We will contact you to confirm availability and finalise pricing before the order is processed.</li>
              <li>Payment is required before goods are released unless a credit arrangement has been agreed in writing.</li>
              <li>We accept cash, mobile money (MoMo), and bank transfer. Confirm accepted payment methods when placing your order.</li>
            </ul>
          </div>

          <div>
            <h2 className="text-xl font-bold mb-3" style={{ color: 'var(--heading-dark)' }}>4. Delivery</h2>
            <ul className="list-disc pl-5 space-y-2">
              <li>Delivery is available within our service area. Delivery fees are quoted based on location, quantity, and vehicle type.</li>
              <li>We will provide an estimated delivery time when your order is confirmed. Delivery times are estimates and not guarantees.</li>
              <li>Risk of loss or damage to goods passes to you once goods are delivered to the agreed delivery address.</li>
              <li>You must inspect goods at the time of delivery. Any visible damage or shortage must be reported to the delivery team immediately.</li>
            </ul>
          </div>

          <div>
            <h2 className="text-xl font-bold mb-3" style={{ color: 'var(--heading-dark)' }}>5. Returns and Cancellations</h2>
            <ul className="list-disc pl-5 space-y-2">
              <li>Returns are accepted within 7 days of purchase for unused, undamaged goods in their original condition, accompanied by proof of purchase.</li>
              <li>Custom-cut, special-order, or perishable items (e.g. cement) cannot be returned once sold.</li>
              <li>Refunds will be processed using the original payment method within a reasonable timeframe.</li>
              <li>We reserve the right to decline a return if the goods have been used, damaged by the customer, or returned without proof of purchase.</li>
            </ul>
          </div>

          <div>
            <h2 className="text-xl font-bold mb-3" style={{ color: 'var(--heading-dark)' }}>6. Limitation of Liability</h2>
            <p>
              K.K. Danny Enterprise shall not be liable for any indirect, incidental, or consequential loss arising from the use
              of our products or services beyond what is required by Ghanaian law. Our liability is limited to the purchase price
              of the goods or services in question.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-bold mb-3" style={{ color: 'var(--heading-dark)' }}>7. Use of This Website</h2>
            <ul className="list-disc pl-5 space-y-2">
              <li>This website is provided for informational and transactional purposes only.</li>
              <li>You may not use this website for any unlawful purpose or in a way that could damage, disable, or impair it.</li>
              <li>All content on this website — including text, images, and logos — is the property of K.K. Danny Enterprise and may not be reproduced without permission.</li>
            </ul>
          </div>

          <div>
            <h2 className="text-xl font-bold mb-3" style={{ color: 'var(--heading-dark)' }}>8. Governing Law</h2>
            <p>
              These terms are governed by the laws of the Republic of Ghana. Any disputes arising from these terms or your use of
              our services shall be subject to the jurisdiction of the courts of Ghana.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-bold mb-3" style={{ color: 'var(--heading-dark)' }}>9. Changes to These Terms</h2>
            <p>
              We may update these terms from time to time. Updated terms will be posted on this page with a revised date.
              Continued use of our services after any changes constitutes acceptance of the updated terms.
            </p>
          </div>

          <div className="card p-6">
            <h2 className="text-lg font-bold mb-2" style={{ color: 'var(--heading-dark)' }}>Questions?</h2>
            <p>If you have any questions about these terms, please contact us:</p>
            <ul className="mt-3 space-y-1 text-sm">
              <li><span className="font-semibold" style={{ color: 'var(--heading-dark)' }}>Phone:</span> 0244754803</li>
              <li><span className="font-semibold" style={{ color: 'var(--heading-dark)' }}>Email:</span> info@kkdanny.com</li>
              <li><span className="font-semibold" style={{ color: 'var(--heading-dark)' }}>Location:</span> Adeiso, Eastern Region, Ghana</li>
            </ul>
          </div>

        </div>
      </section>
    </>
  )
}
