import Navbar from '../Components/Navbar'
function App() {
  return (
    <div className="App">
      <Navbar />
      <main>
      <section className="hero-section">
  <div className="hero-content">
    <h1>Benvenuti in H.U.G</h1>
    <p>
      La piattaforma digitale che semplifica la gestione dei centri diurni, promuove la socializzazione
      e migliora la qualità della vita degli anziani.
    </p>
    <a href="#services" className="hero-button">Scopri di più</a>
  </div>
  <div className="hero-image">
    <img src="/images/community.jpg" alt="Anziani che socializzano" />
  </div>
</section>


    <section id="services" className="services-section">
        <h2>Le Nostre Funzionalità</h2>
        <div className="services-cards">
            <div className="service-card">
                <img src="/images/activity.png" alt="Attività" />
                <h3>Gestione Attività</h3>
                <p>
                    Organizza facilmente attività interne ed esterne per i tuoi utenti.
                </p>
            </div>
            <div className="service-card">
                <img src="/images/transport.png" alt="Trasporti" />
                <h3>Gestione Trasporti</h3>
                <p>
                    Coordina i trasporti per le attività fuori sede con servizi personalizzati.
                </p>
            </div>
            <div className="service-card">
                <img src="/images/collaboration.png" alt="Collaborazione" />
                <h3>Collaborazione</h3>
                <p>
                    Lavora insieme ad altri centri per offrire il meglio ai tuoi utenti.
                </p>
            </div>
            
        </div>
    </section>

    <section className="cta-section">
        <h2>Unisciti a Noi!</h2>
        <p>
            Scopri come H.U.G può aiutarti a semplificare la gestione del tuo centro diurno
            e a migliorare la vita dei tuoi utenti.
        </p>
        <p>Login - asdasdbsdjhkakjnfoasdasdasdasdk</p>
        <a href="#contact" className="cta-button">Contattaci</a>
    </section>
</main>

    </div>
  );
}

export default App;
