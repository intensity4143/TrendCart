import React from 'react'
import { assets } from '../assets/frontend_assets/assets'
import { Link } from 'react-router-dom'

const Footer = () => {
  return (
    <footer style={{ backgroundColor: '#2C2825' }} className="mt-24 text-[#A89F95]">
      <div className="max-w-screen-xl mx-auto px-6 pt-16 pb-8">

        {/* Top grid */}
        <div className="grid grid-cols-1 sm:grid-cols-[2fr_1fr_1fr_1fr] gap-12 pb-12 border-b border-[#3D3530]">

          {/* Brand */}
          <div className="flex flex-col gap-4">
            <img src={assets.logo} className="w-32 brightness-0 invert opacity-90" alt="TrendCart" />
            <p className="text-sm leading-relaxed max-w-xs">
              Your go-to destination for trendy, affordable, and high-quality fashion — delivered right to your doorstep.
            </p>
            {/* Social icons */}
            <div className="flex gap-4 mt-2">
              {[
                { label: 'Instagram', path: 'M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z' },
                { label: 'Twitter', path: 'M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.737-8.835L1.254 2.25H8.08l4.253 5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z' },
                { label: 'Facebook', path: 'M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z' },
              ].map(({ label, path }) => (
                <a key={label} href="#" aria-label={label}
                  className="w-8 h-8 rounded-full border border-[#3D3530] flex items-center justify-center hover:border-[#A89F95] transition-colors">
                  <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                    <path d={path} />
                  </svg>
                </a>
              ))}
            </div>
          </div>

          {/* Company */}
          <div>
            <p className="text-xs font-semibold tracking-widest text-[#F8F7F4] uppercase mb-5">Company</p>
            <ul className="flex flex-col gap-3 text-sm">
              {[['/', 'Home'], ['/collection', 'Collection'], ['/about', 'About Us'], ['/contact', 'Contact']].map(([to, label]) => (
                <li key={label}>
                  <Link to={to} className="hover:text-[#F8F7F4] transition-colors">{label}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <p className="text-xs font-semibold tracking-widest text-[#F8F7F4] uppercase mb-5">Support</p>
            <ul className="flex flex-col gap-3 text-sm">
              {['FAQ', 'Shipping & Returns', 'Order Tracking', 'Privacy Policy'].map(label => (
                <li key={label}><a href="#" className="hover:text-[#F8F7F4] transition-colors">{label}</a></li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <p className="text-xs font-semibold tracking-widest text-[#F8F7F4] uppercase mb-5">Get in Touch</p>
            <ul className="flex flex-col gap-3 text-sm">
              <li>contact@trendcart.com</li>
              <li>+91-56161XXXXX</li>
              <li className="text-xs leading-relaxed pt-1">Mon – Fri, 9am – 6pm IST</li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-2 pt-6 text-xs">
          <p>© 2026 TrendCart. All rights reserved.</p>
          <div className="flex gap-5">
            <a href="#" className="hover:text-[#F8F7F4] transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-[#F8F7F4] transition-colors">Privacy Policy</a>
          </div>
        </div>

      </div>
    </footer>
  )
}

export default Footer
