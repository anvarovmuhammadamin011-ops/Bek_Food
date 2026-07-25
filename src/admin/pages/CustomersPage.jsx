import { useState } from 'react';
import { Search, Phone, Mail, MapPin, ShoppingBag, Star, Ban, CheckCircle, Eye, MoreVertical } from 'lucide-react';
import useAdminStore from '../store/useAdminStore';
import Modal from '../components/Modal';

export default function CustomersPage() {
  const { customers, toggleBlockCustomer } = useAdminStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState(null);

  const filteredCustomers = customers.filter((c) =>
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.phone.includes(searchQuery) ||
    c.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div style={{ padding: '24px', maxWidth: '1200px' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
        <div>
          <h2 style={{ fontSize: '18px', fontWeight: 800, color: 'var(--text-primary)' }}>Customers</h2>
          <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginTop: '2px' }}>{customers.length} registered customers</p>
        </div>
        <div style={{ position: 'relative' }}>
          <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
          <input
            type="text"
            placeholder="Search customers..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              width: '280px',
              padding: '10px 12px 10px 36px',
              borderRadius: '10px',
              border: '1.5px solid var(--border)',
              background: 'var(--bg-card)',
              fontSize: '13px',
              outline: 'none',
            }}
          />
        </div>
      </div>

      {/* Stats */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
        gap: '12px',
        marginBottom: '24px',
      }}>
        <div style={{ padding: '16px', borderRadius: '14px', background: 'var(--color-primary-light)', textAlign: 'center' }}>
          <div style={{ fontSize: '24px', fontWeight: 800, color: 'var(--color-primary)' }}>{customers.length}</div>
          <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-muted)' }}>Total Customers</div>
        </div>
        <div style={{ padding: '16px', borderRadius: '14px', background: 'var(--color-success-light)', textAlign: 'center' }}>
          <div style={{ fontSize: '24px', fontWeight: 800, color: 'var(--color-success)' }}>{customers.filter((c) => !c.isBlocked).length}</div>
          <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-muted)' }}>Active</div>
        </div>
        <div style={{ padding: '16px', borderRadius: '14px', background: 'var(--color-danger-light)', textAlign: 'center' }}>
          <div style={{ fontSize: '24px', fontWeight: 800, color: 'var(--color-danger)' }}>{customers.filter((c) => c.isBlocked).length}</div>
          <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-muted)' }}>Blocked</div>
        </div>
        <div style={{ padding: '16px', borderRadius: '14px', background: 'var(--bg-secondary)', textAlign: 'center' }}>
          <div style={{ fontSize: '24px', fontWeight: 800, color: 'var(--text-primary)' }}>{(customers.reduce((s, c) => s + c.totalSpending, 0) / 1000000).toFixed(1)}M</div>
          <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-muted)' }}>Total Revenue</div>
        </div>
      </div>

      {/* Customers Table */}
      <div style={{
        background: 'var(--bg-card)',
        borderRadius: '16px',
        border: '1px solid var(--border)',
        overflow: 'hidden',
      }}>
        {/* Table Header */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '2fr 1fr 1fr 1fr 1fr 100px',
          gap: '16px',
          padding: '14px 20px',
          background: 'var(--bg-secondary)',
          borderBottom: '1px solid var(--border)',
          fontSize: '11px',
          fontWeight: 600,
          color: 'var(--text-muted)',
          textTransform: 'uppercase',
          letterSpacing: '0.05em',
        }}>
          <div>Customer</div>
          <div>Phone</div>
          <div>Orders</div>
          <div>Spending</div>
          <div>Status</div>
          <div>Actions</div>
        </div>

        {/* Table Body */}
        {filteredCustomers.map((customer) => (
          <div key={customer.id} style={{
            display: 'grid',
            gridTemplateColumns: '2fr 1fr 1fr 1fr 1fr 100px',
            gap: '16px',
            padding: '14px 20px',
            borderBottom: '1px solid var(--border)',
            alignItems: 'center',
            cursor: 'pointer',
            transition: 'background 0.15s ease',
          }}
          onMouseEnter={(e) => e.currentTarget.style.background = 'var(--bg-secondary)'}
          onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
          onClick={() => setSelectedCustomer(customer)}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{
                width: '40px',
                height: '40px',
                borderRadius: '10px',
                background: 'var(--color-primary-light)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 700,
                color: 'var(--color-primary)',
                fontSize: '14px',
              }}>
                {customer.name.charAt(0)}
              </div>
              <div>
                <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)' }}>{customer.name}</div>
                <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{customer.email}</div>
              </div>
            </div>
            <div style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>{customer.phone}</div>
            <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)' }}>{customer.totalOrders}</div>
            <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--color-primary)' }}>{customer.totalSpending.toLocaleString()} so'm</div>
            <div>
              <span style={{
                padding: '4px 10px',
                borderRadius: '9999px',
                background: customer.isBlocked ? 'var(--color-danger-light)' : 'var(--color-success-light)',
                color: customer.isBlocked ? 'var(--color-danger)' : 'var(--color-success)',
                fontSize: '11px',
                fontWeight: 600,
              }}>
                {customer.isBlocked ? 'Blocked' : 'Active'}
              </span>
            </div>
            <div>
              <button
                onClick={(e) => { e.stopPropagation(); toggleBlockCustomer(customer.id); }}
                style={{
                  padding: '6px 10px',
                  borderRadius: '8px',
                  border: `1px solid ${customer.isBlocked ? 'rgba(43, 138, 62, 0.2)' : 'rgba(224, 49, 49, 0.2)'}`,
                  background: customer.isBlocked ? 'var(--color-success-light)' : 'var(--color-danger-light)',
                  color: customer.isBlocked ? 'var(--color-success)' : 'var(--color-danger)',
                  fontSize: '11px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                }}
              >
                {customer.isBlocked ? <CheckCircle size={12} /> : <Ban size={12} />}
                {customer.isBlocked ? 'Unblock' : 'Block'}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Customer Details Modal */}
      <Modal
        isOpen={!!selectedCustomer}
        onClose={() => setSelectedCustomer(null)}
        title={selectedCustomer?.name || ''}
        maxWidth="480px"
      >
        {selectedCustomer && (
          <div>
            <div style={{ textAlign: 'center', marginBottom: '20px' }}>
              <div style={{
                width: '80px',
                height: '80px',
                borderRadius: '20px',
                background: 'var(--color-primary-light)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 12px',
                fontSize: '28px',
                fontWeight: 800,
                color: 'var(--color-primary)',
              }}>
                {selectedCustomer.name.charAt(0)}
              </div>
              <h3 style={{ fontSize: '18px', fontWeight: 700 }}>{selectedCustomer.name}</h3>
              <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Member since {selectedCustomer.createdAt}</p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '20px' }}>
              <div style={{ padding: '14px', borderRadius: '12px', background: 'var(--bg-secondary)', textAlign: 'center' }}>
                <div style={{ fontSize: '20px', fontWeight: 800, color: 'var(--text-primary)' }}>{selectedCustomer.totalOrders}</div>
                <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Orders</div>
              </div>
              <div style={{ padding: '14px', borderRadius: '12px', background: 'var(--bg-secondary)', textAlign: 'center' }}>
                <div style={{ fontSize: '20px', fontWeight: 800, color: 'var(--color-primary)' }}>{selectedCustomer.totalSpending.toLocaleString()}</div>
                <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Total Spent</div>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '12px', borderRadius: '10px', background: 'var(--bg-secondary)' }}>
                <Phone size={16} color="var(--text-muted)" />
                <span style={{ fontSize: '13px' }}>{selectedCustomer.phone}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '12px', borderRadius: '10px', background: 'var(--bg-secondary)' }}>
                <Mail size={16} color="var(--text-muted)" />
                <span style={{ fontSize: '13px' }}>{selectedCustomer.email}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '12px', borderRadius: '10px', background: 'var(--bg-secondary)' }}>
                <MapPin size={16} color="var(--text-muted)" />
                <span style={{ fontSize: '13px' }}>{selectedCustomer.addresses.join(', ')}</span>
              </div>
            </div>

            {selectedCustomer.favoriteFoods.length > 0 && (
              <div>
                <h4 style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Favorite Foods</h4>
                <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                  {selectedCustomer.favoriteFoods.map((food) => (
                    <span key={food} style={{
                      padding: '6px 12px',
                      borderRadius: '9999px',
                      background: 'var(--color-primary-light)',
                      color: 'var(--color-primary)',
                      fontSize: '12px',
                      fontWeight: 600,
                    }}>
                      {food}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {selectedCustomer.notes && (
              <div style={{ marginTop: '16px', padding: '12px', borderRadius: '10px', background: 'rgba(232, 89, 12, 0.06)', fontSize: '13px', color: 'var(--color-primary)' }}>
                {selectedCustomer.notes}
              </div>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
}
