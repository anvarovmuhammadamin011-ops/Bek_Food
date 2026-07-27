import React, { useState } from 'react';
import useStore from '../../store/useStore';
import { useNavigate } from 'react-router-dom';
import {
  ChevronLeft,
  Star,
  MessageCircle,
  Eye,
  EyeOff,
  Filter,
  ThumbsUp,
  Reply,
} from 'lucide-react';

const mockReviews = [
  {
    id: 1,
    name: 'Alisher Navoiy',
    avatar: 'AN',
    rating: 5,
    date: '2026-07-25',
    comment: 'Ajoyib taom! Darvoza qovurilgan mol go\'shtining ta\'mini hech qachon unutmayman. Xizmat juda professional.',
    orderRef: '#ORD-1024',
    likes: 12,
    hidden: false,
  },
  {
    id: 2,
    name: 'Dilnoza Karimova',
    avatar: 'DK',
    rating: 4,
    date: '2026-07-24',
    comment: 'Steak juda yaxshi pishirilgan, lekin garnir biroz sovuq edi. Umuman olganda, yaxshi tajriba.',
    orderRef: '#ORD-1019',
    likes: 8,
    hidden: false,
  },
  {
    id: 3,
    name: 'Sardor Raxmatov',
    avatar: 'SR',
    rating: 5,
    date: '2026-07-23',
    comment: 'Do\'stlar bilan kelgan edik. Hamma narsa ajoyib edi! Hashamatli muhit va mazali taomlar. Albatta qaytaman.',
    orderRef: '#ORD-1015',
    likes: 15,
    hidden: false,
  },
  {
    id: 4,
    name: 'Nilufar Abdullayeva',
    avatar: 'NA',
    rating: 3,
    date: '2026-07-22',
    comment: 'Taom yaxshi edi, lekin kutish vaqti juda uzun bo\'ldi. 40 daqiqa kutdik. Shuningdek, Wi-Fi ishlamadi.',
    orderRef: '#ORD-1012',
    likes: 5,
    hidden: false,
  },
  {
    id: 5,
    name: 'Bobur Toshmatov',
    avatar: 'BT',
    rating: 5,
    date: '2026-07-21',
    comment: 'Tug\'ilgan kunimni nishonladim. Serverlar juda mehribon edi. Maxsus desert bilan supriz qilishdi. Juda minnatdorman!',
    orderRef: '#ORD-1008',
    likes: 20,
    hidden: false,
  },
  {
    id: 6,
    name: 'Malika Husanova',
    avatar: 'MH',
    rating: 2,
    date: '2026-07-20',
    comment: 'Steak men so\'ragandek emas edi. Quruq va qattiq chiqdi. Shikoyat qilganimda, hech qanday javob berishmadi.',
    orderRef: '#ORD-1005',
    likes: 3,
    hidden: true,
  },
  {
    id: 7,
    name: 'Javlon Qodirov',
    avatar: 'JQ',
    rating: 4,
    date: '2026-07-19',
    comment: 'Yaxshi ovqat, yaxshi muhit. Vin karta juda boy. Faqat narxlar biroz yuqoriroq.',
    orderRef: '#ORD-1001',
    likes: 7,
    hidden: false,
  },
  {
    id: 8,
    name: 'Gulnora Mirzayeva',
    avatar: 'GM',
    rating: 5,
    date: '2026-07-18',
    comment: 'Eng yaxshi steakhouse shaharda! Har safar kelganimda yangi lazzatlar kashf qilaman. Oshpazlarga alohida rahmat.',
    orderRef: '#ORD-0998',
    likes: 18,
    hidden: false,
  },
  {
    id: 9,
    name: 'Rustam Ergashev',
    avatar: 'RE',
    rating: 1,
    date: '2026-07-17',
    comment: 'Juda yomon tajriba. Ovqat sovuq edi, xizmat juda sekin. Qaytib kelishni rejalashtirmayapman.',
    orderRef: '#ORD-0994',
    likes: 2,
    hidden: true,
  },
  {
    id: 10,
    name: 'Sabohat Qosimova',
    avatar: 'SQ',
    rating: 4,
    date: '2026-07-16',
    comment: 'Yashirin dasturda biznes uchrashuvi o\'tkazdik. Professional muhit va sifatli xizmat. Tavsiya qilaman.',
    orderRef: '#ORD-0990',
    likes: 9,
    hidden: false,
  },
];

