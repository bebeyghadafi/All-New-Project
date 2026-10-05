import { useEffect, useId, useMemo, useState } from 'react'
import {
  Activity,
  ArrowDownRight,
  ArrowRight,
  ArrowUpRight,
  Banknote,
  BarChart3,
  Bell,
  Check,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  CircleHelp,
  Clock3,
  CreditCard,
  Download,
  Ellipsis,
  Flower2,
  Heart,
  LayoutDashboard,
  Leaf,
  Mail,
  MapPin,
  Menu,
  Minus,
  Package,
  PackageCheck,
  Plus,
  Receipt,
  Search,
  Settings2,
  ShieldCheck,
  ShoppingBag,
  ShoppingCart,
  Sparkles,
  Star,
  Tag,
  Trash2,
  Truck,
  UserRound,
  UsersRound,
  WalletCards,
  X,
} from 'lucide-react'

const INITIAL_PRODUCTS = [
  {
    id: 'santal-lumiere',
    name: 'Santal Lumière',
    collection: 'No. 04 · Eau de parfum',
    notes: 'Sandalwood · Fig · Amber',
    price: 142,
    stock: 8,
    category: 'Woody',
    size: '50 ml',
    badge: 'Bestseller',
    variant: 0,
  },
  {
    id: 'rose-noire',
    name: 'Rose Noire',
    collection: 'No. 07 · Eau de parfum',
    notes: 'Damask rose · Saffron · Musk',
    price: 156,
    stock: 14,
    category: 'Floral',
    size: '50 ml',
    badge: 'Atelier pick',
    variant: 1,
  },
  {
    id: 'cote-dor',
    name: "Côte d'Or",
    collection: 'No. 11 · Eau de parfum',
    notes: 'Neroli · Bergamot · Sea salt',
    price: 128,
    stock: 4,
    category: 'Fresh',
    size: '50 ml',
    badge: 'Low stock',
    variant: 2,
  },
  {
    id: 'heure-bleue',
    name: "L'Heure Bleue",
    collection: 'No. 02 · Eau de parfum',
    notes: 'Iris · Violet · Vanilla',
    price: 168,
    stock: 3,
    category: 'Floral',
    size: '75 ml',
    badge: 'Limited',
    variant: 3,
  },
  {
    id: 'bois-serein',
    name: 'Bois Serein',
    collection: 'No. 09 · Eau de parfum',
    notes: 'Cedar · Vetiver · Black tea',
    price: 148,
    stock: 11,
    category: 'Woody',
    size: '50 ml',
    badge: '',
    variant: 4,
  },
  {
    id: 'discovery-set',
    name: 'The Discovery Set',
    collection: 'Six fragrances · Sample set',
    notes: 'Six little ways to be remembered',
    price: 38,
    stock: 22,
    category: 'Discovery',
    size: '6 × 2 ml',
    badge: 'A little luxury',
    variant: 5,
  },
]

const INITIAL_ORDERS = [
  { id: '#SG-1051', customer: 'Alice Laurent', date: 'Today, 10:24 am', items: 'Santal Lumière · 50 ml', total: 142, channel: 'Online', status: 'Preparing' },
  { id: '#SG-1050', customer: 'Julien Moreau', date: 'Today, 9:18 am', items: "Côte d'Or · 50 ml", total: 128, channel: 'In store', status: 'Completed' },
  { id: '#SG-1049', customer: 'Camille Roche', date: 'Yesterday, 4:42 pm', items: 'Rose Noire + Discovery Set', total: 194, channel: 'Online', status: 'Shipped' },
  { id: '#SG-1048', customer: 'Élise Laurent', date: 'Yesterday, 1:06 pm', items: "L'Heure Bleue · 75 ml", total: 168, channel: 'In store', status: 'Completed' },
]

const CUSTOMERS = [
  { name: 'Alice Laurent', initials: 'AL', email: 'alice.laurent@email.com', orders: 8, spent: 986, tier: 'Atelier' },
  { name: 'Camille Roche', initials: 'CR', email: 'camille.roche@email.com', orders: 5, spent: 742, tier: 'Essence' },
  { name: 'Julien Moreau', initials: 'JM', email: 'julien.moreau@email.com', orders: 12, spent: 1_428, tier: 'Atelier' },
  { name: 'Élise Laurent', initials: 'EL', email: 'elise.laurent@email.com', orders: 3, spent: 402, tier: 'Essence' },
  { name: 'Noémie Bernard', initials: 'NB', email: 'noemie.bernard@email.com', orders: 6, spent: 895, tier: 'Atelier' },
]

const money = (amount) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: amount % 1 === 0 ? 0 : 2 }).format(amount)
const safeRead = (key, fallback) => {
  try {
    const value = window.localStorage.getItem(key)
    return value ? JSON.parse(value) : fallback
  } catch {
    return fallback
  }
}

function BottleArt({ variant = 0, compact = false, className = '' }) {
  const palette = [
    { backdrop: '#e9ded2', glass: '#a95e4a', glass2: '#4c3034', cap: '#33282a', liquid: '#b96c3c', label: '#eee1ce' },
    { backdrop: '#ebe1e2', glass: '#bd8794', glass2: '#68444d', cap: '#533d43', liquid: '#c27782', label: '#f4e9e3' },
    { backdrop: '#e0e6e2', glass: '#5a8c7e', glass2: '#294b49', cap: '#283b37', liquid: '#b3a978', label: '#ebe5d1' },
    { backdrop: '#e7e3e9', glass: '#79728e', glass2: '#3c3649', cap: '#332f39', liquid: '#9c83a2', label: '#f2e9d7' },
    { backdrop: '#e7dfd2', glass: '#94774f', glass2: '#4f4332', cap: '#383126', liquid: '#9d733d', label: '#ede3ce' },
    { backdrop: '#eae5db', glass: '#c29a69', glass2: '#765633', cap: '#483c2d', liquid: '#cf9a4c', label: '#f1e8d5' },
  ][Math.abs(variant) % 6]
  const uid = `bottle-${variant}-${useId().replaceAll(':', '')}`
  return (
    <div className={`bottle-art ${compact ? 'bottle-art--compact' : ''} ${className}`} style={{ '--art-bg': palette.backdrop }} aria-hidden="true">
      <svg viewBox="0 0 220 250" role="presentation">
        <defs>
          <linearGradient id={`${uid}-glass`} x1="0" x2="1" y1="0" y2="1">
            <stop offset="0" stopColor={palette.glass} />
            <stop offset=".52" stopColor={palette.liquid} />
            <stop offset="1" stopColor={palette.glass2} />
          </linearGradient>
          <linearGradient id={`${uid}-shine`} x1="0" x2="1" y1="0" y2="0">
            <stop offset="0" stopColor="#fff" stopOpacity=".7" />
            <stop offset=".35" stopColor="#fff" stopOpacity=".08" />
            <stop offset="1" stopColor="#fff" stopOpacity=".32" />
          </linearGradient>
          <linearGradient id={`${uid}-metal`} x1="0" x2="0" y1="0" y2="1">
            <stop offset="0" stopColor="#f1d8a6" />
            <stop offset=".48" stopColor="#b48c52" />
            <stop offset="1" stopColor="#e4c992" />
          </linearGradient>
        </defs>
        <ellipse cx="111" cy="224" rx="59" ry="10" fill="#4b3933" opacity=".13" />
        <rect x="91" y="37" width="38" height="27" rx="5" fill={palette.cap} />
        <rect x="86" y="59" width="48" height="9" rx="3" fill={`url(#${uid}-metal)`} />
        <rect x="98" y="65" width="24" height="19" rx="3" fill={palette.glass2} />
        <path d="M76 82 Q76 73 86 73 H134 Q144 73 144 82 L153 100 Q158 108 158 119 V193 Q158 207 144 211 Q111 220 76 211 Q62 207 62 193 V119 Q62 108 67 100 Z" fill={`url(#${uid}-glass)`} stroke="#fff" strokeOpacity=".55" strokeWidth="2" />
        <path d="M72 111 Q74 102 79 91 L86 84 V194 Q86 201 78 199 Q72 197 72 190 Z" fill={`url(#${uid}-shine)`} opacity=".72" />
        <path d="M149 116 V191 Q149 203 141 205" fill="none" stroke="#fff" strokeOpacity=".47" strokeWidth="2" />
        <rect x="78" y="123" width="64" height="45" rx="2" fill={palette.label} opacity=".92" />
        <line x1="87" y1="132" x2="133" y2="132" stroke={palette.glass2} strokeOpacity=".3" />
        <text x="110" y="145" textAnchor="middle" fill={palette.glass2} fontFamily="Georgia,serif" fontSize="8" letterSpacing="1.1">MAISON</text>
        <text x="110" y="156" textAnchor="middle" fill={palette.glass2} fontFamily="Georgia,serif" fontSize="8" letterSpacing="1.1">SILLAGE</text>
        <text x="110" y="164" textAnchor="middle" fill={palette.glass2} fontFamily="Arial,sans-serif" fontSize="4.5" letterSpacing="1.3">PARIS · FRANCE</text>
        <path d="M67 201 Q110 211 153 201" fill="none" stroke="#fff" strokeOpacity=".35" />
      </svg>
    </div>
  )
}

