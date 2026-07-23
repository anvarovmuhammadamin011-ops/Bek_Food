import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Clock, CheckCircle, XCircle, RotateCcw, Download, Star } from 'lucide-react';
import useStore from '../store/useStore';

const statusConfig = {
  preparing: { label: 'Preparing', color: 'text-warning', bg: 'bg-warning/15' },
  cooking: { label: 'Cooking', color: 'text-accent-orange', bg: 'bg-accent-orange/15' },
  pickedUp: { label: 'Picked Up', color: 'text-accent-orange', bg: 'bg-accent-orange/15' },
  onTheWay: { label: 'On the Way', color: 'text-accent-orange', bg: 'bg-accent-orange/15' },
  delivered: { label: 'Delivered', color: 'text-success', bg: 'bg-success/15' },
  cancelled: { label: 'Cancelled', color: 'text-accent-red', bg: 'bg-accent-red/15' },
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
        <div className="flex gap-2 mt-3 max-w-lg mx-auto">
          {tabs.map(tab => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)}
              className={`flex-1 py-2.5 rounded-xl text-xs font-semibold transition-all flex items-center justify-center gap-1.5 ${activeTab === tab.id ? 'bg-accent-orange text-white' : 'bg-bg-card text-text-secondary border border-border'}`}>
              {tab.label}
              {tab.count > 0 && <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${activeTab === tab.id ? 'bg-white/20' : 'bg-bg-primary'}`}>{tab.count}</span>}
            </button>
          ))}
        </div>
      </div>

      <div className="p-4 max-w-lg mx-auto space-y-3">
        {displayed.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="w-16 h-16 rounded-full bg-bg-card border border-border flex items-center justify-center mb-4">
              {activeTab === 'active' ? <Clock size={24} className="text-text-secondary" /> : activeTab === 'completed' ? <CheckCircle size={24} className="text-text-secondary" /> : <XCircle size={24} className="text-text-secondary" />}
            </div>
            <h3 className="font-bold mb-1">No {activeTab} orders</h3>
            <p className="text-text-secondary text-sm">{activeTab === 'active' ? 'Your active orders will appear here' : 'No orders in this category yet'}</p>
          </div>
        )}

        {displayed.map(order => {
          const status = statusConfig[order.status] || statusConfig.preparing;
          return (
            <div key={order.id} className="bg-bg-card rounded-2xl p-4 border border-border animate-slide-up">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <p className="text-xs text-text-muted">Order #{String(order.id).slice(-4)}</p>
                  <p className="text-xs text-text-muted mt-0.5">{new Date(order.createdAt).toLocaleString()}</p>
                </div>
                <span className={`px-2.5 py-1 rounded-lg text-[10px] font-semibold ${status.color} ${status.bg}`}>
                  {status.label}
                </span>
              </div>

              <div className="flex items-center gap-3 mb-3">
                <div className="flex -space-x-2">
                  {order.items.slice(0, 3).map((item, i) => (
                    <img key={i} src={item.food.image} alt="" className="w-8 h-8 rounded-lg border-2 border-bg-card object-cover" />
                  ))}
                </div>
                <p className="text-xs text-text-secondary">{order.items.length} items</p>
              </div>

              <div className="flex items-center justify-between">
                <span className="font-bold text-accent-orange text-sm">{order.total.toLocaleString()} so'm</span>
                <div className="flex gap-2">
                  {activeTab === 'active' && (
                    <button onClick={() => navigate('/tracking')} className="px-3 py-1.5 rounded-xl bg-accent-orange/15 text-accent-orange text-xs font-semibold active:scale-95 transition-transform">
                      Track
                    </button>
                  )}
                  {activeTab === 'completed' && (
                    <>
                      <button className="p-2 rounded-xl bg-bg-primary text-text-secondary active:scale-95 transition-transform">
                        <Star size={14} />
                      </button>
                      <button className="p-2 rounded-xl bg-bg-primary text-text-secondary active:scale-95 transition-transform">
                        <Download size={14} />
                      </button>
                    </>
                  )}
                  <button onClick={() => { if (order.status === 'delivered' || order.status === 'cancelled') { /* reorder */ } }}
                    className="p-2 rounded-xl bg-bg-primary text-text-secondary active:scale-95 transition-transform">
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
