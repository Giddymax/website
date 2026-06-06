'use client'
import { useRef } from 'react'
import { X, Printer, FileDown } from 'lucide-react'
import { formatCurrency, formatDate } from '@/lib/utils'
import type { Invoice } from '@/types/database'

interface Props {
  invoice: Invoice
  createdByName: string
  onClose: () => void
}

const STATUS_LABEL: Record<string, string> = {
  draft: 'DRAFT',
  sent: 'SENT',
  paid: 'PAID',
  cancelled: 'CANCELLED',
}

export default function InvoicePrintModal({ invoice, createdByName, onClose }: Props) {
  const contentRef = useRef<HTMLDivElement>(null)

  function openPrintWindow(mode: 'a4' | 'thermal') {
    const content = contentRef.current?.innerHTML || ''
    const base = window.location.origin
    const win = window.open('', '_blank', 'width=680,height=900')
    if (!win) return

    const a4CSS = `
      @page { size: A4; margin: 15mm 20mm; }
      body { font-family: Arial, Helvetica, sans-serif; font-size: 12px; line-height: 1.5; color: #000; background: #fff; margin: 0; padding: 0; }
      img { max-width: 80px; height: auto; }
      table { width: 100%; border-collapse: collapse; }
      th { background: #f3f4f6; font-size: 10px; text-transform: uppercase; letter-spacing: 0.05em; }
      td, th { padding: 6px 8px; text-align: left; border: 1px solid #e5e7eb; }
      .text-right { text-align: right; }
      .total-row td { font-weight: bold; font-size: 13px; }
      .label { color: #6b7280; font-size: 10px; text-transform: uppercase; letter-spacing: 0.05em; }
    `

    const thermalCSS = `
      @page { size: 80mm auto; margin: 2mm; }
      body { font-family: 'Courier New', monospace; font-size: 10px; line-height: 1.4; margin: 0; padding: 4px; width: 72mm; background: white; color: black; }
      img { max-width: 70px; display: block; margin: 0 auto 4px; }
      table { width: 100%; border-collapse: collapse; font-size: 9px; }
      td { padding: 1px 0; vertical-align: top; }
      .text-right { text-align: right; }
    `

    win.document.write(`<html><head>
      <title>Invoice — ${invoice.invoice_number}</title>
      <base href="${base}/">
      <style>* { box-sizing: border-box; } ${mode === 'a4' ? a4CSS : thermalCSS}</style>
    </head><body>${content}</body></html>`)
    win.document.close()
    win.focus()
    setTimeout(() => { win.print(); win.close() }, 400)
  }

  const items = invoice.invoice_items || []

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 overflow-y-auto">
      <div className="w-full max-w-xl rounded-xl my-4" style={{ background: 'var(--navy)', border: '1px solid #1e2e3c' }}>
        {/* Modal header */}
        <div className="flex items-center justify-between px-5 py-4" style={{ borderBottom: '1px solid #1e2e3c' }}>
          <h2 className="text-white font-bold">Invoice — {invoice.invoice_number}</h2>
          <button type="button" onClick={onClose} className="text-gray-500 hover:text-white"><X size={18} /></button>
        </div>

        {/* Invoice preview */}
        <div className="overflow-y-auto max-h-[65vh] p-4">
          <div
            ref={contentRef}
            style={{
              fontFamily: 'Arial, Helvetica, sans-serif',
              fontSize: '12px',
              background: '#fff',
              color: '#000',
              padding: '24px',
              borderRadius: '4px',
              lineHeight: '1.5',
            }}
          >
            {/* Top: logo + company */}
            <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '20px' }}>
              <tbody>
                <tr>
                  <td style={{ verticalAlign: 'top', width: '50%' }}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src="/logo.jpeg" alt="K.K. Danny Enterprise" style={{ maxWidth: '70px', height: 'auto', marginBottom: '6px' }} />
                    <div style={{ fontWeight: 'bold', fontSize: '14px' }}>K.K. DANNY ENTERPRISE</div>
                    <div style={{ color: '#6b7280', fontSize: '11px' }}>Quality &amp; Affordable Building Materials</div>
                    <div style={{ color: '#6b7280', fontSize: '11px' }}>Adeiso, Eastern Region, Ghana</div>
                    <div style={{ color: '#6b7280', fontSize: '11px' }}>Tel: 02444754803 / 0249986118</div>
                  </td>
                  <td style={{ verticalAlign: 'top', textAlign: 'right' }}>
                    <div style={{ fontSize: '22px', fontWeight: 'bold', letterSpacing: '-0.5px' }}>INVOICE</div>
                    <div style={{ marginTop: '8px', fontSize: '11px', color: '#6b7280' }}>Invoice #</div>
                    <div style={{ fontWeight: 'bold' }}>{invoice.invoice_number}</div>
                    <div style={{ marginTop: '6px', fontSize: '11px', color: '#6b7280' }}>Date</div>
                    <div>{formatDate(invoice.created_at)}</div>
                    {invoice.due_date && (
                      <>
                        <div style={{ marginTop: '6px', fontSize: '11px', color: '#6b7280' }}>Due Date</div>
                        <div style={{ fontWeight: 'bold', color: '#dc2626' }}>{formatDate(invoice.due_date)}</div>
                      </>
                    )}
                    <div style={{ marginTop: '8px', display: 'inline-block', padding: '2px 10px', borderRadius: '9999px', fontSize: '10px', fontWeight: 'bold', letterSpacing: '0.05em', background: invoice.status === 'paid' ? '#d1fae5' : invoice.status === 'cancelled' ? '#fee2e2' : '#fef9c3', color: invoice.status === 'paid' ? '#065f46' : invoice.status === 'cancelled' ? '#991b1b' : '#92400e' }}>
                      {STATUS_LABEL[invoice.status]}
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>

            {/* Bill to */}
            <div style={{ background: '#f9fafb', padding: '12px 14px', borderRadius: '6px', marginBottom: '20px' }}>
              <div style={{ fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.05em', color: '#6b7280', marginBottom: '4px' }}>Bill To</div>
              <div style={{ fontWeight: 'bold', fontSize: '13px' }}>{invoice.customer_name}</div>
              {invoice.customer_phone && <div style={{ color: '#374151', fontSize: '11px' }}>{invoice.customer_phone}</div>}
              {invoice.customer_email && <div style={{ color: '#374151', fontSize: '11px' }}>{invoice.customer_email}</div>}
              {invoice.customer_address && <div style={{ color: '#374151', fontSize: '11px' }}>{invoice.customer_address}</div>}
            </div>

            {/* Items table */}
            <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '16px' }}>
              <thead>
                <tr style={{ background: '#1e293b', color: '#fff' }}>
                  <th style={{ padding: '8px', textAlign: 'left', fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: '600' }}>Description</th>
                  <th style={{ padding: '8px', textAlign: 'center', fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: '600', width: '60px' }}>Qty</th>
                  <th style={{ padding: '8px', textAlign: 'center', fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: '600', width: '50px' }}>Unit</th>
                  <th style={{ padding: '8px', textAlign: 'right', fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: '600', width: '90px' }}>Unit Price</th>
                  <th style={{ padding: '8px', textAlign: 'right', fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: '600', width: '90px' }}>Total</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item, i) => (
                  <tr key={item.id || i} style={{ background: i % 2 === 0 ? '#fff' : '#f9fafb' }}>
                    <td style={{ padding: '8px', borderBottom: '1px solid #e5e7eb' }}>{item.description}</td>
                    <td style={{ padding: '8px', textAlign: 'center', borderBottom: '1px solid #e5e7eb' }}>{item.quantity}</td>
                    <td style={{ padding: '8px', textAlign: 'center', borderBottom: '1px solid #e5e7eb', color: '#6b7280', fontSize: '11px' }}>{item.unit}</td>
                    <td style={{ padding: '8px', textAlign: 'right', borderBottom: '1px solid #e5e7eb' }}>{formatCurrency(item.unit_price)}</td>
                    <td style={{ padding: '8px', textAlign: 'right', borderBottom: '1px solid #e5e7eb', fontWeight: '600' }}>{formatCurrency(item.line_total)}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Totals */}
            <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '20px' }}>
              <tbody>
                <tr>
                  <td style={{ width: '55%' }} />
                  <td style={{ width: '45%' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                      <tbody>
                        <tr>
                          <td style={{ padding: '4px 8px', color: '#6b7280', fontSize: '12px' }}>Subtotal</td>
                          <td style={{ padding: '4px 8px', textAlign: 'right', fontSize: '12px' }}>{formatCurrency(invoice.subtotal)}</td>
                        </tr>
                        {invoice.discount > 0 && (
                          <tr>
                            <td style={{ padding: '4px 8px', color: '#6b7280', fontSize: '12px' }}>Discount</td>
                            <td style={{ padding: '4px 8px', textAlign: 'right', fontSize: '12px', color: '#dc2626' }}>−{formatCurrency(invoice.discount)}</td>
                          </tr>
                        )}
                        <tr style={{ borderTop: '2px solid #000' }}>
                          <td style={{ padding: '8px 8px 4px', fontWeight: 'bold', fontSize: '14px' }}>TOTAL</td>
                          <td style={{ padding: '8px 8px 4px', textAlign: 'right', fontWeight: 'bold', fontSize: '14px' }}>{formatCurrency(invoice.total)}</td>
                        </tr>
                      </tbody>
                    </table>
                  </td>
                </tr>
              </tbody>
            </table>

            {/* Notes */}
            {invoice.notes && (
              <div style={{ background: '#fffbeb', border: '1px solid #fde68a', borderRadius: '6px', padding: '10px 14px', marginBottom: '16px' }}>
                <div style={{ fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.05em', color: '#92400e', marginBottom: '4px' }}>Notes / Terms</div>
                <div style={{ fontSize: '12px', color: '#374151', whiteSpace: 'pre-wrap' }}>{invoice.notes}</div>
              </div>
            )}

            {/* Footer */}
            <div style={{ borderTop: '1px solid #e5e7eb', paddingTop: '12px', textAlign: 'center', fontSize: '11px', color: '#6b7280' }}>
              <div>Thank you for your business!</div>
              <div>K.K. Danny Enterprise · Adeiso, Eastern Region, Ghana · Tel: 02444754803</div>
              {createdByName && <div style={{ marginTop: '4px' }}>Prepared by: {createdByName}</div>}
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-2 px-5 py-4" style={{ borderTop: '1px solid #1e2e3c' }}>
          <button onClick={() => openPrintWindow('a4')} className="btn-gold flex-1 flex items-center justify-center gap-2 py-2.5 text-sm">
            <Printer size={15} /> Print A4
          </button>
          <button
            onClick={() => openPrintWindow('thermal')}
            className="flex-1 flex items-center justify-center gap-2 py-2.5 text-sm rounded font-semibold transition-colors hover:text-white"
            style={{ background: '#1e2a35', border: '1px solid #374d5e', color: '#94a3b8' }}
          >
            <Printer size={15} /> Thermal
          </button>
          <button
            onClick={() => openPrintWindow('a4')}
            className="flex-1 flex items-center justify-center gap-2 py-2.5 text-sm rounded font-semibold transition-colors"
            style={{ background: '#1e3a2e', border: '1px solid #2d6a4f', color: '#4ade80' }}
          >
            <FileDown size={15} /> Save PDF
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2.5 text-sm rounded font-semibold text-gray-300 hover:text-white transition-colors"
            style={{ background: '#1e2a35', border: '1px solid #374d5e' }}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  )
}
