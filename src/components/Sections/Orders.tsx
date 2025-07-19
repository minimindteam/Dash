import React, { useState, useEffect } from 'react';
import { Package, Eye, Trash2, Copy } from 'lucide-react';
import { formatInTimeZone } from 'date-fns-tz';
import { type Order } from '../../types';
import { API_URL } from '../../utils/api';
import Button from '../Common/Button';
import Modal from '../Common/Modal';
import Header from '../Layout/Header';

const Orders: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'pending' | 'confirmed' | 'in-progress' | 'completed' | 'cancelled'>('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('access_token');
      if (!token) {
        setError('Authentication required.');
        setLoading(false);
        return;
      }
      const response = await fetch(`${API_URL}/orders`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      if (!response.ok) {
        throw new Error('Failed to fetch orders');
      }
      const data: Order[] = await response.json();
      setOrders(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.order_id.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         order.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         order.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         order.package_name.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesFilter = filterStatus === 'all' || order.status === filterStatus;
    
    return matchesSearch && matchesFilter;
  });

  const handleStatusChange = async (orderId: string, newStatus: Order['status']) => {
    const token = localStorage.getItem('access_token');
    if (!token) {
      setError('Authentication required.');
      return;
    }

    try {
      const response = await fetch(`${API_URL}/orders/${orderId}?status=${newStatus}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to update order status.');
      }
      setOrders(prevOrders =>
        prevOrders.map(order =>
          order.order_id === orderId ? { ...order, status: newStatus } : order
        )
      );
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleDeleteOrder = async (orderId: string) => {
    if (confirm('Are you sure you want to delete this order?')) {
      const token = localStorage.getItem('access_token');
      if (!token) {
        setError('Authentication required.');
        return;
      }

      try {
        const response = await fetch(`${API_URL}/orders/${orderId}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error('Failed to delete order.');
        }
        setOrders(prevOrders => prevOrders.filter(order => order.order_id !== orderId));
      } catch (err: any) {
        setError(err.message);
      }
    }
  };

  const copyOrderId = (orderId: string) => {
    navigator.clipboard.writeText(orderId);
    alert('Order ID copied to clipboard!');
  };

  const getStatusColor = (status: Order['status']) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'confirmed': return 'bg-blue-100 text-blue-800';
      case 'in-progress': return 'bg-purple-100 text-purple-800';
      case 'completed': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const pendingCount = orders.filter(order => order.status === 'pending').length;
  const inProgressCount = orders.filter(order => order.status === 'in-progress').length;

  return (
    <div className="flex-1 overflow-y-auto bg-gray-50">
      <Header title="Orders" onSearch={setSearchQuery} />
      
      <div className="p-6">
        <div className="fb-flex fb-justify-between fb-items-center mb-6">
          <div>
            <h3 className="text-xl fb-font-bold text-gray-900">Order Management</h3>
            <p className="fb-text-muted fb-text-small">
              {pendingCount > 0 && `${pendingCount} pending orders`}
              {pendingCount > 0 && inProgressCount > 0 && ', '}
              {inProgressCount > 0 && `${inProgressCount} in progress`}
            </p>
          </div>
          <select
            className="fb-select"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value as any)}
          >
            <option value="all">All Orders</option>
            <option value="pending">Pending</option>
            <option value="confirmed">Confirmed</option>
            <option value="in-progress">In Progress</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>

        {loading ? (
          <div className="fb-flex fb-items-center fb-justify-center py-12">
            <div className="fb-spinner"></div>
            <span className="ml-2 fb-text-muted">Loading orders...</span>
          </div>
        ) : error ? (
          <div className="fb-card p-6 text-center">
            <p className="text-red-600">Error: {error}</p>
          </div>
        ) : (
          <div className="fb-card overflow-hidden">
            {filteredOrders.length === 0 ? (
              <div className="text-center py-12">
                <Package className="w-16 h-16 fb-text-muted mx-auto mb-4" />
                <h3 className="text-lg fb-font-semibold text-gray-900 mb-2">No orders found</h3>
                <p className="fb-text-muted">Orders will appear here when customers place them</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="fb-table">
                  <thead>
                    <tr>
                      <th>
                        Order ID
                      </th>
                      <th>
                        Customer
                      </th>
                      <th>
                        Package
                      </th>
                      <th>
                        Price
                      </th>
                      <th>
                        Budget
                      </th>
                      <th>
                        Timeline
                      </th>
                      <th>
                        Status
                      </th>
                      <th>
                        Order Age
                      </th>
                      <th>
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredOrders.map((order) => (
                      <tr key={order.order_id}>
                        <td>
                          <div className="fb-flex fb-items-center fb-space-x-2">
                            <span className="fb-text-small font-mono text-gray-900">{order.order_id}</span>
                            <button
                              onClick={() => copyOrderId(order.order_id)}
                              className="text-gray-400 hover:text-gray-600 p-1"
                              title="Copy Order ID"
                            >
                              <Copy className="w-3 h-3" />
                            </button>
                          </div>
                        </td>
                        <td>
                          <div>
                            <div className="fb-text-small fb-font-semibold text-gray-900">{order.name}</div>
                            <div className="fb-text-small fb-text-muted">{order.email}</div>
                          </div>
                        </td>
                        <td>
                          <div className="fb-text-small text-gray-900">{order.package_name}</div>
                        </td>
                        <td>
                          <div className="fb-text-small fb-font-semibold text-gray-900">{order.package_price}</div>
                        </td>
                        <td>
                          <div className="fb-text-small text-gray-900">{order.budget}</div>
                        </td>
                        <td>
                          <div className="fb-text-small text-gray-900">{order.timeline}</div>
                        </td>
                        <td>
                          <select
                            value={order.status}
                            onChange={(e) => handleStatusChange(order.order_id, e.target.value as Order['status'])}
                            className={`fb-badge ${getStatusColor(order.status)} border-0 cursor-pointer`}
                          >
                            <option value="pending">Pending</option>
                            <option value="confirmed">Confirmed</option>
                            <option value="in-progress">In Progress</option>
                            <option value="completed">Completed</option>
                            <option value="cancelled">Cancelled</option>
                          </select>
                        </td>
                        <td>
                          <div className="fb-text-small fb-text-muted">
                            {new Date(order.created_at).toLocaleDateString()}
                          </div>
                        </td>
                        <td>
                          <div className="fb-flex fb-items-center fb-space-x-2">
                            <button
                              onClick={() => {
                                setSelectedOrder(order);
                                setIsModalOpen(true);
                              }}
                              className="p-1 text-blue-600 hover:bg-blue-100 rounded transition-colors"
                              title="View Details"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteOrder(order.order_id)}
                              className="p-1 text-red-600 hover:bg-red-100 rounded transition-colors"
                              title="Delete Order"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>

      <OrderDetailsModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedOrder(null);
        }}
        order={selectedOrder}
      />
    </div>
  );
};

interface OrderDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  order: Order | null;
}

