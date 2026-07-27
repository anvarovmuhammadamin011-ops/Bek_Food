import React, { useState, useEffect, useMemo } from 'react';
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
  AlertTriangle,
} from 'lucide-react';

const statusSteps = [
  'Buyurtma qabul qilindi',
  'Filialga keldim',
  'Buyurtmani oldim',
  'Yo\'ldaman',
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
      return { icon: '🔴', text: 'Juda kechikayotgan', bg: '#3a1111', border: '#e51e1e', color: '#ff6b6b' };
    }
    if (order.priority === 'normal' || order.urgency === 'normal') {
      return { icon: '🟡', text: 'Oddiy', bg: '#3a3411', border: '#b8860b', color: '#ffd93d' };
    }
    return { icon: '🟢', text: 'Yangi', bg: '#113a1a', border: '#22c55e', color: '#4ade80' };
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case 'ready':
        return { text: 'Tayyor - Olish kerak', color: '#4ade80', bg: '#113a1a' };
      case 'onTheWay':
        return { text: 'Yo\'lda', color: '#ffd93d', bg: '#3a3411' };
      case 'delivered':
        return { text: 'Yetkazildi', color: '#888', bg: '#1a1a1a' };
      default:
        return { text: status, color: '#aaa', bg: '#1a1a1a' };
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
    { key: 'onTheWay', label: 'Yo\'lda', count: courierOrders.filter((o) => o.status === 'onTheWay').length },
    { key: 'delivered', label: 'Yetkazilgan', count: courierOrders.filter((o) => o.status === 'delivered').length },
  ];

  return (
    <div style={{ minHeight: '100vh', background: '#0a0a0a', color: '#fff', fontFamily: 'Inter, -apple-system, sans-serif' }}>
      {/* Header */}
      <div
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 100,
          background: 'rgba(10, 10, 10, 0.85)',
          backdropFilter: 'blur(20px)',
          borderBottom: '1px solid #222',
          padding: '16px',
        }}
      >
        <div className="flex items-center justify-between" style={{ marginBottom: 12 }}>
          <div className="flex items-center" style={{ gap: 12 }}>
            <button
              onClick={() => navigate(-1)}
              className="card-interactive"
              style={{
                width: 40,
                height: 40,
                borderRadius: 12,
                background: '#141414',
                border: '1px solid #222',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                color: '#fff',
              }}
            >
              <ChevronLeft size={20} />
            </button>
            <h1 style={{ fontSize: 20, fontWeight: 700, margin: 0 }}>Buyurtmalar</h1>
          </div>
          <span
            className="badge badge-red"
            style={{
              background: '#e51e1e',
              color: '#fff',
              padding: '4px 12px',
              borderRadius: 20,
              fontSize: 13,
              fontWeight: 600,
            }}
          >
            {courierOrders.length}
          </span>
        </div>

        {/* Tabs */}
        <div
          className="flex"
          style={{
            gap: 8,
            overflowX: 'auto',
            paddingBottom: 4,
            scrollbarWidth: 'none',
          }}
        >
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
                transition: 'all 0.2s',
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                background: activeTab === tab.key ? '#e51e1e' : '#1a1a1a',
                color: activeTab === tab.key ? '#fff' : '#888',
              }}
            >
              {tab.label}
              <span
                style={{
                  background: activeTab === tab.key ? 'rgba(255,255,255,0.25)' : '#222',
                  color: activeTab === tab.key ? '#fff' : '#666',
                  padding: '1px 7px',
                  borderRadius: 10,
                  fontSize: 11,
                  fontWeight: 700,
                }}
              >
                {tab.count}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Orders List */}
      <div style={{ padding: '12px 16px 120px 16px' }} className="space-y-3">
        {filteredOrders.length === 0 && (
          <div
            className="animate-fade-in card"
            style={{
              textAlign: 'center',
              padding: '60px 20px',
              background: '#141414',
              borderRadius: 16,
              border: '1px solid #1a1a1a',
            }}
          >
            <Package size={48} color="#333" style={{ marginBottom: 12 }} />
            <p style={{ color: '#555', fontSize: 15 }}>Buyurtmalar topilmadi</p>
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
              className="card card-hover animate-fade-in-up"
              style={{
                background: '#141414',
                borderRadius: 16,
                border: `1px solid ${order.status === 'delivered' ? '#1a1a1a' : '#222'}`,
                padding: 16,
                opacity: order.status === 'delivered' ? 0.65 : 1,
                animationDelay: `${idx * 0.05}s`,
              }}
            >
              {/* Top row: Order ID + Priority + Status */}
              <div className="flex items-center justify-between" style={{ marginBottom: 12 }}>
                <div className="flex items-center" style={{ gap: 10 }}>
                  <span style={{ fontWeight: 700, fontSize: 16, color: '#fff' }}>
                    #{order.id || order.orderId || '1001'}
                  </span>
                  <span
                    style={{
                      padding: '3px 8px',
                      borderRadius: 8,
                      fontSize: 11,
                      fontWeight: 600,
                      background: priority.bg,
                      border: `1px solid ${priority.border}`,
                      color: priority.color,
                    }}
                  >
                    {priority.icon} {priority.text}
                  </span>
                </div>
                <span
                  style={{
                    padding: '4px 10px',
                    borderRadius: 8,
                    fontSize: 11,
                    fontWeight: 600,
                    background: statusInfo.bg,
                    color: statusInfo.color,
                    border: `1px solid ${statusInfo.color}22`,
                  }}
                >
                  {statusInfo.text}
                </span>
              </div>

              {/* Customer Info */}
              <div style={{ marginBottom: 10 }}>
                <div className="flex items-center justify-between" style={{ marginBottom: 4 }}>
                  <span style={{ fontWeight: 600, fontSize: 14, color: '#eee' }}>
                    {order.customerName || order.name || 'Mijoz'}
                  </span>
                  {order.phone && (
                    <button
                      onClick={() => callCustomer(order.phone)}
                      style={{
                        width: 32,
                        height: 32,
                        borderRadius: 10,
                        background: '#113a1a',
                        border: '1px solid #22c55e33',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer',
                        color: '#4ade80',
                      }}
                    >
                      <Phone size={14} />
                    </button>
                  )}
                </div>
                {order.phone && (
                  <span style={{ fontSize: 13, color: '#888' }}>{order.phone}</span>
                )}
              </div>

              {/* Address */}
              <div
                className="flex items-center"
                style={{
                  gap: 6,
                  padding: '8px 10px',
                  background: '#0f0f0f',
                  borderRadius: 10,
                  marginBottom: 10,
                  border: '1px solid #1a1a1a',
                }}
              >
                <MapPin size={14} color="#e51e1e" />
                <span style={{ fontSize: 13, color: '#aaa', flex: 1, lineHeight: 1.4 }}>
                  {order.address || order.deliveryAddress || 'Manzil ko\'rsatilmagan'}
                </span>
                <button
                  onClick={() => openMaps(order.address)}
                  style={{
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    color: '#e51e1e',
                    padding: 2,
                    flexShrink: 0,
                  }}
                >
                  <Navigation size={16} />
                </button>
              </div>

              {/* Items Summary */}
              <div
                className="flex items-center justify-between"
                style={{ marginBottom: 10, padding: '6px 0' }}
              >
                <div className="flex items-center" style={{ gap: 6 }}>
                  <Package size={14} color="#888" />
                  <span style={{ fontSize: 13, color: '#aaa' }}>
                    {itemsCount} ta mahsulot
                  </span>
                </div>
                <span style={{ fontSize: 14, fontWeight: 700, color: '#fff' }}>
                  {totalPrice.toLocaleString()} so'm
                </span>
              </div>

              {/* Items detail */}
              {items.length > 0 && (
                <div style={{ marginBottom: 10 }}>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                    {items.slice(0, 3).map((item, i) => (
                      <span
                        key={i}
                        style={{
                          padding: '2px 8px',
                          borderRadius: 6,
                          background: '#1a1a1a',
                          color: '#999',
                          fontSize: 11,
                        }}
                      >
                        {item.name || item.title || 'Mahsulot'} x{item.quantity || 1}
                      </span>
                    ))}
                    {items.length > 3 && (
                      <span
                        style={{
                          padding: '2px 8px',
                          borderRadius: 6,
                          background: '#1a1a1a',
                          color: '#666',
                          fontSize: 11,
                        }}
                      >
                        +{items.length - 3} ta
                      </span>
                    )}
                  </div>
                </div>
              )}

              {/* Payment + Time */}
              <div className="flex items-center justify-between" style={{ marginBottom: 10 }}>
                <span
                  style={{
                    padding: '3px 8px',
                    borderRadius: 6,
                    fontSize: 11,
                    fontWeight: 600,
                    background: order.paymentMethod === 'cash' || order.payment === 'cash' ? '#1a2a1a' : '#1a1a2a',
                    color: order.paymentMethod === 'cash' || order.payment === 'cash' ? '#4ade80' : '#60a5fa',
                    border: `1px solid ${order.paymentMethod === 'cash' || order.payment === 'cash' ? '#22c55e22' : '#3b82f622'}`,
                  }}
                >
                  {(order.paymentMethod === 'cash' || order.payment === 'cash') ? '💵 Naqd' : '💳 Karta'}
                </span>
                <div className="flex items-center" style={{ gap: 4 }}>
                  <Clock size={12} color="#666" />
                  <span style={{ fontSize: 12, color: '#666' }}>
                    {getTimeSince(order.createdAt || order.timestamp)}
                  </span>
                </div>
              </div>

              {/* Notes */}
              {(order.note || order.notes || order.comment) && (
                <div
                  style={{
                    padding: '8px 10px',
                    background: '#0f0f0f',
                    borderRadius: 8,
                    marginBottom: 10,
                    borderLeft: '3px solid #b8860b',
                  }}
                >
                  <span style={{ fontSize: 12, color: '#999', fontStyle: 'italic' }}>
                    📝 {order.note || order.notes || order.comment}
                  </span>
                </div>
              )}

              {/* Delivered Info */}
              {order.status === 'delivered' && order.deliveredAt && (
                <div
                  className="flex items-center"
                  style={{
                    gap: 6,
                    padding: '6px 10px',
                    background: '#113a1a',
                    borderRadius: 8,
                    marginBottom: 10,
                    border: '1px solid #22c55e22',
                  }}
                >
                  <CheckCircle2 size={14} color="#4ade80" />
                  <span style={{ fontSize: 12, color: '#4ade80' }}>
                    Yetkazildi • {getTimeSince(order.deliveredAt)} oldin
                  </span>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex items-center" style={{ gap: 8, marginTop: 12 }}>
                {order.status === 'ready' && (
                  <button
                    onClick={() => handleAcceptOrder(order)}
                    className="btn btn-primary"
                    style={{
                      flex: 1,
                      padding: '12px 16px',
                      borderRadius: 12,
                      background: '#22c55e',
                      border: 'none',
                      color: '#fff',
                      fontWeight: 700,
                      fontSize: 14,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: 8,
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
                        background: '#1a1a2a',
                        border: '1px solid #3b82f633',
                        color: '#60a5fa',
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
                      className="btn btn-primary"
                      style={{
                        flex: 1,
                        padding: '12px 16px',
                        borderRadius: 12,
                        background: '#e51e1e',
                        border: 'none',
                        color: '#fff',
                        fontWeight: 700,
                        fontSize: 14,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: 8,
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
                      background: '#1a1a1a',
                      border: '1px solid #222',
                      color: '#888',
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

                {/* Contact buttons */}
                {order.status !== 'delivered' && order.phone && (
                  <>
                    <button
                      onClick={() => sendTelegram(order.phone)}
                      style={{
                        width: 44,
                        height: 44,
                        borderRadius: 12,
                        background: '#1a1a2a',
                        border: '1px solid #3b82f622',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer',
                        color: '#60a5fa',
                        flexShrink: 0,
                      }}
                    >
                      <MessageCircle size={16} />
                    </button>
                    <button
                      onClick={() => sendSMS(order.phone)}
                      style={{
                        width: 44,
                        height: 44,
                        borderRadius: 12,
                        background: '#2a1a1a',
                        border: '1px solid #e51e1e22',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer',
                        color: '#e51e1e',
                        flexShrink: 0,
                      }}
                    >
                      <Send size={16} />
                    </button>
                  </>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Delivery Workflow Modal */}
      {showModal && selectedOrder && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 1000,
            background: 'rgba(0,0,0,0.8)',
            display: 'flex',
            alignItems: 'flex-end',
            justifyContent: 'center',
            backdropFilter: 'blur(8px)',
          }}
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setShowModal(false);
              setSelectedOrder(null);
              setCurrentStep(0);
            }
          }}
        >
          <div
            className="glass-floating animate-fade-in-up"
            style={{
              background: 'rgba(20, 20, 20, 0.95)',
              backdropFilter: 'blur(30px)',
              borderRadius: '24px 24px 0 0',
              width: '100%',
              maxWidth: 480,
              padding: '24px 20px 40px 20px',
              border: '1px solid #222',
              borderBottom: 'none',
            }}
          >
            <div style={{ width: 40, height: 4, background: '#333', borderRadius: 2, margin: '0 auto 20px auto' }} />

            <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 6, textAlign: 'center' }}>
              Buyurtma #{selectedOrder.id || selectedOrder.orderId}
            </h2>
            <p style={{ fontSize: 13, color: '#888', marginBottom: 20, textAlign: 'center' }}>
              Yetkazish jarayoni
            </p>

            <div className="space-y-2">
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
                      transition: 'all 0.3s',
                      background: isCompleted
                        ? '#113a1a'
                        : isCurrent
                        ? '#1a2a1a'
                        : '#0f0f0f',
                      opacity: isFuture ? 0.35 : 1,
                      textAlign: 'left',
                    }}
                  >
                    <div
                      style={{
                        width: 32,
                        height: 32,
                        borderRadius: 10,
                        background: isCompleted
                          ? '#22c55e'
                          : isCurrent
                          ? '#e51e1e'
                          : '#222',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                        color: '#fff',
                        fontSize: 13,
                        fontWeight: 700,
                      }}
                    >
                      {isCompleted ? <CheckCircle2 size={16} /> : idx + 1}
                    </div>
                    <div>
                      <div
                        style={{
                          fontSize: 13,
                          fontWeight: isCurrent ? 700 : 500,
                          color: isCompleted
                            ? '#4ade80'
                            : isCurrent
                            ? '#fff'
                            : '#555',
                        }}
                      >
                        {step}
                      </div>
                      {isCurrent && (
                        <div style={{ fontSize: 11, color: '#e51e1e', marginTop: 2 }}>
                          Bosing → Keyingi qadam
                        </div>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>

            {currentStep >= 4 && (
              <div
                className="animate-fade-in"
                style={{
                  marginTop: 16,
                  padding: '12px',
                  borderRadius: 12,
                  background: '#113a1a',
                  border: '1px solid #22c55e33',
                  textAlign: 'center',
                }}
              >
                <CheckCircle2 size={24} color="#4ade80" style={{ marginBottom: 4 }} />
                <p style={{ color: '#4ade80', fontWeight: 600, fontSize: 14 }}>
                  Buyurtma muvaffaqiyatli yetkazildi!
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Quick Message Modal */}
      {showQuickMessage && selectedOrder && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 1000,
            background: 'rgba(0,0,0,0.7)',
            display: 'flex',
            alignItems: 'flex-end',
            justifyContent: 'center',
            backdropFilter: 'blur(4px)',
          }}
          onClick={(e) => {
            if (e.target === e.currentTarget) setShowQuickMessage(false);
          }}
        >
          <div
            className="animate-fade-in-up"
            style={{
              background: '#141414',
              borderRadius: '20px 20px 0 0',
              width: '100%',
              maxWidth: 480,
              padding: '20px 16px 32px 16px',
              border: '1px solid #222',
              borderBottom: 'none',
            }}
          >
            <div style={{ width: 40, height: 4, background: '#333', borderRadius: 2, margin: '0 auto 16px auto' }} />
            <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 12 }}>Tezkor xabar</h3>
            <div className="space-y-2">
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
                    background: '#0f0f0f',
                    border: '1px solid #1a1a1a',
                    color: '#ccc',
                    fontSize: 14,
                    cursor: 'pointer',
                    textAlign: 'left',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 10,
                  }}
                >
                  <MessageCircle size={14} color="#e51e1e" />
                  {msg}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Floating Quick Message Bar (when onTheWay) */}
      {filteredOrders.some((o) => o.status === 'onTheWay') && !showQuickMessage && !showModal && (
        <div
          className="glass-floating animate-fade-in-up"
          style={{
            position: 'fixed',
            bottom: 20,
            left: 16,
            right: 16,
            zIndex: 50,
            background: 'rgba(20, 20, 20, 0.9)',
            backdropFilter: 'blur(20px)',
            borderRadius: 16,
            padding: '12px 16px',
            border: '1px solid #222',
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            overflowX: 'auto',
            scrollbarWidth: 'none',
          }}
        >
          <span style={{ fontSize: 12, color: '#666', flexShrink: 0, fontWeight: 600 }}>Xabar:</span>
          {quickMessages.slice(0, 3).map((msg, i) => (
            <button
              key={i}
              style={{
                flexShrink: 0,
                padding: '6px 12px',
                borderRadius: 10,
                background: '#1a1a1a',
                border: '1px solid #222',
                color: '#aaa',
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
    </div>
  );
};

export default CourierOrders;
