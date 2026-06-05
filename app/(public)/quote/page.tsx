import type { Metadata } from 'next'
import QuoteForm from './QuoteForm'

export const metadata: Metadata = {
  title: 'Request a Quote | K.K. Danny Enterprise',
  description: 'Get a free written price quote for building materials from K.K. Danny Enterprise in Adeiso, Ghana.',
}

export default function QuotePage() {
  return (
    <>
      <div style={{ background: 'var(--navy)' }} className="py-14 sm:py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <span className="section-label">Free Quote</span>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-white mt-3 mb-4">Request a Price Quote</h1>
          <p className="text-base max-w-xl mx-auto" style={{ color: '#8a9ba8' }}>
            Fill in the form below and we&apos;ll prepare a detailed price list for your project. Fast turnaround, honest pricing.
          </p>
        </div>
      </div>
      <section className="py-14 sm:py-20 max-w-3xl mx-auto px-4 sm:px-6">
        <QuoteForm />
      </section>
    </>
  )
}
