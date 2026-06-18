import type { Metadata } from 'next'
import QuoteForm from './QuoteForm'
import PageHero from '@/components/public/PageHero'

export const metadata: Metadata = {
  title: 'Request a Quote | K.K. Danny Enterprise',
  description: 'Get a free written price quote for building materials from K.K. Danny Enterprise in Adeiso, Ghana.',
}

export default function QuotePage() {
  return (
    <>
      <PageHero
        slug="quote"
        defaultLabel="Free Quote"
        defaultHeading="Request a Price Quote"
        defaultDescription="Fill in the form below and we'll prepare a detailed price list for your project. Fast turnaround, honest pricing."
      />
      <section className="py-14 sm:py-20 max-w-3xl mx-auto px-4 sm:px-6">
        <QuoteForm />
      </section>
    </>
  )
}
