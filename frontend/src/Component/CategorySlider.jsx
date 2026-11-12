import HairCare from '../assets/HairCare.png'
import SmartSkinCare from '../assets/SmartSkinCare.png'
import LipCarePng from '../assets/LipCare.png'
import './CategorySlider.css'

const categoryCards = [
  { id: 1, title: 'Hair Care',      img: HairCare,      targetPage: 'hair' },
  { id: 2, title: 'Lip Care',       img: LipCarePng,    targetPage: 'lip' },
  { id: 3, title: 'Smart Skincare', img: SmartSkinCare, targetPage: 'skincare' },
]

export default function CategorySlider({ onNavigate }) {
  const handleCardClick = (targetPage) => {
    if (targetPage && onNavigate) {
      onNavigate(targetPage)
    }
  }

  return (
    <section className="cat-slider">
      <div className="cat-slider__header">
        <h2 className="cat-slider__heading">Shop By Collection</h2>
      </div>

      <div className="cat-slider__grid">
        {categoryCards.map((cat) => (
          <div 
            key={cat.id} 
            className="cat-slider__card"
            onClick={() => handleCardClick(cat.targetPage)}
          >
            <div className="cat-slider__img-wrap">
              <img src={cat.img} alt={cat.title} className="cat-slider__img" loading="lazy" decoding="async" />
            </div>
            <div className="cat-slider__label">
              <h3 className="cat-slider__title">{cat.title}</h3>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
