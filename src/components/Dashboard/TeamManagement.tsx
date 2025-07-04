import React, { useState, useEffect, FormEvent } from 'react';

const API_URL = 'https://minimind-backend.onrender.com';

interface TeamMember {
  id: number;
  name: string;
  designation: string;
  image_url: string;
}

function TeamManagement() {
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  // Form state
  const [name, setName] = useState('');
  const [designation, setDesignation] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const fetchMembers = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/team-members`);
      if (!response.ok) {
        throw new Error('Failed to fetch team members.');
      }
      const data: TeamMember[] = await response.json();
      setMembers(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMembers();
  }, []);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setImageFile(event.target.files[0]);
    }
  };

  const uploadImage = async (): Promise<string | null> => {
    if (!imageFile) return null;

    setIsUploading(true);
    setMessage('Uploading image...');
    const token = localStorage.getItem('access_token');
    const formData = new FormData();
    formData.append('file', imageFile);

    try {
      const response = await fetch(`${API_URL}/images/upload`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData,
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.detail || 'Image upload failed.');
      }
      setMessage('Image uploaded successfully.');
      return data.url;
    } catch (err: any) {
      setError(err.message);
      return null;
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setMessage('Processing...');

    const token = localStorage.getItem('access_token');
    if (!token) {
      setError('Authentication required.');
      return;
    }

    const imageUrl = await uploadImage();
    if (!imageUrl) {
      setError('Could not upload image. Please try again.');
      setMessage('');
      return;
    }

    try {
      const response = await fetch(`${API_URL}/team-members`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ name, designation, image_url: imageUrl }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.detail || 'Failed to create team member.');
      }
      
      setMessage('Team member created successfully!');
      // Reset form
      setName('');
      setDesignation('');
      setImageFile(null);
      // Refresh list
      fetchMembers(); 
    } catch (err: any) {
      setError(err.message);
      setMessage('');
    }
  };

  const handleDelete = async (memberId: number) => {
    if (!window.confirm('Are you sure you want to delete this member?')) {
      return;
    }

    setError('');
    setMessage('Deleting...');
    const token = localStorage.getItem('access_token');
    if (!token) {
      setError('Authentication required.');
      return;
    }

    try {
      const response = await fetch(`${API_URL}/team-members/${memberId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.detail || 'Failed to delete member.');
      }
      
      setMessage('Member deleted successfully.');
      fetchMembers(); // Refresh list
    } catch (err: any) {
      setError(err.message);
      setMessage('');
    }
  };


  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Team Management</h2>

      {/* Form for creating new team members */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-6">
        <h3 className="text-xl font-semibold mb-4">Add New Member</h3>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="name" className="block text-gray-700 text-sm font-bold mb-2">Name:</label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700"
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="designation" className="block text-gray-700 text-sm font-bold mb-2">Designation:</label>
            <input
              type="text"
              id="designation"
              value={designation}
              onChange={(e) => setDesignation(e.target.value)}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700"
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="imageFile" className="block text-gray-700 text-sm font-bold mb-2">Image:</label>
            <input
              type="file"
              id="imageFile"
              onChange={handleFileChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700"
              accept="image/*"
              required
            />
          </div>
          <button
            type="submit"
            className="bg-primary hover:bg-purple-700 text-white font-bold py-2 px-4 rounded"
            disabled={isUploading}
          >
            {isUploading ? 'Uploading...' : 'Add Member'}
          </button>
          {message && <p className="mt-4 text-sm text-green-500">{message}</p>}
          {error && <p className="mt-4 text-sm text-red-500">{error}</p>}
        </form>
      </div>

      {/* Display current team members */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-xl font-semibold mb-4">Current Team Members</h3>
        {loading ? (
          <p>Loading...</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {members.map((member) => (
              <div key={member.id} className="border p-4 rounded-lg text-center">
                <img src={member.image_url} alt={member.name} className="w-24 h-24 rounded-full mx-auto mb-2 object-cover" />
                <h4 className="text-lg font-bold">{member.name}</h4>
                <p className="text-gray-600">{member.designation}</p>
                <div className="flex justify-center mt-4">
                  {/* <button className="bg-blue-500 text-white px-3 py-1 rounded mr-2">Edit</button> */}
                  <button 
                    onClick={() => handleDelete(member.id)}
                    className="bg-red-500 hover:bg-red-700 text-white px-3 py-1 rounded"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default TeamManagement;