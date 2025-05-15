import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Link, Routes } from 'react-router-dom';
import CustomerForm from './components/CustomerForm';
import ProductForm from './components/ProductForm';
import InvoiceForm from './components/InvoiceForm';
import InvoicesList from './components/InvoicesList';  // Dodajemo ovaj import
import { getData, setData } from './utils/storage';

function App() {
  const [customers, setCustomers] = useState(getData('customers') || []);
  const [products, setProducts] = useState(getData('products') || []);
  const [invoices, setInvoices] = useState(getData('invoices') || []);

  return (
    <Router>
      <div className="container-fluid">
        <div className="row">
          {/* Leva strana sa menijem */}
          <div className="col-md-3 p-3 bg-light">
            <h4>Menadžment prodaje</h4>
            <ul className="list-group">
              <li className="list-group-item">
                <Link to="/dodaj-kupca">Dodaj Kupca</Link>
              </li>
              <li className="list-group-item">
                <Link to="/dodaj-artikal">Dodaj Artikal</Link>
              </li>
              <li className="list-group-item">
                <Link to="/prodaj-artikal">Prodaj Artikal</Link>
              </li>
              <li className="list-group-item">
                <Link to="/pregled-predracuna">Pregled Predračuna</Link>  {/* Dodajemo link za pregled */}
              </li>
            </ul>
          </div>

          {/* Desna strana za prikaz sadržaja */}
          <div className="col-md-9 p-3">
            <Routes>
              <Route path="/dodaj-kupca" element={<CustomerForm customers={customers} setCustomers={setCustomers} />} />
              <Route path="/dodaj-artikal" element={<ProductForm products={products} setProducts={setProducts} />} />
              <Route path="/prodaj-artikal" element={<InvoiceForm customers={customers} products={products} setProducts={setProducts} invoices={invoices}  setInvoices={setInvoices} /> } />

			<Route path="/pregled-predracuna" element={<InvoicesList invoices={invoices} customers={customers} setInvoices={setInvoices} />}
/>
            </Routes>
          </div>
        </div>
      </div>
    </Router>
  );
}

export default App;
