import React, { useState } from "react";
import { setData } from "../utils/storage";

const ProductForm = ({ products, setProducts }) => {
  const [form, setForm] = useState({
    id: null,
    name: "",
    type: "",
    size: "",
    color: "",
    description: "",
    price: "",
    pack: "",
    stock: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!form.name.trim() || !form.price) return;

    if (form.id) {
      // Izmena
      const updated = products.map((p) =>
        p.id === form.id ? { ...form } : p
      );
      setProducts(updated);
      setData("products", updated);
    } else {
      // Novi
      const newProduct = { ...form, id: Date.now() };
      const updated = [...products, newProduct];
      setProducts(updated);
      setData("products", updated);
    }

    setForm({
      id: null,
      name: "",
      type: "",
      size: "",
      color: "",
      description: "",
      price: "",
      pack: "",
      stock: "",
    });
  };

  const handleEdit = (product) => {
    setForm(product);
  };

  const handleDelete = (id) => {
    const updated = products.filter((p) => p.id !== id);
    setProducts(updated);
    setData("products", updated);
  };

  return (
    <div>
      <h2>{form.id ? "Izmeni artikal" : "Dodaj artikal"}</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group mb-2">
          <input
            className="form-control"
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Naziv artikla"
            required
          />
        </div>
        <div className="form-group mb-2">
          <input
            className="form-control"
            name="type"
            value={form.type}
            onChange={handleChange}
            placeholder="Vrsta (npr. muške, ženske...)"
          />
        </div>
        <div className="form-group mb-2">
          <input
            className="form-control"
            name="size"
            value={form.size}
            onChange={handleChange}
            placeholder="Veličina (npr. 39–42)"
          />
        </div>
        <div className="form-group mb-2">
          <input
            className="form-control"
            name="color"
            value={form.color}
            onChange={handleChange}
            placeholder="Boja"
          />
        </div>
        <div className="form-group mb-2">
          <textarea
            className="form-control"
            name="description"
            value={form.description}
            onChange={handleChange}
            placeholder="Opis artikla"
          />
        </div>
        <div className="form-group mb-2">
          <input
            type="number"
            className="form-control"
            name="price"
            value={form.price}
            onChange={handleChange}
            placeholder="Cena po komadu"
            required
          />
        </div>
        <div className="form-group mb-2">
          <input
            type="number"
            className="form-control"
            name="pack"
            value={form.pack}
            onChange={handleChange}
            placeholder="Broj pari u pakovanju"
          />
        </div>
        <div className="form-group mb-2">
          <input
            type="number"
            className="form-control"
            name="stock"
            value={form.stock}
            onChange={handleChange}
            placeholder="Zaliha na stanju"
          />
        </div>
        <button type="submit" className="btn btn-success">
          {form.id ? "Sačuvaj izmene" : "Dodaj artikal"}
        </button>
        {form.id && (
          <button
            type="button"
            className="btn btn-secondary ms-2"
            onClick={() =>
              setForm({
                id: null,
                name: "",
                type: "",
                size: "",
                color: "",
                description: "",
                price: "",
                pack: "",
                stock: "",
              })
            }
          >
            Otkaži
          </button>
        )}
      </form>

      <hr />

      <h4>Lista artikala</h4>
      {products.length === 0 ? (
        <p>Nema unetih artikala.</p>
      ) : (
        <div className="table-responsive">
          <table className="table table-striped">
            <thead>
              <tr>
                <th>Naziv</th>
                <th>Vrsta</th>
                <th>Veličina</th>
                <th>Boja</th>
                <th>Cena</th>
                <th>Paket</th>
                <th>Zaliha</th>
                <th>Akcije</th>
              </tr>
            </thead>
            <tbody>
              {products.map((p) => (
                <tr key={p.id}>
                  <td>{p.name}</td>
                  <td>{p.type}</td>
                  <td>{p.size}</td>
                  <td>{p.color}</td>
                  <td>{p.price}</td>
                  <td>{p.pack}</td>
                  <td>{p.stock}</td>
                  <td>
                    <button
                      className="btn btn-sm btn-warning me-2"
                      onClick={() => handleEdit(p)}
                    >
                      Izmeni
                    </button>
                    <button
                      className="btn btn-sm btn-danger"
                      onClick={() => handleDelete(p.id)}
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

export default ProductForm;
