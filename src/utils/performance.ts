import React from 'react';

// 성능 최적화 유틸리티 함수들

// 디바운스 함수 - 검색 입력 최적화
export function debounce<T extends (...args: unknown[]) => unknown>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

// 스로틀 함수 - 스크롤 이벤트 최적화
export function throttle<T extends (...args: unknown[]) => unknown>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean;
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}

// 이미지 지연 로딩을 위한 Intersection Observer
export function createImageObserver(
  callback: (entries: IntersectionObserverEntry[]) => void,
  options: IntersectionObserverInit = {}
): IntersectionObserver {
  return new IntersectionObserver(callback, {
    rootMargin: '50px',
    threshold: 0.1,
    ...options,
  });
}

// 메모이제이션을 위한 간단한 캐시
export function createCache<T>(maxSize: number = 100) {
  const cache = new Map<string, T>();
  
  return {
    get: (key: string): T | undefined => cache.get(key),
    set: (key: string, value: T): void => {
      if (cache.size >= maxSize) {
        const firstKey = cache.keys().next().value;
        if (firstKey) {
          cache.delete(firstKey);
        }
      }
      cache.set(key, value);
    },
    clear: (): void => cache.clear(),
    has: (key: string): boolean => cache.has(key),
  };
}

// 가상화를 위한 아이템 청크 생성
export function chunkArray<T>(array: T[], chunkSize: number): T[][] {
  const chunks: T[][] = [];
  for (let i = 0; i < array.length; i += chunkSize) {
    chunks.push(array.slice(i, i + chunkSize));
  }
  return chunks;
}

// 성능 측정을 위한 유틸리티
export const performanceUtils = {
  measure: (name: string, fn: () => void) => {
    const start = performance.now();
    fn();
    const end = performance.now();
    console.log(`${name} took ${end - start}ms`);
  },
  
  measureAsync: async (name: string, fn: () => Promise<void>) => {
    const start = performance.now();
    await fn();
    const end = performance.now();
    console.log(`${name} took ${end - start}ms`);
  },
};

// 웹 워커를 위한 메시지 타입
export interface WorkerMessage {
  type: string;
  payload: unknown;
}

// 무거운 계산을 위한 웹 워커 생성
export function createWorker(workerFunction: string): Worker {
  const blob = new Blob([workerFunction], { type: 'application/javascript' });
  return new Worker(URL.createObjectURL(blob));
}

/**
 * 메모이제이션 함수 - 함수 결과를 캐싱
 */
export function memoize<T extends (...args: unknown[]) => unknown>(
  func: T
): T {
  const cache = new Map();
  return ((...args: Parameters<T>) => {
    const key = JSON.stringify(args);
    if (cache.has(key)) {
      return cache.get(key);
    }
    const result = func(...args);
    cache.set(key, result);
    return result;
  }) as T;
}

/**
 * 성능 측정 함수
 */
export function measurePerformance<T>(
  name: string,
  fn: () => T
): T {
  const start = performance.now();
  const result = fn();
  const end = performance.now();
  console.log(`${name} took ${end - start}ms`);
  return result;
}

/**
 * 컴포넌트 지연 로딩을 위한 동적 import 래퍼
 */
export function lazyLoad<T>(
  importFunc: () => Promise<{ default: React.ComponentType<T> }>
) {
  return importFunc;
}

/**
 * 캐시 관리를 위한 LRU 캐시
 */
export class LRUCache<K, V> {
  private cache = new Map<K, V>();
  private maxSize: number;

  constructor(maxSize: number = 100) {
    this.maxSize = maxSize;
  }

  get(key: K): V | undefined {
    if (this.cache.has(key)) {
      const value = this.cache.get(key)!;
      this.cache.delete(key);
      this.cache.set(key, value);
      return value;
    }
    return undefined;
  }

  set(key: K, value: V): void {
    if (this.cache.has(key)) {
      this.cache.delete(key);
    } else if (this.cache.size >= this.maxSize) {
      const firstKey = this.cache.keys().next().value;
      if (firstKey !== undefined) {
        this.cache.delete(firstKey);
      }
    }
    this.cache.set(key, value);
  }

  clear(): void {
    this.cache.clear();
  }

  size(): number {
    return this.cache.size;
  }
}

/**
 * 웹 워커를 위한 메시지 래퍼
 */
export function createWorkerMessage<T>(data: T): MessageEvent<T> {
  return new MessageEvent('message', { data });
}

/**
 * 스크롤 성능 최적화를 위한 패시브 이벤트 리스너
 */
export function addPassiveEventListener(
  element: EventTarget,
  event: string,
  handler: EventListener
): void {
  element.addEventListener(event, handler, { passive: true });
}

/**
 * 메모리 누수 방지를 위한 정리 함수
 */
export function cleanupResources(resources: (() => void)[]): void {
  resources.forEach(cleanup => {
    try {
      cleanup();
    } catch (error) {
      console.warn('Cleanup error:', error);
    }
  });
}

/**
 * 컴포넌트 언마운트 시 정리 함수 등록
 */
export function registerCleanup(cleanup: () => void): () => void {
  return cleanup;
}

/**
 * 성능 모니터링을 위한 메트릭 수집
 */
export class PerformanceMetrics {
  private metrics: Map<string, number[]> = new Map();

  record(metric: string, value: number): void {
    if (!this.metrics.has(metric)) {
      this.metrics.set(metric, []);
    }
    this.metrics.get(metric)!.push(value);
  }

  getAverage(metric: string): number {
    const values = this.metrics.get(metric);
    if (!values || values.length === 0) return 0;
    return values.reduce((a, b) => a + b, 0) / values.length;
  }

  getMetrics(): Record<string, number> {
    const result: Record<string, number> = {};
    for (const [metric] of this.metrics) {
      result[metric] = this.getAverage(metric);
    }
    return result;
  }

  clear(): void {
    this.metrics.clear();
  }
}

// 전역 성능 메트릭 인스턴스
export const performanceMetrics = new PerformanceMetrics();

 