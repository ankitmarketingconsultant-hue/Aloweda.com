import { Link } from 'react-router-dom'
import AlowedaLogo from '../assets/AlowedaLogo.png'
import './Footer.css'

/* ── Footer ── */
export default function Footer({ onLoginClick }) {
  const handleSignUpClick = () => {
    if (onLoginClick) {
      onLoginClick()
    }
  }

  return (
    <footer className="footer">
      <div className="footer__inner">

          {/* Col 1 — Brand */}
          <div className="footer__brand">
            <img src={AlowedaLogo} alt="Aloweda" className="footer__logo" loading="lazy" decoding="async" />
            <p className="footer__bio">
              At Aloweda, we believe wellness starts with conscious choices. From skincare
              and haircare to nutrition, our mission is to deliver high-quality, nature-inspired
              products that fit seamlessly into your daily routine. Rooted in trust,
              transparency, and care. Aloweda is your partner in everyday well-being.
            </p>
          </div>

          {/* Col 2 — Collections */}
          <div className="footer__col">
            <h4 className="footer__col-title">Collections</h4>
            <a href="#" className="footer__link">Skin Care</a>
            <a href="#" className="footer__link">Lip Care</a>
            <a href="#" className="footer__link">Hair Care</a>
            <a href="#" className="footer__link">Dietary Supplement</a>
          </div>

          {/* Col 3 — Quick Links */}
          <div className="footer__col">
            <h4 className="footer__col-title">Quick Links</h4>
            <Link to="/about" className="footer__link">About Us</Link>
            <a href="#" className="footer__link">Blogs</a>
            <a href="#" className="footer__link">Contact us</a>
            <a href="#" className="footer__link">Shipping Policy</a>
            <a href="#" className="footer__link">Cancellation/Refund Policy</a>
            <a href="#" className="footer__link">Privacy policy</a>
            <Link to="/terms" className="footer__link">Terms &amp; Conditions</Link>
          </div>

          {/* Col 4 — Newsletter */}
          <div className="footer__col">
            <h4 className="footer__col-title">Newsletter</h4>
            <p className="footer__newsletter-text">
              Subscribe to get notified about product launches, special offers and company news
            </p>
            <button className="footer__signup-btn" onClick={handleSignUpClick}>SIGN UP</button>
          </div>

        </div>

        {/* Bottom bar */}
        <div className="footer__bottom">
          <div className="footer__contact-pills">
            <a href="tel:+919972269191" className="footer__pill">+91 99722 69191</a>
            <a href="mailto:marketing@aloweda.com" className="footer__pill">MARKETING@ALOWEDA.COM</a>
          </div>
          <p className="footer__copy">© 2026, Aloweda. All rights reserved.</p>
        </div>
      </footer>
  )
}
