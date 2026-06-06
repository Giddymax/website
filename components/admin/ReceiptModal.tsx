'use client'
import { useRef } from 'react'
import { formatCurrency } from '@/lib/utils'
import { X, Printer, FileDown } from 'lucide-react'
import type { Sale, SaleItem } from '@/types/database'

interface Props {
  sale: Sale
  items: SaleItem[]
  staffName?: string
  onClose: () => void
}

export default function ReceiptModal({ sale, items, staffName, onClose }: Props) {
  const receiptRef = useRef<HTMLDivElement>(null)

  function openPrintWindow(mode: 'thermal' | 'pdf') {
    const content = receiptRef.current?.innerHTML || ''
    const base = window.location.origin
    const win = window.open('', '_blank', 'width=500,height=750')
    if (!win) return

    const thermalCSS = `
      @page { size: 80mm auto; margin: 2mm; }
      body {
        font-family: 'Courier New', monospace;
        font-size: 10px;
        line-height: 1.4;
        margin: 0;
        padding: 4px;
        width: 72mm;
        background: white;
        color: black;
      }
      img { max-width: 80px; display: block; margin: 0 auto 4px; }
      div { word-break: break-word; }
    `

    const pdfCSS = `
      @page { size: A4; margin: 18mm 20mm; }
      body {
        font-family: 'Courier New', monospace;
        font-size: 12px;
        line-height: 1.6;
        margin: 0 auto;
        padding: 0;
        max-width: 400px;
        background: white;
        color: black;
      }
      img { max-width: 110px; display: block; margin: 0 auto 8px; }
    `

    win.document.write(`
      <html><head>
        <title>Receipt — ${sale.sale_ref}</title>
        <base href="${base}/">
        <style>
          * { box-sizing: border-box; }
          ${mode === 'thermal' ? thermalCSS : pdfCSS}
          table { width: 100%; border-collapse: collapse; }
          td { vertical-align: top; padding: 1px 0; }
        </style>
      </head>
      <body>${content}</body></html>
    `)
    win.document.close()
    win.focus()
    setTimeout(() => { win.print(); win.close() }, 400)
  }

  const printReceipt = () => openPrintWindow('thermal')
  const saveAsPDF = () => openPrintWindow('pdf')

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
          <div ref={receiptRef} style={{ fontFamily: "'Courier New', monospace", fontSize: '11px', color: '#000', background: '#fff', padding: '16px', borderRadius: '4px', lineHeight: '1.5' }}>
            {/* Header */}
            <div className="center bold" style={{ textAlign: 'center', marginBottom: '4px' }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/logo.png" alt="K.K. Danny Enterprise" style={{ maxWidth: '100px', height: 'auto', margin: '0 auto 6px', display: 'block' }} />
              <div style={{ fontWeight: 'bold', fontSize: '13px' }}>K.K. DANNY ENTERPRISE</div>
              <div>Quality &amp; Affordable Building Materials</div>
              <div>Adeiso, Eastern Region, Ghana</div>
              <div>Tel: 0244754803 / 0249986118</div>
              <div>Opp. Radiance Gas Filling Station</div>
            </div>
            <div style={{ borderTop: '1px dashed #000', margin: '6px 0' }} />

            <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>Date:</span><span>{dateStr} {timeStr}</span></div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>Ref:</span><span>{sale.sale_ref}</span></div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>Cust:</span><span>{sale.customer_name || 'Walk-in'}</span></div>
            {sale.customer_phone && <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>Tel:</span><span>{sale.customer_phone}</span></div>}
            <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>Pay:</span><span>{sale.payment_method?.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase())}</span></div>
            {staffName && <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>Serv:</span><span>{staffName}</span></div>}
            {sale.notes && <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>Note:</span><span>{sale.notes}</span></div>}

            <div style={{ borderTop: '1px dashed #000', margin: '6px 0' }} />
            <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold' }}>
              <span>ITEM</span><span>QTY&nbsp;&nbsp;&nbsp;TOTAL</span>
            </div>
            <div style={{ borderTop: '1px dashed #000', margin: '4px 0' }} />

            {items.length > 0 ? items.map((item, i) => (
              <div key={i} style={{ marginBottom: '2px' }}>
                <div style={{ fontSize: '10px' }}>{item.item_name}</div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: '10px' }}>&nbsp;{formatCurrency(item.unit_price)}/{item.unit}</span>
                  <span>{item.quantity}&nbsp;&nbsp;&nbsp;{formatCurrency(item.line_total)}</span>
                </div>
              </div>
            )) : <div style={{ textAlign: 'center', color: '#666', margin: '4px 0' }}>(item details unavailable)</div>}

            <div style={{ borderTop: '1px dashed #000', margin: '6px 0' }} />
            <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>SUBTOTAL</span><span>{formatCurrency(sale.subtotal)}</span></div>
            {sale.discount > 0 && <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>DISCOUNT</span><span>-{formatCurrency(sale.discount)}</span></div>}
            <div style={{ borderTop: '1px dashed #000', margin: '4px 0' }} />
            <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold' }}><span>TOTAL</span><span>{formatCurrency(sale.total)}</span></div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>PAID</span><span>{formatCurrency(sale.amount_paid)}</span></div>
            {sale.change_due > 0 && <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold' }}><span>CHANGE</span><span>{formatCurrency(sale.change_due)}</span></div>}
            {sale.balance_due > 0 && <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold' }}><span>BALANCE DUE</span><span>{formatCurrency(sale.balance_due)}</span></div>}

            <div style={{ borderTop: '2px solid #000', margin: '8px 0' }} />
            <div style={{ textAlign: 'center', fontWeight: 'bold', fontSize: '10px' }}>
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
          <button onClick={saveAsPDF}
            className="flex-1 flex items-center justify-center gap-2 py-2.5 text-sm rounded font-semibold transition-colors hover:text-white"
            style={{ background: '#1e3a2e', border: '1px solid #2d6a4f', color: '#4ade80' }}>
            <FileDown size={15} /> Save PDF
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
