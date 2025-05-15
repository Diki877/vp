const InvoiceList = ({ invoices, setInvoices }) => {
  const togglePaid = (id) => {
    const updated = invoices.map(inv =>
      inv.id === id ? { ...inv, paid: !inv.paid } : inv
    );
    setInvoices(updated);
  };

  return (
    <div>
      <h2>Predračuni</h2>
      {invoices.map(inv => (
        <div key={inv.id} style={{ border: "1px solid #ccc", padding: 10, margin: 10 }}>
          <strong>{inv.customerName}</strong> - {inv.date} - 
          <span style={{ color: inv.paid ? "green" : "red" }}>
            {inv.paid ? " PLAĆENO" : " NIJE PLAĆENO"}
          </span>
          <ul>
            {inv.items.map((item, i) => (
              <li key={i}>{item.name} x {item.quantity} = {(item.quantity * item.price).toFixed(2)} €</li>
            ))}
          </ul>
          <p><strong>Ukupno: {inv.total.toFixed(2)} €</strong></p>
          <button onClick={() => togglePaid(inv.id)}>
            Obeleži kao {inv.paid ? "neplaćeno" : "plaćeno"}
          </button>
        </div>
      ))}
    </div>
  );
};

export default InvoiceList;
