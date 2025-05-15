import React, { useState } from 'react';
import { jsPDF } from "jspdf";

function InvoicesList({ invoices, customers, setInvoices }) {
  const [selectedCustomerId, setSelectedCustomerId] = useState("");

  const filteredInvoices = selectedCustomerId
    ? invoices.filter((invoice) => invoice.customerId === parseInt(selectedCustomerId))
    : invoices;

  const handleDelete = (invoiceId) => {
    const updated = invoices.filter(invoice => invoice.id !== invoiceId);
    setInvoices(updated);
    localStorage.setItem("invoices", JSON.stringify(updated));
  };

  const togglePaidStatus = (invoiceId) => {
    const updatedInvoices = invoices.map(inv => {
      if (inv.id === invoiceId) {
        return { ...inv, paid: !inv.paid };
      }
      return inv;
    });
    setInvoices(updatedInvoices);
    localStorage.setItem("invoices", JSON.stringify(updatedInvoices));
  };

  const handleDownloadPDF = (invoice) => {
    const doc = new jsPDF();
    doc.text(`Predračun za kupca: ${getCustomerName(invoice.customerId)}`, 10, 10);
    doc.text(`Predračun broj: ${invoice.id}`, 10, 20);
    invoice.items.forEach((item, idx) => {
      doc.text(`${item.product?.name || 'Nepoznat proizvod'} x ${item.quantity} - ${item.total} €`, 10, 30 + idx * 10);
    });
    doc.text(`Ukupno: ${invoice.total} € `, 10, 30 + invoice.items.length * 10);
    doc.save(`predracun_${invoice.id}.pdf`);
  };

  const handlePrint = (invoice) => {
    const printContent = `
      <div style="font-family: Arial, sans-serif; margin: 20px; padding: 10px; width: 100%; max-width: 800px; margin-left: auto; margin-right: auto;">
        <div style="text-align: center;">
          <h2>Predračun</h2>
          <h4>BUKRES D.O.O</h4>
          <p>Adresa: Pante Gajica</p>
          <p>Telefon: 069000000 | Email: info@firma.com</p>
        </div>

        <div style="margin-top: 30px; padding: 20px; border: 1px solid #ccc;">
          <h3>Podaci o kupcu</h3>
          <p><strong>Ime Kupca:</strong> ${getCustomerName(invoice.customerId)}</p>
          <p><strong>Adresa:</strong> [Adresa kupca]</p>
          <p><strong>Email:</strong> [Email kupca]</p>
          <p><strong>Telefon:</strong> [Telefon kupca]</p>
        </div>

        <div style="margin-top: 30px; padding: 20px; border: 1px solid #ccc;">
          <h3>Detalji Predračuna</h3>
          <table style="width: 100%; border-collapse: collapse;">
            <thead>
              <tr>
                <th style="border: 1px solid #ccc; padding: 8px; text-align: left;">Proizvod</th>
                <th style="border: 1px solid #ccc; padding: 8px; text-align: left;">Količina</th>
                <th style="border: 1px solid #ccc; padding: 8px; text-align: left;">Cena</th>
                <th style="border: 1px solid #ccc; padding: 8px; text-align: left;">Ukupno</th>
              </tr>
            </thead>
            <tbody>
              ${invoice.items.map(item => `
                <tr>
                  <td style="border: 1px solid #ccc; padding: 8px;">${item.product?.name || 'Nepoznat proizvod'}</td>
                  <td style="border: 1px solid #ccc; padding: 8px;">${item.quantity}</td>
                  <td style="border: 1px solid #ccc; padding: 8px;">${item.product?.price || '0'} €</td>
                  <td style="border: 1px solid #ccc; padding: 8px;">${item.total} €</td>
                </tr>
              `).join('')}
            </tbody>
          </table>

          <div style="margin-top: 20px; padding-top: 10px;">
            <h4 style="text-align: right; margin-top: 20px;">Ukupno: ${invoice.total} €</h4>
            <p style="text-align: right;">Status: ${invoice.paid ? "Plaćeno" : "Nije plaćeno"}</p>
          </div>
        </div>

        <div style="text-align: center; margin-top: 30px;">
                    <p>Hvala na poverenju!</p>
        </div>
      </div>
    `;

    const newWindow = window.open();
    newWindow.document.write(printContent);
    newWindow.document.close();
    newWindow.print();
  };

  const getCustomerName = (id) => {
    if (id === undefined || id === null) return 'Nepoznat kupac';
    const customer = customers.find(c => c.id === id);
    return customer ? customer.name : 'Nepoznat kupac';
  };

  return (
    <div>
      <h3>Sačuvani Predračuni</h3>

      <div className="mb-3">
        <label className="form-label">Izaberi kupca</label>
        <select
          className="form-select"
          value={selectedCustomerId}
          onChange={(e) => setSelectedCustomerId(e.target.value)}
        >
          <option value="">-- Svi kupci --</option>
          {customers.map((customer) => (
            <option key={customer.id} value={customer.id}>
              {customer.name}
            </option>
          ))}
        </select>
      </div>

      {filteredInvoices.length === 0 ? (
        <p>Nema sačuvanih predracuna za ovog kupca.</p>
      ) : (
        filteredInvoices.map((invoice) => (
          <div key={invoice.id} className="card mb-3">
            <div className="card-header d-flex justify-content-between align-items-center">
              <span>Predračun #{invoice.id} — {getCustomerName(invoice.customerId)}</span>
              <button className="btn btn-danger btn-sm" onClick={() => handleDelete(invoice.id)}>Obriši</button>
            </div>
            <div className="card-body">
              <ul className="list-group">
                {invoice.items && invoice.items.map((item, idx) => (
                  <li key={idx} className="list-group-item d-flex justify-content-between">
                    <span>{item.product?.name || 'Nepoznat proizvod'} × {item.quantity}</span>
                    <span>{item.total} €</span>
                  </li>
                ))}
              </ul>

              <div className="mt-2 fw-bold">
                Ukupno: {invoice.total} €
              </div>

              <div className="form-check mt-3">
                <input
                  className="form-check-input"
                  type="checkbox"
                  id={`paidCheckbox${invoice.id}`}
                  checked={invoice.paid || false}
                  onChange={() => togglePaidStatus(invoice.id)}
                />
                <label className="form-check-label" htmlFor={`paidCheckbox${invoice.id}`}>
                  Plaćeno
                </label>
              </div>

              <div
                style={{
                  marginTop: "5px",
                  fontWeight: "bold",
                  color: invoice.paid ? "green" : "red",
                }}
              >
                {invoice.paid ? "Plaćeno" : "Nije plaćeno"}
              </div>

              <button className="btn btn-success mt-2" onClick={() => handleDownloadPDF(invoice)}>
                Preuzmi PDF
              </button>

              <button className="btn btn-info mt-2 ms-2" onClick={() => handlePrint(invoice)}>
                Štampaj
              </button>
            </div>
          </div>
        ))
      )}
    </div>
  );
}

export default InvoicesList;