const AdminReviews = () => {
  const store = useStore();
  const navigate = useNavigate();
  const [activeFilter, setActiveFilter] = useState('all');
  const [filterOpen, setFilterOpen] = useState(false);
  const [replyModal, setReplyModal] = useState(null);
  const [replyText, setReplyText] = useState('');
  const [reviews, setReviews] = useState(mockReviews);

  const filters = [
    { key: 'all', label: 'Barchasi' },
    { key: '5', label: '5 yulduz' },
    { key: '4', label: '4 yulduz' },
    { key: '3', label: '3 yulduz' },
    { key: 'low', label: 'Past' },
  ];

  const filteredReviews = reviews.filter((r) => {
    if (activeFilter === 'all') return true;
    if (activeFilter === 'low') return r.rating <= 2;
    return r.rating === parseInt(activeFilter);
  });

  const stats = {
    avgRating: 4.8,
    totalReviews: 124,
    newReviews: 8,
  };

  const toggleHidden = (id) => {
    setReviews((prev) =>
      prev.map((r) => (r.id === id ? { ...r, hidden: !r.hidden } : r))
    );
  };

  const handleReply = (id) => {
    if (replyText.trim()) {
      alert(`Reply sent to review #${id}: "${replyText}"`);
      setReplyText('');
      setReplyModal(null);
    }
  };

  const renderStars = (rating, size = 16) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        size={size}
        fill={i < rating ? '#f59e0b' : 'transparent'}
        stroke={i < rating ? '#f59e0b' : '#6b7280'}
      />
    ));
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)',
      padding: '24px',
      fontFamily: '"Inter", "Segoe UI", sans-serif',
    }}>
      {/* Header */}
      <div
        className="flex items-center justify-between animate-fade-in"
        style={{ marginBottom: '32px' }}
      >
        <div className="flex items-center" style={{ gap: '16px' }}>
          <button
            onClick={() => navigate(-1)}
            className="btn btn-primary"
            style={{
              padding: '10px',
              borderRadius: '10px',
              display: 'flex',
              alignItems: 'center',
              background: 'rgba(255,255,255,0.08)',
              border: '1px solid rgba(255,255,255,0.1)',
            }}
          >
            <ChevronLeft size={20} color="#fff" />
          </button>
          <div>
            <h1 style={{ color: '#fff', fontSize: '28px', fontWeight: 700, margin: 0 }}>
              Sharhlar boshqaruvi
            </h1>
            <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '14px', margin: '4px 0 0 0' }}>
              Sharhlarni ko\'ring va boshqaring
            </p>
          </div>
        </div>

        <div style={{ position: 'relative' }}>
          <button
            className="btn btn-primary"
            onClick={() => setFilterOpen(!filterOpen)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '10px 20px',
              background: 'rgba(255,255,255,0.08)',
              border: '1px solid rgba(255,255,255,0.15)',
              borderRadius: '10px',
              color: '#fff',
              cursor: 'pointer',
              fontSize: '14px',
            }}
          >
            <Filter size={16} />
            Filtr
          </button>
          {filterOpen && (
            <div
              className="animate-fade-in"
              style={{
                position: 'absolute',
                top: '100%',
                right: 0,
                marginTop: '8px',
                background: '#1e293b',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '12px',
                padding: '8px',
                minWidth: '160px',
                zIndex: 100,
                boxShadow: '0 20px 40px rgba(0,0,0,0.4)',
              }}
            >
              {filters.map((f) => (
                <button
                  key={f.key}
                  onClick={() => {
                    setActiveFilter(f.key);
                    setFilterOpen(false);
                  }}
                  style={{
                    display: 'block',
                    width: '100%',
                    padding: '10px 16px',
                    border: 'none',
                    borderRadius: '8px',
                    background: activeFilter === f.key ? 'rgba(234,179,8,0.15)' : 'transparent',
                    color: activeFilter === f.key ? '#f59e0b' : '#fff',
                    cursor: 'pointer',
                    textAlign: 'left',
                    fontSize: '14px',
                  }}
                >
                  {f.label}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Stats */}
      <div
        className="flex stagger"
        style={{ gap: '20px', marginBottom: '32px' }}
      >
        {[
          {
            label: "O'rtacha baho",
            value: stats.avgRating,
            icon: <Star size={22} fill="#f59e0b" stroke="#f59e0b" />,
            color: '#f59e0b',
            bg: 'rgba(245,158,11,0.1)',
          },
          {
            label: 'Jami sharhlar',
            value: stats.totalReviews,
            icon: <MessageCircle size={22} color="#3b82f6" />,
            color: '#3b82f6',
            bg: 'rgba(59,130,246,0.1)',
          },
          {
            label: 'Yangi sharhlar',
            value: stats.newReviews,
            icon: <ThumbsUp size={22} color="#10b981" />,
            color: '#10b981',
            bg: 'rgba(16,185,129,0.1)',
          },
        ].map((stat, i) => (
          <div
            key={i}
            className="card animate-fade-in"
            style={{
              flex: 1,
              padding: '24px',
              background: 'rgba(255,255,255,0.05)',
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: '16px',
              display: 'flex',
              alignItems: 'center',
              gap: '16px',
              animationDelay: `${i * 0.1}s`,
            }}
          >
            <div
              style={{
                width: '52px',
                height: '52px',
                borderRadius: '14px',
                background: stat.bg,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              {stat.icon}
            </div>
            <div>
              <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '13px', margin: 0 }}>
                {stat.label}
              </p>
              <h3 style={{ color: stat.color, fontSize: '28px', fontWeight: 700, margin: '4px 0 0 0' }}>
                {stat.value}
              </h3>
            </div>
          </div>
        ))}
      </div>

      {/* Filter Tabs */}
      <div
        className="flex animate-fade-in"
        style={{
          gap: '8px',
          marginBottom: '28px',
          background: 'rgba(255,255,255,0.05)',
          padding: '6px',
          borderRadius: '12px',
          width: 'fit-content',
          border: '1px solid rgba(255,255,255,0.08)',
        }}
      >
        {filters.map((f) => (
          <button
            key={f.key}
            onClick={() => setActiveFilter(f.key)}
            style={{
              padding: '10px 20px',
              border: 'none',
              borderRadius: '8px',
              background: activeFilter === f.key ? 'rgba(234,179,8,0.2)' : 'transparent',
              color: activeFilter === f.key ? '#f59e0b' : 'rgba(255,255,255,0.6)',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: activeFilter === f.key ? 600 : 400,
              transition: 'all 0.2s',
            }}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Reviews List */}
      <div className="stagger" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {filteredReviews.length === 0 ? (
          <div
            className="card animate-fade-in"
            style={{
              padding: '60px',
              textAlign: 'center',
              background: 'rgba(255,255,255,0.05)',
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: '16px',
            }}
          >
            <MessageCircle size={48} color="rgba(255,255,255,0.2)" style={{ margin: '0 auto 16px' }} />
            <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '16px', margin: 0 }}>
              Bu kategoriyada sharhlar topilmadi
            </p>
          </div>
        ) : (
          filteredReviews.map((review, index) => (
            <div
              key={review.id}
              className="card card-hover animate-fade-in"
              style={{
                padding: '24px',
                background: review.hidden
                  ? 'rgba(255,255,255,0.02)'
                  : 'rgba(255,255,255,0.05)',
                border: review.hidden
                  ? '1px solid rgba(255,255,255,0.04)'
                  : '1px solid rgba(255,255,255,0.08)',
                borderRadius: '16px',
                opacity: review.hidden ? 0.5 : 1,
                animationDelay: `${index * 0.05}s`,
                transition: 'all 0.3s',
              }}
            >
              <div className="flex items-center justify-between" style={{ marginBottom: '16px' }}>
                <div className="flex items-center" style={{ gap: '14px' }}>
                  <div
                    style={{
                      width: '48px',
                      height: '48px',
                      borderRadius: '14px',
                      background: review.rating >= 4
                        ? 'linear-gradient(135deg, #f59e0b, #d97706)'
                        : review.rating === 3
                        ? 'linear-gradient(135deg, #6366f1, #4f46e5)'
                        : 'linear-gradient(135deg, #ef4444, #dc2626)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#fff',
                      fontWeight: 700,
                      fontSize: '16px',
                    }}
                  >
                    {review.avatar}
                  </div>
                  <div>
                    <h4 style={{ color: '#fff', fontSize: '16px', fontWeight: 600, margin: 0 }}>
                      {review.name}
                    </h4>
                    <div className="flex items-center" style={{ gap: '8px', marginTop: '4px' }}>
                      <div className="flex" style={{ gap: '2px' }}>
                        {renderStars(review.rating, 14)}
                      </div>
                      <span
                        className={`badge ${review.rating >= 4 ? 'badge-green' : review.rating === 3 ? 'badge-yellow' : 'badge-red'}`}
                        style={{ fontSize: '12px', padding: '2px 8px' }}
                      >
                        {review.rating}.0
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center" style={{ gap: '8px' }}>
                  <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: '13px' }}>
                    {review.date}
                  </span>
                  <span
                    style={{
                      color: 'rgba(255,255,255,0.3)',
                      fontSize: '13px',
                      background: 'rgba(255,255,255,0.06)',
                      padding: '4px 10px',
                      borderRadius: '6px',
                    }}
                  >
                    {review.orderRef}
                  </span>
                </div>
              </div>

              <p
                style={{
                  color: 'rgba(255,255,255,0.75)',
                  fontSize: '15px',
                  lineHeight: '1.6',
                  margin: '0 0 16px 0',
                  paddingLeft: '62px',
                }}
              >
                {review.comment}
              </p>

              <div
                className="flex items-center justify-between"
                style={{ paddingLeft: '62px' }}
              >
                <div className="flex items-center" style={{ gap: '6px' }}>
                  <ThumbsUp size={14} color="rgba(255,255,255,0.4)" />
                  <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: '13px' }}>
                    {review.likes}
                  </span>
                </div>

                <div className="flex items-center" style={{ gap: '8px' }}>
                  <button
                    onClick={() => toggleHidden(review.id)}
                    className="btn btn-primary"
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      padding: '8px 14px',
                      background: review.hidden
                        ? 'rgba(239,68,68,0.15)'
                        : 'rgba(16,185,129,0.15)',
                      border: review.hidden
                        ? '1px solid rgba(239,68,68,0.2)'
                        : '1px solid rgba(16,185,129,0.2)',
                      borderRadius: '8px',
                      color: review.hidden ? '#ef4444' : '#10b981',
                      cursor: 'pointer',
                      fontSize: '13px',
                    }}
                  >
                    {review.hidden ? <EyeOff size={14} /> : <Eye size={14} />}
                    {review.hidden ? 'Yashirin' : 'Ko\'rsatish'}
                  </button>

                  <button
                    onClick={() => setReplyModal(review.id)}
                    className="btn btn-primary"
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      padding: '8px 14px',
                      background: 'rgba(59,130,246,0.15)',
                      border: '1px solid rgba(59,130,246,0.2)',
                      borderRadius: '8px',
                      color: '#3b82f6',
                      cursor: 'pointer',
                      fontSize: '13px',
                    }}
                  >
                    <Reply size={14} />
                    Javob berish
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Reply Modal */}
      {replyModal && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.7)',
            backdropFilter: 'blur(8px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
          }}
          onClick={() => {
            setReplyModal(null);
            setReplyText('');
          }}
        >
          <div
            className="card animate-fade-in"
            onClick={(e) => e.stopPropagation()}
            style={{
              width: '480px',
              maxWidth: '90%',
              padding: '32px',
              background: 'linear-gradient(135deg, #1e293b, #0f172a)',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: '20px',
              boxShadow: '0 25px 50px rgba(0,0,0,0.5)',
            }}
          >
            <div className="flex items-center" style={{ gap: '12px', marginBottom: '24px' }}>
              <div
                style={{
                  width: '44px',
                  height: '44px',
                  borderRadius: '12px',
                  background: 'rgba(59,130,246,0.15)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <MessageCircle size={22} color="#3b82f6" />
              </div>
              <div>
                <h3 style={{ color: '#fff', fontSize: '20px', fontWeight: 700, margin: 0 }}>
                  Sharhga javob
                </h3>
                <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '13px', margin: '2px 0 0 0' }}>
                  {reviews.find((r) => r.id === replyModal)?.name} ga javob yozing
                </p>
              </div>
            </div>

            <textarea
              className="input"
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              placeholder="Javobingizni yozing..."
              rows={5}
              style={{
                width: '100%',
                padding: '16px',
                background: 'rgba(255,255,255,0.06)',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '12px',
                color: '#fff',
                fontSize: '14px',
                lineHeight: '1.6',
                resize: 'vertical',
                outline: 'none',
                fontFamily: 'inherit',
                boxSizing: 'border-box',
              }}
            />

            <div className="flex items-center" style={{ gap: '12px', marginTop: '20px', justifyContent: 'flex-end' }}>
              <button
                onClick={() => {
                  setReplyModal(null);
                  setReplyText('');
                }}
                style={{
                  padding: '10px 24px',
                  background: 'rgba(255,255,255,0.06)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: '10px',
                  color: 'rgba(255,255,255,0.7)',
                  cursor: 'pointer',
                  fontSize: '14px',
                }}
              >
                Bekor qilish
              </button>
              <button
                onClick={() => handleReply(replyModal)}
                className="btn btn-primary"
                style={{
                  padding: '10px 28px',
                  background: 'linear-gradient(135deg, #3b82f6, #2563eb)',
                  border: 'none',
                  borderRadius: '10px',
                  color: '#fff',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: 600,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                }}
              >
                <Reply size={16} />
                Yuborish
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminReviews;
