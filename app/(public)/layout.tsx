import { createClient } from '@/lib/supabase/server'
import Navbar from '@/components/public/Navbar'
import Footer from '@/components/public/Footer'

export const revalidate = 3600

export default async function PublicLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()
  const { data: headerContent } = await supabase
    .from('site_content')
    .select('key, value')
    .eq('section', 'header')
    .limit(10)

  const h = (key: string) => headerContent?.find(x => x.key === key)?.value || undefined

  return (
    <>
      <Navbar phone={h('header_phone')} tagline={h('header_tagline')} />
      <main className="pt-16">{children}</main>
      <Footer />
    </>
  )
}
