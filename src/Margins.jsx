const Margins = ({ buyPrice, sellPrice, handlePriceChange }) => {
  return (
    <section className="card stack">
      <div>
        <h3 className="section-title">Experiment with your margins</h3>
        <p className="section-copy">
          Adjust the unit economics without reloading the inventory data.
        </p>
      </div>
      <div className="form-row">
        <label className="field">
          <span className="field-label">Buy Price</span>
          <input
            className="field-input"
            min="0"
            name="buyPrice"
            step="0.01"
            type="number"
            value={buyPrice}
            onChange={handlePriceChange}
          />
        </label>
        <label className="field">
          <span className="field-label">Sell Price</span>
          <input
            className="field-input"
            min="0"
            name="sellPrice"
            step="0.01"
            type="number"
            value={sellPrice}
            onChange={handlePriceChange}
          />
        </label>
      </div>
    </section>
  )
}

export default Margins
