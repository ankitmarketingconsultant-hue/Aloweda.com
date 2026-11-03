import './ShopByCategory.css'

const categories = [
  { label: 'Face Serums', icon: '✦' },
  { label: 'Moisturisers', icon: '✦' },
  { label: 'Face Wash', icon: '✦' },
  { label: 'Skincare Rituals', icon: '✦' },
  { label: 'Creams', icon: '✦' },
  { label: 'Hair Care', icon: '✦' },
]

export default function ShopByCategory() {
  return (
    <section className="section categories-section">
      <div className="section__header">
        <span className="section__eyebrow">Browse</span>
        <h2 className="section__title">Shop by Category</h2>
      </div>
      <div className="categories-grid">
        {categories.map((c) => (
          <a key={c.label} href="#" className="category-card">
            <div className="category-card__icon">{c.icon}</div>
            <span className="category-card__label">{c.label}</span>
          </a>
        ))}
      </div>
    </section>
  )
}
