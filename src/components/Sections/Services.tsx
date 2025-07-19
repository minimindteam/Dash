import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Globe, Smartphone, Monitor, Zap, Upload } from 'lucide-react';
import { type Service } from '../../types';
import { API_URL } from '../../utils/api';
import Button from '../Common/Button';
import Modal from '../Common/Modal';
import Header from '../Layout/Header';

const iconMap = {
  Globe,
  Smartphone,
  Monitor,
  Zap
};

const Services: React.FC = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchServices = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/services`);
      if (!response.ok) {
        throw new Error('Failed to fetch services');
      }
      const data: Service[] = await response.json();
      setServices(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  const filteredServices = services.filter(service =>
    service.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    service.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSaveService = async (serviceData: Omit<Service, 'id' | 'createdAt'>) => {
    const token = localStorage.getItem('access_token');
    if (!token) {
      setError('Authentication required.');
      return;
    }

    try {
      let response;
      if (editingService) {
        response = await fetch(`${API_URL}/services/${editingService.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify(serviceData),
        });
      } else {
        response = await fetch(`${API_URL}/services`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify(serviceData),
        });
      }

      if (!response.ok) {
        throw new Error('Failed to save service.');
      }
      fetchServices();
      setIsModalOpen(false);
      setEditingService(null);
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleDeleteService = async (id: string) => {
    if (confirm('Are you sure you want to delete this service?')) {
      const token = localStorage.getItem('access_token');
      if (!token) {
        setError('Authentication required.');
        return;
      }

      try {
        const response = await fetch(`${API_URL}/services/${id}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error('Failed to delete service.');
        }
        fetchServices();
      } catch (err: any) {
        setError(err.message);
      }
    }
  };

  return (
    <div className="flex-1 overflow-y-auto bg-gray-50">
      <Header title="Services" onSearch={setSearchQuery} />
      
      <div className="p-6">
        <div className="fb-flex fb-justify-between fb-items-center mb-6">
          <div>
            <h3 className="text-xl fb-font-bold text-gray-900">Manage Services</h3>
            <p className="fb-text-muted fb-text-small">Add, edit, or remove services from your website</p>
          </div>
          <button
            onClick={() => setIsModalOpen(true)}
            className="fb-btn fb-flex fb-items-center fb-space-x-2"
          >
            <Plus className="w-4 h-4" />
            Add Service
          </button>
        </div>

        {loading ? (
          <div className="fb-flex fb-items-center fb-justify-center py-12">
            <div className="fb-spinner"></div>
            <span className="ml-2 fb-text-muted">Loading services...</span>
          </div>
        ) : error ? (
          <div className="fb-card p-6 text-center">
            <p className="text-red-600">Error: {error}</p>
          </div>
        ) : (
          <div className="fb-grid fb-grid-3">
            {filteredServices.map((service) => {
              const IconComponent = iconMap[service.icon as keyof typeof iconMap] || Globe;
              const features = Array.isArray(service.features) ? service.features : [];
              return (
                <div key={service.id} className="fb-card">
                  {service.cover_image_url && (
                    <div className="fb-mb-4">
                      <img 
                        src={service.cover_image_url} 
                        alt={service.title}
                        className="fb-image"
                      />
                    </div>
                  )}
                  <div className="fb-flex fb-items-start fb-justify-between fb-mb-4">
                    <div className="fb-flex fb-items-center">
                      <div style={{ 
                        width: '40px', 
                        height: '40px', 
                        background: '#e7f3ff', 
                        borderRadius: '8px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        marginRight: '12px'
                      }}>
                        <IconComponent style={{ width: '20px', height: '20px', color: '#1877f2' }} />
                      </div>
                      <div>
                        <h4 className="fb-font-semibold" style={{ color: '#1c1e21' }}>{service.title}</h4>
                        {service.price && (
                          <p className="fb-text-small fb-font-semibold" style={{ color: '#42b883' }}>{service.price}</p>
                        )}
                      </div>
                    </div>
                    <div className="fb-flex fb-space-x-2">
                      <button
                        onClick={() => {
                          setEditingService(service);
                          setIsModalOpen(true);
                        }}
                        style={{
                          padding: '8px',
                          background: '#e7f3ff',
                          border: 'none',
                          borderRadius: '50%',
                          cursor: 'pointer',
                          color: '#1877f2'
                        }}
                      >
                        <Edit style={{ width: '16px', height: '16px' }} />
                      </button>
                      <button
                        onClick={() => handleDeleteService(service.id)}
                        style={{
                          padding: '8px',
                          background: '#f8d7da',
                          border: 'none',
                          borderRadius: '50%',
                          cursor: 'pointer',
                          color: '#e41e3f'
                        }}
                      >
                        <Trash2 style={{ width: '16px', height: '16px' }} />
                      </button>
                    </div>
                  </div>
                  
                  <p className="fb-text-muted fb-text-small fb-mb-4">{service.description}</p>
                  
                  {features.length > 0 && (
                    <div>
                      <h5 className="fb-text-small fb-font-semibold fb-mb-2" style={{ color: '#1c1e21' }}>Features:</h5>
                      <ul className="fb-text-small fb-text-muted">
                        {features.map((feature: string, index: number) => (
                          <li key={index} className="fb-flex fb-items-center fb-mb-1">
                            <span style={{ 
                              width: '6px', 
                              height: '6px', 
                              background: '#42b883', 
                              borderRadius: '50%', 
                              marginRight: '8px' 
                            }}></span>
                            {feature}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {filteredServices.length === 0 && !loading && !error && (
          <div className="fb-empty-state">
            <Globe />
            <h3>No services found</h3>
            <p>Get started by adding your first service</p>
          </div>
        )}
      </div>

      <ServiceModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingService(null);
        }}
        onSave={handleSaveService}
        service={editingService}
      />
    </div>
  );
};

interface ServiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (service: Omit<Service, 'id' | 'createdAt'>) => void;
  service: Service | null;
}

const ServiceModal: React.FC<ServiceModalProps> = ({ isOpen, onClose, onSave, service }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    icon: 'Globe',
    price: '',
    features: [''],
    cover_image_url: '',
  });

  useEffect(() => {
    if (service) {
      setFormData({
        title: service.title,
        description: service.description,
        icon: service.icon,
        price: service.price || '',
        features: Array.isArray(service.features) && service.features.length > 0 ? service.features : [''],
        cover_image_url: service.cover_image_url || '',
      });
    } else {
      setFormData({
        title: '',
        description: '',
        icon: 'Globe',
        price: '',
        features: [''],
        cover_image_url: '',
      });
    }
  }, [service]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      ...formData,
      features: formData.features.filter(f => f.trim() !== ''),
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
      setFormData(prev => ({ ...prev, cover_image_url: data.url }));
      alert('Image uploaded successfully!');
    } catch (err: any) {
      alert(`Error uploading image: ${err.message}`);
    }
  };

  const addFeature = () => {
    setFormData(prev => ({
      ...prev,
      features: [...prev.features, '']
    }));
  };

  const removeFeature = (index: number) => {
    setFormData(prev => ({
      ...prev,
      features: prev.features.filter((_, i) => i !== index)
    }));
  };

  const updateFeature = (index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      features: prev.features.map((f, i) => i === index ? value : f)
    }));
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={service ? 'Edit Service' : 'Add Service'}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Title
          </label>
          <input
            type="text"
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={formData.title}
            onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Description
          </label>
          <textarea
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows={3}
            value={formData.description}
            onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Icon
          </label>
          <select
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={formData.icon}
            onChange={(e) => setFormData(prev => ({ ...prev, icon: e.target.value }))}
          >
            <option value="Globe">Globe</option>
            <option value="Smartphone">Smartphone</option>
            <option value="Monitor">Monitor</option>
            <option value="Zap">Zap</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Price (Optional)
          </label>
          <input
            type="text"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={formData.price}
            onChange={(e) => setFormData(prev => ({ ...prev, price: e.target.value }))}
            placeholder="$1,000"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Cover Image URL
          </label>
          <div className="flex items-center space-x-4">
            <input
              type="text"
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={formData.cover_image_url}
              onChange={(e) => setFormData(prev => ({ ...prev, cover_image_url: e.target.value }))}
              placeholder="Enter image URL"
            />
            <input
              type="file"
              id="service-cover-image"
              accept="image/*"
              className="hidden"
              onChange={handleImageUpload}
            />
            <label htmlFor="service-cover-image">
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
          {formData.cover_image_url && (
            <div className="mt-2">
              <img
                src={formData.cover_image_url}
                alt="Cover Preview"
                className="w-full h-32 object-cover rounded-md"
              />
            </div>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Features
          </label>
          {formData.features.map((feature, index) => (
            <div key={index} className="flex items-center space-x-2 mb-2">
              <input
                type="text"
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={feature}
                onChange={(e) => updateFeature(index, e.target.value)}
                placeholder="Enter feature"
              />
              {formData.features.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeFeature(index)}
                  className="text-red-600 hover:text-red-800"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>
          ))}
          <button
            type="button"
            onClick={addFeature}
            className="text-blue-600 hover:text-blue-800 text-sm"
          >
            + Add Feature
          </button>
        </div>

        <div className="flex justify-end space-x-3 pt-4">
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit">
            {service ? 'Update' : 'Add'} Service
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default Services;