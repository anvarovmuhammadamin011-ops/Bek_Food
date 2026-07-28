import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Phone, Navigation2, Bike, Check, Clock, Settings } from 'lucide-react';
import useStore from '../../store/useStore';
import { Card, CardContent } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Avatar } from '../../components/ui/Avatar';
import { cn } from '../../utils/cn';

const statusSteps = [
  'Buyurtma qabul qilindi',
  'Filialga keldim',
  'Buyurtmani oldim',
  "Yo'ldaman",
  'Mijozga yetib keldim',
  'Yetkazildi',
];

const quickMessages = [
  '5 daqiqada yetib boraman',
  'Uy oldidaman',
  'Kechirasiz, biroz kechikaman',
  'Buyurtma tayyor, chiqyapman',
  'Necha daqiqada yetib boraman',
];

const CourierOrders = () => {
  const navigate = useNavigate();
  const { orders, user, courierAcceptOrder, courierDelivered, updateOrderStatus } = useStore();

  const [activeTab, setActiveTab] = useState('all');
  const [showModal, setShowModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showQuickMessage, setShowQuickMessage] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);

  const courierOrders = useMemo(() => {
    return orders.filter(o => o.courierId === user?.id || o.courierId === user?.uid || o.status === 'ready');
  }, [orders, user]);

  const filteredOrders = useMemo(() => {
    if (activeTab === 'all') return courierOrders;
    if (activeTab === 'new') return courierOrders.filter(o => o.status === 'ready');
    if (activeTab === 'onTheWay') return courierOrders.filter(o => o.status === 'onTheWay');
    if (activeTab === 'delivered') return courierOrders.filter(o => o.status === 'delivered');
    return courierOrders;
  }, [courierOrders, activeTab]);

  const getTimeSince = (timestamp) => {
    if (!timestamp) return '';
    const diff = Date.now() - new Date(timestamp).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return 'Hozirgina';
    if (mins < 60) return `${mins} daqiqa`;
    return `${Math.floor(mins / 60)} soat ${mins % 60} daq`;
  };

  const handleAcceptOrder = (order) => {
    setSelectedOrder(order);
    setCurrentStep(1);
    setShowModal(true);
  };

  const handleStepAdvance = (stepIndex) => {
    if (!selectedOrder) return;
    setCurrentStep(stepIndex);
    if (stepIndex === 4) {
      if (courierDelivered) courierDelivered(selectedOrder.id);
      if (updateOrderStatus) updateOrderStatus(selectedOrder.id, 'delivered');
      setTimeout(() => { setShowModal(false); setSelectedOrder(null); setCurrentStep(0); }, 1000);
    } else if (stepIndex === 1) {
      if (courierAcceptOrder) courierAcceptOrder(selectedOrder.id);
      if (updateOrderStatus) updateOrderStatus(selectedOrder.id, 'onTheWay');
    }
  };

  const handleDelivered = (order) => {
    if (courierDelivered) courierDelivered(order.id);
    if (updateOrderStatus) updateOrderStatus(order.id, 'delivered');
  };

  const openMaps = (address) => {
    const q = encodeURIComponent(address || '');
    window.open(`https://www.google.com/maps/search/?api=1&query=${q}`, '_blank');
  };

  const callCustomer = (phone) => { if (phone) window.open(`tel:${phone}`, '_self'); };
  const sendTelegram = (phone) => { if (phone) window.open(`https://t.me/+${phone.replace(/\D/g, '')}`, '_blank'); };
  const sendSMS = (phone) => { if (phone) window.open(`sms:${phone}`, '_self'); };

  const tabs = [
    { key: 'all', label: 'Barchasi', count: courierOrders.length },
    { key: 'new', label: 'Yangi', count: courierOrders.filter(o => o.status === 'ready').length },
    { key: 'onTheWay', label: "Yo'lda", count: courierOrders.filter(o => o.status === 'onTheWay').length },
    { key: 'delivered', label: 'Yetkazilgan', count: courierOrders.filter(o => o.status === 'delivered').length },
  ];

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', paddingBottom: 90 }}>
      <div style={{
        position: 'sticky', top: 0, zIndex: 50,
        background: 'rgba(255,255,255,0.85)', backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)', borderBottom: '1px solid var(--border)',
        padding: '12px 16px',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <motion.button whileTap={{ scale: 0.9 }}
              onClick={() => navigate(-1)}
              style={{ width: 36, height: 36, borderRadius: 10, background: 'var(--surface)', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
            >
              <span style={{ color: 'var(--text)', fontSize: 16, fontWeight: 700, lineHeight: 1 }}>{"<"}</span>
            </motion.button>
            <h1 style={{ fontSize: 20, fontWeight: 700, margin: 0, color: 'var(--text)' }}>Buyurtmalar</h1>
          </div>
          <Badge variant="primary" size="sm">{courierOrders.length}</Badge>
        </div>

        <div style={{ display: 'flex', gap: 6, overflowX: 'auto', paddingBottom: 4, scrollbarWidth: 'none' }}>
          {tabs.map((tab) => (
            <motion.button
              key={tab.key}
              whileTap={{ scale: 0.95 }}
              onClick={() => setActiveTab(tab.key)}
              style={{
                flexShrink: 0, padding: '7px 14px', borderRadius: 20, border: 'none', cursor: 'pointer', fontSize: 13, fontWeight: 600,
                display: 'flex', alignItems: 'center', gap: 6,
                background: activeTab === tab.key ? 'var(--primary)' : 'var(--surface)',
                color: activeTab === tab.key ? '#fff' : 'var(--text-muted)',
                boxShadow: activeTab === tab.key ? '0 2px 8px rgba(249,115,22,0.2)' : 'var(--shadow-sm)',
              }}
            >
              {tab.label}
              <span style={{
                background: activeTab === tab.key ? 'rgba(255,255,255,0.25)' : 'var(--surface-active)',
                color: activeTab === tab.key ? '#fff' : 'var(--text-muted)',
                padding: '1px 7px', borderRadius: 10, fontSize: 11, fontWeight: 700,
              }}>
                {tab.count}
              </span>
            </motion.button>
          ))}
        </div>
      </div>

      <div style={{ padding: '12px 16px', display: 'flex', flexDirection: 'column', gap: 12 }}>
        {filteredOrders.length === 0 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ textAlign: 'center', padding: '60px 20px' }}>
            <Bike size={48} style={{ color: 'var(--border-strong)', marginBottom: 12, opacity: 0.4 }} />
            <p style={{ color: 'var(--text-muted)', fontSize: 15 }}>Buyurtmalar topilmadi</p>
          </motion.div>
        )}

        <AnimatePresence>
          {filteredOrders.map((order) => {
            const itemsCount = order.items?.length || order.itemCount || 0;
            const totalPrice = order.totalPrice || order.total || 0;
            const items = order.items || [];
            const isDelivered = order.status === 'delivered';
            const isOnWay = order.status === 'onTheWay';
            const isReady = order.status === 'ready';

            return (
              <motion.div key={order.id} layout initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95 }} transition={{ type: 'spring', stiffness: 300, damping: 25 }}>
                <Card variant={isDelivered ? 'default' : 'elevated'} padding="md" className={cn(isDelivered && 'opacity-60')}>
                  <CardContent className="pt-0 space-y-3">
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <span style={{ fontWeight: 700, fontSize: 15, color: 'var(--text)' }}>#{order.id || order.orderId || '1001'}</span>
                        {order.priority === 'high' || order.urgency === 'high' ? (
                          <Badge variant="danger" size="xs">Juda kechikayotgan</Badge>
                        ) : order.priority === 'normal' || order.urgency === 'normal' ? (
                          <Badge variant="warning" size="xs">Oddiy</Badge>
                        ) : (
                          <Badge variant="success" size="xs">Yangi</Badge>
                        )}
                      </div>
                      <Badge variant={isDelivered ? 'default' : isOnWay ? 'warning' : 'success'} size="sm" dot>
                        {isDelivered ? 'Yetkazildi' : isOnWay ? "Yo'lda" : 'Tayyor'}
                      </Badge>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <Avatar name={order.customerName || order.name || 'Mijoz'} size="sm" />
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <p style={{ color: 'var(--text)', fontSize: 14, fontWeight: 600, margin: 0 }}>
                          {order.customerName || order.name || 'Mijoz'}
                        </p>
                        {order.phone && <p style={{ color: 'var(--text-muted)', fontSize: 12, margin: '1px 0 0' }}>{order.phone}</p>}
                      </div>
                      {order.phone && (
                        <motion.button whileTap={{ scale: 0.9 }}
                          onClick={() => callCustomer(order.phone)}
                          style={{ width: 34, height: 34, borderRadius: 10, background: 'rgba(34,197,94,0.08)', border: '1px solid rgba(34,197,94,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', flexShrink: 0 }}
                        >
                          <Phone size={14} style={{ color: 'var(--success)' }} />
                        </motion.button>
                      )}
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '10px 12px', background: 'var(--bg)', borderRadius: 10, border: '1px solid var(--border)' }}>
                      <MapPin size={14} style={{ color: 'var(--primary)', flexShrink: 0 }} />
                      <span style={{ fontSize: 13, color: 'var(--text-secondary)', flex: 1, lineHeight: 1.4 }}>
                        {order.address || order.deliveryAddress || "Manzil ko'rsatilmagan"}
                      </span>
                      <motion.button whileTap={{ scale: 0.9 }}
                        onClick={() => openMaps(order.address)}
                        style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--primary)', padding: 2, flexShrink: 0 }}
                      >
                        <Navigation2 size={16} />
                      </motion.button>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <span style={{ fontSize: 13, color: 'var(--text-muted)' }}>{itemsCount} ta mahsulot</span>
                      <span style={{ fontSize: 15, fontWeight: 700, color: 'var(--text)' }}>{totalPrice.toLocaleString()} so'm</span>
                    </div>

                    {items.length > 0 && (
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                        {items.slice(0, 3).map((item, i) => (
                          <span key={i} style={{ padding: '2px 8px', borderRadius: 6, background: 'var(--surface-active)', color: 'var(--text-secondary)', fontSize: 11 }}>
                            {item.name || item.title || 'Mahsulot'} x{item.quantity || 1}
                          </span>
                        ))}
                        {items.length > 3 && (
                          <span style={{ padding: '2px 8px', borderRadius: 6, background: 'var(--surface-active)', color: 'var(--text-muted)', fontSize: 11 }}>
                            +{items.length - 3} ta
                          </span>
                        )}
                      </div>
                    )}

                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <Badge variant={(order.paymentMethod === 'cash' || order.payment === 'cash') ? 'success' : 'info'} size="xs">
                        {(order.paymentMethod === 'cash' || order.payment === 'cash') ? 'Naqd' : 'Karta'}
                      </Badge>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                        <Clock size={12} style={{ color: 'var(--text-muted)' }} />
                        <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>{getTimeSince(order.createdAt || order.timestamp)}</span>
                      </div>
                    </div>

                    {(order.note || order.notes || order.comment) && (
                      <div style={{ padding: '10px 12px', background: 'var(--bg)', borderRadius: 8, borderLeft: '3px solid var(--warning)' }}>
                        <span style={{ fontSize: 12, color: 'var(--text-secondary)', fontStyle: 'italic' }}>
                          {order.note || order.notes || order.comment}
                        </span>
                      </div>
                    )}

                    {isDelivered && order.deliveredAt && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 12px', background: 'rgba(34,197,94,0.06)', borderRadius: 8, border: '1px solid rgba(34,197,94,0.12)' }}>
                        <Check size={14} style={{ color: 'var(--success)' }} />
                        <span style={{ fontSize: 12, color: 'var(--success)' }}>Yetkazildi - {getTimeSince(order.deliveredAt)} oldin</span>
                      </div>
                    )}

                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      {isReady && (
                        <motion.button whileTap={{ scale: 0.95 }}
                          onClick={() => handleAcceptOrder(order)}
                          style={{
                            flex: 1, padding: '12px 16px', borderRadius: 12,
                            background: 'var(--success)', border: 'none', color: '#fff', fontWeight: 700, fontSize: 14,
                            cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                            boxShadow: '0 2px 8px rgba(34,197,94,0.25)',
                          }}
                        >
                          <Check size={18} />
                          Olish
                        </motion.button>
                      )}

                      {isOnWay && (
                        <>
                          <motion.button whileTap={{ scale: 0.95 }}
                            onClick={() => openMaps(order.address)}
                            style={{
                              flex: 1, padding: '12px 16px', borderRadius: 12,
                              background: 'var(--surface)', border: '1px solid var(--border)',
                              color: 'var(--primary)', fontWeight: 700, fontSize: 14,
                              cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                            }}
                          >
                            <Navigation2 size={16} />
                            Navigatsiya
                          </motion.button>
                          <motion.button whileTap={{ scale: 0.95 }}
                            onClick={() => handleDelivered(order)}
                            style={{
                              flex: 1, padding: '12px 16px', borderRadius: 12,
                              background: 'var(--primary)', border: 'none', color: '#fff', fontWeight: 700, fontSize: 14,
                              cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                              boxShadow: '0 2px 8px rgba(249,115,22,0.25)',
                            }}
                          >
                            <Check size={16} />
                            Yetkazdim
                          </motion.button>
                        </>
                      )}

                      {isDelivered && (
                        <div style={{ flex: 1, padding: '12px 16px', borderRadius: 12, background: 'var(--surface)', border: '1px solid var(--border)', color: 'var(--text-muted)', fontWeight: 600, fontSize: 13, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
                          <Check size={16} />
                          Yetkazildi
                        </div>
                      )}

                      {!isDelivered && order.phone && (
                        <>
                          <motion.button whileTap={{ scale: 0.9 }}
                            onClick={() => sendTelegram(order.phone)}
                            style={{ width: 44, height: 44, borderRadius: 12, background: 'rgba(59,130,246,0.06)', border: '1px solid rgba(59,130,246,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', flexShrink: 0 }}
                          >
                            <Phone size={16} style={{ color: '#3b82f6' }} />
                          </motion.button>
                          <motion.button whileTap={{ scale: 0.9 }}
                            onClick={() => sendSMS(order.phone)}
                            style={{ width: 44, height: 44, borderRadius: 12, background: 'rgba(249,115,22,0.06)', border: '1px solid rgba(249,115,22,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', flexShrink: 0 }}
                          >
                            <Clock size={16} style={{ color: 'var(--primary)' }} />
                          </motion.button>
                        </>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      <AnimatePresence>
        {showModal && selectedOrder && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            style={{ position: 'fixed', inset: 0, zIndex: 1000, background: 'rgba(0,0,0,0.3)', display: 'flex', alignItems: 'flex-end', justifyContent: 'center', backdropFilter: 'blur(8px)', WebkitBackdropFilter: 'blur(8px)' }}
            onClick={(e) => { if (e.target === e.currentTarget) { setShowModal(false); setSelectedOrder(null); setCurrentStep(0); } }}
          >
            <motion.div
              initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              style={{ background: 'var(--surface)', borderRadius: '24px 24px 0 0', width: '100%', maxWidth: 480, padding: '24px 20px 40px', border: '1px solid var(--border)', borderBottom: 'none', boxShadow: 'var(--shadow-lg)' }}
            >
              <div style={{ width: 40, height: 4, background: 'var(--border-strong)', borderRadius: 2, margin: '0 auto 20px' }} />

              <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 6, textAlign: 'center', color: 'var(--text)' }}>
                Buyurtma #{selectedOrder.id || selectedOrder.orderId}
              </h2>
              <p style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 20, textAlign: 'center' }}>
                Yetkazish jarayoni
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {statusSteps.map((step, idx) => {
                  const isCompleted = idx < currentStep;
                  const isCurrent = idx === currentStep;
                  const isFuture = idx > currentStep;
                  return (
                    <motion.button
                      key={idx}
                      whileTap={isFuture ? {} : { scale: 0.98 }}
                      onClick={() => { if (idx <= currentStep) handleStepAdvance(idx + 1); }}
                      disabled={isFuture}
                      style={{
                        width: '100%', padding: '14px 16px', borderRadius: 12, border: 'none',
                        cursor: isFuture ? 'not-allowed' : 'pointer',
                        display: 'flex', alignItems: 'center', gap: 12, opacity: isFuture ? 0.35 : 1, textAlign: 'left',
                        background: isCompleted ? 'rgba(34,197,94,0.08)' : isCurrent ? 'var(--primary-light)' : 'var(--bg)',
                      }}
                    >
                      <div style={{
                        width: 32, height: 32, borderRadius: 10,
                        background: isCompleted ? 'var(--success)' : isCurrent ? 'var(--primary)' : 'var(--surface-active)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, color: '#fff', fontSize: 13, fontWeight: 700,
                      }}>
                        {isCompleted ? <Check size={16} /> : idx + 1}
                      </div>
                      <div>
                        <div style={{ fontSize: 13, fontWeight: isCurrent ? 700 : 500, color: isCompleted ? 'var(--success)' : isCurrent ? 'var(--text)' : 'var(--text-muted)' }}>
                          {step}
                        </div>
                        {isCurrent && <div style={{ fontSize: 11, color: 'var(--primary)', marginTop: 2 }}>Bosing - Keyingi qadam</div>}
                      </div>
                    </motion.button>
                  );
                })}
              </div>

              {currentStep >= 4 && (
                <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} style={{ marginTop: 16, padding: 12, borderRadius: 12, background: 'rgba(34,197,94,0.06)', border: '1px solid rgba(34,197,94,0.12)', textAlign: 'center' }}>
                  <Check size={24} style={{ color: 'var(--success)', marginBottom: 4 }} />
                  <p style={{ color: 'var(--success)', fontWeight: 600, fontSize: 14 }}>Buyurtma muvaffaqiyatli yetkazildi!</p>
                </motion.div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showQuickMessage && selectedOrder && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            style={{ position: 'fixed', inset: 0, zIndex: 1000, background: 'rgba(0,0,0,0.3)', display: 'flex', alignItems: 'flex-end', justifyContent: 'center', backdropFilter: 'blur(4px)', WebkitBackdropFilter: 'blur(4px)' }}
            onClick={(e) => { if (e.target === e.currentTarget) setShowQuickMessage(false); }}
          >
            <motion.div
              initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              style={{ background: 'var(--surface)', borderRadius: '20px 20px 0 0', width: '100%', maxWidth: 480, padding: '20px 16px 32px', border: '1px solid var(--border)', borderBottom: 'none', boxShadow: 'var(--shadow-lg)' }}
            >
              <div style={{ width: 40, height: 4, background: 'var(--border-strong)', borderRadius: 2, margin: '0 auto 16px' }} />
              <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 12, color: 'var(--text)' }}>Tezkor xabar</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {quickMessages.map((msg, i) => (
                  <motion.button
                    key={i}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setShowQuickMessage(false)}
                    style={{
                      width: '100%', padding: '12px 16px', borderRadius: 12,
                      background: 'var(--bg)', border: '1px solid var(--border)',
                      color: 'var(--text-secondary)', fontSize: 14, cursor: 'pointer', textAlign: 'left',
                      display: 'flex', alignItems: 'center', gap: 10,
                    }}
                  >
                    <Phone size={14} style={{ color: 'var(--primary)' }} />
                    {msg}
                  </motion.button>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {filteredOrders.some(o => o.status === 'onTheWay') && !showQuickMessage && !showModal && (
        <div style={{
          position: 'fixed', bottom: 90, left: 16, right: 16, zIndex: 50,
          background: 'rgba(255,255,255,0.9)', backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)',
          borderRadius: 16, padding: '12px 16px', border: '1px solid var(--border)', boxShadow: 'var(--shadow-md)',
          display: 'flex', alignItems: 'center', gap: 8, overflowX: 'auto', scrollbarWidth: 'none',
        }}>
          <span style={{ fontSize: 12, color: 'var(--text-muted)', flexShrink: 0, fontWeight: 600 }}>Xabar:</span>
          {quickMessages.slice(0, 3).map((msg, i) => (
            <button key={i} style={{
              flexShrink: 0, padding: '6px 12px', borderRadius: 10, background: 'var(--surface)',
              border: '1px solid var(--border)', color: 'var(--text-secondary)', fontSize: 11,
              cursor: 'pointer', whiteSpace: 'nowrap',
            }}>
              {msg}
            </button>
          ))}
        </div>
      )}

      <div style={{
        position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 100,
        background: 'rgba(255,255,255,0.85)', backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)', borderTop: '1px solid var(--border)',
        paddingBottom: 'env(safe-area-inset-bottom, 0px)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-around', padding: '8px 0', maxWidth: 480, margin: '0 auto' }}>
          {[
            { icon: MapPin, label: 'Bosh sahifa', path: '/courier' },
            { icon: Bike, label: 'Buyurtmalar', path: '/courier/orders' },
            { icon: Settings, label: 'Sozlamalar', path: '/courier/settings' },
          ].map((item) => {
            const isActive = window.location.pathname === item.path;
            return (
              <motion.button
                key={item.path}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate(item.path)}
                style={{
                  display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4,
                  padding: '6px 16px', background: 'none', border: 'none', cursor: 'pointer', position: 'relative',
                }}
              >
                {isActive && (
                  <motion.div layoutId="navIndicator2" style={{
                    position: 'absolute', top: -8, width: 24, height: 3, borderRadius: 2, background: 'var(--primary)',
                  }} />
                )}
                <item.icon size={20} style={{ color: isActive ? 'var(--primary)' : 'var(--text-muted)' }} />
                <span style={{ fontSize: 10, fontWeight: isActive ? 700 : 500, color: isActive ? 'var(--primary)' : 'var(--text-muted)' }}>
                  {item.label}
                </span>
              </motion.button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default CourierOrders;
