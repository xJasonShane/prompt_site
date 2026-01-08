'use client';

import { useEffect } from 'react';

export function PerformanceMonitor() {
  useEffect(() => {
    // 监控页面加载性能
    if (typeof window !== 'undefined' && 'performance' in window) {
      const observer = new PerformanceObserver((list) => {
        list.getEntries().forEach((entry) => {
          // 记录长任务
          if (entry.entryType === 'longtask') {
            console.warn('Long task detected:', entry);
          }
          // 记录资源加载时间
          if (entry.entryType === 'resource') {
            if (entry.duration > 2000) {
              console.warn('Slow resource:', entry.name, entry.duration);
            }
          }
        });
      });

      observer.observe({ entryTypes: ['longtask', 'resource'] });

      // 监听页面可见性变化，暂停不必要的操作
      const handleVisibilityChange = () => {
        if (document.hidden) {
          // 页面隐藏时可以暂停一些操作
          console.log('Page hidden, pausing non-essential operations');
        } else {
          // 页面显示时恢复操作
          console.log('Page visible, resuming operations');
        }
      };

      document.addEventListener('visibilitychange', handleVisibilityChange);

      return () => {
        observer.disconnect();
        document.removeEventListener('visibilitychange', handleVisibilityChange);
      };
    }
  }, []);

  return null;
}
