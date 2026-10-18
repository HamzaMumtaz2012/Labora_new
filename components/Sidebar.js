'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const links = [
  { href: '/patients', icon: '♙', label: 'Patient Registration' },
  { href: '/employees', icon: '♧', label: 'Employee Registration' },
  { href: '/services', icon: '⚗', label: 'Products & Services' },
];

export default function Sidebar() {
  const pathname = usePathname();
  return (
    <aside className="sidebar">
      <Link href="/patients" className="brand">
        <span className="brand-mark">L</span>
        <span><strong>Labora</strong><small>LAB MANAGEMENT</small></span>
      </Link>
      <div>
        <p className="nav-label">REGISTRATION</p>
        <nav className="nav-list" aria-label="Main navigation">
          {links.map((link) => (
            <Link key={link.href} href={link.href} className={`nav-link ${pathname === link.href ? 'active' : ''}`}>
              <span className="nav-icon">{link.icon}</span><span>{link.label}</span>
            </Link>
          ))}
        </nav>
      </div>
      <div className="sidebar-note"><strong>Laboratory records</strong><span>Manage registration forms in separate pages.</span></div>
      <div className="sidebar-bottom">LABORA <span>•</span> REGISTRATION PORTAL</div>
    </aside>
  );
}
