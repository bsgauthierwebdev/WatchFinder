import "../styles/dashboardPreferencesCard.css"

const DashboardPreferenceCard = (props) => {
    const {
        case_size_min,
        case_size_max,
        price_min,
        price_max,
        movements,
        strap_styles,
        watch_styles,
        platforms,
        brands,
        dial_colors,
        condition,
        seller_location,
        frequency
    } = props

    const capitalize = (str) => {
        if (typeof str !== "string" || !str) return ""
        return str.charAt(0).toUpperCase() + str.slice(1)
    }

    return (
        <div className="dashboard-card">
            <h3>Your Preferences</h3>

            <p><strong>Size: </strong>{case_size_min}mm - {case_size_max}mm</p>
            <p><strong>Budget: </strong>${price_min} - ${price_max}</p>
            <p><strong>Movement: </strong>
                {movements.map((m, i) => (
                    <span key = {i}>
                        {capitalize(m)}{i < movements.length - 1 ? ", " : ""}
                    </span>
                ))}
            </p>
            <p><strong>Strap Style: </strong>
                {strap_styles.map((s, i) => (
                    <span key = {i}>
                        {capitalize(s)}{i < strap_styles.length - 1 ? ", " : ""}
                    </span>
                ))}
            </p>
            <p><strong>Watch Style: </strong>
                {watch_styles.map((w, i) => (
                    <span key = {i}>
                        {capitalize(w)}{i < watch_styles.length - 1 ? ", " : ""}
                    </span>
                ))}
            </p>
            <p><strong>Dial Colors: </strong>
                {dial_colors.map((d, i) => (
                    <span key = {i}>
                        {capitalize(d)}{i < dial_colors.length - 1 ? ", " : ""}
                    </span>
                ))}
            </p>
            <p><strong>Condition: </strong>
                {condition.map((c, i) => (
                    <span key = {i}>
                        {capitalize(c)}{i < condition.length - 1 ? ", " : ""}
                    </span>
                ))}
            </p>
            <p><strong>Platforms: </strong>
                {platforms?.map((p, i) => (
                    <span key = {i}>
                        {capitalize(p)}{i < platforms.length - 1 ? ", " : ""}
                    </span>
                ))}
            </p>
            <p><strong>Brands: </strong>
                {strap_styles?.map((b, i) => (
                    <span key = {i}>
                        {capitalize(b)}{i < strap_styles.length - 1 ? ", " : ""}
                    </span>
                ))}
            </p>
            <p><strong>Seller Location: </strong>{capitalize(seller_location) || "Not specified"}</p>
            <p><strong>Alert Frequency: </strong>{capitalize(frequency) || "Not specified"}</p>
        </div>
    )
}

export default DashboardPreferenceCard