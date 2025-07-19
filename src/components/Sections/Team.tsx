import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Users, Linkedin, Twitter, Globe, Upload } from 'lucide-react';
import { type TeamMember } from '../../types';
import { API_URL } from '../../utils/api';
import Button from '../Common/Button';
import Modal from '../Common/Modal';
import Header from '../Layout/Header';

const Team: React.FC = () => {
  const [team, setTeam] = useState<TeamMember[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMember, setEditingMember] = useState<TeamMember | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Dummy data for testing UI
  const dummyTeam = [
    {
      id: '1',
      name: 'John Smith',
      designation: 'Lead Developer',
      image_url: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg',
      bio: 'Experienced full-stack developer with 8+ years in web development',
      specialties: ['React', 'Node.js', 'TypeScript', 'AWS'],
      social_url_a: 'https://linkedin.com/in/johnsmith',
      social_url_b: 'https://twitter.com/johnsmith',
      social_url_c: 'https://github.com/johnsmith'
    },
    {
      id: '2',
      name: 'Sarah Johnson',
      designation: 'UI/UX Designer',
      image_url: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg',
      bio: 'Creative designer passionate about user experience and modern design',
      specialties: ['Figma', 'Adobe Creative Suite', 'User Research', 'Prototyping'],
      social_url_a: 'https://linkedin.com/in/sarahjohnson',
      social_url_b: 'https://dribbble.com/sarahjohnson',
      social_url_c: 'https://behance.net/sarahjohnson'
    },
    {
      id: '3',
      name: 'Mike Chen',
      designation: 'Project Manager',
      image_url: 'https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg',
      bio: 'Agile project manager ensuring smooth delivery of all projects',
      specialties: ['Agile', 'Scrum', 'Team Leadership', 'Client Relations'],
      social_url_a: 'https://linkedin.com/in/mikechen',
      social_url_b: 'https://twitter.com/mikechen',
      social_url_c: 'https://mikechen.dev'
    }
  ];

  const fetchTeamMembers = async () => {
    setLoading(true);
    try {
      // Use dummy data for now to test UI
      setTeam(dummyTeam);
      
      // Uncomment this when Supabase is working properly
      // const response = await fetch(`${API_URL}/team-members`);
      // if (!response.ok) {
      //   throw new Error('Failed to fetch team members');
      // }
      // const data: TeamMember[] = await response.json();
      // setTeam(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTeamMembers();
  }, []);

  const filteredTeam = team.filter(member =>
    member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    member.designation.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSaveMember = async (memberData: Omit<TeamMember, 'id'>) => {
    const token = localStorage.getItem('access_token');
    if (!token) {
      setError('Authentication required.');
      return;
    }

    try {
      let response;
      if (editingMember) {
        response = await fetch(`${API_URL}/team-members/${editingMember.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify(memberData),
        });
      } else {
        response = await fetch(`${API_URL}/team-members`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify(memberData),
        });
      }

      if (!response.ok) {
        throw new Error('Failed to save team member.');
      }
      fetchTeamMembers();
      setIsModalOpen(false);
      setEditingMember(null);
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleDeleteMember = async (id: string) => {
    if (confirm('Are you sure you want to delete this team member?')) {
      const token = localStorage.getItem('access_token');
      if (!token) {
        setError('Authentication required.');
        return;
      }

      try {
        const response = await fetch(`${API_URL}/team-members/${id}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error('Failed to delete team member.');
        }
        fetchTeamMembers();
      } catch (err: any) {
        setError(err.message);
      }
    }
  };

  return (
    <div className="flex-1 overflow-y-auto bg-gray-50">
      <Header title="Team" onSearch={setSearchQuery} />
      
      <div className="p-6">
        <div className="fb-flex fb-justify-between fb-items-center mb-6">
          <div>
            <h3 className="text-xl fb-font-bold text-gray-900">Manage Team</h3>
            <p className="fb-text-muted fb-text-small">Add, edit, or remove team members</p>
          </div>
          <button
            onClick={() => setIsModalOpen(true)}
            className="fb-btn fb-flex fb-items-center fb-space-x-2"
          >
            <Plus className="w-4 h-4" />
            Add Team Member
          </button>
        </div>

        {loading ? (
          <div className="fb-flex fb-items-center fb-justify-center py-12">
            <div className="fb-spinner"></div>
            <span className="ml-2 fb-text-muted">Loading team members...</span>
          </div>
        ) : error ? (
          <div className="fb-card p-6 text-center">
            <p className="text-red-600">Error: {error}</p>
          </div>
        ) : (
          <div className="fb-grid fb-grid-4 gap-6">
            {filteredTeam.map((member) => (
              <div key={member.id} className="fb-card p-6 text-center hover:shadow-lg transition-shadow">
                <img
                  src={member.image_url}
                  alt={member.name}
                  className="w-20 h-20 rounded-full object-cover mx-auto mb-4 border-4 border-gray-100"
                />
                <h4 className="fb-font-semibold text-gray-900 text-base mb-1">{member.name}</h4>
                <p className="fb-text-small text-blue-600 fb-font-semibold mb-3">{member.designation}</p>
                <p className="fb-text-muted fb-text-small mb-4 line-clamp-3">{member.bio}</p>
                {member.specialties && member.specialties.length > 0 && (
                  <div className="flex flex-wrap gap-1 mb-4 justify-center">
                    {member.specialties.map((specialty, idx) => (
                      <span key={idx} className="fb-badge-info fb-text-small">
                        {specialty}
                      </span>
                    ))}
                  </div>
                )}
                
                <div className="fb-flex fb-justify-center fb-space-x-3 mb-4">
                  {member.social_url_a && (
                    <a href={member.social_url_a} target="_blank" rel="noopener noreferrer" className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-colors">
                      <Linkedin className="w-5 h-5" />
                    </a>
                  )}
                  {member.social_url_b && (
                    <a href={member.social_url_b} target="_blank" rel="noopener noreferrer" className="p-2 text-gray-500 hover:text-blue-400 hover:bg-blue-50 rounded-full transition-colors">
                      <Twitter className="w-5 h-5" />
                    </a>
                  )}
                  {member.social_url_c && (
                    <a href={member.social_url_c} target="_blank" rel="noopener noreferrer" className="p-2 text-gray-500 hover:text-purple-600 hover:bg-purple-50 rounded-full transition-colors">
                      <Globe className="w-5 h-5" />
                    </a>
                  )}
                </div>
                
                <div className="fb-flex fb-justify-center fb-space-x-2">
                  <button
                    onClick={() => {
                      setEditingMember(member);
                      setIsModalOpen(true);
                    }}
                    className="fb-btn-secondary fb-flex fb-items-center"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDeleteMember(member.id)}
                    className="fb-btn-danger fb-flex fb-items-center"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {filteredTeam.length === 0 && !loading && !error && (
          <div className="fb-card p-12 text-center">
            <Users className="w-16 h-16 fb-text-muted mx-auto mb-4" />
            <h3 className="text-lg fb-font-semibold text-gray-900 mb-2">No team members found</h3>
            <p className="fb-text-muted">Get started by adding your first team member</p>
          </div>
        )}
      </div>

      <TeamModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingMember(null);
        }}
        onSave={handleSaveMember}
        member={editingMember}
      />
    </div>
  );
};

interface TeamModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (member: Omit<TeamMember, 'id'>) => void;
  member: TeamMember | null;
}

const TeamModal: React.FC<TeamModalProps> = ({ isOpen, onClose, onSave, member }) => {
  const [formData, setFormData] = useState({
    name: '',
    designation: '',
    image_url: '',
    bio: '',
    specialties: [''],
    social_url_a: '',
    social_url_b: '',
    social_url_c: '',
  });

  useEffect(() => {
    if (member) {
      setFormData({
        name: member.name,
        designation: member.designation,
        image_url: member.image_url,
        bio: member.bio || '',
        specialties: member.specialties && member.specialties.length > 0 ? member.specialties : [''],
        social_url_a: member.social_url_a || '',
        social_url_b: member.social_url_b || '',
        social_url_c: member.social_url_c || '',
      });
    } else {
      setFormData({
        name: '',
        designation: '',
        image_url: '',
        bio: '',
        specialties: [''],
        social_url_a: '',
        social_url_b: '',
        social_url_c: '',
      });
    }
  }, [member]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      name: formData.name,
      designation: formData.designation,
      image_url: formData.image_url,
      bio: formData.bio,
      specialties: formData.specialties.filter(s => s.trim() !== ''),
      social_url_a: formData.social_url_a,
      social_url_b: formData.social_url_b,
      social_url_c: formData.social_url_c,
    });
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const token = localStorage.getItem('access_token');
    if (!token) {
      alert('Authentication required to upload image.');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

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
      setFormData(prev => ({ ...prev, image_url: data.url }));
      alert('Image uploaded successfully!');
    } catch (err: any) {
      alert(`Error uploading image: ${err.message}`);
    }
  };

  const addSpecialty = () => {
    setFormData(prev => ({
      ...prev,
      specialties: [...prev.specialties, '']
    }));
  };

  const removeSpecialty = (index: number) => {
    setFormData(prev => ({
      ...prev,
      specialties: prev.specialties.filter((_, i) => i !== index)
    }));
  };

  const updateSpecialty = (index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      specialties: prev.specialties.map((s, i) => i === index ? value : s)
    }));
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={member ? 'Edit Team Member' : 'Add Team Member'}
      size="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Name
            </label>
            <input
              type="text"
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Designation
            </label>
            <input
              type="text"
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={formData.designation}
              onChange={(e) => setFormData(prev => ({ ...prev, designation: e.target.value }))}
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Image URL
          </label>
          <div className="flex items-center space-x-4">
            <input
              type="text"
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={formData.image_url}
              onChange={(e) => setFormData(prev => ({ ...prev, image_url: e.target.value }))}
              placeholder="Enter image URL"
            />
            <input
              type="file"
              id="member-image"
              accept="image/*"
              className="hidden"
              onChange={handleImageUpload}
            />
            <label htmlFor="member-image">
              <Button
                variant="secondary"
                icon={Upload}
                size="sm"
                as="span"
                className="cursor-pointer"
              >
                Upload
              </Button>
            </label>
          </div>
          {formData.image_url && (
            <div className="mt-2">
              <img
                src={formData.image_url}
                alt="Preview"
                className="w-20 h-20 rounded-full object-cover"
              />
            </div>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Bio
          </label>
          <textarea
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows={3}
            value={formData.bio}
            onChange={(e) => setFormData(prev => ({ ...prev, bio: e.target.value }))}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Specialties
          </label>
          {formData.specialties.map((specialty, index) => (
            <div key={index} className="flex items-center space-x-2 mb-2">
              <input
                type="text"
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={specialty}
                onChange={(e) => updateSpecialty(index, e.target.value)}
                placeholder="e.g., Brand Strategy"
              />
              {formData.specialties.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeSpecialty(index)}
                  className="text-red-600 hover:text-red-800"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>
          ))}
          <button
            type="button"
            onClick={addSpecialty}
            className="text-blue-600 hover:text-blue-800 text-sm"
          >
            + Add Specialty
          </button>
        </div>

        <div>
          <h4 className="text-sm font-medium text-gray-700 mb-3">Social Links (Optional)</h4>
          <div className="space-y-3">
            <div>
              <label className="block text-xs text-gray-600 mb-1">Social Link A</label>
              <input
                type="url"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={formData.social_url_a}
                onChange={(e) => setFormData(prev => ({ ...prev, social_url_a: e.target.value }))}
                placeholder="https://example.com/a"
              />
            </div>

            <div>
              <label className="block text-xs text-gray-600 mb-1">Social Link B</label>
              <input
                type="url"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={formData.social_url_b}
                onChange={(e) => setFormData(prev => ({ ...prev, social_url_b: e.target.value }))}
                placeholder="https://example.com/b"
              />
            </div>

            <div>
              <label className="block text-xs text-gray-600 mb-1">Social Link C</label>
              <input
                type="url"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={formData.social_url_c}
                onChange={(e) => setFormData(prev => ({ ...prev, social_url_c: e.target.value }))}
                placeholder="https://example.com/c"
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end space-x-3 pt-4">
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit">
            {member ? 'Update' : 'Add'} Member
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default Team;