import "./rangeInput.css"

const RangeInput = ({label, min, max, valueMin, valueMax, onMinChange, onMaxChange}) => {
  return (
    <div className="rangeinput-container">
        <label className="rangeinput-label">{label}</label>
        <div className="rangeinput-options">
            <input 
                type="number"
                min = {min}
                max = {max}
                value = {valueMin}
                onChange = {(e) => onMinChange(e.target.value)}
                className = "rangeinput-minvalue" 
            />
            <span>to</span>
            <input 
                type="number"
                min = {min}
                max = {max}
                value = {valueMax}
                onChange = {(e) => onMaxChange(e.target.value)}
                className = "rangeinput-maxvalue" 
            />
        </div>
    </div>
  )
}

export default RangeInput
