# Maison Sillage — Fragrance Studio

A responsive fragrance storefront and retail workspace for a fictional independent perfume house. The single-page app brings the customer-facing shop, in-store POS, admin studio, and client portal together under one brand.

## Run locally

```bash
npm install
npm run dev
```

Create a production build with `npm run build`.

## What's included

- **Studio dashboard:** sales snapshot, revenue chart, low-stock watchlist, best sellers, recent orders, product inventory, order management, and customer book.
- **Online store:** editorial storefront, fragrance family filters, search, saved scents, shopping bag, scent finder, and mock checkout with delivery or atelier pickup details.
- **Point of sale:** searchable product catalog, customer selection, adjustable sale basket, courtesy discount, card/cash/gift-card payment selection, and receipt confirmation.
- **Client portal:** loyalty progress, order history, saved fragrance wardrobe, profile details, and delivery status.
- **Local persistence:** catalog, orders, and saved scents are stored in browser `localStorage`; checkout and payments are demo interactions and are not connected to a payment provider or backend.

The app is built with React, Vite, and lucide-react. Product illustrations are rendered as inline SVG, with a locally bundled editorial hero image.
