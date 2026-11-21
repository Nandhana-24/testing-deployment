import { Link, useLocation } from 'react-router-dom';

export default function InfoPage() {
  const { pathname } = useLocation();
  const isContact = pathname === '/contact';
  return (
    <main className="container page-shell info-page">
      <div className="page-intro"><span className="eyebrow">{isContact ? 'WE’RE HERE TO HELP' : 'A MORE CONSIDERED APPROACH'}</span>
        <h1>{isContact ? <>Let’s talk <em>time.</em></> : <>Time, with <em>intention.</em></>}</h1>
        <p>{isContact ? 'Questions about a timepiece, your order, or just curious? We’d love to hear from you.' : 'WatchHub is a small edit of watches made to be worn, loved, and passed along.'}</p>
      </div>
      {isContact ? <section className="info-card"><span className="eyebrow">CUSTOMER CARE</span><h2>Good conversations start here.</h2><p>Our team is available Monday through Friday, 9am–5pm. Send us a note and we’ll get back to you as soon as we can.</p><a className="button-dark" href="mailto:hello@watchhub.example">hello@watchhub.example <span>↗</span></a></section> :
        <section className="info-story"><div><span className="eyebrow">WHY WATCHHUB</span><h2>Keep what matters.</h2><p>We think the best things are chosen carefully and enjoyed for a long time. That’s why every piece in our collection is selected for thoughtful design, reliable craftsmanship, and a point of view that lasts beyond the season.</p><p>From the first click to the delivery at your door, we want discovering your next everyday favourite to feel refreshingly straightforward.</p><Link className="text-link" to="/shop">Explore the collection <span>↗</span></Link></div><img src="https://images.unsplash.com/photo-1495856458515-063718b7c7a6?auto=format&fit=crop&w=1200&q=85" alt="Thoughtfully crafted wristwatch" /></section>}
    </main>
  );
}
