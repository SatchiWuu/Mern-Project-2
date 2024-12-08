
import './App.css'
import { Routes, Route } from 'react-router-dom'
import AdminLayout from './admin/components/AdminLayout'
import Product from './admin/pages/Product'
import { Toaster } from 'react-hot-toast';
import ClientLayout from './client/components/ClientLayout'
import Welcome from './client/pages/Welcome'
import axios from 'axios'
import Cart from './client/pages/Cart'
import Profile from './client/pages/Profile'

import OneProduct from './admin/pages/OneProduct'
import Login from './client/components/Login';
import Checkout from './client/components/Checkout/Checkout';
import Register from './client/pages/Register';
import Charts from './client/pages/Charts';

import { AuthProvider } from './auth/AuthContext';

function App() {
  axios.defaults.withCredentials = true;

  return (
    <AuthProvider>
      <Toaster />
      <Routes>
        <Route path="/admin" element={<AdminLayout />}>
          <Route path="/admin/crud/product" element={<Product />} />
          <Route path="/admin/chart" element={<Charts />} />
        </Route>

        <Route element={<ClientLayout />}>
          <Route path="/" element={<Welcome />} />
          <Route path="/product/:id" element={<OneProduct />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/checkout" element={<Checkout />} />
        </Route>

      </Routes>
    </AuthProvider>
  )
}

export default App
