import { useEffect } from 'react';
import { useNavigate, Link, Routes, Route } from 'react-router-dom';
import ContentManagement from '../components/Dashboard/ContentManagement';
import ImageManagement from '../components/Dashboard/ImageManagement';
import MessageManagement from '../components/Dashboard/MessageManagement';

function DashboardPage() {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    if (!token) {
      navigate('/login');
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-lightGray flex flex-col">
      <header className="bg-primary text-white p-4 shadow-md flex justify-between items-center">
        <h1 className="text-2xl font-bold">Admin Dashboard</h1>
        <button
          onClick={handleLogout}
          className="bg-secondary hover:bg-pink-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
        >
          Logout
        </button>
      </header>
      <div className="flex flex-1">
        <nav className="w-64 bg-primary text-white p-4 shadow-md">
          <ul>
            <li className="mb-2">
              <Link to="/dashboard/content" className="block py-2 px-4 rounded hover:bg-gray-700">Content Management</Link>
            </li>
            <li className="mb-2">
              <Link to="/dashboard/images" className="block py-2 px-4 rounded hover:bg-gray-700">Image Management</Link>
            </li>
            <li className="mb-2">
              <Link to="/dashboard/messages" className="block py-2 px-4 rounded hover:bg-gray-700">Message Management</Link>
            </li>
          </ul>
        </nav>
        <main className="flex-1 p-4">
          <Routes>
            <Route path="content" element={<ContentManagement />} />
            <Route path="images" element={<ImageManagement />} />
            <Route path="messages" element={<MessageManagement />} />
            <Route path="*" element={<h2 className="text-xl font-semibold mb-4">Select a section from the sidebar.</h2>} />
          </Routes>
        </main>
      </div>
    </div>
  );
}

export default DashboardPage;