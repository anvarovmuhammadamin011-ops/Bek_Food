import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Plus, Pencil, Trash2, Building2, DoorOpen, ChevronUp } from 'lucide-react';
import useStore from '../store/useStore';
import { cn } from '../utils/cn';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Input } from '../components/ui/Input';
import { Modal } from '../components/ui/Modal';

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.06 } },
};

const addrItem = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 260, damping: 24 } },
};

export default function AddressesPage() {
  const { addresses } = useStore();
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({ label: '', street: '', apartment: '', entrance: '', floor: '', isDefault: false });

  const openAdd = () => {
    setEditingId(null);
    setForm({ label: '', street: '', apartment: '', entrance: '', floor: '', isDefault: false });
    setModalOpen(true);
  };

  const openEdit = (addr) => {
    setEditingId(addr.id);
    const parts = (addr.fullAddress || addr.street || '').split(', ');
    setForm({
      label: addr.label || '',
      street: parts[0] || '',
      apartment: addr.apartment || parts[1] || '',
      entrance: addr.entrance || '',
      floor: addr.floor || '',
      isDefault: addr.isDefault || false,
    });
    setModalOpen(true);
  };

  return (
    <motion.div className="h-full overflow-y-auto scrollbar-hide pb-28" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      <div className="px-4 pt-4 pb-2 flex items-center justify-between mb-1">
        <h1 className="text-xl font-bold text-text">Manzillarim</h1>
        <motion.button
          onClick={openAdd}
          className="flex items-center gap-1.5 text-xs font-semibold text-primary bg-primary/10 px-3.5 py-1.5 rounded-[10px]"
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
        >
          <Plus size={14} />
          Yangi
        </motion.button>
      </div>

      <div className="px-4 space-y-3">
        <AnimatePresence mode="popLayout">
          {addresses.length === 0 ? (
            <motion.div
              className="flex flex-col items-center py-20"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <motion.div
                className="w-16 h-16 rounded-[20px] bg-primary/10 flex items-center justify-center mb-4"
                animate={{ y: [0, -6, 0] }}
                transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
              >
                <MapPin size={28} className="text-primary" />
              </motion.div>
              <h3 className="text-base font-bold text-text mb-1">Manzil yoq</h3>
              <p className="text-sm text-textMuted mb-5">Yetkazib berish manzilini qoshish uchun bosing</p>
              <motion.button
                onClick={openAdd}
                className="flex items-center gap-2 px-5 py-3 bg-primary text-white font-semibold rounded-[14px] shadow-[0_8px_24px_rgba(249,115,22,0.3)]"
                whileHover={{ scale: 1.03, y: -2 }}
                whileTap={{ scale: 0.97 }}
              >
                <Plus size={16} />
                Manzil qoshish
              </motion.button>
            </motion.div>
          ) : (
            <motion.div className="space-y-3" variants={container} initial="hidden" animate="show">
              {addresses.map((addr) => (
                <motion.div key={addr.id} variants={addrItem} layout>
                  <Card variant="default" padding="md" hoverable>
                    <div className="flex items-start gap-3.5">
                      <motion.div
                        className={cn(
                          'w-11 h-11 rounded-full flex items-center justify-center flex-shrink-0',
                          addr.isDefault ? 'bg-primary/10 text-primary' : 'bg-surfaceActive text-textMuted'
                        )}
                        whileHover={{ scale: 1.1 }}
                      >
                        <MapPin size={18} />
                      </motion.div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-0.5">
                          <span className="text-sm font-semibold text-text">{addr.label}</span>
                          {addr.isDefault && (
                            <Badge variant="primary" size="xs">Asosiy</Badge>
                          )}
                        </div>
                        <p className="text-xs text-textMuted leading-relaxed">
                          {addr.fullAddress || addr.street}
                          {addr.apartment ? `, ${addr.apartment}` : ''}
                          {addr.entrance ? `, Kiraverish ${addr.entrance}` : ''}
                          {addr.floor ? `, ${addr.floor} qavat` : ''}
                        </p>
                        <div className="flex items-center gap-2 mt-3">
                          <motion.button
                            onClick={() => openEdit(addr)}
                            className="flex items-center gap-1 text-[11px] font-semibold text-textMuted bg-surfaceActive px-2.5 py-1.5 rounded-[8px]"
                            whileHover={{ scale: 1.03, backgroundColor: 'rgba(249,115,22,0.08)', color: '#F97316' }}
                            whileTap={{ scale: 0.97 }}
                          >
                            <Pencil size={12} />
                            Tahrirlash
                          </motion.button>
                          <motion.button
                            className="flex items-center gap-1 text-[11px] font-semibold text-textMuted bg-surfaceActive px-2.5 py-1.5 rounded-[8px]"
                            whileHover={{ scale: 1.03, backgroundColor: 'rgba(239,68,68,0.08)', color: '#EF4444' }}
                            whileTap={{ scale: 0.97 }}
                          >
                            <Trash2 size={12} />
                            Ochirish
                          </motion.button>
                        </div>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingId ? 'Manzilni tahrirlash' : 'Yangi manzil'}
        size="sm"
      >
        <div className="space-y-4">
          <Input
            label="Manzil nomi"
            placeholder="Uy, Ish va h.k."
            value={form.label}
            onChange={(e) => setForm({ ...form, label: e.target.value })}
            leftIcon={<MapPin size={16} />}
          />
          <Input
            label="Ko'cha"
            placeholder="Ko'cha nomi, uy raqami"
            value={form.street}
            onChange={(e) => setForm({ ...form, street: e.target.value })}
            leftIcon={<Building2 size={16} />}
          />
          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Kvartira/Ofis"
              placeholder="Raqam"
              value={form.apartment}
              onChange={(e) => setForm({ ...form, apartment: e.target.value })}
              leftIcon={<DoorOpen size={16} />}
            />
            <Input
              label="Qavat"
              placeholder="Nechinchi"
              value={form.floor}
              onChange={(e) => setForm({ ...form, floor: e.target.value })}
              leftIcon={<ChevronUp size={16} />}
            />
          </div>
          <Input
            label="Kiraverish"
            placeholder="Raqam (ixtiyoriy)"
            value={form.entrance}
            onChange={(e) => setForm({ ...form, entrance: e.target.value })}
          />
          <label className="flex items-center gap-2.5 cursor-pointer pt-1">
            <input
              type="checkbox"
              checked={form.isDefault}
              onChange={(e) => setForm({ ...form, isDefault: e.target.checked })}
              className="w-4 h-4 rounded border-border accent-primary"
            />
            <span className="text-sm font-medium text-text">Asosiy manzil qilish</span>
          </label>
          <motion.button
            className="w-full py-3 bg-primary text-white font-semibold rounded-[14px] text-sm shadow-[0_8px_24px_rgba(249,115,22,0.3)]"
            whileHover={{ scale: 1.02, y: -1 }}
            whileTap={{ scale: 0.98 }}
          >
            {editingId ? 'Saqlash' : 'Qoshish'}
          </motion.button>
        </div>
      </Modal>
    </motion.div>
  );
}
