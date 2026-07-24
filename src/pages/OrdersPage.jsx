import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Clock, CheckCircle, XCircle, RotateCcw, Download, Star, Package, ArrowRight } from 'lucide-react';
import useStore from '../store/useStore';

const statusConfig = {
  preparing: { label: 'Preparing', color: 'text-warning', bg: 'bg-warning-alpha' },
  cooking: { label: 'Cooking', color: 'text-primary', bg: 'bg-primary-alpha' },
  pickedUp: { label: 'Picked Up', color: 'text-primary', bg: 'bg-primary-alpha' },
  onTheWay: { label: 'On the Way', color: 'text-primary', bg: 'bg-primary-alpha' },
  delivered: { label: 'Delivered', color: 'text-success', bg: 'bg-success-alpha' },
  cancelled: { label: 'Cancelled', color: 'text-danger', bg: 'bg-danger-alpha' },
};

export default function OrdersPage() {
  const navigate = useNavigate();
  const { orders, updateOrderStatus } = useStore();
  const [activeTab, setActiveTab] = useState('active');

  const activeOrders = orders.filter(o => !['delivered', 'cancelled'].includes(o.status));
  const completedOrders = orders.filter(o => o.status === 'delivered');
  const cancelledOrders = orders.filter(o => o.status === 'cancelled');

  const displayed = activeTab === 'active' ? activeOrders : activeTab === 'completed' ? completedOrders : cancelledOrders;

  const tabs = [
    { id: 'active', label: 'Active', count: activeOrders.length },
    { id: 'completed', label: 'Completed', count: completedOrders.length },
    { id: 'cancelled', label: 'Cancelled', count: cancelledOrders.length },
  ];

  return (
    <div className="h-full overflow-y-auto scrollbar-hide pb-24">
      <div className="p-4 glass-strong sticky top-0 z-30">
        <h1 className="text-lg font-bold text-center max-w-lg mx-auto">My Orders</h1>
        <div className="tab-group mt-3 max-w-lg mx-auto">
          {tabs.map(tab => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)}
              className={`tab-btn ${activeTab === tab.id ? 'active' : ''}`}>
              {tab.label}
              {tab.count > 0 && <span className="count">{tab.count}</span>}
            </button>
          ))}
        </div>
      </div>

      <div className="p-4 max-w-lg mx-auto vertical-list">
        {displayed.length === 0 && (
          <div className="empty-state">
            <div className="icon-wrapper">
              <div className={`icon-circle ${
                activeTab === 'active' ? 'orange' : activeTab === 'completed' ? 'green' : 'red'
              }`}>
                {activeTab === 'active' ? (
                  <Clock size={48} className="text-primary" />
                ) : activeTab === 'completed' ? (
                  <CheckCircle size={48} className="text-success" />
                ) : (
                  <XCircle size={48} className="text-danger" />
                )}
              </div>
              <div className="icon-badge">
                <Package size={16} className="text-secondary" />
              </div>
            </div>
            <h3>
              {activeTab === 'active' ? 'No active orders' : activeTab === 'completed' ? 'No completed orders' : 'No cancelled orders'}
            </h3>
            <p>
              {activeTab === 'active'
                ? "You don't have any orders in progress. Ready to satisfy your cravings?"
                : activeTab === 'completed'
                ? "Your completed orders will appear here. Start ordering to build your history!"
                : "Good news — you have no cancelled orders!"}
            </p>
            {activeTab === 'active' && (
              <button onClick={() => navigate('/')} className="btn btn-primary rounded-xl max-w-xs">
                Order Now <ArrowRight size={16} />
              </button>
            )}
            {activeTab === 'completed' && (
              <button onClick={() => navigate('/')} className="btn btn-primary rounded-xl max-w-xs">
                Browse Restaurants <ArrowRight size={16} />
              </button>
            )}
            {activeTab === 'cancelled' && (
              <div className="card p-5 max-w-xs">
                <p className="text-secondary text-sm">That's a good sign! Keep ordering.</p>
                <button onClick={() => navigate('/')} className="mt-3 text-primary text-xs font-semibold">
                  Browse menu <ArrowRight size={12} className="inline" />
                </button>
              </div>
            )}
          </div>
        )}

        {displayed.map(order => {
          const status = statusConfig[order.status] || statusConfig.preparing;
          return (
            <div key={order.id} className="card p-4 animate-slide-up">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <p className="text-xs text-muted">Order #{String(order.id).slice(-4)}</p>
                  <p className="text-xs text-muted mt-0.5">{new Date(order.createdAt).toLocaleString()}</p>
                </div>
                <span className={`px-2.5 py-1 rounded-lg text-[10px] font-semibold ${status.color} ${status.bg}`}>
                  {status.label}
                </span>
              </div>

              <div className="flex items-center gap-3 mb-3">
                <div className="flex -space-x-2">
                  {order.items.slice(0, 3).map((item, i) => (
                    <img key={i} src={item.food.image} alt="" className="w-8 h-8 rounded-lg border-2 border-card object-cover" />
                  ))}
                </div>
                <p className="text-xs text-secondary">{order.items.length} items</p>
              </div>

              <div className="flex items-center justify-between">
                <span className="font-bold text-primary text-sm">{order.total.toLocaleString()} so'm</span>
                <div className="flex gap-2">
                  {activeTab === 'active' && (
                    <button onClick={() => navigate('/tracking')} className="px-3 py-1.5 rounded-xl bg-primary-alpha text-primary text-xs font-semibold active:scale-95 transition-transform">
                      Track
                    </button>
                  )}
                  {activeTab === 'completed' && (
                    <>
                      <button className="btn-icon"><Star size={14} /></button>
                      <button className="btn-icon"><Download size={14} /></button>
                    </>
                  )}
                  <button className="btn-icon">
                    <RotateCcw size={14} />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
