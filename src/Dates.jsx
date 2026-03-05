const Dates = ({ end, handleDateChange, start }) => {
  return (
    <div className="form-row">
      <label className="field">
        <span className="field-label">Start Date</span>
        <input
          className="field-input"
          type="date"
          name="start"
          value={start}
          onChange={handleDateChange}
        />
      </label>
      <label className="field">
        <span className="field-label">End Date</span>
        <input
          className="field-input"
          type="date"
          name="end"
          value={end}
          onChange={handleDateChange}
        />
      </label>
    </div>
  )
}

export default Dates