function AppHeader({ activeView, onNavigate, products, orders, onGlobalSearch, onSearchProduct, onSearchOrder, globalSearch, onOpenNotifications, noticeOpen, onDismissNotices }) {
  const [profileOpen, setProfileOpen] = useState(false)
  const [searchFocused, setSearchFocused] = useState(false)
  const nav = [
    { id: 'studio', label: 'Admin', icon: LayoutDashboard },
    { id: 'store', label: 'Online store', icon: ShoppingBag },
    { id: 'pos', label: 'Point of sale', icon: Activity },
    { id: 'client', label: 'Client portal', icon: UserRound },
  ]
  const q = globalSearch.trim().toLowerCase()
  const searchProducts = q ? products.filter((product) => `${product.name} ${product.category} ${product.notes}`.toLowerCase().includes(q)).slice(0, 3) : []
  const searchOrders = q ? orders.filter((order) => `${order.id} ${order.customer}`.toLowerCase().includes(q)).slice(0, 2) : []
  const showSearchResults = searchFocused && q && (searchProducts.length > 0 || searchOrders.length > 0)

  return (
    <header className="app-header">
      <button className="brand-lockup" onClick={() => onNavigate('studio')} aria-label="Go to studio overview">
        <span className="brand-mark"><Flower2 size={18} strokeWidth={1.5} /></span>
        <span className="brand-type"><strong>maison sillage</strong><small>FRAGRANCE STUDIO</small></span>
      </button>
      <nav className="global-nav" aria-label="Main navigation">
        {nav.map(({ id, label, icon: Icon }) => (
          <button key={id} onClick={() => onNavigate(id)} className={`global-nav__item ${activeView === id ? 'is-active' : ''}`}>
            <Icon size={15} strokeWidth={1.8} />
            <span>{label}</span>
          </button>
        ))}
      </nav>
      <div className="header-tools">
        <div className="global-search-wrap">
          <Search size={16} />
          <input
            aria-label="Search products and orders"
            value={globalSearch}
            placeholder="Search products, orders…"
            onChange={(event) => onGlobalSearch(event.target.value)}
            onFocus={() => setSearchFocused(true)}
            onBlur={() => window.setTimeout(() => setSearchFocused(false), 150)}
            onKeyDown={(event) => {
              if (event.key === 'Escape') onGlobalSearch('')
              if (event.key === 'Enter' && searchProducts[0]) {
                onSearchProduct(searchProducts[0].name)
                setSearchFocused(false)
              }
            }}
          />
          <kbd>/</kbd>
          {showSearchResults && (
            <div className="search-results">
              <p className="search-results__label">MATCHING PRODUCTS</p>
              {searchProducts.map((product) => (
                <button key={product.id} onMouseDown={(event) => event.preventDefault()} onClick={() => { onSearchProduct(product.name); setSearchFocused(false) }}>
                  <span className="search-results__icon"><Package size={15} /></span>
                  <span><strong>{product.name}</strong><small>{product.category} · {money(product.price)}</small></span>
                  <ArrowRight size={14} />
                </button>
              ))}
              {searchOrders.length > 0 && <p className="search-results__label search-results__label--orders">RECENT ORDERS</p>}
              {searchOrders.map((order) => (
                <button key={order.id} onMouseDown={(event) => event.preventDefault()} onClick={() => { onSearchOrder(order.id); setSearchFocused(false) }}>
                  <span className="search-results__icon"><Receipt size={15} /></span>
                  <span><strong>{order.id} · {order.customer}</strong><small>{money(order.total)} · {order.status}</small></span>
                  <ArrowRight size={14} />
                </button>
              ))}
            </div>
          )}
        </div>
        <div className="header-popover-wrap">
          <button className={`icon-button notification-trigger ${noticeOpen ? 'is-open' : ''}`} onClick={onOpenNotifications} aria-label="Notifications">
            <Bell size={17} strokeWidth={1.8} /><span className="notification-dot" />
          </button>
          {noticeOpen && (
            <div className="notice-popover">
              <div className="popover-heading"><strong>Little things to know</strong><button onClick={onDismissNotices} aria-label="Close notifications"><X size={15} /></button></div>
              <div className="notice-item"><span className="notice-dot notice-dot--rose"><Package size={14} /></span><span><strong>Stock is running low</strong><small>3 fragrances are below 5 units.</small></span></div>
              <div className="notice-item"><span className="notice-dot notice-dot--green"><ShoppingBag size={14} /></span><span><strong>New order received</strong><small>#SG-1051 is ready to prepare.</small></span></div>
              <button className="popover-link" onClick={() => { onNavigate('studio'); onDismissNotices() }}>View your studio <ArrowRight size={14} /></button>
            </div>
          )}
        </div>
        <div className="header-popover-wrap profile-wrap">
          <button className="profile-chip" onClick={() => setProfileOpen((value) => !value)} aria-expanded={profileOpen}>
            <span className="profile-avatar">AM</span>
            <span className="profile-copy"><strong>Amélie Martin</strong><small>Owner</small></span>
            <ChevronDown size={14} />
          </button>
          {profileOpen && (
            <div className="profile-popover">
              <span className="profile-popover__hello">Signed in as</span>
              <strong>Amélie Martin</strong>
              <button onClick={() => { onNavigate('client'); setProfileOpen(false) }}><UserRound size={15} /> Preview client portal</button>
              <button onClick={() => { onNavigate('studio'); setProfileOpen(false) }}><Settings2 size={15} /> Studio settings</button>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}

function PageHeading({ eyebrow, title, description, actions }) {
  return (
    <div className="page-heading">
      <div>
        <p className="eyebrow">{eyebrow}</p>
        <h1>{title}</h1>
        {description && <p className="page-heading__description">{description}</p>}
      </div>
      {actions && <div className="page-heading__actions">{actions}</div>}
    </div>
  )
}

function StudioTabs({ activeTab, onChange, productCount, orderCount }) {
  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'products', label: 'Products', count: String(productCount).padStart(2, '0') },
    { id: 'orders', label: 'Orders', count: String(orderCount).padStart(2, '0') },
    { id: 'customers', label: 'Customers' },
  ]
  return (
    <div className="studio-tabs" role="tablist" aria-label="Studio sections">
      {tabs.map((tab) => <button key={tab.id} role="tab" aria-selected={activeTab === tab.id} onClick={() => onChange(tab.id)} className={activeTab === tab.id ? 'is-active' : ''}>{tab.label}{tab.count && <span>{tab.count}</span>}</button>)}
    </div>
  )
}

function MetricCard({ label, value, trend, trendLabel, icon: Icon, tone = 'plum' }) {
  return (
    <article className="metric-card">
      <div className="metric-card__top"><span>{label}</span><span className={`metric-card__icon metric-card__icon--${tone}`}><Icon size={16} strokeWidth={1.8} /></span></div>
      <div className="metric-card__value">{value}</div>
      <div className="metric-card__foot"><span className="metric-trend"><ArrowUpRight size={13} />{trend}</span><span>{trendLabel}</span></div>
    </article>
  )
}

const CHART_SERIES = {
  '7 days': [31, 43, 36, 51, 45, 64, 57, 73, 62, 79, 69, 92],
  '30 days': [34, 38, 35, 44, 40, 50, 45, 59, 54, 61, 68, 82],
  '90 days': [25, 33, 30, 37, 42, 39, 53, 48, 63, 59, 70, 84],
}

function SalesChart({ range, setRange }) {
  const values = CHART_SERIES[range]
  const points = values.map((value, index) => `${(index / (values.length - 1)) * 100},${100 - value}`).join(' ')
  const first = values[0]
  const last = values[values.length - 1]
  return (
    <section className="panel sales-panel">
      <div className="panel-heading">
        <div><p className="panel-kicker">REVENUE OVER TIME</p><h2>Sales performance</h2></div>
        <div className="select-like"><select value={range} onChange={(event) => setRange(event.target.value)} aria-label="Sales chart date range"><option>7 days</option><option>30 days</option><option>90 days</option></select><ChevronDown size={13} /></div>
      </div>
      <div className="chart-summary"><strong>$8,420.80</strong><span><ArrowUpRight size={13} /> 12.8%</span><small>compared to previous period</small></div>
      <div className="chart-wrap">
        <div className="chart-y-labels"><span>$2.5k</span><span>$1.8k</span><span>$1.2k</span><span>$600</span><span>$0</span></div>
        <div className="chart-main">
          <div className="chart-grid"><i /><i /><i /><i /><i /></div>
          <svg className="sales-chart" viewBox="0 0 100 100" preserveAspectRatio="none" aria-label={`Sales trend for ${range}`} role="img">
            <defs><linearGradient id="sales-fill" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stopColor="#825363" stopOpacity=".22" /><stop offset="1" stopColor="#825363" stopOpacity="0" /></linearGradient></defs>
            <polygon points={`0,100 ${points} 100,100`} fill="url(#sales-fill)" />
            <polyline points={points} fill="none" stroke="#764956" strokeWidth="1.7" vectorEffect="non-scaling-stroke" strokeLinecap="round" strokeLinejoin="round" />
            <circle cx="100" cy={100 - last} r="2.3" fill="#764956" stroke="#fff" strokeWidth="1.4" vectorEffect="non-scaling-stroke" />
            <circle cx="0" cy={100 - first} r="1.5" fill="#b88a7d" stroke="#fff" strokeWidth="1.2" vectorEffect="non-scaling-stroke" />
          </svg>
          <div className="chart-x-labels"><span>Sep 29</span><span>Sep 30</span><span>Oct 01</span><span>Oct 02</span><span>Oct 03</span><span>Oct 04</span><span>Oct 05</span></div>
        </div>
      </div>
      <div className="chart-footnote"><span><i className="legend-dot" /> Gross sales</span><span>Updated just now</span></div>
    </section>
  )
}

function LowStockPanel({ products, onViewInventory }) {
  const lowStock = products.filter((product) => product.stock <= 5).slice(0, 3)
  return (
    <section className="panel stock-panel">
      <div className="panel-heading"><div><p className="panel-kicker">NEEDS A LITTLE LOVE</p><h2>Running low</h2></div><button className="round-action" onClick={onViewInventory} aria-label="View inventory"><ArrowRight size={16} /></button></div>
      <div className="stock-list">
        {lowStock.map((product) => <div className="stock-row" key={product.id}><span className={`stock-swatch stock-swatch--${product.variant % 6}`}><BottleArt variant={product.variant} compact /></span><span className="stock-row__info"><strong>{product.name}</strong><small>{product.collection.split('·')[0].trim()}</small></span><span className={`stock-count ${product.stock <= 3 ? 'stock-count--alert' : ''}`}>{product.stock}<small>left</small></span></div>)}
        {lowStock.length === 0 && <div className="empty-note">Everything is beautifully stocked.</div>}
      </div>
      <button className="text-link" onClick={onViewInventory}>Review inventory <ArrowRight size={14} /></button>
    </section>
  )
}

function RecentOrders({ orders, onViewAll }) {
  return (
    <section className="panel orders-panel">
      <div className="panel-heading"><div><p className="panel-kicker">THE LATEST COMINGS & GOINGS</p><h2>Recent orders</h2></div><button className="text-link" onClick={onViewAll}>View all <ArrowRight size={14} /></button></div>
      <OrdersTable orders={orders.slice(0, 4)} compact />
    </section>
  )
}

function OrdersTable({ orders, compact = false, onStatusChange }) {
  if (!orders.length) return <div className="empty-table"><span><Search size={18} /></span><strong>No orders just yet</strong><small>When an order arrives, it will find a home here.</small></div>
  return (
    <div className={`table-scroll ${compact ? 'table-scroll--compact' : ''}`}>
      <table className="data-table">
        <thead><tr><th>Order</th><th>Customer</th><th>Placed</th><th>Channel</th><th>Fulfillment</th><th>Total</th><th>Status</th><th /></tr></thead>
        <tbody>{orders.map((order) => (
          <tr key={order.id}>
            <td><strong className="order-id">{order.id}</strong><small className="cell-subtitle">{order.items}</small></td>
            <td><span className="customer-cell"><span className="tiny-avatar">{order.customer.split(' ').map((part) => part[0]).slice(0, 2).join('')}</span>{order.customer}</span></td>
            <td className="muted-cell">{order.date}</td>
            <td><span className="channel-tag">{order.channel}</span></td>
            <td title={order.deliveryAddress || ''}>{order.deliveryMethod ? <><span className="channel-tag">{order.deliveryMethod === 'Studio pickup' ? 'Studio pickup' : 'Delivery'}</span>{!compact && order.deliveryAddress && <small className="cell-subtitle fulfillment-address">{order.deliveryAddress}</small>}</> : <span className="muted-cell">—</span>}</td>
            <td className="table-total">{money(order.total)}</td>
            <td>{onStatusChange ? <select className={`status-select status-${order.status.toLowerCase().replaceAll(' ', '-')}`} value={order.status} onChange={(event) => onStatusChange(order.id, event.target.value)} aria-label={`Update status for ${order.id}`}><option>Preparing</option><option>Completed</option><option>Shipped</option><option>Ready for pickup</option></select> : <StatusPill status={order.status} />}</td>
            <td><button className="table-more" aria-label={`More options for ${order.id}`}><Ellipsis size={16} /></button></td>
          </tr>
        ))}</tbody>
      </table>
    </div>
  )
}

function StatusPill({ status }) {
  const className = status.toLowerCase().replaceAll(' ', '-')
  return <span className={`status-pill status-${className}`}><i />{status}</span>
}

function BestSellersPanel({ products }) {
  const popularity = [
    { id: 'santal-lumiere', sold: 38, bar: 92 },
    { id: 'rose-noire', sold: 27, bar: 72 },
    { id: 'discovery-set', sold: 19, bar: 53 },
  ]
  return (
    <section className="panel bestsellers-panel">
      <div className="panel-heading"><div><p className="panel-kicker">LOVED BY YOUR CUSTOMERS</p><h2>Quiet favourites</h2></div><button className="round-action" aria-label="More sales insights"><BarChart3 size={16} /></button></div>
      <div className="bestsellers-list">{popularity.map((item, index) => {
        const product = products.find((entry) => entry.id === item.id) || products[index]
        if (!product) return null
        return <div className="bestseller-row" key={item.id}><div className="bestseller-row__name"><span className="bestseller-rank">0{index + 1}</span><strong>{product.name}</strong><small>{item.sold} sold</small></div><div className="mini-bar"><i style={{ width: `${item.bar}%` }} /></div></div>
      })}</div>
    </section>
  )
}

function StudioOverview({ products, orders, range, setRange, onGoToInventory, onGoToOrders }) {
  const additionalSales = orders.reduce((sum, order) => sum + (Number(order.id.replace('#SG-', '')) >= 1052 ? order.total : 0), 0)
  return (
    <>
      <div className="metrics-grid">
        <MetricCard label="Net sales" value={money(8420.8 + additionalSales)} trend="12.8%" trendLabel="vs. last month" icon={WalletCards} tone="plum" />
        <MetricCard label="Orders today" value={`${12 + Math.max(0, orders.length - INITIAL_ORDERS.length)}`} trend="8.4%" trendLabel="vs. yesterday" icon={ShoppingBag} tone="sage" />
        <MetricCard label="Average order" value="$96.40" trend="4.2%" trendLabel="vs. last month" icon={Tag} tone="sand" />
        <MetricCard label="Needs restock" value={String(products.filter((product) => product.stock <= 5).length).padStart(2, '0')} trend="2 urgent" trendLabel={`across ${products.length} SKUs`} icon={PackageCheck} tone="rose" />
      </div>
      <div className="overview-grid">
        <SalesChart range={range} setRange={setRange} />
        <LowStockPanel products={products} onViewInventory={onGoToInventory} />
      </div>
      <div className="overview-bottom-grid">
        <RecentOrders orders={orders} onViewAll={onGoToOrders} />
        <BestSellersPanel products={products} />
      </div>
    </>
  )
}

function ProductTable({ products, onRestock, onEdit }) {
  return (
    <div className="table-scroll product-table-wrap">
      <table className="data-table product-table">
        <thead><tr><th>Product</th><th>Collection</th><th>Category</th><th>Price</th><th>Stock level</th><th>Availability</th><th /></tr></thead>
        <tbody>{products.map((product) => (
          <tr key={product.id}>
            <td><div className="inventory-product"><span className="inventory-product__art"><BottleArt variant={product.variant} compact /></span><span><strong>{product.name}</strong><small>SKU · MS-{String(product.variant + 4).padStart(3, '0')}</small></span></div></td>
            <td className="muted-cell">{product.collection.replace(' · ', ' / ')}</td>
            <td><span className="category-tag">{product.category}</span></td>
            <td className="table-total">{money(product.price)}</td>
            <td><div className="stock-meter"><span>{product.stock} units</span><i><b style={{ width: `${Math.max(6, Math.min(100, product.stock * 5))}%` }} className={product.stock <= 5 ? 'is-low' : ''} /></i></div></td>
            <td><span className={`availability ${product.stock <= 3 ? 'availability--critical' : product.stock <= 5 ? 'availability--low' : ''}`}><i />{product.stock <= 3 ? 'Critical' : product.stock <= 5 ? 'Low stock' : 'In stock'}</span></td>
            <td><button className="table-more" onClick={() => onRestock(product.id)} title="Add five units" aria-label={`Restock ${product.name}`}><Plus size={16} /></button></td>
          </tr>
        ))}</tbody>
      </table>
    </div>
  )
}

function ProductsAdmin({ products, onAddProduct, onRestock, onEdit }) {
  const totalValue = products.reduce((sum, item) => sum + item.price * item.stock, 0)
  return (
    <div className="admin-catalog-view">
      <div className="catalog-summary-row">
        <div className="catalog-summary-copy"><span className="catalog-summary-icon"><Package size={17} /></span><span><strong>{products.length} active fragrances</strong><small>{money(totalValue)} retail value on hand</small></span></div>
        <div className="catalog-actions"><button className="button button--outline" onClick={onEdit}><Settings2 size={15} /> Manage categories</button><button className="button button--primary" onClick={onAddProduct}><Plus size={16} /> Add product</button></div>
      </div>
      <section className="panel product-table-panel"><div className="panel-heading"><div><p className="panel-kicker">YOUR COLLECTION, WELL COMPOSED</p><h2>All products</h2></div><button className="filter-button"><Settings2 size={15} /> Filters <span>2</span></button></div><ProductTable products={products} onRestock={onRestock} onEdit={onEdit} /></section>
      <div className="inventory-note"><Sparkles size={15} /><span>Tip: Keep your best-loved fragrances above 8 units to stay ready for the weekend.</span></div>
    </div>
  )
}

function OrdersAdmin({ orders, onStatusChange, globalSearch }) {
  const [filter, setFilter] = useState('All orders')
  const filters = ['All orders', 'Online', 'In store']
  const filteredOrders = orders.filter((order) => (filter === 'All orders' || order.channel === filter) && (!globalSearch.trim() || `${order.id} ${order.customer} ${order.items}`.toLowerCase().includes(globalSearch.trim().toLowerCase())))
  return (
    <div className="admin-orders-view">
      <div className="order-filters-row"><div className="filter-tabs">{filters.map((item) => <button className={filter === item ? 'is-active' : ''} onClick={() => setFilter(item)} key={item}>{item}</button>)}</div><div className="order-filter-actions"><span><Clock3 size={14} /> Latest first</span><button className="filter-button"><Settings2 size={15} /> Filters</button></div></div>
      <section className="panel full-orders-panel"><div className="panel-heading"><div><p className="panel-kicker">KEEP EVERY DETAIL CLOSE</p><h2>All orders <span className="heading-count">{filteredOrders.length}</span></h2></div><button className="button button--outline button--small"><Download size={14} /> Export orders</button></div><OrdersTable orders={filteredOrders} onStatusChange={onStatusChange} /></section>
      <div className="orders-footer-note"><ShieldCheck size={15} /> Order details are securely synced across your studio.</div>
    </div>
  )
}

function CustomersAdmin() {
  const [query, setQuery] = useState('')
  const visibleCustomers = CUSTOMERS.filter((customer) => `${customer.name} ${customer.email}`.toLowerCase().includes(query.toLowerCase()))
  return (
    <div className="admin-customers-view">
      <div className="customer-stats"><div><span className="customer-stat-icon"><UsersRound size={16} /></span><span><strong>1,248</strong><small>Returning customers</small></span></div><div><span className="customer-stat-icon customer-stat-icon--sage"><Star size={16} /></span><span><strong>38%</strong><small>Repeat purchase rate</small></span></div><div><span className="customer-stat-icon customer-stat-icon--sand"><Sparkles size={16} /></span><span><strong>86</strong><small>New this month</small></span></div></div>
      <section className="panel customers-panel"><div className="panel-heading"><div><p className="panel-kicker">THE PEOPLE BEHIND THE SCENT</p><h2>Customer book</h2></div><div className="inline-search"><Search size={15} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Find a customer" aria-label="Search customers" /></div></div>
        <div className="table-scroll"><table className="data-table customer-table"><thead><tr><th>Customer</th><th>Orders</th><th>Lifetime value</th><th>Membership</th><th>Last seen</th><th /></tr></thead><tbody>{visibleCustomers.map((customer, index) => <tr key={customer.email}><td><div className="customer-profile-cell"><span className={`customer-avatar customer-avatar--${index % 4}`}>{customer.initials}</span><span><strong>{customer.name}</strong><small>{customer.email}</small></span></div></td><td>{customer.orders} orders</td><td className="table-total">{money(customer.spent)}</td><td><span className={`tier-tag tier-tag--${customer.tier.toLowerCase()}`}><Sparkles size={12} />{customer.tier}</span></td><td className="muted-cell">{index === 0 ? 'Today' : index === 1 ? 'Yesterday' : `${index + 1} days ago`}</td><td><button className="table-more" aria-label={`View ${customer.name}`}><ChevronRight size={16} /></button></td></tr>)}</tbody></table>{!visibleCustomers.length && <div className="empty-note">No one by that name, just yet.</div>}</div>
      </section>
    </div>
  )
}

function StudioView({ activeTab, setActiveTab, products, setProducts, orders, setOrders, onGoToPos, onCreateProduct, onExport, globalSearch, notify }) {
  const dateText = 'MONDAY · 5 OCTOBER 2026'
  const [range, setRange] = useState('7 days')
  const updateOrderStatus = (orderId, status) => {
    setOrders((previous) => previous.map((order) => order.id === orderId ? { ...order, status } : order))
    notify('Order status updated', `${orderId} is now ${status.toLowerCase()}.`)
  }
  const restock = (productId) => {
    setProducts((previous) => previous.map((product) => product.id === productId ? { ...product, stock: product.stock + 5 } : product))
    const product = products.find((item) => item.id === productId)
    notify('Restock added', `${product?.name || 'Product'} · 5 units added to inventory.`)
  }
  return (
    <div className="studio-page page-container">
      <PageHeading eyebrow={`${dateText}  ·  STUDIO`} title={activeTab === 'overview' ? 'Good morning, Amélie.' : activeTab === 'products' ? 'Your collection.' : activeTab === 'orders' ? 'Every order, in good hands.' : 'Your people, your perfume.'} description={activeTab === 'overview' ? 'A quiet start to a very good day.' : activeTab === 'products' ? 'A considered collection, from your shelves to their homes.' : activeTab === 'orders' ? 'The little details that make every delivery feel personal.' : 'A closer look at the people who love what you make.'} actions={<><button className="button button--outline" onClick={onExport}><Download size={15} /> Export</button><button className="button button--primary" onClick={onGoToPos}><Plus size={16} /> New sale</button></>} />
      <StudioTabs activeTab={activeTab} onChange={setActiveTab} productCount={products.length} orderCount={orders.length} />
      {activeTab === 'overview' && <StudioOverview products={products} orders={orders} range={range} setRange={setRange} onGoToInventory={() => setActiveTab('products')} onGoToOrders={() => setActiveTab('orders')} />}
      {activeTab === 'products' && <ProductsAdmin products={products} onAddProduct={onCreateProduct} onRestock={restock} onEdit={() => notify('Category settings', 'Your fragrance families are ready to manage.')} />}
      {activeTab === 'orders' && <OrdersAdmin orders={orders} onStatusChange={updateOrderStatus} globalSearch={globalSearch} />}
      {activeTab === 'customers' && <CustomersAdmin />}
      <footer className="studio-footer"><span>MAISON SILLAGE · PARIS</span><span>Thoughtfully made. Beautifully managed.</span><button onClick={() => notify('Help is on its way', 'Our studio team will be in touch shortly.')}><CircleHelp size={14} /> Need a hand?</button></footer>
    </div>
  )
}

function StoreProductCard({ product, isFavorite, onToggleFavorite, onAdd }) {
  const displayBadge = product.stock > 0 && product.stock <= 3 ? `Only ${product.stock} left` : product.stock > 3 && product.stock <= 5 ? 'Low stock' : product.badge === 'Low stock' ? '' : product.badge
  return (
    <article className="store-product-card">
      <div className="store-product-art-wrap">
        <BottleArt variant={product.variant} />
        {displayBadge && <span className={`product-badge ${displayBadge.toLowerCase().includes('left') || displayBadge === 'Low stock' ? 'product-badge--low' : ''}`}>{displayBadge}</span>}
        <button className={`favorite-button ${isFavorite ? 'is-favorite' : ''}`} onClick={() => onToggleFavorite(product.id)} aria-label={isFavorite ? `Remove ${product.name} from saved scents` : `Save ${product.name}`}><Heart size={17} fill={isFavorite ? 'currentColor' : 'none'} /></button>
      </div>
      <div className="store-product-details"><div className="store-product-title"><div><p>{product.collection}</p><h3>{product.name}</h3></div><span>{money(product.price)}</span></div><p className="product-notes">{product.notes}</p><button className="add-to-bag" onClick={() => onAdd(product)} disabled={product.stock <= 0}>{product.stock <= 0 ? 'Temporarily out of stock' : 'Add to bag'}<Plus size={15} /></button></div>
    </article>
  )
}

function StoreView({ products, favorites, toggleFavorite, addToCart, openCart, cartCount, storeQuery, setStoreQuery, notify, onOpenScentFinder }) {
  const [filter, setFilter] = useState('All fragrances')
  const filters = ['All fragrances', 'Woody', 'Floral', 'Fresh', 'Discovery']
  const filteredProducts = products.filter((product) => (filter === 'All fragrances' || product.category === filter) && (!storeQuery.trim() || `${product.name} ${product.notes} ${product.category}`.toLowerCase().includes(storeQuery.trim().toLowerCase())))
  return (
    <div className="store-page page-container">
      <div className="store-local-nav"><div className="store-mark"><Flower2 size={16} /><span>MAISON SILLAGE</span></div><nav><button className="is-current" onClick={() => { setFilter('All fragrances'); setStoreQuery('') }}>Fragrances</button><button onClick={() => setFilter('Discovery')}>Discovery sets</button><button onClick={onOpenScentFinder}>Find your scent</button></nav><button className="store-bag-button" onClick={openCart}><ShoppingBag size={16} /><span>Bag</span>{cartCount > 0 && <i>{cartCount}</i>}</button></div>
      <section className="store-hero">
        <img src="/images/atelier-hero.png" alt="A hand-composed amber perfume beside a plum blossom" />
        <div className="store-hero__overlay" />
        <div className="store-hero__copy"><p className="hero-eyebrow"><span /> THE ART OF BEING REMEMBERED</p><h1>Leave a little<br /><em>of yourself</em> behind.</h1><p>Small-batch fragrances for the beautifully unrepeatable.</p><button className="button button--cream" onClick={() => document.getElementById('fragrance-collection')?.scrollIntoView({ behavior: 'smooth' })}>Explore the collection <ArrowRight size={16} /></button></div>
        <div className="hero-side-note"><span>01 / 06</span><i /><small>Composed slowly<br />in Paris, France</small></div>
        <div className="hero-product-note"><span>THE SIGNATURE</span><strong>Santal Lumière</strong><small>Warm woods. Soft light.</small></div>
      </section>
      <div className="store-promises"><span><Truck size={16} /> Complimentary delivery over $150</span><i /><span><Sparkles size={16} /> Two little samples, always</span><i /><span><Leaf size={16} /> Thoughtfully made in Paris</span></div>
      <section className="collection-section" id="fragrance-collection">
        <div className="collection-heading"><div><p className="eyebrow">FIND YOUR NOTE</p><h2>A scent that feels like <em>you.</em></h2><p>Made to meet you where you are — and stay a little longer.</p></div><div className="collection-search"><Search size={15} /><input value={storeQuery} onChange={(event) => setStoreQuery(event.target.value)} placeholder="Find a fragrance" aria-label="Search fragrances" /></div></div>
        <div className="collection-toolbar"><div className="filter-tabs store-filters">{filters.map((item) => <button key={item} className={filter === item ? 'is-active' : ''} onClick={() => setFilter(item)}>{item}</button>)}</div><span className="results-count">{filteredProducts.length} compositions</span></div>
        {filteredProducts.length ? <div className="store-product-grid">{filteredProducts.map((product) => <StoreProductCard key={product.id} product={product} isFavorite={favorites.includes(product.id)} onToggleFavorite={toggleFavorite} onAdd={addToCart} />)}</div> : <div className="store-empty"><Search size={20} /><strong>No fragrances found</strong><span>Try another note or clear your search.</span><button onClick={() => { setStoreQuery(''); setFilter('All fragrances') }}>Clear search</button></div>}
      </section>
      <section className="atelier-note"><div className="atelier-note__ornament"><Flower2 size={27} strokeWidth={1.2} /></div><p className="eyebrow">A NOTE FROM THE ATELIER</p><h2>“A fragrance is the first thing<br />you give, and the last thing<br /><em>someone forgets.</em>”</h2><span>— Amélie, founder & nose</span><button onClick={() => notify('Our story', 'The Sillage story begins with one small Paris atelier and a love of beautiful, lasting things.')}>Our story <ArrowRight size={14} /></button></section>
      <footer className="store-footer"><div className="store-footer__brand"><span className="brand-mark"><Flower2 size={17} /></span><span><strong>maison sillage</strong><small>Fragrance, with feeling.</small></span></div><span>© 2026 Maison Sillage · Paris</span><div><button onClick={() => notify('Shipping & returns', 'Complimentary delivery on orders over $150. Thoughtful returns within 30 days.')}>Shipping & returns</button><button onClick={() => notify('Contact the atelier', 'Write to bonjour@maisonsillage.fr — we would love to hear from you.')}>Contact</button><button onClick={() => notify('Instagram', 'Follow along @maisonsillage for notes from the atelier.')}>Instagram</button></div></footer>
    </div>
  )
}

function LineItem({ item, onAdjust, onRemove, mode = 'cart' }) {
  return (
    <div className={`line-item ${mode === 'pos' ? 'line-item--pos' : ''}`}>
      <div className="line-item__art"><BottleArt variant={item.variant} compact /></div>
      <div className="line-item__copy"><strong>{item.name}</strong><small>{item.size} · {item.category}</small><div className="line-quantity"><button onClick={() => onAdjust(item.id, -1)} aria-label={`Decrease quantity of ${item.name}`}><Minus size={12} /></button><span>{item.quantity}</span><button onClick={() => onAdjust(item.id, 1)} aria-label={`Increase quantity of ${item.name}`}><Plus size={12} /></button></div></div>
      <div className="line-item__price"><strong>{money(item.price * item.quantity)}</strong>{mode !== 'pos' && <button onClick={() => onRemove(item.id)} aria-label={`Remove ${item.name}`}><Trash2 size={13} /></button>}</div>
    </div>
  )
}

function CartDrawer({ open, items, subtotal, deliveryMethod, onClose, onAdjust, onRemove, onCheckout, onShop }) {
  if (!open) return null
  return (
    <div className="drawer-backdrop" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose() }}>
      <aside className="cart-drawer" aria-label="Shopping bag">
        <div className="drawer-header"><div><p className="eyebrow">A LITTLE SOMETHING</p><h2>Your bag <span>{items.reduce((sum, item) => sum + item.quantity, 0)}</span></h2></div><button className="icon-button" onClick={onClose} aria-label="Close bag"><X size={18} /></button></div>
        {items.length ? <><div className="drawer-items">{items.map((item) => <LineItem key={item.id} item={item} onAdjust={onAdjust} onRemove={onRemove} />)}</div><div className="drawer-summary"><div><span>Subtotal</span><strong>{money(subtotal)}</strong></div><div><span>{deliveryMethod === 'Studio pickup' ? 'Studio pickup' : 'Delivery'}</span><span>{deliveryMethod === 'Studio pickup' || subtotal >= 150 ? 'Complimentary' : '$8.00'}</span></div><p>Two complimentary samples are always tucked inside.</p><button className="button button--primary button--wide" onClick={onCheckout}>Continue to checkout <ArrowRight size={16} /></button><button className="continue-shopping" onClick={onClose}>Keep looking</button></div></> : <div className="empty-bag"><span><ShoppingBag size={22} /></span><h3>Something's missing.</h3><p>Your bag is waiting for a scent that feels like you.</p><button className="button button--primary" onClick={onShop}>Explore fragrances <ArrowRight size={15} /></button></div>}
      </aside>
    </div>
  )
}

