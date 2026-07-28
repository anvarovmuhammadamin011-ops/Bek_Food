import React, { useState, useMemo } from 'react';
import useStore from '../../store/useStore';
import { useNavigate } from 'react-router-dom';
import {
  ChevronLeft,
  Phone,
  MessageCircle,
  Navigation,
  MapPin,
  Clock,
  CheckCircle2,
  Package,
  Send,
  Camera,
  LayoutDashboard,
  Settings,
  ShoppingCart,
} from 'lucide-react';

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
    return orders.filter(
      (o) =>
        o.courierId === user?.id ||
        o.courierId === user?.uid ||
        o.status === 'ready'
    );
  }, [orders, user]);

  const filteredOrders = useMemo(() => {
    if (activeTab === 'all') return courierOrders;
    if (activeTab === 'new') return courierOrders.filter((o) => o.status === 'ready');
    if (activeTab === 'onTheWay') return courierOrders.filter((o) => o.status === 'onTheWay');
    if (activeTab === 'delivered') return courierOrders.filter((o) => o.status === 'delivered');
    return courierOrders;
  }, [courierOrders, activeTab]);

  const getTimeSince = (timestamp) => {
    if (!timestamp) return '';
    const now = Date.now();
    const diff = now - new Date(timestamp).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return 'Hozirgina';
    if (mins < 60) return `${mins} daqiqa`;
    const hrs = Math.floor(mins / 60);
    return `${hrs} soat ${mins % 60} daq`;
  };

  const getPriorityBadge = (order) => {
    if (order.priority === 'high' || order.urgency === 'high') {
      return { text: 'Juda kechikayotgan', bg: 'rgba(239,68,68,0.08)', border: 'rgba(239,68,68,0.2)', color: 'var(--danger)' };
    }
    if (order.priority === 'normal' || order.urgency === 'normal') {
      return { text: 'Oddiy', bg: 'rgba(245,158,11,0.08)', border: 'rgba(245,158,11,0.2)', color: 'var(--warning)' };
    }
    return { text: 'Yangi', bg: 'rgba(34,197,94,0.08)', border: 'rgba(34,197,94,0.2)', color: 'var(--success)' };
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case 'ready':
        return { text: 'Tayyor - Olish kerak', color: 'var(--success)', bg: 'rgba(34,197,94,0.08)' };
      case 'onTheWay':
        return { text: "Yo'lda", color: 'var(--warning)', bg: 'rgba(245,158,11,0.08)' };
      case 'delivered':
        return { text: 'Yetkazildi', color: 'var(--text-muted)', bg: 'var(--surface-active)' };
      default:
        return { text: status, color: 'var(--text-muted)', bg: 'var(--surface-active)' };
    }
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
      if (courierDelivered) {
        courierDelivered(selectedOrder.id);
      }
      if (updateOrderStatus) {
        updateOrderStatus(selectedOrder.id, 'delivered');
      }
      setTimeout(() => {
        setShowModal(false);
        setSelectedOrder(null);
        setCurrentStep(0);
      }, 1000);
    } else if (stepIndex === 1) {
      if (courierAcceptOrder) {
        courierAcceptOrder(selectedOrder.id);
      }
      if (updateOrderStatus) {
        updateOrderStatus(selectedOrder.id, 'onTheWay');
      }
    }
  };

  const handleDelivered = (order) => {
    if (courierDelivered) {
      courierDelivered(order.id);
    }
    if (updateOrderStatus) {
      updateOrderStatus(order.id, 'delivered');
    }
  };

  const openMaps = (address) => {
    const q = encodeURIComponent(address || '');
    window.open(`https://www.google.com/maps/search/?api=1&query=${q}`, '_blank');
  };

  const callCustomer = (phone) => {
    if (phone) window.open(`tel:${phone}`, '_self');
  };

  const sendTelegram = (phone) => {
    if (phone) {
      const cleaned = phone.replace(/\D/g, '');
      window.open(`https://t.me/+${cleaned}`, '_blank');
    }
  };

  const sendSMS = (phone) => {
    if (phone) window.open(`sms:${phone}`, '_self');
  };

  const tabs = [
    { key: 'all', label: 'Barchasi', count: courierOrders.length },
    { key: 'new', label: 'Yangi', count: courierOrders.filter((o) => o.status === 'ready').length },
    { key: 'onTheWay', label: "Yo'lda", count: courierOrders.filter((o) => o.status === 'onTheWay').length },
    { key: 'delivered', label: 'Yetkazilgan', count: courierOrders.filter((o) => o.status === 'delivered').length },
  ];

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', paddingBottom: 90 }}>
      <div style={{
        position: 'sticky',
        top: 0,
        zIndex: 100,
        background: 'rgba(255,255,255,0.85)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        borderBottom: '1px solid var(--border)',
        padding: '16px',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <button
              onClick={() => navigate(-1)}
              style={{
                width: 40,
                height: 40,
                borderRadius: 12,
                background: 'var(--surface)',
                border: '1px solid var(--border)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                boxShadow: 'var(--shadow-sm)',
              }}
            >
              <ChevronLeft size={20} style={{ color: 'var(--text)' }} />
            </button>
            <h1 style={{ fontSize: 20, fontWeight: 700, margin: 0, color: 'var(--text)' }}>Buyurtmalar</h1>
          </div>
          <span style={{
            background: 'var(--primary)',
            color: '#fff',
            padding: '4px 12px',
            borderRadius: 20,
            fontSize: 13,
            fontWeight: 600,
          }}>
            {courierOrders.length}
          </span>
        </div>

        <div style={{
          display: 'flex',
          gap: 8,
          overflowX: 'auto',
          paddingBottom: 4,
          scrollbarWidth: 'none',
        }}>
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              style={{
                flexShrink: 0,
                padding: '8px 16px',
                borderRadius: 20,
                border: 'none',
                cursor: 'pointer',
                fontSize: 13,
                fontWeight: 600,
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                background: activeTab === tab.key ? 'var(--primary)' : 'var(--surface)',
                color: activeTab === tab.key ? '#fff' : 'var(--text-muted)',
                boxShadow: activeTab === tab.key ? '0 2px 8px rgba(249,115,22,0.2)' : 'var(--shadow-sm)',
              }}
            >
              {tab.label}
              <span style={{
                background: activeTab === tab.key ? 'rgba(255,255,255,0.25)' : 'var(--surface-active)',
                color: activeTab === tab.key ? '#fff' : 'var(--text-muted)',
                padding: '1px 7px',
                borderRadius: 10,
                fontSize: 11,
                fontWeight: 700,
              }}>
                {tab.count}
              </span>
            </button>
          ))}
        </div>
      </div>

      <div style={{ padding: '12px 16px' }} className="space-y-3">
        {filteredOrders.length === 0 && (
          <div style={{
            textAlign: 'center',
            padding: '60px 20px',
            background: 'var(--surface)',
            borderRadius: 'var(--radius)',
            border: '1px solid var(--border)',
            boxShadow: 'var(--shadow-sm)',
          }}>
            <Package size={48} style={{ color: 'var(--border-strong)', marginBottom: 12 }} />
            <p style={{ color: 'var(--text-muted)', fontSize: 15 }}>Buyurtmalar topilmadi</p>
          </div>
        )}

        {filteredOrders.map((order, idx) => {
          const priority = getPriorityBadge(order);
          const statusInfo = getStatusLabel(order.status);
          const itemsCount = order.items?.length || order.itemCount || 0;
          const totalPrice = order.totalPrice || order.total || 0;
          const items = order.items || [];

          return (
            <div
              key={order.id}
              style={{
                background: 'var(--surface)',
                borderRadius: 'var(--radius)',
                border: `1px solid ${order.status === 'delivered' ? 'var(--border)' : 'var(--border-strong)'}`,
                padding: 16,
                opacity: order.status === 'delivered' ? 0.65 : 1,
                boxShadow: 'var(--shadow-sm)',
                marginBottom: 10,
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <span style={{ fontWeight: 700, fontSize: 16, color: 'var(--text)' }}>
                    #{order.id || order.orderId || '1001'}
                  </span>
                  <span style={{
                    padding: '3px 8px',
                    borderRadius: 8,
                    fontSize: 11,
                    fontWeight: 600,
                    background: priority.bg,
                    border: `1px solid ${priority.border}`,
                    color: priority.color,
                  }}>
                    {priority.text}
                  </span>
                </div>
                <span style={{
                  padding: '4px 10px',
                  borderRadius: 8,
                  fontSize: 11,
                  fontWeight: 600,
                  background: statusInfo.bg,
                  color: statusInfo.color,
                }}>
                  {statusInfo.text}
                </span>
              </div>

              <div style={{ marginBottom: 10 }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 }}>
                  <span style={{ fontWeight: 600, fontSize: 14, color: 'var(--text)' }}>
                    {order.customerName || order.name || 'Mijoz'}
                  </span>
                  {order.phone && (
                    <button
                      onClick={() => callCustomer(order.phone)}
                      style={{
                        width: 32,
                        height: 32,
                        borderRadius: 10,
                        background: 'rgba(34,197,94,0.08)',
                        border: '1px solid rgba(34,197,94,0.15)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer',
                      }}
                    >
                      <Phone size={14} style={{ color: 'var(--success)' }} />
                    </button>
                  )}
                </div>
                {order.phone && (
                  <span style={{ fontSize: 13, color: 'var(--text-muted)' }}>{order.phone}</span>
                )}
              </div>

              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                padding: '10px 12px',
                background: 'var(--bg)',
                borderRadius: 10,
                marginBottom: 10,
                border: '1px solid var(--border)',
              }}>
                <MapPin size={14} style={{ color: 'var(--primary)', flexShrink: 0 }} />
                <span style={{ fontSize: 13, color: 'var(--text-secondary)', flex: 1, lineHeight: 1.4 }}>
                  {order.address || order.deliveryAddress || "Manzil ko'rsatilmagan"}
                </span>
                <button
                  onClick={() => openMaps(order.address)}
                  style={{
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    color: 'var(--primary)',
                    padding: 2,
                    flexShrink: 0,
                  }}
                >
                  <Navigation size={16} />
                </button>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10, padding: '6px 0' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <Package size={14} style={{ color: 'var(--text-muted)' }} />
                  <span style={{ fontSize: 13, color: 'var(--text-muted)' }}>
                    {itemsCount} ta mahsulot
                  </span>
                </div>
                <span style={{ fontSize: 14, fontWeight: 700, color: 'var(--text)' }}>
                  {totalPrice.toLocaleString()} so'm
                </span>
              </div>

              {items.length > 0 && (
                <div style={{ marginBottom: 10 }}>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                    {items.slice(0, 3).map((item, i) => (
                      <span
                        key={i}
                        style={{
                          padding: '2px 8px',
                          borderRadius: 6,
                          background: 'var(--surface-active)',
                          color: 'var(--text-secondary)',
                          fontSize: 11,
                        }}
                      >
                        {item.name || item.title || 'Mahsulot'} x{item.quantity || 1}
                      </span>
                    ))}
                    {items.length > 3 && (
                      <span style={{
                        padding: '2px 8px',
                        borderRadius: 6,
                        background: 'var(--surface-active)',
                        color: 'var(--text-muted)',
                        fontSize: 11,
                      }}>
                        +{items.length - 3} ta
                      </span>
                    )}
                  </div>
                </div>
              )}

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
                <span style={{
                  padding: '3px 8px',
                  borderRadius: 6,
                  fontSize: 11,
                  fontWeight: 600,
                  background: order.paymentMethod === 'cash' || order.payment === 'cash' ? 'rgba(34,197,94,0.08)' : 'rgba(59,130,246,0.08)',
                  color: order.paymentMethod === 'cash' || order.payment === 'cash' ? 'var(--success)' : '#3b82f6',
                }}>
                  {(order.paymentMethod === 'cash' || order.payment === 'cash') ? 'Naqd' : 'Karta'}
                </span>
                <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                  <Clock size={12} style={{ color: 'var(--text-muted)' }} />
                  <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>
                    {getTimeSince(order.createdAt || order.timestamp)}
                  </span>
                </div>
              </div>

              {(order.note || order.notes || order.comment) && (
                <div style={{
                  padding: '10px 12px',
                  background: 'var(--bg)',
                  borderRadius: 8,
                  marginBottom: 10,
                  borderLeft: '3px solid var(--warning)',
                }}>
                  <span style={{ fontSize: 12, color: 'var(--text-secondary)', fontStyle: 'italic' }}>
                    {order.note || order.notes || order.comment}
                  </span>
                </div>
              )}

              {order.status === 'delivered' && order.deliveredAt && (
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                  padding: '8px 12px',
                  background: 'rgba(34,197,94,0.06)',
                  borderRadius: 8,
                  marginBottom: 10,
                  border: '1px solid rgba(34,197,94,0.12)',
                }}>
                  <CheckCircle2 size={14} style={{ color: 'var(--success)' }} />
                  <span style={{ fontSize: 12, color: 'var(--success)' }}>
                    Yetkazildi - {getTimeSince(order.deliveredAt)} oldin
                  </span>
                </div>
              )}

              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 12 }}>
                {order.status === 'ready' && (
                  <button
                    onClick={() => handleAcceptOrder(order)}
                    style={{
                      flex: 1,
                      padding: '12px 16px',
                      borderRadius: 12,
                      background: 'var(--success)',
                      border: 'none',
                      color: '#fff',
                      fontWeight: 700,
                      fontSize: 14,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: 8,
                      boxShadow: '0 2px 8px rgba(34,197,94,0.25)',
                    }}
                  >
                    <CheckCircle2 size={18} />
                    Olish
                  </button>
                )}

                {order.status === 'onTheWay' && (
                  <>
                    <button
                      onClick={() => {
                        setSelectedOrder(order);
                        setShowQuickMessage(true);
                      }}
                      style={{
                        flex: 1,
                        padding: '12px 16px',
                        borderRadius: 12,
                        background: 'var(--surface)',
                        border: '1px solid var(--border)',
                        color: 'var(--primary)',
                        fontWeight: 700,
                        fontSize: 14,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: 8,
                      }}
                    >
                      <Navigation size={16} />
                      Navigatsiya
                    </button>
                    <button
                      onClick={() => handleDelivered(order)}
                      style={{
                        flex: 1,
                        padding: '12px 16px',
                        borderRadius: 12,
                        background: 'var(--primary)',
                        border: 'none',
                        color: '#fff',
                        fontWeight: 700,
                        fontSize: 14,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: 8,
                        boxShadow: '0 2px 8px rgba(249,115,22,0.25)',
                      }}
                    >
                      <CheckCircle2 size={16} />
                      Yetkazdim
                    </button>
                  </>
                )}

                {order.status === 'delivered' && (
                  <button
                    style={{
                      flex: 1,
                      padding: '12px 16px',
                      borderRadius: 12,
                      background: 'var(--surface)',
                      border: '1px solid var(--border)',
                      color: 'var(--text-muted)',
                      fontWeight: 600,
                      fontSize: 13,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: 8,
                    }}
                  >
                    <Camera size={16} />
                    Rasm yuklash
                  </button>
                )}

                {order.status !== 'delivered' && order.phone && (
                  <>
                    <button
                      onClick={() => sendTelegram(order.phone)}
                      style={{
                        width: 44,
                        height: 44,
                        borderRadius: 12,
                        background: 'rgba(59,130,246,0.06)',
                        border: '1px solid rgba(59,130,246,0.12)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer',
                        flexShrink: 0,
                      }}
                    >
                      <MessageCircle size={16} style={{ color: '#3b82f6' }} />
                    </button>
                    <button
                      onClick={() => sendSMS(order.phone)}
                      style={{
                        width: 44,
                        height: 44,
                        borderRadius: 12,
                        background: 'rgba(249,115,22,0.06)',
                        border: '1px solid rgba(249,115,22,0.12)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer',
                        flexShrink: 0,
                      }}
                    >
                      <Send size={16} style={{ color: 'var(--primary)' }} />
                    </button>
                  </>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {showModal && selectedOrder && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 1000,
            background: 'rgba(0,0,0,0.3)',
            display: 'flex',
            alignItems: 'flex-end',
            justifyContent: 'center',
            backdropFilter: 'blur(8px)',
            WebkitBackdropFilter: 'blur(8px)',
          }}
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setShowModal(false);
              setSelectedOrder(null);
              setCurrentStep(0);
            }
          }}
        >
          <div style={{
            background: 'var(--surface)',
            borderRadius: '24px 24px 0 0',
            width: '100%',
            maxWidth: 480,
            padding: '24px 20px 40px 20px',
            border: '1px solid var(--border)',
            borderBottom: 'none',
            boxShadow: 'var(--shadow-lg)',
          }}>
            <div style={{ width: 40, height: 4, background: 'var(--border-strong)', borderRadius: 2, margin: '0 auto 20px auto' }} />

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
                  <button
                    key={idx}
                    onClick={() => {
                      if (idx <= currentStep) {
                        handleStepAdvance(idx + 1);
                      }
                    }}
                    disabled={isFuture}
                    style={{
                      width: '100%',
                      padding: '14px 16px',
                      borderRadius: 12,
                      border: 'none',
                      cursor: isFuture ? 'not-allowed' : 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 12,
                      opacity: isFuture ? 0.35 : 1,
                      textAlign: 'left',
                      background: isCompleted
                        ? 'rgba(34,197,94,0.08)'
                        : isCurrent
                        ? 'var(--primary-light)'
                        : 'var(--bg)',
                    }}
                  >
                    <div style={{
                      width: 32,
                      height: 32,
                      borderRadius: 10,
                      background: isCompleted
                        ? 'var(--success)'
                        : isCurrent
                        ? 'var(--primary)'
                        : 'var(--surface-active)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                      color: '#fff',
                      fontSize: 13,
                      fontWeight: 700,
                    }}>
                      {isCompleted ? <CheckCircle2 size={16} /> : idx + 1}
                    </div>
                    <div>
                      <div style={{
                        fontSize: 13,
                        fontWeight: isCurrent ? 700 : 500,
                        color: isCompleted
                          ? 'var(--success)'
                          : isCurrent
                          ? 'var(--text)'
                          : 'var(--text-muted)',
                      }}>
                        {step}
                      </div>
                      {isCurrent && (
                        <div style={{ fontSize: 11, color: 'var(--primary)', marginTop: 2 }}>
                          Bosing - Keyingi qadam
                        </div>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>

            {currentStep >= 4 && (
              <div style={{
                marginTop: 16,
                padding: 12,
                borderRadius: 12,
                background: 'rgba(34,197,94,0.06)',
                border: '1px solid rgba(34,197,94,0.12)',
                textAlign: 'center',
              }}>
                <CheckCircle2 size={24} style={{ color: 'var(--success)', marginBottom: 4 }} />
                <p style={{ color: 'var(--success)', fontWeight: 600, fontSize: 14 }}>
                  Buyurtma muvaffaqiyatli yetkazildi!
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {showQuickMessage && selectedOrder && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 1000,
            background: 'rgba(0,0,0,0.3)',
            display: 'flex',
            alignItems: 'flex-end',
            justifyContent: 'center',
            backdropFilter: 'blur(4px)',
            WebkitBackdropFilter: 'blur(4px)',
          }}
          onClick={(e) => {
            if (e.target === e.currentTarget) setShowQuickMessage(false);
          }}
        >
          <div style={{
            background: 'var(--surface)',
            borderRadius: '20px 20px 0 0',
            width: '100%',
            maxWidth: 480,
            padding: '20px 16px 32px 16px',
            border: '1px solid var(--border)',
            borderBottom: 'none',
            boxShadow: 'var(--shadow-lg)',
          }}>
            <div style={{ width: 40, height: 4, background: 'var(--border-strong)', borderRadius: 2, margin: '0 auto 16px auto' }} />
            <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 12, color: 'var(--text)' }}>Tezkor xabar</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {quickMessages.map((msg, i) => (
                <button
                  key={i}
                  onClick={() => {
                    setShowQuickMessage(false);
                  }}
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    borderRadius: 12,
                    background: 'var(--bg)',
                    border: '1px solid var(--border)',
                    color: 'var(--text-secondary)',
                    fontSize: 14,
                    cursor: 'pointer',
                    textAlign: 'left',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 10,
                  }}
                >
                  <MessageCircle size={14} style={{ color: 'var(--primary)' }} />
                  {msg}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {filteredOrders.some((o) => o.status === 'onTheWay') && !showQuickMessage && !showModal && (
        <div style={{
          position: 'fixed',
          bottom: 96,
          left: 16,
          right: 16,
          zIndex: 50,
          background: 'rgba(255,255,255,0.9)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          borderRadius: 16,
          padding: '12px 16px',
          border: '1px solid var(--border)',
          boxShadow: 'var(--shadow-md)',
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          overflowX: 'auto',
          scrollbarWidth: 'none',
        }}>
          <span style={{ fontSize: 12, color: 'var(--text-muted)', flexShrink: 0, fontWeight: 600 }}>Xabar:</span>
          {quickMessages.slice(0, 3).map((msg, i) => (
            <button
              key={i}
              style={{
                flexShrink: 0,
                padding: '6px 12px',
                borderRadius: 10,
                background: 'var(--surface)',
                border: '1px solid var(--border)',
                color: 'var(--text-secondary)',
                fontSize: 11,
                cursor: 'pointer',
                whiteSpace: 'nowrap',
              }}
            >
              {msg}
            </button>
          ))}
        </div>
      )}

      <div style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 100,
        background: 'rgba(255,255,255,0.85)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        borderTop: '1px solid var(--border)',
        paddingBottom: 'env(safe-area-inset-bottom, 0px)',
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-around',
          padding: '8px 0',
          maxWidth: 480,
          margin: '0 auto',
        }}>
          {[
            { icon: LayoutDashboard, label: 'Bosh sahifa', path: '/courier' },
            { icon: ShoppingCart, label: 'Buyurtmalar', path: '/courier/orders' },
            { icon: Settings, label: 'Sozlamalar', path: '/courier/settings' },
          ].map((item) => {
            const isActive = window.location.pathname === item.path;
            return (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: 4,
                  padding: '6px 16px',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  position: 'relative',
                }}
              >
                {isActive && (
                  <div style={{
                    position: 'absolute',
                    top: -8,
                    width: 24,
                    height: 3,
                    borderRadius: 2,
                    background: 'var(--primary)',
                  }} />
                )}
                <item.icon
                  size={20}
                  style={{ color: isActive ? 'var(--primary)' : 'var(--text-muted)' }}
                />
                <span style={{
                  fontSize: 10,
                  fontWeight: isActive ? 700 : 500,
                  color: isActive ? 'var(--primary)' : 'var(--text-muted)',
                }}>
                  {item.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default CourierOrders;
