import "./preferenceSelector.css"

const PreferenceSelector = ({label, options, selectedOptions, onChange}) => {
    const toggleOption = (option) => {
        const updated = selectedOptions.includes(option)
            ? selectedOptions.filter((item) => item !== option)
            : [...selectedOptions, option]

        onChange(updated)
    }

    const removeOption = (option) => {
        onChange(selectedOptions.filter((item) => item !== option))
    }

  return (
    <div className="selector-container">
        <label className="selector-label">{label}</label>

        {/* Selected options area */}
        <div className="selector-list">
            {selectedOptions.length === 0 && (
                <span className="selector-list__placeholder">No {label.toLowerCase()} selected</span>
            )}
            {(label !== "Condition"
                ? [...selectedOptions].sort((a, b) => a.localeCompare(b))
                : selectedOptions
            ).map((item) => (
                <span 
                    key = {item}className="selector-list__selections"
                >
                    {item}
                    <button 
                        onClick = {() => removeOption(item)}
                        className="selector-list__remove"
                    >
                        X
                    </button>
                </span>
            ))}
        </div>

        {/* Button list for selection */}
        <div className="selector-options">
            {(label !== "Condition"
                ? [...options].sort((a, b) => a.localeCompare(b))
                : options
            ).map((option) => {
                const selected = selectedOptions.includes(option)
                return (
                    <button 
                        key = {option}
                        type = "button"
                        onClick = {() => toggleOption(option)}
                        className = {`selector-options__item ${
                            selected
                                ? "selected"
                                : "deselected"
                        }`}
                    >
                        {option}
                    </button>
                )
            })}
        </div>

    </div>
  )
}

export default PreferenceSelector
