import './css/home.css'
import banana from '../images/banana-logo.png'

const Home = () => {
  return (
    <main className="hero-container">
      <div className="hero-card">
        <p className="eyebrow">Inventory dashboard</p>
        <div className="app-name">Banana Tracker</div>
        <p className="hero-copy">
          Track purchases, record sales, and inspect margin assumptions from one
          lightweight dashboard.
        </p>
        <img src={banana} alt="Banana Tracker logo" />
      </div>
    </main>
  )
}

export default Home
