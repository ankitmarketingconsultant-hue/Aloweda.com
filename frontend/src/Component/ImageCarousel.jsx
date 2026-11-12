import CrueltyFree from '../assets/CrueltyFree.png'
import GMP from '../assets/GMP.png'
import GoFast from '../assets/GoFast.png'
import ShopNow from '../assets/ShopNow.png'
import ISOcertified from '../assets/ISOcertified.png'
import './ImageCarousel.css'

const carouselItems = [
  { id: 2, img: GoFast,        alt: 'Fast Delivery',     label: 'Earn Gift on first order' },
  { id: 3, img: ShopNow,       alt: 'Shop Now',          label: 'Shop Now. Glow Forever.' },
  { id: 4, img: CrueltyFree,   alt: 'Cruelty Free',      label: '100% Cruelty Free' },
  { id: 5, img: GMP,           alt: 'GMP Certified',     label: 'GMP Certified' },
  { id: 6, img: ISOcertified,  alt: 'ISO Certified',     label: 'ISO Certified' },
]

export default function ImageCarousel() {
  const track = [...carouselItems, ...carouselItems, ...carouselItems, ...carouselItems]

  return (
    <section className="img-carousel">
      <div className="img-carousel__track">
        {track.map((item, i) => (
          <div key={i} className="img-carousel__item">
            <img src={item.img} alt={item.alt} className="img-carousel__img" loading="lazy" decoding="async" />
            <span className="img-carousel__label">{item.label}</span>
          </div>
        ))}
      </div>
    </section>
  )
}
