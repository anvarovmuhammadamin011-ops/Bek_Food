import React, { useState } from 'react';
import useStore from '../../store/useStore';
import { useNavigate } from 'react-router-dom';
import {
  Star,
  MessageCircle,
  Eye,
  EyeOff,
  Filter,
  ThumbsUp,
  Reply,
  TrendingUp,
  ArrowUpRight,
} from 'lucide-react';

const mockReviews = [
  {
    id: 1,
    name: 'Alisher Navoiy',
    avatar: 'AN',
    rating: 5,
    date: '2026-07-25',
    comment: "Ajoyib taom! Darvoza qovurilgan mol go'shtining ta'mini hech qachon unutmayman. Xizmat juda professional.",
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
    comment: "Do'stlar bilan kelgan edik. Hamma narsa ajoyib edi! Hashamatli muhit va mazali taomlar. Albatta qaytaman.",
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
    comment: "Taom yaxshi edi, lekin kutish vaqti juda uzun bo'ldi. 40 daqiqa kutdik. Shuningdek, Wi-Fi ishlamadi.",
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
    comment: "Tug'ilgan kunimni nishonladim. Serverlar juda mehribon edi. Maxsus desert bilan supriz qilishdi. Juda minnatdorman!",
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
    comment: "Steak men so'ragandek emas edi. Quruq va qattiq chiqdi. Shikoyat qilganimda, hech qanday javob berishmadi.",
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
    comment: "Yashirin dasturda biznes uchrashuvi o'tkazdik. Professional muhit va sifatli xizmat. Tavsiya qilaman.",
    orderRef: '#ORD-0990',
    likes: 9,
    hidden: false,
  },
];