function CheckoutModal({ open, onClose, onConfirm, total, deliveryFee, deliveryMethod, setDeliveryMethod, address, setAddress, city, setCity, name, setName, email, setEmail }) {
  if (!open) return null
  const needsAddress = deliveryMethod === 'Home delivery'
  const validEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())
  const canSubmit = name.trim() && validEmail && (!needsAddress || (address.trim() && city.trim()))
  return (
    <div className="modal-backdrop" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose() }}>
      <div className="modal checkout-modal" role="dialog" aria-modal="true" aria-labelledby="checkout-title">
        <button className="modal-close" onClick={onClose} aria-label="Close checkout"><X size={17} /></button>
        <span className="modal-symbol"><ShoppingBag size={19} /></span><p className="eyebrow">A LOVELY CHOICE</p><h2 id="checkout-title">A little detail,<br /><em>then it's yours.</em></h2><p className="modal-copy">We'll prepare your order with the care it deserves.</p>
        <label className="field-label">Your name<input value={name} onChange={(event) => setName(event.target.value)} placeholder="Alice Laurent" /></label>
        <label className="field-label">Email address<input type="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="you@example.com" /></label>
        <p className="checkout-section-label">HOW WOULD YOU LIKE TO RECEIVE IT?</p>
        <div className="checkout-methods">
          <button className={needsAddress ? 'is-selected' : ''} onClick={() => setDeliveryMethod('Home delivery')}><span className="checkout-method-icon"><Truck size={16} /></span><span><strong>Home delivery</strong><small>Complimentary over $150</small></span>{needsAddress && <Check size={14} />}</button>
          <button className={!needsAddress ? 'is-selected' : ''} onClick={() => setDeliveryMethod('Studio pickup')}><span className="checkout-method-icon"><MapPin size={16} /></span><span><strong>Studio pickup</strong><small>Ready in about 2 hours</small></span>{!needsAddress && <Check size={14} />}</button>
        </div>
        {needsAddress ? <div className="checkout-address-fields"><label className="field-label">Delivery address<input value={address} onChange={(event) => setAddress(event.target.value)} placeholder="Street and number" /></label><label className="field-label">City & postal code<input value={city} onChange={(event) => setCity(event.target.value)} placeholder="75009 Paris, France" /></label></div> : <div className="pickup-location"><MapPin size={15} /><span><strong>Maison Sillage Atelier</strong><small>14 Rue des Martyrs · 75009 Paris</small></span></div>}
        <div className="checkout-total"><span>Order total<small>{deliveryMethod === 'Studio pickup' ? 'Studio pickup · no fee' : deliveryFee === 0 ? 'Complimentary delivery' : `Includes ${money(deliveryFee)} delivery`}</small></span><strong>{money(total)}</strong></div>
        <button className="button button--primary button--wide" onClick={onConfirm} disabled={!canSubmit}>Place your order <ArrowRight size={16} /></button>
        <small className="secure-note"><ShieldCheck size={13} /> A secure, thoughtful checkout experience</small>
      </div>
    </div>
  )
}

