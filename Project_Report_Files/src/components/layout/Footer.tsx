import { Link } from 'react-router-dom';
import { Hospital, Mail, Phone, MapPin } from 'lucide-react';

const SOCIAL_LINKS = [
  {
    label: 'Facebook',
    icon: (
      <svg className="w-4 h-4 fill-current text-blue-200" viewBox="0 0 24 24">
        <path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z"/>
      </svg>
    ),
  },
  {
    label: 'Twitter',
    icon: (
      <svg className="w-4 h-4 fill-current text-blue-200" viewBox="0 0 24 24">
        <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/>
      </svg>
    ),
  },
  {
    label: 'LinkedIn',
    icon: (
      <svg className="w-4 h-4 fill-current text-blue-200" viewBox="0 0 24 24">
        <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.779-1.75-1.75s.784-1.75 1.75-1.75 1.75.779 1.75 1.75-.784 1.75-1.75 1.75zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
      </svg>
    ),
  },
  {
    label: 'Instagram',
    icon: (
      <svg className="w-4 h-4 fill-current text-blue-200" viewBox="0 0 24 24">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
      </svg>
    ),
  },
];

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-gradient-hero text-white">
      <div className="container-xl py-16 px-6 lg:px-0 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
        {/* Brand */}
        <div className="lg:col-span-1">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
              <Hospital size={20} className="text-white" />
            </div>
            <span className="font-display text-xl font-bold">
              Medi<span className="text-blue-300">Queue</span>
            </span>
          </div>
          <p className="text-blue-200 text-sm leading-relaxed mb-6">
            Premium smart medical appointment and queue management system for modern healthcare providers.
          </p>
          <div className="flex gap-3">
            {SOCIAL_LINKS.map((link, i) => (
              <a
                key={i}
                href="#"
                className="w-9 h-9 rounded-xl bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
                aria-label={link.label}
              >
                {link.icon}
              </a>
            ))}
          </div>
        </div>

        {/* Quick links */}
        <div>
          <h3 className="font-display font-semibold text-white mb-4 text-sm uppercase tracking-wider">
            Quick Links
          </h3>
          <ul className="space-y-2.5">
            {['Home', 'About Us', 'Services', 'Departments', 'Doctors', 'Blog'].map(l => (
              <li key={l}>
                <Link to="#" className="text-blue-200 hover:text-white text-sm transition-colors flex items-center gap-1.5">
                  <span className="w-1 h-1 bg-blue-400 rounded-full" />
                  {l}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Services */}
        <div>
          <h3 className="font-display font-semibold text-white mb-4 text-sm uppercase tracking-wider">
            Services
          </h3>
          <ul className="space-y-2.5">
            {['Online Appointments', 'Queue Management', 'Medical Records', 'Billing & Payments', 'Patient Portal', 'Telemedicine'].map(s => (
              <li key={s}>
                <Link to="#" className="text-blue-200 hover:text-white text-sm transition-colors flex items-center gap-1.5">
                  <span className="w-1 h-1 bg-blue-400 rounded-full" />
                  {s}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h3 className="font-display font-semibold text-white mb-4 text-sm uppercase tracking-wider">
            Contact
          </h3>
          <ul className="space-y-4">
            {[
              { icon: MapPin, text: '123 Medical Center Dr, Suite 100\nNew York, NY 10001' },
              { icon: Phone, text: '+1 (555) 000-0000' },
              { icon: Mail,  text: 'contact@mediqueue.com' },
            ].map(({ icon: Icon, text }, i) => (
              <li key={i} className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center shrink-0 mt-0.5">
                  <Icon size={15} className="text-blue-300" />
                </div>
                <p className="text-blue-200 text-sm whitespace-pre-line">{text}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/10">
        <div className="container-xl px-6 lg:px-0 py-5 flex flex-col md:flex-row items-center justify-between gap-3 text-sm text-blue-300">
          <p>© {year} MediQueue. All rights reserved.</p>
          <div className="flex gap-6">
            {['Privacy Policy', 'Terms of Service', 'Cookie Policy'].map(l => (
              <Link key={l} to="#" className="hover:text-white transition-colors">{l}</Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