const OrderDetailsModal: React.FC<OrderDetailsModalProps> = ({ isOpen, onClose, order }) => {
  if (!order) return null;

  const copyOrderId = () => {
    navigator.clipboard.writeText(order.order_id);
    alert('Order ID copied to clipboard!');
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Order Details"
      size="lg"
    >
      <div className="space-y-6">
        <div className="bg-blue-50 p-4 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <label className="block text-sm font-medium text-blue-700 mb-1">
                Order ID
              </label>
              <p className="text-lg font-mono text-blue-900">{order.order_id}</p>
            </div>
            <Button
              onClick={copyOrderId}
              variant="secondary"
              size="sm"
              icon={Copy}
            >
              Copy ID
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Customer Name
            </label>
            <p className="text-sm text-gray-900">{order.name}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <p className="text-sm text-gray-900">{order.email}</p>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Phone
          </label>
          <p className="text-sm text-gray-900">{order.phone}</p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Package
            </label>
            <p className="text-sm text-gray-900">{order.package_name}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Price
            </label>
            <p className="text-sm text-gray-900 font-medium">{order.package_price}</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Budget
            </label>
            <p className="text-sm text-gray-900">{order.budget}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Timeline
            </label>
            <p className="text-sm text-gray-900">{order.timeline}</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Order Date
            </label>
            <p className="text-sm text-gray-900">{order.order_id.includes('_') ? formatInTimeZone(new Date(parseInt(order.order_id.split('_')[1])), 'Asia/Dhaka', 'MMM dd, yyyy, hh:mm a') : 'N/A'}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Status
            </label>
            <p className="text-sm text-gray-900 capitalize">{order.status.replace('-', ' ')}</p>
          </div>
        </div>

        {order.message && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Notes
            </label>
            <div className="bg-gray-50 p-3 rounded-md">
              <p className="text-sm text-gray-900">{order.message}</p>
            </div>
          </div>
        )}

        <div className="flex justify-end pt-4 border-t border-gray-200">
          <Button type="button" variant="secondary" onClick={onClose}>
            Close
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default Orders;