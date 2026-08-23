import React from 'react';
import Mylogo from '../assets/logo.png';

export default function InvoicePrintModal({ invoice, onClose }) {
  if (!invoice) return null;

  const totalPc = invoice.items?.reduce((sum, item) => sum + (parseInt(item.pc) || 0), 0) || 0;
  //const logoUrl = `${import.meta.env.BASE_URL}logo.png`;

  const handlePrint = () => {
    const htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Invoice - UNIQUE JEWELLER</title>
          <style>
            @page {
              size: A5 landscape;
              margin: 2mm;
            }
            
            html, body {
              background-color: #ffffff !important;
              color: #000000 !important;
              font-family: Arial, sans-serif !important;
              margin: 0 !important;
              padding: 0 !important;
              width: 100% !important;
              height: 100% !important;
              -webkit-print-color-adjust: exact !important;
              print-color-adjust: exact !important;
            }

            * {
              box-sizing: border-box;
            }

            .invoice-box {
              border: 1.5px solid #000000 !important;
              padding: 10px;
              width: 100% !important;
              height: 98vh;
              display: flex;
              flex-direction: column;
              justify-content: space-between;
              background-color: #ffffff !important;
            }

            .flex-between {
              display: flex;
              justify-content: space-between;
              align-items: flex-start;
            }

            .header {
              border-bottom: 1.5px solid #000000;
              padding-bottom: 6px;
              margin-bottom: 8px;
            }

            .shop-title {
              font-size: 24px;
              font-weight: 900;
              letter-spacing: 0.5px;
            }

            .shop-sub {
              font-size: 11px;
              font-weight: bold;
              margin-top: 2px;
            }

            .logo-u {
              weight: 75;
              max-height: 75px;
              object-fit: contain;
              margin-top: 15px;

            }

            .date-bar {
              background-color: #000000 !important;
              color: #ffffff !important;
              padding: 5px 10px;
              font-size: 12px;
              font-weight: bold;
              display: flex;
              justify-content: space-between;
              margin-bottom: 10px;
            }

            .date-bar * {
              color: #ffffff !important;
            }

            /* Table Container taking all available space */
            .content-wrapper {
              display: flex;
              flex-direction: column;
              flex-grow: 1;
              justify-content: space-between;
            }

            table {
              width: 100%;
              border-collapse: collapse;
            }

            th, td {
              border: 1px solid #000000 !important;
              padding: 6px 8px;
              font-size: 12px;
              text-align: center;
              background-color: #ffffff !important;
              color: #000000 !important;
            }

            th {
              background-color: #f0f0f0 !important;
              font-weight: bold;
            }

            .text-left { text-align: left; }
            .text-right { text-align: right; }

            .spacer-row td {
              border: none !important;
              border-left: 1px solid #000000 !important;
              border-right: 1px solid #000000 !important;
            }

            .footer-grid {
              display: flex;
              border: 1px solid #000000 !important;
              padding: 8px;
              gap: 10px;
              font-size: 10px;
              margin-top: 10px;
            }

            .terms { flex: 2; }
            .terms-title { font-weight: bold; text-decoration: underline; margin-bottom: 4px; }

            .sign-box {
              flex: 1;
              border-left: 1px solid #000000 !important;
              padding-left: 10px;
              display: flex;
              flex-direction: column;
              justify-content: space-between;
              text-align: center;
              min-height: 60px;
            }
          </style>
        </head>
        <body>
          <div class="invoice-box">
            <div>
              <div class="flex-between header">
                <div>
                  <div class="shop-title">UNIQUE JEWELLER</div>
                  <div class="shop-sub">Noor Palace, Amir Nishan, Aligarh-202001</div>
                  <div class="shop-sub">DEALS IN: DIAMOND, GOLD, SILVER &nbsp;&nbsp;&nbsp;&nbsp; Phone No - +91 9412545883</div>
                </div>
                <div><img src="${window.location.origin}${import.meta.env.BASE_URL}/logo.png" class="logo-u" alt="logo"/></div>
              </div>

              <div class="date-bar">
                <div>Customer: <span style="text-transform: uppercase;">${invoice.customerName || 'N/A'}</span></div>
                <div>Date : <span>${invoice.invoiceDate || 'N/A'}</span></div>
              </div>
            </div>

            <div class="content-wrapper">
              <table style="height: 100%;">
                <thead>
                  <tr>
                    <th style="width: 40px;">NO</th>
                    <th class="text-left">Particular</th>
                    <th style="width: 60px;">PC</th>
                    <th style="width: 90px;">Amount</th>
                    <th style="width: 90px;">Weight</th>
                    <th class="text-right" style="width: 100px;">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  ${
                    invoice.items && invoice.items.length > 0
                      ? invoice.items.map((item, index) => `
                          <tr>
                            <td><b>${index + 1}</b></td>
                            <td class="text-left"><b>${item.particular || '-'}</b></td>
                            <td>${item.pc || 1}</td>
                            <td>${item.amount || '-'}</td>
                            <td>${item.weight || '-'}</td>
                            <td class="text-right"><b>&#8377;${item.amount || '0.00'}</b></td>
                          </tr>
                        `).join('')
                      : `<tr><td colspan="6">No items added</td></tr>`
                  }
                  
                  <tr class="spacer-row" style="height: 100%;">
                    <td></td><td></td><td></td><td></td><td></td><td></td>
                  </tr>
                  <tr style="font-weight: bold; background-color: #f9f9f9;">
                    <td colSpan="2" class="text-right">Total:</td>
                    <td>${totalPc}</td>
                    <td></td>
                    <td></td>
                    <td class="text-right">&#8377;${Number(invoice.grandTotal || 0).toFixed(2)}</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div class="footer-grid">
              <div class="terms">
                <div class="terms-title">Terms & Conditions :-</div>
                <div>1. AT TIME OF RETURNING MEENA-KUNDAN & STONE WILL BE DEDUCTED.</div>
                <div>2. MUST BRING THE RECEIPT AT TIME OF RETURN OF ALL SUBJECTS. / Broken Jewellery Will Not Be Replaced.</div>
                <div>3. 92.5% RETURN ON WEIGHT 92.5 SILVER JEWELLERY. / Exchanged for any type of jewellery within three days.</div>
              </div>
              <div class="sign-box">
                <div><b>For UNIQUE JEWELLER</b></div>
                <div style="margin-top: 25px;"><b>Authorised Signatory</b></div>
              </div>
            </div>
          </div>

          <script>
            window.onload = function() {
              window.print();
              setTimeout(function() { window.close(); }, 500);
            };
          </script>
        </body>
      </html>
    `;

    const blob = new Blob([htmlContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const printWin = window.open(url, '_blank');

    if (!printWin) {
      alert("Please allow popups in your browser to print the invoice.");
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full p-4 text-black">
        <div className="flex justify-between items-center border-b pb-2 mb-4">
          <h3 className="font-bold text-gray-800 text-lg">Invoice Preview (Landscape)</h3>
          <div className="flex gap-2">
            <button
              onClick={handlePrint}
              className="bg-green-600 hover:bg-green-700 text-white font-bold px-4 py-1.5 rounded text-sm shadow"
            >
              🖨️ Print Now
            </button>
            <button
              onClick={onClose}
              className="bg-gray-400 hover:bg-gray-500 text-white font-bold px-3 py-1.5 rounded text-sm"
            >
              ✕ Close
            </button>
          </div>
        </div>

        {/* Modal On-Screen Preview matching exact layout */}
        <div className="p-3 border rounded bg-gray-100 overflow-x-auto">
          <div className="bg-white border border-black p-3 rounded w-full min-h-[420px] flex flex-col justify-between text-black">
            <div>
              <div className="flex justify-between items-start border-b border-black pb-2 mb-2">
                <div>
                  <h1 className="text-xl font-black uppercase">UNIQUE JEWELLER</h1>
                  <p className="text-[11px] font-bold">Noor Palace, Amir Nishan, Aligarh-202001</p>
                  <p className="text-[10px] font-bold mt-0.5">
                    DEALS IN: DIAMOND, GOLD, SILVER &nbsp;&nbsp;&nbsp;&nbsp; Phone No - +91 9412545883
                  </p>
                </div>
                <div className="text-right pr-2">
                  <img src={Mylogo} className="text-4xl font-black font-serif"/>
                </div>
              </div>

              <div className="flex justify-between items-center bg-black text-white px-2 py-1 text-xs font-bold mb-2">
                <div>Customer: <span className="uppercase">{invoice.customerName || 'N/A'}</span></div>
                <div>Date : <span>{invoice.invoiceDate || 'N/A'}</span></div>
              </div>
            </div>

            {/* Table with flex growth so Total stays at bottom */}
            <div className="flex-1 flex flex-col justify-between my-2">
              <table className="w-full border-collapse border border-black text-xs">
                <thead>
                  <tr className="bg-gray-100 border-b border-black text-center font-bold">
                    <th className="border border-black p-1 w-10">NO</th>
                    <th className="border border-black p-1 text-left">Particular</th>
                    <th className="border border-black p-1 w-16">PC</th>
                    <th className="border border-black p-1 w-24">Amount</th>
                    <th className="border border-black p-1 w-24">Weight</th>
                    <th className="border border-black p-1 w-28 text-right">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {invoice.items && invoice.items.map((item, index) => (
                    <tr key={index} className="border-b border-black text-center">
                      <td className="border border-black p-1 font-bold">{index + 1}</td>
                      <td className="border border-black p-1 text-left font-semibold">{item.particular || '-'}</td>
                      <td className="border border-black p-1">{item.pc || 1}</td>
                      <td className="border border-black p-1">{item.amount || '-'}</td>
                      <td className="border border-black p-1">{item.weight || '-'}</td>
                      <td className="border border-black p-1 text-right font-bold">₹{item.amount || '0.00'}</td>
                    </tr>
                  ))}
                  <tr className="font-bold bg-gray-50 border-t border-black">
                    <td colSpan="2" className="border border-black p-1 text-right">Total:</td>
                    <td className="border border-black p-1 text-center">{totalPc}</td>
                    <td className="border border-black p-1"></td>
                    <td className="border border-black p-1"></td>
                    <td className="border border-black p-1 text-right text-sm">
                      ₹{Number(invoice.grandTotal || 0).toFixed(2)}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="grid grid-cols-3 gap-2 border border-black p-2 text-[10px]">
              <div className="col-span-2 space-y-0.5">
                <p className="font-bold text-xs underline mb-1">Terms & Conditions :-</p>
                <p>1. AT TIME OF RETURNING MEENA-KUNDAN & STONE WILL BE DEDUCTED.</p>
                <p>2. MUST BRING THE RECEIPT AT TIME OF RETURN OF ALL SUBJECTS. / Broken Jewellery Will Not Be Replaced.</p>
                <p>3. 92.5% RETURN ON WEIGHT 92.5 SILVER JEWELLERY. / Exchanged for any type of jewellery within three days.</p>
              </div>
              <div className="col-span-1 border-l border-black pl-2 flex flex-col justify-between text-center min-h-[50px]">
                <p className="font-bold text-xs">For UNIQUE JEWELLER</p>
                <p className="font-bold text-xs pt-4">Authorised Signatory</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

