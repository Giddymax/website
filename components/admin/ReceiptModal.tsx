'use client'
import { useRef, useState } from 'react'
import { formatCurrency } from '@/lib/utils'
import { X, Printer, FileDown, Loader2 } from 'lucide-react'
import type { Sale, SaleItem } from '@/types/database'
import toast from 'react-hot-toast'

interface Props {
  sale: Sale
  items: SaleItem[]
  staffName?: string
  onClose: () => void
}

export default function ReceiptModal({ sale, items, staffName, onClose }: Props) {
  const receiptRef = useRef<HTMLDivElement>(null)
  const [savingPdf, setSavingPdf] = useState(false)

  // Prints the receipt directly — no popup window. The #receipt-print rule in
  // globals.css hides the rest of the page and sizes the printed page to
  // match an 80mm thermal roll, so this goes straight to the browser's print
  // dialog targeting the real printer.
  function printReceipt() {
    window.print()
  }

  async function saveAsPDF() {
    const el = receiptRef.current
    if (!el) return
    setSavingPdf(true)
    try {
      const [{ default: html2canvas }, { jsPDF }] = await Promise.all([
        import('html2canvas'),
        import('jspdf'),
      ])

      const canvas = await html2canvas(el, {
        scale: 3,
        backgroundColor: '#ffffff',
        useCORS: true,
      })
      const imgData = canvas.toDataURL('image/png')

      // Match the physical 80mm thermal roll — auto-height to fit content,
      // same as a real receipt printout rather than a full A4 sheet.
      const pageWidthMM = 80
      const margin = 2
      const contentWidthMM = pageWidthMM - margin * 2
      const contentHeightMM = (canvas.height * contentWidthMM) / canvas.width
      const pageHeightMM = contentHeightMM + margin * 2

      const pdf = new jsPDF({ unit: 'mm', format: [pageWidthMM, pageHeightMM] })
      pdf.addImage(imgData, 'PNG', margin, margin, contentWidthMM, contentHeightMM)
      pdf.save(`Receipt-${sale.sale_ref}.pdf`)
    } catch (err) {
      console.error('Failed to generate receipt PDF', err)
      toast.error('Failed to generate PDF')
    } finally {
      setSavingPdf(false)
    }
  }

  const date = new Date(sale.created_at)
  const dateStr = date.toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' })
  const timeStr = date.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', hour12: false })

  const getPaymentStatus = () => {
    if (sale.change_due > 0) return `CHANGE DUE: ${formatCurrency(sale.change_due)}`
    if (sale.balance_due > 0) return `BALANCE DUE: ${formatCurrency(sale.balance_due)}`
    return 'PAID IN FULL'
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70">
      <div className="relative w-full max-w-sm rounded-xl overflow-hidden shadow-2xl" style={{ background: 'var(--navy)', border: '1px solid #1e2e3c' }}>
        <div className="flex items-center justify-between px-5 py-4" style={{ borderBottom: '1px solid #1e2e3c' }}>
          <h2 className="text-white font-bold">Receipt — {sale.sale_ref}</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-white"><X size={18} /></button>
        </div>

        {/* Receipt Preview */}
        <div className="overflow-y-auto max-h-[70vh] p-4">
          <div id="receipt-print" ref={receiptRef} style={{ fontFamily: "'Courier New', Courier, monospace", fontSize: '12px', fontWeight: 700, color: '#000', background: '#fff', padding: '16px', borderRadius: '4px', lineHeight: '1.6', WebkitFontSmoothing: 'antialiased' }}>
            {/* Header */}
            <div className="center bold" style={{ textAlign: 'center', marginBottom: '4px' }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/logo.png" alt="K.K. Danny Enterprise" style={{ maxWidth: '100px', height: 'auto', margin: '0 auto 6px', display: 'block' }} />
              <div style={{ fontWeight: 800, fontSize: '15px' }}>K.K. DANNY ENTERPRISE</div>
              <div>Quality &amp; Affordable Building Materials</div>
              <div>Adeiso, Eastern Region, Ghana</div>
              <div>Tel: 0244754803 / 0249986118</div>
              <div>Opp. Radiance Gas Filling Station</div>
            </div>
            <div style={{ borderTop: '1px dashed #000', margin: '6px 0' }} />

            <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>Receipt No:</span><span>{sale.sale_ref}</span></div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>Date:</span><span>{dateStr} {timeStr}</span></div>
            {staffName && <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>Served By:</span><span>{staffName}</span></div>}
            <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>Customer:</span><span>{sale.customer_name || 'Walk-in'}</span></div>
            {sale.customer_phone && <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>Tel:</span><span>{sale.customer_phone}</span></div>}
            <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>Payment:</span><span>{sale.payment_method?.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase())}</span></div>
            {sale.notes && <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>Note:</span><span>{sale.notes}</span></div>}

            <div style={{ borderTop: '2px dashed #000', margin: '6px 0' }} />
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '11px' }}>
              <thead>
                <tr style={{ fontWeight: 800 }}>
                  <th style={{ textAlign: 'left', padding: '0 2px 0 0' }}>Item</th>
                  <th style={{ textAlign: 'center', padding: '0 2px' }}>Qty</th>
                  <th style={{ textAlign: 'right', padding: '0 2px' }}>Price</th>
                  <th style={{ textAlign: 'right', padding: '0 0 0 2px' }}>Total</th>
                </tr>
              </thead>
            </table>
            <div style={{ borderTop: '2px dashed #000', margin: '4px 0' }} />

            {items.length > 0 ? (
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '11px' }}>
                <tbody>
                  {items.map((item, i) => (
                    <tr key={i}>
                      <td style={{ textAlign: 'left', verticalAlign: 'top', padding: '2px 2px 2px 0' }}>
                        {item.item_name}
                        {item.unit && <div style={{ fontSize: '10px', fontWeight: 600, color: '#333' }}>{item.unit}</div>}
                      </td>
                      <td style={{ textAlign: 'center', verticalAlign: 'top', padding: '2px' }}>{item.quantity}</td>
                      <td style={{ textAlign: 'right', verticalAlign: 'top', padding: '2px' }}>{formatCurrency(item.unit_price)}</td>
                      <td style={{ textAlign: 'right', verticalAlign: 'top', padding: '2px 0 2px 2px', fontWeight: 800 }}>{formatCurrency(item.line_total)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : <div style={{ textAlign: 'center', color: '#333', margin: '4px 0', fontWeight: 700 }}>(item details unavailable)</div>}

            <div style={{ borderTop: '2px dashed #000', margin: '6px 0' }} />
            <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>SUBTOTAL</span><span>{formatCurrency(sale.subtotal)}</span></div>
            {sale.discount > 0 && <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>DISCOUNT</span><span>-{formatCurrency(sale.discount)}</span></div>}
            <div style={{ borderTop: '2px dashed #000', margin: '4px 0' }} />
            <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 900, fontSize: '13px' }}><span>TOTAL</span><span>{formatCurrency(sale.total)}</span></div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>PAID</span><span>{formatCurrency(sale.amount_paid)}</span></div>
            {sale.change_due > 0 && <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 900 }}><span>CHANGE</span><span>{formatCurrency(sale.change_due)}</span></div>}
            {sale.balance_due > 0 && <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 900 }}><span>BALANCE DUE</span><span>{formatCurrency(sale.balance_due)}</span></div>}

            <div style={{ borderTop: '3px solid #000', margin: '8px 0' }} />
            <div style={{ textAlign: 'center', fontWeight: 800, fontSize: '11px' }}>
              <div>{getPaymentStatus()}</div>
              <div style={{ marginTop: '6px' }}>Thank you for your patronage!</div>
              <div>*** CUSTOMER COPY ***</div>
            </div>
          </div>
        </div>

        <div className="flex gap-2 px-5 py-4" style={{ borderTop: '1px solid #1e2e3c' }}>
          <button onClick={printReceipt} className="btn-gold flex-1 flex items-center justify-center gap-2 py-2.5 text-sm">
            <Printer size={15} /> Print
          </button>
          <button onClick={saveAsPDF} disabled={savingPdf}
            className="flex-1 flex items-center justify-center gap-2 py-2.5 text-sm rounded font-semibold transition-colors hover:text-white disabled:opacity-60"
            style={{ background: '#1e3a2e', border: '1px solid #2d6a4f', color: '#4ade80' }}>
            {savingPdf ? <Loader2 size={15} className="animate-spin" /> : <FileDown size={15} />}
            {savingPdf ? 'Generating…' : 'Save PDF'}
          </button>
          <button onClick={onClose}
            className="flex-1 py-2.5 text-sm rounded font-semibold text-gray-300 hover:text-white transition-colors"
            style={{ background: '#1e2a35', border: '1px solid #374d5e' }}>
            Close
          </button>
        </div>
      </div>
    </div>
  )
}
