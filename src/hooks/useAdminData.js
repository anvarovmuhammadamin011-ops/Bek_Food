import { useEffect, useState, useCallback } from 'react';
import api from '../api/client';
import { on, off } from '../lib/socket';

export default function useAdminData(initial = {}) {
  const [kpi, setKpi] = useState(initial.kpi || null);
  const [revenue, setRevenue] = useState(initial.revenue || []);
  const [trend, setTrend] = useState(initial.trend || []);
  const [orders, setOrders] = useState(initial.orders || []);
  const [statusCounts, setStatusCounts] = useState(initial.statusCounts || {});
  const [peakHours, setPeakHours] = useState(initial.peakHours || []);
  const [payments, setPayments] = useState(initial.payments || []);
  const [delivery, setDelivery] = useState(initial.delivery || []);
  const [products, setProducts] = useState(initial.products || []);
  const [inventory, setInventory] = useState(initial.inventory || []);
  const [promotions, setPromotions] = useState(initial.promotions || []);
  const [employees, setEmployees] = useState(initial.employees || []);
  const [loading, setLoading] = useState(true);
  const [loadingKey, setLoadingKey] = useState(null);
  const [error, setError] = useState(null);

  const refetch = useCallback(async (opts = {}) => {
    const { days, signal } = opts;
    const d = days || 7;
    setLoadingKey(signal || null);
    setError(null);
    try {
      const [k, rev, tnd, ord, ph, pay, deliv, prod, inv, prom, emp] = await Promise.all([
        api.adminKpis(),
        api.adminRevenue(d),
        api.adminRevenueTrend(d),
        api.adminOrders(),
        api.adminPeakHours(),
        api.adminPayments(),
        api.adminDelivery(),
        api.adminProducts(10),
        api.adminInventory(),
        api.adminPromotions(),
        api.adminEmployees(),
      ]);
      setKpi(k?.data || null);
      setRevenue(rev?.data || []);
      setTrend(tnd?.data || []);
      setOrders(ord?.data || []);
      setPeakHours(ph?.data || []);
      setPayments(pay?.data || []);
      setDelivery(deliv?.data || []);
      setProducts(prod?.data || []);
      setInventory(inv?.data || []);
      setPromotions(prom?.data || []);
      setEmployees(emp?.data?.employees || []);
      setStatusCounts(k?.data?.byStatus || {});
    } catch (e) {
      setError(e.message || 'Xatolik');
    } finally {
      setLoading(false);
      setLoadingKey(null);
    }
  }, []);

  const refreshKpi = useCallback(() => {
    api.adminKpis().then((k) => setKpi(k?.data || null)).catch(() => {});
  }, []);

  useEffect(() => {
    refetch();
    const onKpi = (d) => setKpi((prev) => (d ? { ...(prev || {}), ...d } : prev));
    const onOrders = (d) => setStatusCounts(d || {});
    const onOrder = (d) => {
      if (!d?.orderId) return;
      setOrders((prev) => prev.map((o) => (o.id === d.orderId ? { ...o, status: d.status } : o)));
      refreshKpi();
    };
    const onRefresh = () => refetch();
    on('kpi', onKpi);
    on('orders', onOrders);
    on('order', onOrder);
    on('refresh', onRefresh);
    return () => {
      off('kpi', onKpi);
      off('orders', onOrders);
      off('order', onOrder);
      off('refresh', onRefresh);
    };
  }, [refetch, refreshKpi]);

  return {
    kpi,
    revenue,
    trend,
    orders,
    statusCounts,
    peakHours,
    payments,
    delivery,
    products,
    inventory,
    promotions,
    employees,
    loading,
    loadingKey,
    error,
    refetch,
    refreshKpi,
    setOrders,
    setInventory,
    setProducts,
    setPromotions,
  };
}
