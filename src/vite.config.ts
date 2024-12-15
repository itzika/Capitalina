@@ .. @@
   server: {
     proxy: {
       '/api/yahoo': {
-        target: 'https://query1.finance.yahoo.com',
        target: 'https://query1.finance.yahoo.com',
         changeOrigin: true,
         rewrite: (path) => path.replace(/^\/api\/yahoo/, ''),
-        configure: (proxy, _options) => {
-          proxy.on('error', (err, _req, _res) => {
-            console.log('proxy error', err);
-          });
-          proxy.on('proxyReq', (proxyReq, req, _res) => {
-            console.log('Sending Request to the Target:', req.method, req.url);
-          });
-          proxy.on('proxyRes', (proxyRes, req, _res) => {
-            console.log('Received Response from the Target:', proxyRes.statusCode, req.url);
-          });
+        headers: {
          'Accept': '*/*',
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
          'Accept-Language': 'en-US,en;q=0.9',
          'Cache-Control': 'no-cache',
          'Pragma': 'no-cache',
         },
        configure: (proxy) => {
          proxy.on('error', (err) => {
            console.error('Proxy error:', err);
          });
          proxy.on('proxyRes', (proxyRes) => {
            if (proxyRes.statusCode >= 400) {
              console.error('Proxy response error:', proxyRes.statusCode);
            }
          });
        },
       },
     },
   },