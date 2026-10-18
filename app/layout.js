import './globals.css';
import Sidebar from '../components/Sidebar';

export const metadata = {
  title: 'Labora | Laboratory Management',
  description: 'Laboratory patient, employee, and service registration system.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <div className="app-shell">
          <Sidebar />
          <main className="main-content">{children}</main>
        </div>
      </body>
    </html>
  );
}