function POSView({ products, cartItems, cartSubtotal, addToCart, adjustCart, clearCart, onCompleteSale, notify }) {
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState('All')
  const [payment, setPayment] = useState('Card')
  const [discount, setDiscount] = useState(false)
  const [customer, setCustomer] = useState('Walk-in customer')
  const [customerMenu, setCustomerMenu] = useState(false)
  const categories = ['All', 'Woody', 'Floral', 'Fresh', 'Discovery']
  const visibleProducts = products.filter((product) => (category === 'All' || product.category === category) && (!query || `${product.name} ${product.notes}`.toLowerCase().includes(query.toLowerCase())))
  const discountValue = discount ? cartSubtotal * 0.1 : 0
  const total = cartSubtotal - discountValue
  return (
    <div className="pos-page page-container">
      <PageHeading eyebrow="MAISON SILLAGE  /  RETAIL STUDIO" title="Point of sale" description="A little care goes a long way. Make it a lovely one." actions={<div className="register-status"><span className="register-live-dot" /> REGISTER 01 <i /> OPEN SINCE 9:00 AM</div>} />
      <div className="pos-layout">
        <section className="panel pos-catalog-panel">
          <div className="pos-toolbar"><div className="inline-search pos-search"><Search size={16} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search your collection…" aria-label="Search POS products" /><kbd>⌘ K</kbd></div><button className="filter-square" onClick={() => { setCategory('All'); setQuery('') }} aria-label="Clear filters"><Settings2 size={16} /></button></div>
          <div className="filter-tabs pos-filters">{categories.map((item) => <button key={item} className={category === item ? 'is-active' : ''} onClick={() => setCategory(item)}>{item}</button>)}</div>
          <div className="pos-product-grid">{visibleProducts.map((product) => <button className="pos-product-tile" key={product.id} onClick={() => addToCart(product)} disabled={product.stock <= 0}>
            <span className="pos-tile-art"><BottleArt variant={product.variant} compact />{product.stock <= 5 && <span className="tile-stock-alert">{product.stock} left</span>}</span>
            <span className="pos-tile-copy"><strong>{product.name}</strong><small>{product.size} · {product.category}</small><b>{money(product.price)}</b></span><span className="pos-tile-add"><Plus size={15} /></span>
          </button>)}</div>
          {!visibleProducts.length && <div className="empty-note pos-empty">No products match those notes.</div>}
          <div className="pos-catalog-foot"><span><Package size={14} /> {products.length} items in collection</span><span>Tap an item to add to sale</span></div>
        </section>
        <aside className="pos-checkout-panel">
          <div className="pos-order-head"><div><p className="panel-kicker">REGISTER 01 · IN STORE</p><h2>Current sale <span>{cartItems.reduce((sum, item) => sum + item.quantity, 0)}</span></h2></div><button className="table-more" onClick={clearCart} aria-label="Clear sale" title="Clear sale"><Trash2 size={15} /></button></div>
          <div className="customer-picker-wrap"><button className="customer-picker" onClick={() => setCustomerMenu((value) => !value)}><span className="customer-picker-avatar">{customer === 'Walk-in customer' ? <UserRound size={15} /> : customer.split(' ').map((name) => name[0]).join('')}</span><span><strong>{customer}</strong><small>{customer === 'Walk-in customer' ? 'Add a customer to this sale' : 'Member · Atelier tier'}</small></span><ChevronDown size={15} /></button>{customerMenu && <div className="customer-menu"><p>RECENT CUSTOMERS</p>{['Walk-in customer', 'Alice Laurent', 'Julien Moreau', 'Camille Roche'].map((name) => <button key={name} onClick={() => { setCustomer(name); setCustomerMenu(false) }}><span className="tiny-avatar">{name === 'Walk-in customer' ? 'WI' : name.split(' ').map((part) => part[0]).join('')}</span>{name}{customer === name && <Check size={14} />}</button>)}</div>}</div>
          <div className="pos-cart-list">{cartItems.length ? cartItems.map((item) => <LineItem key={item.id} item={item} onAdjust={adjustCart} onRemove={(id) => adjustCart(id, -100)} mode="pos" />) : <div className="pos-empty-state"><span><ShoppingCart size={22} /></span><strong>A fresh start.</strong><small>Choose a fragrance to begin this sale.</small></div>}</div>
          {cartItems.length > 0 && <div className="pos-checkout-bottom"><button className={`discount-toggle ${discount ? 'is-applied' : ''}`} onClick={() => setDiscount((value) => !value)}><span><Tag size={14} />{discount ? '10% atelier courtesy applied' : 'Add an atelier courtesy'}</span><span>{discount ? <Check size={15} /> : <Plus size={15} />}</span></button><div className="totals-list"><div><span>Subtotal</span><strong>{money(cartSubtotal)}</strong></div>{discount && <div className="discount-line"><span>Atelier courtesy · 10%</span><strong>−{money(discountValue)}</strong></div>}<div className="total-line"><span>Total due</span><strong>{money(total)}</strong></div></div><p className="payment-label">PAYMENT METHOD</p><div className="payment-options">{[{ name: 'Card', icon: CreditCard }, { name: 'Cash', icon: Banknote }, { name: 'Gift card', icon: WalletCards }].map(({ name, icon: Icon }) => <button key={name} className={payment === name ? 'is-selected' : ''} onClick={() => setPayment(name)}><Icon size={15} />{name}</button>)}</div><button className="button button--primary button--wide complete-sale" onClick={() => onCompleteSale({ customer, payment, total, discount: discountValue })}><span><CheckCircle2 size={16} /> Complete sale</span><strong>{money(total)}</strong></button><p className="pos-secure"><ShieldCheck size={13} /> Payment is securely recorded</p></div>}
        </aside>
      </div>
      <div className="pos-bottom-note"><Sparkles size={14} /> Make it personal — a handwritten note goes a long way.</div>
    </div>
  )
}

