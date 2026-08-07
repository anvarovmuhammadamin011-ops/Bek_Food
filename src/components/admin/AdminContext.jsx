import { createContext, useContext, useState, useMemo } from 'react';

const AdminCtx = createContext(null);

export function AdminProvider({ children }) {
  const [days, setDays] = useState(7);
  const [range, setRange] = useState('7d');
  const [statusFilter, setStatusFilter] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');
  const value = useMemo(
    () => ({
      days,
      setDays,
      range,
      setRange,
      statusFilter,
      setStatusFilter,
      searchQuery,
      setSearchQuery,
      activeFilter,
      setActiveFilter,
    }),
    [days, range, statusFilter, searchQuery, activeFilter]
  );
  return <AdminCtx.Provider value={value}>{children}</AdminCtx.Provider>;
}

export function useAdminContext() {
  const ctx = useContext(AdminCtx);
  if (!ctx) throw new Error('useAdminContext must be used within AdminProvider');
  return ctx;
}
