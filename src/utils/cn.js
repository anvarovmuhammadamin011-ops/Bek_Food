export function cva(base, config) {
  return function variantClasses(props = {}) {
    const classes = [base];
    if (!config || !config.variants) return classes.filter(Boolean).join(' ');
    for (const [key, value] of Object.entries(props)) {
      const variantMap = config.variants[key];
      if (!variantMap) continue;
      if (value && variantMap[value]) {
        classes.push(variantMap[value]);
      }
    }
    if (config.defaultVariants) {
      for (const [key, value] of Object.entries(config.defaultVariants)) {
        if (props[key] === undefined || props[key] === null) {
          const variantMap = config.variants[key];
          if (variantMap && variantMap[value]) {
            classes.push(variantMap[value]);
          }
        }
      }
    }
    if (config.compoundVariants) {
      for (const compound of config.compoundVariants) {
        const matches = Object.entries(compound).every(([key, val]) => {
          if (key === 'className') return true;
          return props[key] === val;
        });
        if (matches) classes.push(compound.className);
      }
    }
    return classes.filter(Boolean).join(' ');
  };
}

export function cn(...inputs) {
  const output = [];
  for (const input of inputs) {
    if (!input) continue;
    if (typeof input === 'string' || typeof input === 'number') {
      output.push(input);
    } else if (Array.isArray(input)) {
      output.push(cn(...input));
    } else if (typeof input === 'object' && input !== null) {
      for (const [key, value] of Object.entries(input)) {
        if (value) output.push(key);
      }
    }
  }
  return output.join(' ');
}

export function formatCurrency(amount, currency = 'UZS', locale = 'uz-UZ') {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount).replace('UZS', '').replace('so\'m', '').trim();
}

export function formatPrice(amount) {
  return new Intl.NumberFormat('uz-UZ').format(amount);
}

export function formatTime(date) {
  return new Intl.DateTimeFormat('uz-UZ', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  }).format(new Date(date));
}

export function formatDate(date) {
  return new Intl.DateTimeFormat('uz-UZ', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(new Date(date));
}

export function formatDateTime(date) {
  return new Intl.DateTimeFormat('uz-UZ', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  }).format(new Date(date));
}

export function timeAgo(date) {
  const now = new Date();
  const past = new Date(date);
  const ms = now - past;
  const seconds = Math.floor(ms / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (seconds < 60) return `${seconds} soniya`;
  if (minutes < 60) return `${minutes} daqiqa`;
  if (hours < 24) return `${hours} soat`;
  if (days < 7) return `${days} kun`;
  return formatDate(date);
}

export function debounce(fn, delay) {
  let timeoutId;
  return (...args) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn(...args), delay);
  };
}

export function throttle(fn, limit) {
  let inThrottle;
  return (...args) => {
    if (!inThrottle) {
      fn(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}

export function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

export function getRandomColor(seed) {
  const colors = [
    'bg-primary/10 text-primary',
    'bg-success/10 text-success',
    'bg-warning/10 text-warning',
    'bg-info/10 text-info',
    'bg-danger/10 text-danger',
    'bg-purple/10 text-purple',
    'bg-pink/10 text-pink',
    'bg-orange/10 text-orange',
    'bg-teal/10 text-teal',
    'bg-lime/10 text-lime',
  ];
  let hash = 0;
  for (let i = 0; i < seed.length; i++) hash = seed.charCodeAt(i) + ((hash << 5) - hash);
  return colors[Math.abs(hash) % colors.length];
}

export function getContrastTextColor(hex) {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminance > 0.5 ? '#111827' : '#FFFFFF';
}

export function smoothScrollTo(elementId) {
  const element = document.getElementById(elementId);
  if (element) {
    element.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}

export function copyToClipboard(text) {
  if (navigator.clipboard && window.isSecureContext) {
    return navigator.clipboard.writeText(text);
  }
  const textArea = document.createElement('textarea');
  textArea.value = text;
  textArea.style.position = 'absolute';
  textArea.style.top = '-9999px';
  document.body.appendChild(textArea);
  const result = document.execCommand('copy');
  document.body.removeChild(textArea);
  return Promise.resolve(result);
}

export function downloadFile(url, filename) {
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}

export function isMobile() {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(max-width: 768px)').matches;
}

export function isTouchDevice() {
  if (typeof window === 'undefined') return false;
  return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
}

export function prefersReducedMotion() {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

export function lerp(start, end, t) {
  return start + (end - start) * t;
}

export function easeInOutCubic(t) {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

export function classNames(...classes) {
  return classes.filter(Boolean).join(' ');
}