function ReceiptModal({ order, onClose, onNewSale }) {
  if (!order) return null
  return (
    <div className="modal-backdrop">
      <div className="modal receipt-modal" role="dialog" aria-modal="true" aria-labelledby="receipt-title">
        <button className="modal-close" onClick={onClose} aria-label="Close receipt"><X size={17} /></button>
        <span className="receipt-success"><Check size={21} /></span><p className="eyebrow">A BEAUTIFUL SALE</p><h2 id="receipt-title">All wrapped up.</h2><p className="modal-copy">Your customer's new favourite is on its way.</p>
        <div className="receipt-ticket"><div><span>SALE REFERENCE</span><strong>{order.id}</strong></div><div><span>FOR</span><strong>{order.customer}</strong></div><div><span>PAYMENT</span><strong>{order.payment || 'Card'}</strong></div><div className="receipt-ticket__total"><span>TOTAL PAID</span><strong>{money(order.total)}</strong></div></div>
        <button className="button button--primary button--wide" onClick={onNewSale}><Plus size={16} /> Start a new sale</button><button className="receipt-print" onClick={() => window.print()}><Receipt size={14} /> Print receipt</button>
      </div>
    </div>
  )
}

function ClientPortal({ products, orders, favorites, toggleFavorite, addToCart, goToShop, notify }) {
  const [section, setSection] = useState('overview')
  const clientOrders = orders.filter((order) => order.customer === 'Alice Laurent' || order.customer === 'Alice Martin').slice(0, 4)
  const latestOrder = clientOrders[0]
  const savedProducts = products.filter((product) => favorites.includes(product.id))
  const portalTabs = [{ id: 'overview', label: 'Overview' }, { id: 'orders', label: 'My orders' }, { id: 'wardrobe', label: 'My wardrobe' }, { id: 'profile', label: 'Profile' }]
  return (
    <div className="client-page page-container">
      <div className="client-welcome"><div><p className="eyebrow">YOUR LITTLE CORNER OF SILLAGE</p><h1>Bonjour, Alice<span>.</span></h1><p>Welcome back. Your next favourite might be just around the corner.</p></div><span className="client-welcome-flower"><Flower2 size={24} strokeWidth={1.3} /></span></div>
      <div className="client-tabs" role="tablist" aria-label="Client portal sections">{portalTabs.map((tab) => <button key={tab.id} role="tab" aria-selected={section === tab.id} className={section === tab.id ? 'is-active' : ''} onClick={() => setSection(tab.id)}>{tab.label}{tab.id === 'wardrobe' && favorites.length > 0 && <span>{favorites.length}</span>}</button>)}</div>
      {section === 'overview' && <div className="client-dashboard-grid"><div className="client-main-column"><section className="loyalty-card"><div className="loyalty-card__top"><span className="loyalty-logo"><Flower2 size={16} /> MAISON SILLAGE</span><span className="loyalty-tier"><Sparkles size={12} /> ATELIER MEMBER</span></div><div className="loyalty-card__body"><div><p>YOUR FRAGRANCE JOURNEY</p><strong>1,280 <small>points</small></strong></div><div className="loyalty-stamp"><span>Next little<br />surprise</span><strong>1,500</strong><small>points</small></div></div><div className="loyalty-progress"><span><i style={{ width: '72%' }} /></span><small>220 points until your next reward</small></div><div className="loyalty-flower"><Flower2 size={89} strokeWidth={0.7} /></div></section><section className="panel client-orders-panel"><div className="panel-heading"><div><p className="panel-kicker">FROM THE ATELIER TO YOU</p><h2>Your recent orders</h2></div><button className="text-link" onClick={() => setSection('orders')}>All orders <ArrowRight size={14} /></button></div>{clientOrders.length ? <div className="client-order-list">{clientOrders.map((order, index) => <div className="client-order" key={order.id}><span className={`client-order-art client-order-art--${index % 4}`}><PackageCheck size={18} /></span><span className="client-order-copy"><strong>{order.items.split('·')[0]}</strong><small>{order.id} · {order.date}</small></span><span className="client-order-state"><StatusPill status={order.status} /><strong>{money(order.total)}</strong></span><ChevronRight size={16} /></div>)}</div> : <div className="empty-note">Your next favourite is waiting.</div>}</section></div><aside className="client-aside"><section className="delivery-card"><div className="delivery-card__icon"><Truck size={17} /></div><p className="panel-kicker">A LITTLE UPDATE</p><h3>Your next order,<br /><em>beautifully delivered.</em></h3><div className="delivery-progress"><span className="delivery-step is-done"><i><Check size={10} /></i><small>Composed</small></span><i className="delivery-line is-done" /><span className="delivery-step is-current"><i /><small>Preparing</small></span><i className="delivery-line" /><span className="delivery-step"><i /><small>At your door</small></span></div><button onClick={() => notify('Delivery details', latestOrder?.deliveryAddress ? `${latestOrder.deliveryMethod === 'Studio pickup' ? 'Collect from' : 'Delivering to'} ${latestOrder.deliveryAddress}.` : 'Your order includes complimentary samples and a handwritten note from the atelier.')}>Delivery details <ArrowRight size={14} /></button></section><section className="wardrobe-card"><div className="wardrobe-card__heading"><span><Heart size={16} /> YOUR WARDROBE</span><button onClick={() => setSection('wardrobe')}>View all <ArrowRight size={13} /></button></div>{savedProducts.length ? savedProducts.slice(0, 2).map((product) => <div key={product.id} className="wardrobe-mini"><span className="wardrobe-mini__art"><BottleArt variant={product.variant} compact /></span><span><strong>{product.name}</strong><small>{product.category} · {money(product.price)}</small></span><button onClick={() => toggleFavorite(product.id)} aria-label={`Remove ${product.name}`}><Heart size={15} fill="currentColor" /></button></div>) : <div className="wardrobe-empty"><span><Heart size={18} /></span><strong>Save what speaks to you.</strong><small>Your favourite fragrances will live here.</small><button onClick={goToShop}>Explore the collection</button></div>}</section></aside></div>}
      {section === 'orders' && <section className="panel client-full-panel"><div className="panel-heading"><div><p className="panel-kicker">KEPT CLOSE, FROM THE FIRST SPRAY</p><h2>Order history</h2></div><button className="button button--outline button--small" onClick={goToShop}><ShoppingBag size={14} /> Shop fragrances</button></div><div className="client-order-list client-order-list--full">{clientOrders.length ? clientOrders.map((order, index) => <div className="client-order" key={order.id}><span className={`client-order-art client-order-art--${index % 4}`}><PackageCheck size={18} /></span><span className="client-order-copy"><strong>{order.items}</strong><small>{order.id} · {order.date} · {order.channel}</small></span><span className="client-order-state"><StatusPill status={order.status} /><strong>{money(order.total)}</strong></span><ChevronRight size={16} /></div>) : <div className="empty-note">Your first order is yet to be written.</div>}</div></section>}
      {section === 'wardrobe' && <section className="client-full-panel"><div className="panel-heading"><div><p className="panel-kicker">A COLLECTION OF YOU</p><h2>Your saved scents</h2></div><button className="button button--outline button--small" onClick={goToShop}><ShoppingBag size={14} /> Discover more</button></div>{savedProducts.length ? <div className="store-product-grid client-wardrobe-grid">{savedProducts.map((product) => <StoreProductCard key={product.id} product={product} isFavorite onToggleFavorite={toggleFavorite} onAdd={() => addToCart(product)} />)}</div> : <div className="client-wardrobe-empty"><span><Heart size={20} /></span><h3>Save a scent that feels like you.</h3><p>Tap the little heart on any fragrance to keep it close.</p><button className="button button--primary" onClick={goToShop}>Find your next favourite <ArrowRight size={15} /></button></div>}</section>}
      {section === 'profile' && <section className="panel profile-settings-panel"><div className="panel-heading"><div><p className="panel-kicker">THE LITTLE DETAILS</p><h2>Your profile</h2></div><button className="button button--outline button--small" onClick={() => notify('Profile saved', 'Your details are all up to date.')}>Save changes</button></div><div className="profile-form-grid"><label className="field-label">First name<input defaultValue="Alice" /></label><label className="field-label">Last name<input defaultValue="Laurent" /></label><label className="field-label">Email address<input defaultValue="alice.laurent@email.com" /></label><label className="field-label">Phone number<input defaultValue="+33 6 12 34 56 78" /></label></div><div className="profile-address"><span><MapPin size={16} /></span><div><strong>Preferred delivery address</strong><small>14 Rue des Martyrs, 75009 Paris, France</small></div><button onClick={() => notify('Address book', 'Your delivery address is ready to update.')}>Edit</button></div></section>}
      <footer className="studio-footer client-footer"><span>MAISON SILLAGE · PARIS</span><span>Your fragrance journey, considered.</span><button onClick={() => notify('Need a hand?', 'Write to bonjour@maisonsillage.fr — we are always happy to help.')}><Mail size={14} /> Need a hand?</button></footer>
    </div>
  )
}

