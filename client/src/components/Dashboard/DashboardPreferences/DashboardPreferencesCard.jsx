import "./dashboardPreferencesCard.css"

const DashboardPreferenceCard = (props) => {
    if (!props || Object.keys(props).length === 0) {
        return <p>No preferences saved yet</p>
    }
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

    const readCaseSizeMin = case_size_min ?? "Not specified"
    const readCaseSizeMax = case_size_max ?? "Not specified"
    const readPriceMin = price_min ?? "Not specified"
    const readPriceMax = price_max ?? "Not specified"
    const readMovements = movements ?? []
    const readStrapStyles = strap_styles ?? []
    const readWatchStyles = watch_styles ?? []
    const readPlatforms = platforms ?? []
    const readBrands = brands ?? []
    const readDialColors = dial_colors ?? []
    const readCondition = condition ?? []
    const readSellerLocation = seller_location ?? []
    const readFrequency = frequency ?? []

    const capitalize = (str) => {
        if (typeof str !== "string" || !str) return ""
        return str.charAt(0).toUpperCase() + str.slice(1)
    }

    return (
        <div className="dashboard-preferences-container">
            <div className="dashboard-preferences-header">
                <h3>Your Preferences</h3>
            </div>

            <div className="dashboard-preferences-grid">
                <p><strong>Size: </strong>
                    {Number.isFinite(readCaseSizeMin) && Number.isFinite(readCaseSizeMax)
                        ? `${readCaseSizeMin}mm - ${readCaseSizeMax}mm`
                        : "Not specified"}
                </p>
                <p><strong>Budget: </strong>
                    {Number.isFinite(readPriceMin) && Number.isFinite(readPriceMax)
                        ? `$${readPriceMin} - $${readPriceMax}`
                        : "Not specified"}
                </p>
                <p><strong>Movement: </strong>
                    {readMovements.length > 0
                        ? readMovements.sort((a, b) => a.localeCompare(b)).map((m, i) => (
                            <span key = {i}>
                                {capitalize(m)}{i < readMovements.length - 1 ? ", " : ""}
                            </span>
                        )) : "Not specified"}
                </p>
                <p><strong>Strap Style: </strong>
                    {readStrapStyles.length > 0
                        ? readStrapStyles.sort((a, b) => a.localeCompare(b)).map((m, i) => (
                            <span key = {i}>
                                {capitalize(m)}{i < readStrapStyles.length - 1 ? ", " : ""}
                            </span>
                        )) : "Not specified"}
                </p>
                <p><strong>Watch Style: </strong>
                    {readWatchStyles.sort((a, b) => a.localeCompare(b)).length > 0
                        ? readWatchStyles.map((m, i) => (
                            <span key = {i}>
                                {capitalize(m)}{i < readWatchStyles.length - 1 ? ", " : ""}
                            </span>
                        )) : "Not specified"}
                </p>
                <p><strong>Dial Colors: </strong>
                    {readDialColors.sort((a, b) => a.localeCompare(b)).length > 0
                        ? readDialColors.map((m, i) => (
                            <span key = {i}>
                                {capitalize(m)}{i < readDialColors.length - 1 ? ", " : ""}
                            </span>
                        )) : "Not specified"}
                </p>
                <p><strong>Condition: </strong>
                    {readCondition.length > 0
                        ? readCondition.map((m, i) => (
                            <span key = {i}>
                                {capitalize(m)}{i < readCondition.length - 1 ? ", " : ""}
                            </span>
                        )) : "Not specified"}
                </p>
                <p><strong>Platforms: </strong>
                    {readPlatforms.sort((a, b) => a.localeCompare(b)).length > 0
                        ? readPlatforms.map((m, i) => (
                            <span key = {i}>
                                {capitalize(m)}{i < readPlatforms.length - 1 ? ", " : ""}
                            </span>
                        )) : "Not specified"}
                </p>
                <p><strong>Brands: </strong>
                    {readBrands.sort((a, b) => a.localeCompare(b)).length > 0
                        ? readBrands.map((m, i) => (
                            <span key = {i}>
                                {capitalize(m)}{i < readBrands.length - 1 ? ", " : ""}
                            </span>
                        )) : "Not specified"}
                </p>
                <p><strong>Seller Location: </strong>{capitalize(seller_location) || "Not specified"}</p>
                <p><strong>Alert Frequency: </strong>{capitalize(frequency) || "Not specified"}</p>
            </div>
            <div className="dashboard-preferences-footer">
                <a href = "/preferences" className = "view-all-link">Edit Your Preferences</a>
            </div>
        </div>
    )
}

export default DashboardPreferenceCard