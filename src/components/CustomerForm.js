import React, { useState } from "react";
import { setData } from "../utils/storage";

const CustomerForm = ({ customers, setCustomers }) => {
  const [form, setForm] = useState({
    id: null,
    name: "",
    address: "",
    phone: "",
    email: "",
    note: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!form.name.trim()) return;

    if (form.id) {
      // Izmena postojećeg kupca
      const updated = customers.map((c) =>
        c.id === form.id ? { ...form } : c
      );
      setCustomers(updated);
      setData("customers", updated);
    } else {
      // Novi kupac
      const newCustomer = { ...form, id: Date.now() };
      const updated = [...customers, newCustomer];
      setCustomers(updated);
      setData("customers", updated);
    }

    setForm({
      id: null,
      name: "",
      address: "",
      phone: "",
      email: "",
      note: "",
    });
  };

  const handleEdit = (customer) => {
    setForm(customer);
  };

  const handleDelete = (id) => {
    const updated = customers.filter((c) => c.id !== id);
    setCustomers(updated);
    setData("customers", updated);
  };

  return (
    <div>
      <h2>{form.id ? "Izmeni kupca" : "Dodaj kupca"}</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group mb-2">
          <input
            className="form-control"
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Ime kupca"
            required
          />
        </div>
        <div className="form-group mb-2">
          <input
            className="form-control"
            name="address"
            value={form.address}
            onChange={handleChange}
            placeholder="Adresa"
          />
        </div>
        <div className="form-group mb-2">
          <input
            className="form-control"
            name="phone"
            value={form.phone}
            onChange={handleChange}
            placeholder="Telefon"
          />
        </div>
        <div className="form-group mb-2">
          <input
            type="email"
            className="form-control"
            name="email"
            value={form.email}
            onChange={handleChange}
            placeholder="Email"
          />
        </div>
        <div className="form-group mb-2">
          <textarea
            className="form-control"
            name="note"
            value={form.note}
            onChange={handleChange}
            placeholder="Napomena"
          />
        </div>
        <button type="submit" className="btn btn-success">
          {form.id ? "Sačuvaj izmene" : "Dodaj kupca"}
        </button>
        {form.id && (
          <button
            type="button"
            className="btn btn-secondary ms-2"
            onClick={() =>
              setForm({
                id: null,
                name: "",
                address: "",
                phone: "",
                email: "",
                note: "",
              })
            }
          >
            Otkaži
          </button>
        )}
      </form>

      <hr />

      <h4>Lista kupaca</h4>
      {customers.length === 0 ? (
        <p>Nema unetih kupaca.</p>
      ) : (
        <div className="table-responsive">
          <table className="table table-striped">
            <thead>
              <tr>
                <th>Ime</th>
                <th>Adresa</th>
                <th>Telefon</th>
                <th>Email</th>
                <th>Napomena</th>
                <th>Akcije</th>
              </tr>
            </thead>
            <tbody>
              {customers.map((c) => (
                <tr key={c.id}>
                  <td>{c.name}</td>
                  <td>{c.address}</td>
                  <td>{c.phone}</td>
                  <td>{c.email}</td>
                  <td>{c.note}</td>
                  <td>
                    <button
                      className="btn btn-sm btn-warning me-2"
                      onClick={() => handleEdit(c)}
                    >
                      Izmeni
                    </button>
                    <button
                      className="btn btn-sm btn-danger"
                      onClick={() => handleDelete(c.id)}
                    >
                      Obriši
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default CustomerForm;