function ScentFinderModal({ open, onClose, onSelect }) {
  const [selected, setSelected] = useState('Warm & intimate')
  if (!open) return null
  const moods = [
    { name: 'Warm & intimate', notes: 'Woods, skin musk, soft amber', icon: Sparkles, product: 'santal-lumiere' },
    { name: 'Bright & open', notes: 'Citrus, green leaves, sea air', icon: Leaf, product: 'cote-dor' },
    { name: 'Romantic & bold', notes: 'Velvet petals, spice, a little mystery', icon: Flower2, product: 'rose-noire' },
  ]
  const chosen = moods.find((item) => item.name === selected) || moods[0]
  return (
    <div className="modal-backdrop" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose() }}><div className="modal finder-modal" role="dialog" aria-modal="true" aria-labelledby="finder-title"><button className="modal-close" onClick={onClose} aria-label="Close scent finder"><X size={17} /></button><span className="modal-symbol"><Flower2 size={20} /></span><p className="eyebrow">A MOMENT FOR YOU</p><h2 id="finder-title">How do you want<br /><em>to feel?</em></h2><p className="modal-copy">Tell us the mood. We'll meet you there.</p><div className="mood-options">{moods.map(({ name, notes, icon: Icon }) => <button key={name} onClick={() => setSelected(name)} className={selected === name ? 'is-selected' : ''}><span><Icon size={17} /></span><span><strong>{name}</strong><small>{notes}</small></span>{selected === name && <Check size={15} />}</button>)}</div><button className="button button--primary button--wide" onClick={() => onSelect(chosen.product)}>Meet your match <ArrowRight size={15} /></button></div></div>
  )
}

