module.exports = {
  "serverExternalPackages": [
    "@prisma/client",
    "mongoose"
  ],
  "poweredByHeader": false,
  "reactStrictMode": true,
  "onDemandEntries": {
    "maxInactiveAge": 3600000,
    "pagesBufferLength": 2
  },
  "images": {
    "domains": [
      "via.placeholder.com",
      "placehold.co"
    ],
    "formats": [
      "image/avif",
      "image/webp"
    ],
    "deviceSizes": [
      640,
      750,
      828,
      1080,
      1200,
      1920,
      2048,
      3840
    ],
    "imageSizes": [
      16,
      32,
      48,
      64,
      96,
      128,
      256,
      384
    ],
    "minimumCacheTTL": 604800
  },
  "compress": true,
  "env": {
    "NEXT_PUBLIC_VERCEL_ENV": "development",
    "FRONTEND_ONLY": "false"
  },
  "experimental": {
    "serverActions": {
      "bodySizeLimit": "2mb"
    },
    "optimizeCss": true,
    "optimizePackageImports": [
      "react-icons",
      "lodash",
      "date-fns"
    ]
  },
  "compiler": {}
}