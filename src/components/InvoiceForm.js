import React, { useState, useEffect } from "react";

const InvoiceForm = ({ customers, products, invoices, setInvoices }) => {
  const [selectedCustomerId, setSelectedCustomerId] = useState("");
  const [selectedProductId, setSelectedProductId] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [items, setItems] = useState([]);
  const [paid, setPaid] = useState(false);

  // Računanje ukupne sume
  const total = items.reduce((sum, item) => sum + item.total, 0);

  // Dodaj stavku u listu
  const handleAddItem = () => {
    if (!selectedProductId) {
      alert("Izaberite proizvod");
      return;
    }
    if (quantity <= 0) {
      alert("Količina mora biti veća od 0");
      return;
    }
    const product = products.find(p => p.id === parseInt(selectedProductId));
    if (!product) {
      alert("Proizvod nije pronađen");
      return;
    }

    // Provera da li već postoji taj proizvod u stavkama
    const existingIndex = items.findIndex(item => item.product.id === product.id);
    if (existingIndex >= 0) {
      // Ako postoji, samo povećaj količinu i ukupno
      const updatedItems = [...items];
      updatedItems[existingIndex].quantity += quantity;
      updatedItems[existingIndex].total = updatedItems[existingIndex].quantity * product.price;
      setItems(updatedItems);
    } else {
      // Dodaj novu stavku
      setItems([
        ...items,
        {
          product,
          quantity,
          total: product.price * quantity
        }
      ]);
    }
    // Resetuj izbor proizvoda i količine
    setSelectedProductId("");
    setQuantity(1);
  };

  // Brisanje stavke
  const handleRemoveItem = (index) => {
    const updatedItems = items.filter((_, i) => i !== index);
    setItems(updatedItems);
  };

  // Čuvanje predračuna
  const handleSave = () => {
    if (!selectedCustomerId) {
      alert("Izaberite kupca");
      return;
    }
    if (items.length === 0) {
      alert("Dodajte bar jedan artikal");
      return;
    }

    // Kreiraj novi predračun
    const newInvoice = {
      id: invoices.length > 0 ? Math.max(...invoices.map(i => i.id)) + 1 : 1,
      customerId: parseInt(selectedCustomerId),
      items,
      total,
      paid
    };

    const updatedInvoices = [...invoices, newInvoice];
    setInvoices(updatedInvoices);
    localStorage.setItem("invoices", JSON.stringify(updatedInvoices));

    // Reset forme
    setSelectedCustomerId("");
    setItems([]);
    setPaid(false);
  };

  // Štampanje predračuna
  const handlePrint = () => {
    if (items.length === 0 || !selectedCustomerId) {
      alert("Dodaj artikle i izaberi kupca za štampu.");
      return;
    }

    const customer = customers.find(c => c.id === parseInt(selectedCustomerId));

    const printContent = `
      <div style="font-family: Arial, sans-serif; margin: 20px; padding: 10px; max-width: 800px; margin-left: auto; margin-right: auto;">
        <div style="text-align: center;">
          <h2>Predračun</h2>
          <h4>Firma: Vaša Firma d.o.o.</h4>
          <p>Adresa: Ulica 123, Grad</p>
          <p>Telefon: 0123456789 | Email: info@firma.com</p>
        </div>

        <div style="margin-top: 30px; padding: 20px; border: 1px solid #ccc;">
          <h3>Podaci o kupcu</h3>
          <p><strong>Ime Kupca:</strong> ${customer ? customer.name : "Nepoznat kupac"}</p>
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
              ${items.map(item => `
                <tr>
                  <td style="border: 1px solid #ccc; padding: 8px;">${item.product.name}</td>
                  <td style="border: 1px solid #ccc; padding: 8px;">${item.quantity}</td>
                  <td style="border: 1px solid #ccc; padding: 8px;">${item.product.price} RSD</td>
                  <td style="border: 1px solid #ccc; padding: 8px;">${item.total} RSD</td>
                </tr>
              `).join('')}
            </tbody>
          </table>

          <div style="margin-top: 20px; padding-top: 10px;">
            <h4 style="text-align: right;">Ukupno: ${total} RSD</h4>
            <p style="text-align: right;">Status: ${paid ? "Plaćeno" : "Nije plaćeno"}</p>
          </div>
        </div>

        <div style="text-align: center; margin-top: 30px;">
          <p><strong>Napomena:</strong> [Ovde možete dodati napomene o predracunu]</p>
          <p>Hvala na poverenju!</p>
        </div>
      </div>
    `;

    const printWindow = window.open("", "", "width=800,height=600");
    printWindow.document.write(printContent);
    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
    printWindow.close();
  };

  return (
    <div className="container mt-4">
      <h3>Prodaj Artikal (Novi Predračun)</h3>

      <div className="mb-3">
        <label className="form-label">Izaberi kupca:</label>
        <select
          className="form-select"
          value={selectedCustomerId}
          onChange={(e) => setSelectedCustomerId(e.target.value)}
        >
          <option value="">-- Izaberite kupca --</option>
          {customers.map(c => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>
      </div>

      <div className="mb-3 row g-2 align-items-center">
        <div className="col-auto">
          <label className="form-label">Izaberi artikal:</label>
          <select
            className="form-select"
            value={selectedProductId}
            onChange={e => setSelectedProductId(e.target.value)}
          >
            <option value="">-- Izaberite proizvod --</option>
            {products.map(p => (
              <option key={p.id} value={p.id}>{p.name} - {p.price} RSD</option>
            ))}
          </select>
        </div>

        <div className="col-auto">
          <label className="form-label">Količina:</label>
          <input
            type="number"
            className="form-control"
            min="1"
            value={quantity}
            onChange={e => setQuantity(parseInt(e.target.value))}
          />
        </div>

        <div className="col-auto mt-4">
          <button className="btn btn-primary" onClick={handleAddItem}>Dodaj artikal</button>
        </div>
      </div>

      {items.length > 0 && (
        <table className="table table-bordered mt-3">
          <thead>
            <tr>
              <th>Proizvod</th>
              <th>Količina</th>
              <th>Cena</th>
              <th>Ukupno</th>
              <th>Akcija</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item, idx) => (
              <tr key={idx}>
                <td>{item.product.name}</td>
                <td>{item.quantity}</td>
                <td>{item.product.price} RSD</td>
                <td>{item.total} RSD</td>
                <td>
                  <button className="btn btn-danger btn-sm" onClick={() => handleRemoveItem(idx)}>
                    Obriši
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <div className="mt-3 fw-bold">Ukupno: {total} RSD</div>

      <div className="form-check mt-3">
        <input
          className="form-check-input"
          type="checkbox"
          checked={paid}
          id="paidCheck"
          onChange={e => setPaid(e.target.checked)}
        />
        <label className="form-check-label" htmlFor="paidCheck">
          Plaćeno
        </label>
      </div>

      <div className="mt-4">
        <button className="btn btn-success" onClick={handleSave}>
          Sačuvaj predračun
        </button>

        <button className="btn btn-outline-secondary ms-2" onClick={handlePrint}>
          Štampaj
        </button>
      </div>
    </div>
  );
};

export default InvoiceForm;
