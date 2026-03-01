const CACHE_NAME = 'pwa-bbs-cache-v2';
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/vite.svg',
  '/src/main.tsx',
  '/src/index.css'
];

// インストール時に静的アセットをキャッシュ
self.addEventListener('install', (event: any) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(STATIC_ASSETS))
      .then(() => (self as any).skipWaiting())
  );
});

// アクティベート時に古いキャッシュを削除
self.addEventListener('activate', (event: any) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.filter((name) => name !== CACHE_NAME)
          .map((name) => caches.delete(name))
      );
    })
  );
});

// フェッチイベント
self.addEventListener('fetch', (event: any) => {
  const { request } = event;
  const url = new URL(request.url);

  // APIリクエストはキャッシュしない（またはNetwork-firstにする）
  if (url.origin === self.location.origin) {
    event.respondWith(
      caches.match(request).then((response) => {
        // キャッシュがあればそれを返し、バックグラウンドでネットワークから更新する (Stale-while-revalidate)
        const fetchPromise = fetch(request).then((networkResponse) => {
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(request, networkResponse.clone());
          });
          return networkResponse;
        });
        return response || fetchPromise;
      })
    );
  } else {
    // 外部APIなど
    event.respondWith(fetch(request));
  }
});