const AdminReviews = () => {
  const store = useStore();
  const navigate = useNavigate();
  const [activeFilter, setActiveFilter] = useState('all');
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
        fill={i < rating ? 'var(--warning)' : 'transparent'}
        stroke={i < rating ? 'var(--warning)' : 'var(--border-strong)'}
        strokeWidth={1.5}
      />
    ));
  };

  return (
    <div style={{ padding: '28px 32px', minHeight: '100vh', background: 'var(--bg)', fontFamily: 'var(--font-sans, "Inter", "Segoe UI", sans-serif)' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ marginBottom: '28px' }}>
          <h1 style={{ fontSize: '24px', fontWeight: 700, color: 'var(--text)', margin: 0 }}>
            Sharhlar boshqaruvi
          </h1>
          <p style={{ fontSize: '14px', color: 'var(--text-muted)', margin: '6px 0 0 0' }}>
            Sharhlarni ko'ring va boshqaring
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px', marginBottom: '28px' }}>
          <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', padding: '20px 22px', display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'var(--primary-light)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Star size={22} fill="var(--warning)" stroke="var(--warning)" />
            </div>
            <div>
              <p style={{ fontSize: '12px', color: 'var(--text-muted)', margin: 0, fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                O'rtacha baho
              </p>
              <p style={{ fontSize: '26px', fontWeight: 700, color: 'var(--warning)', margin: '2px 0 0 0' }}>
                {stats.avgRating}
              </p>
            </div>
          </div>

          <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', padding: '20px 22px', display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'var(--primary-light)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <MessageCircle size={22} stroke="var(--primary)" />
            </div>
            <div>
              <p style={{ fontSize: '12px', color: 'var(--text-muted)', margin: 0, fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                Jami sharhlar
              </p>
              <p style={{ fontSize: '26px', fontWeight: 700, color: 'var(--text)', margin: '2px 0 0 0' }}>
                {stats.totalReviews}
              </p>
            </div>
          </div>

          <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', padding: '20px 22px', display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'var(--primary-light)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <TrendingUp size={22} stroke="var(--success)" />
            </div>
            <div>
              <p style={{ fontSize: '12px', color: 'var(--text-muted)', margin: 0, fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                Yangi sharhlar
              </p>
              <p style={{ fontSize: '26px', fontWeight: 700, color: 'var(--success)', margin: '2px 0 0 0' }}>
                {stats.newReviews}
              </p>
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '24px', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', padding: '6px', width: 'fit-content' }}>
          <Filter size={16} color="var(--text-muted)" style={{ marginLeft: '10px' }} />
          {filters.map((f) => (
            <button
              key={f.key}
              onClick={() => setActiveFilter(f.key)}
              style={{
                padding: '8px 18px',
                border: 'none',
                borderRadius: '8px',
                background: activeFilter === f.key ? 'var(--primary)' : 'transparent',
                color: activeFilter === f.key ? '#FFFFFF' : 'var(--text-muted)',
                cursor: 'pointer',
                fontSize: '13px',
                fontWeight: activeFilter === f.key ? 600 : 500,
                transition: 'all 0.2s ease',
                fontFamily: 'inherit',
              }}
            >
              {f.label}
            </button>
          ))}
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {filteredReviews.length === 0 ? (
            <div style={{ padding: '64px 32px', textAlign: 'center', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius)' }}>
              <div style={{ width: '56px', height: '56px', borderRadius: '16px', background: 'var(--surface-hover)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
                <MessageCircle size={26} stroke="var(--text-muted)" />
              </div>
              <p style={{ color: 'var(--text-muted)', fontSize: '15px', margin: 0, fontWeight: 500 }}>
                Bu kategoriyada sharhlar topilmadi
              </p>
            </div>
          ) : (
            filteredReviews.map((review) => (
              <div
                key={review.id}
                style={{
                  padding: '22px 24px',
                  background: 'var(--surface)',
                  border: '1px solid var(--border)',
                  borderRadius: 'var(--radius)',
                  opacity: review.hidden ? 0.5 : 1,
                  transition: 'all 0.2s ease',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '14px', flexWrap: 'wrap', gap: '12px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                    <div
                      style={{
                        width: '46px',
                        height: '46px',
                        borderRadius: '12px',
                        background: review.rating >= 4
                          ? 'var(--primary-light)'
                          : review.rating === 3
                          ? 'var(--surface-active)'
                          : 'var(--primary-light)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: review.rating >= 4 ? 'var(--primary)' : review.rating === 3 ? 'var(--text-muted)' : 'var(--danger)',
                        fontWeight: 700,
                        fontSize: '15px',
                        border: '1px solid var(--border)',
                      }}
                    >
                      {review.avatar}
                    </div>
                    <div>
                      <h4 style={{ fontSize: '15px', fontWeight: 600, color: 'var(--text)', margin: 0 }}>
                        {review.name}
                      </h4>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '4px' }}>
                        <div style={{ display: 'flex', gap: '1px' }}>
                          {renderStars(review.rating, 13)}
                        </div>
                        <span style={{
                          fontSize: '11px',
                          fontWeight: 600,
                          padding: '2px 8px',
                          borderRadius: '6px',
                          background: review.rating >= 4 ? 'var(--primary-light)' : review.rating === 3 ? 'var(--surface-active)' : 'var(--primary-light)',
                          color: review.rating >= 4 ? 'var(--primary)' : review.rating === 3 ? 'var(--text-muted)' : 'var(--danger)',
                        }}>
                          {review.rating}.0
                        </span>
                      </div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                    <span style={{ color: 'var(--text-muted)', fontSize: '13px' }}>
                      {review.date}
                    </span>
                    <span style={{
                      color: 'var(--text-secondary)',
                      fontSize: '12px',
                      fontWeight: 500,
                      background: 'var(--surface-active)',
                      padding: '4px 10px',
                      borderRadius: '6px',
                      border: '1px solid var(--border)',
                    }}>
                      {review.orderRef}
                    </span>
                  </div>
                </div>

                <p style={{ fontSize: '14px', lineHeight: '1.65', color: 'var(--text-secondary)', margin: '0 0 16px 0', paddingLeft: '60px' }}>
                  {review.comment}
                </p>

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingLeft: '60px', flexWrap: 'wrap', gap: '10px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <ThumbsUp size={14} stroke="var(--text-muted)" />
                    <span style={{ color: 'var(--text-muted)', fontSize: '13px', fontWeight: 500 }}>
                      {review.likes}
                    </span>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <button
                      onClick={() => toggleHidden(review.id)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        padding: '7px 14px',
                        background: review.hidden ? 'var(--primary-light)' : 'var(--surface-active)',
                        border: '1px solid var(--border)',
                        borderRadius: '8px',
                        color: review.hidden ? 'var(--danger)' : 'var(--text-secondary)',
                        cursor: 'pointer',
                        fontSize: '13px',
                        fontWeight: 500,
                        transition: 'all 0.2s ease',
                        fontFamily: 'inherit',
                      }}
                    >
                      {review.hidden ? <EyeOff size={14} /> : <Eye size={14} />}
                      {review.hidden ? 'Yashirin' : "Ko'rsatish"}
                    </button>

                    <button
                      onClick={() => setReplyModal(review.id)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        padding: '7px 14px',
                        background: 'var(--primary)',
                        border: 'none',
                        borderRadius: '8px',
                        color: '#FFFFFF',
                        cursor: 'pointer',
                        fontSize: '13px',
                        fontWeight: 500,
                        transition: 'all 0.2s ease',
                        fontFamily: 'inherit',
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
      </div>

      {replyModal && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.3)',
            backdropFilter: 'blur(6px)',
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
            onClick={(e) => e.stopPropagation()}
            style={{
              width: '460px',
              maxWidth: '92%',
              padding: '28px',
              background: 'var(--surface)',
              border: '1px solid var(--border)',
              borderRadius: 'var(--radius)',
              boxShadow: 'var(--shadow-lg)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '22px' }}>
              <div style={{ width: '42px', height: '42px', borderRadius: '12px', background: 'var(--primary-light)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <MessageCircle size={20} stroke="var(--primary)" />
              </div>
              <div>
                <h3 style={{ fontSize: '18px', fontWeight: 700, color: 'var(--text)', margin: 0 }}>
                  Sharhga javob
                </h3>
                <p style={{ fontSize: '13px', color: 'var(--text-muted)', margin: '2px 0 0 0' }}>
                  {reviews.find((r) => r.id === replyModal)?.name} ga javob yozing
                </p>
              </div>
            </div>

            <textarea
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              placeholder="Javobingizni yozing..."
              rows={5}
              style={{
                width: '100%',
                padding: '14px 16px',
                background: 'var(--bg)',
                border: '1px solid var(--border)',
                borderRadius: 'var(--radius-sm)',
                color: 'var(--text)',
                fontSize: '14px',
                lineHeight: '1.6',
                resize: 'vertical',
                outline: 'none',
                fontFamily: 'inherit',
                boxSizing: 'border-box',
                transition: 'border-color 0.2s ease',
              }}
              onFocus={(e) => e.target.style.borderColor = 'var(--primary)'}
              onBlur={(e) => e.target.style.borderColor = 'var(--border)'}
            />

            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '20px', justifyContent: 'flex-end' }}>
              <button
                onClick={() => {
                  setReplyModal(null);
                  setReplyText('');
                }}
                style={{
                  padding: '10px 22px',
                  background: 'var(--surface-hover)',
                  border: '1px solid var(--border)',
                  borderRadius: '10px',
                  color: 'var(--text-secondary)',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: 500,
                  fontFamily: 'inherit',
                  transition: 'all 0.2s ease',
                }}
              >
                Bekor qilish
              </button>
              <button
                onClick={() => handleReply(replyModal)}
                style={{
                  padding: '10px 24px',
                  background: 'var(--primary)',
                  border: 'none',
                  borderRadius: '10px',
                  color: '#FFFFFF',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: 600,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  fontFamily: 'inherit',
                  transition: 'all 0.2s ease',
                  boxShadow: '0 2px 8px rgba(249, 115, 22, 0.25)',
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
