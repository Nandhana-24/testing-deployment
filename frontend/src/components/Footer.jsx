import { Link } from 'react-router-dom';
import watchhubMark from '../assets/watchhub-mark.svg';

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="container footer-grid">
        <div>
          <Link className="brand-mark footer-brand" to="/"><img className="brand-icon" src={watchhubMark} alt="" /><span>WATCH<span className="brand-light">HUB</span></span></Link>
          <p>Considered timepieces. Made for wherever life takes you.</p>
        </div>
        <div><h3>Explore</h3><Link to="/shop">All watches</Link><Link to="/about">Our story</Link><Link to="/contact">Contact</Link></div>
        <div><h3>Get in touch</h3><a href="mailto:hello@watchhub.example">hello@watchhub.example</a><p>Monday–Friday, 9am–5pm</p></div>
        <div><h3>Follow along</h3><div className="social-links"><a href="https://instagram.com" target="_blank" rel="noreferrer">Instagram</a><a href="https://pinterest.com" target="_blank" rel="noreferrer">Pinterest</a></div></div>
      </div>
      <div className="container footer-bottom"><span>© {new Date().getFullYear()} WatchHub</span><span>Time, considered.</span></div>
    </footer>
  );
}