function Toast({ toast, onClose }) {
  if (!toast) return null
  return <div className="toast-message" role="status"><span><Check size={15} /></span><div><strong>{toast.title}</strong><small>{toast.message}</small></div><button onClick={onClose} aria-label="Dismiss"><X size={14} /></button></div>
}

function App() {
  const [activeView, setActiveView] = useState('studio')
  const [adminTab, setAdminTab] = useState('overview')
  const [products, setProducts] = useState(() => safeRead('sillage-products', INITIAL_PRODUCTS))
  const [orders, setOrders] = useState(() => safeRead('sillage-orders', INITIAL_ORDERS))
  const [favorites, setFavorites] = useState(() => safeRead('sillage-favorites', []))
  const [cart, setCart] = useState({})
  const [globalSearch, setGlobalSearch] = useState('')
  const [storeQuery, setStoreQuery] = useState('')
  const [noticeOpen, setNoticeOpen] = useState(false)
  const [cartOpen, setCartOpen] = useState(false)
  const [checkoutOpen, setCheckoutOpen] = useState(false)
  const [scentFinderOpen, setScentFinderOpen] = useState(false)
  const [productModalOpen, setProductModalOpen] = useState(false)
  const [checkoutName, setCheckoutName] = useState('Alice Laurent')
  const [checkoutEmail, setCheckoutEmail] = useState('alice.laurent@email.com')
  const [deliveryMethod, setDeliveryMethod] = useState('Home delivery')
  const [checkoutAddress, setCheckoutAddress] = useState('14 Rue des Martyrs')
  const [checkoutCity, setCheckoutCity] = useState('75009 Paris, France')
  const [receiptOrder, setReceiptOrder] = useState(null)
  const [toast, setToast] = useState(null)
  const [newProduct, setNewProduct] = useState({ name: '', notes: '', category: 'Woody', price: '', stock: '' })

  useEffect(() => { window.localStorage.setItem('sillage-products', JSON.stringify(products)) }, [products])
  useEffect(() => { window.localStorage.setItem('sillage-orders', JSON.stringify(orders)) }, [orders])
  useEffect(() => { window.localStorage.setItem('sillage-favorites', JSON.stringify(favorites)) }, [favorites])
  useEffect(() => {
    if (!toast) return undefined
    const timer = window.setTimeout(() => setToast(null), 3600)
    return () => window.clearTimeout(timer)
  }, [toast])

  const notify = (title, message) => setToast({ title, message })
  const cartItems = useMemo(() => Object.entries(cart).map(([id, quantity]) => {
    const product = products.find((entry) => entry.id === id)
    return product ? { ...product, quantity } : null
  }).filter(Boolean), [cart, products])
  const cartSubtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const deliveryFee = deliveryMethod === 'Studio pickup' || cartSubtotal >= 150 ? 0 : 8

  const addToCart = (product) => {
    if (product.stock <= (cart[product.id] || 0)) {
      notify('Almost out of this one', `There are only ${product.stock} ${product.name} in the atelier.`)
      return
    }
    setCart((previous) => ({ ...previous, [product.id]: (previous[product.id] || 0) + 1 }))
    notify('A lovely choice', `${product.name} was added to your bag.`)
  }
  const adjustCart = (id, change) => {
    const nextQuantity = (cart[id] || 0) + change
    const product = products.find((entry) => entry.id === id)
    if (nextQuantity > 0 && product && nextQuantity > product.stock) {
      notify('That is all we have', `There are only ${product.stock} ${product.name} available.`)
      return
    }
    setCart((previous) => {
      if (nextQuantity <= 0) {
        const next = { ...previous }
        delete next[id]
        return next
      }
      return { ...previous, [id]: nextQuantity }
    })
  }
  const removeFromCart = (id) => setCart((previous) => { const next = { ...previous }; delete next[id]; return next })
  const toggleFavorite = (id) => setFavorites((previous) => previous.includes(id) ? previous.filter((favorite) => favorite !== id) : [...previous, id])
  const navigate = (view) => { setActiveView(view); setNoticeOpen(false); if (view === 'studio') setAdminTab((tab) => tab || 'overview') }

  const createOrder = ({ channel, customer, total, discount = 0, payment, deliveryMethod, deliveryAddress, shipping = 0 }) => {
    if (!cartItems.length) return null
    const orderNumber = 1052 + Math.max(0, orders.length - INITIAL_ORDERS.length)
    const order = {
      id: `#SG-${orderNumber}`,
      customer,
      date: 'Today, just now',
      items: cartItems.map((item) => `${item.name} × ${item.quantity}`).join(' · '),
      total,
      channel,
      status: channel === 'Online' ? 'Preparing' : 'Completed',
      payment,
      discount,
      deliveryMethod,
      deliveryAddress,
      shipping,
    }
    setOrders((previous) => [order, ...previous])
    setProducts((previous) => previous.map((product) => cart[product.id] ? { ...product, stock: Math.max(0, product.stock - cart[product.id]) } : product))
    setCart({})
    return order
  }

  const handleOnlineOrder = () => {
    const total = cartSubtotal + deliveryFee
    const deliveryAddress = deliveryMethod === 'Studio pickup'
      ? 'Maison Sillage Atelier, 14 Rue des Martyrs, 75009 Paris'
      : `${checkoutAddress.trim()}, ${checkoutCity.trim()}`
    const order = createOrder({ channel: 'Online', customer: checkoutName.trim(), total, deliveryMethod, deliveryAddress, shipping: deliveryFee })
    if (!order) return
    setCheckoutOpen(false)
    setCartOpen(false)
    setActiveView('client')
    notify('Order placed with care', `${order.id} is now being prepared at the atelier.`)
  }

  const handleSale = ({ customer, payment, total, discount }) => {
    const order = createOrder({ channel: 'In store', customer, total, discount, payment })
    if (order) setReceiptOrder(order)
  }

  const exportOrders = () => {
    const heading = ['Order', 'Customer', 'Date', 'Items', 'Channel', 'Fulfillment', 'Delivery address', 'Shipping', 'Total', 'Status']
    const lines = orders.map((order) => [order.id, order.customer, order.date, order.items, order.channel, order.deliveryMethod || '', order.deliveryAddress || '', order.shipping || 0, order.total, order.status].map((value) => `"${String(value).replaceAll('"', '""')}"`).join(','))
    const blob = new Blob([[heading.join(','), ...lines].join('\n')], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const anchor = document.createElement('a')
    anchor.href = url
    anchor.download = 'maison-sillage-orders.csv'
    anchor.click()
    URL.revokeObjectURL(url)
    notify('Your report is ready', 'A CSV of your recent orders has been downloaded.')
  }

  const submitNewProduct = () => {
    if (!newProduct.name.trim() || !newProduct.price || !newProduct.stock) return
    const product = {
      id: `sillage-${Date.now()}`,
      name: newProduct.name.trim(),
      collection: 'Atelier edition · Eau de parfum',
      notes: newProduct.notes.trim() || 'A new composition from the atelier',
      price: Number(newProduct.price),
      stock: Number(newProduct.stock),
      category: newProduct.category,
      size: '50 ml',
      badge: 'New arrival',
      variant: products.length % 6,
    }
    setProducts((previous) => [product, ...previous])
    setNewProduct({ name: '', notes: '', category: 'Woody', price: '', stock: '' })
    setProductModalOpen(false)
    notify('A new fragrance, welcome', `${product.name} is now in your collection.`)
  }

  const selectScent = (id) => {
    setScentFinderOpen(false)
    setActiveView('store')
    const product = products.find((item) => item.id === id)
    setStoreQuery(product?.name || '')
  }
  const searchProduct = (name) => {
    setActiveView('store')
    setStoreQuery(name)
    setGlobalSearch('')
  }
  const searchOrder = (id) => {
    setActiveView('studio')
    setAdminTab('orders')
    setGlobalSearch(id)
  }

  return (
    <div className="app-shell">
      <AppHeader activeView={activeView} onNavigate={navigate} products={products} orders={orders} globalSearch={globalSearch} onGlobalSearch={setGlobalSearch} onSearchProduct={searchProduct} onSearchOrder={searchOrder} onOpenNotifications={() => setNoticeOpen((value) => !value)} noticeOpen={noticeOpen} onDismissNotices={() => setNoticeOpen(false)} />
      <main className={`app-main app-main--${activeView}`}>
        {activeView === 'studio' && <StudioView activeTab={adminTab} setActiveTab={(tab) => { setAdminTab(tab); setGlobalSearch('') }} products={products} setProducts={setProducts} orders={orders} setOrders={setOrders} onGoToPos={() => navigate('pos')} onCreateProduct={() => setProductModalOpen(true)} onExport={exportOrders} globalSearch={globalSearch} notify={notify} />}
        {activeView === 'store' && <StoreView products={products} favorites={favorites} toggleFavorite={toggleFavorite} addToCart={addToCart} openCart={() => setCartOpen(true)} cartCount={cartItems.reduce((sum, item) => sum + item.quantity, 0)} storeQuery={storeQuery} setStoreQuery={setStoreQuery} notify={notify} onOpenScentFinder={() => setScentFinderOpen(true)} />}
        {activeView === 'pos' && <POSView products={products} cartItems={cartItems} cartSubtotal={cartSubtotal} addToCart={addToCart} adjustCart={adjustCart} clearCart={() => setCart({})} onCompleteSale={handleSale} notify={notify} />}
        {activeView === 'client' && <ClientPortal products={products} orders={orders} favorites={favorites} toggleFavorite={toggleFavorite} addToCart={addToCart} goToShop={() => { setActiveView('store'); setStoreQuery('') }} notify={notify} />}
      </main>
      <CartDrawer open={cartOpen} items={cartItems} subtotal={cartSubtotal} deliveryMethod={deliveryMethod} onClose={() => setCartOpen(false)} onAdjust={adjustCart} onRemove={removeFromCart} onCheckout={() => { setCartOpen(false); setCheckoutOpen(true) }} onShop={() => { setCartOpen(false); setActiveView('store') }} />
      <CheckoutModal open={checkoutOpen} onClose={() => setCheckoutOpen(false)} onConfirm={handleOnlineOrder} total={cartSubtotal + deliveryFee} deliveryFee={deliveryFee} deliveryMethod={deliveryMethod} setDeliveryMethod={setDeliveryMethod} address={checkoutAddress} setAddress={setCheckoutAddress} city={checkoutCity} setCity={setCheckoutCity} name={checkoutName} setName={setCheckoutName} email={checkoutEmail} setEmail={setCheckoutEmail} />
      <ScentFinderModal open={scentFinderOpen} onClose={() => setScentFinderOpen(false)} onSelect={selectScent} />
      <ReceiptModal order={receiptOrder} onClose={() => setReceiptOrder(null)} onNewSale={() => { setReceiptOrder(null); setActiveView('pos') }} />
      {productModalOpen && <div className="modal-backdrop" onMouseDown={(event) => { if (event.target === event.currentTarget) setProductModalOpen(false) }}><div className="modal product-modal" role="dialog" aria-modal="true" aria-labelledby="new-product-title"><button className="modal-close" onClick={() => setProductModalOpen(false)} aria-label="Close"><X size={17} /></button><span className="modal-symbol"><Package size={19} /></span><p className="eyebrow">ADD TO THE COLLECTION</p><h2 id="new-product-title">A new composition.</h2><p className="modal-copy">Bring another beautiful thing into the world.</p><label className="field-label">Fragrance name<input value={newProduct.name} onChange={(event) => setNewProduct((previous) => ({ ...previous, name: event.target.value }))} placeholder="e.g. Fleur de Minuit" /></label><label className="field-label">Notes & feeling<input value={newProduct.notes} onChange={(event) => setNewProduct((previous) => ({ ...previous, notes: event.target.value }))} placeholder="Iris · Cedar · Soft musk" /></label><div className="field-row"><label className="field-label">Family<select value={newProduct.category} onChange={(event) => setNewProduct((previous) => ({ ...previous, category: event.target.value }))}><option>Woody</option><option>Floral</option><option>Fresh</option><option>Discovery</option></select></label><label className="field-label">Price<input type="number" min="1" value={newProduct.price} onChange={(event) => setNewProduct((previous) => ({ ...previous, price: event.target.value }))} placeholder="$ 148" /></label><label className="field-label">Units<input type="number" min="0" value={newProduct.stock} onChange={(event) => setNewProduct((previous) => ({ ...previous, stock: event.target.value }))} placeholder="12" /></label></div><button className="button button--primary button--wide" onClick={submitNewProduct} disabled={!newProduct.name.trim() || !newProduct.price || !newProduct.stock}><Plus size={16} /> Add fragrance</button></div></div>}
      <Toast toast={toast} onClose={() => setToast(null)} />
    </div>
  )
}

export default App
