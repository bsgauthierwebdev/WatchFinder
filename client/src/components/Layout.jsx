// import Header from "./Header"
import Navbar from "./Navbar"
import Footer from "./Footer"
import "../styles/Layout.css"

const Layout = ({children}) => {
    return (
        <div className="layout-container">
            {/* <Header /> */}
            <Navbar />
            <main className="layout__main-content">{children}</main>
            <Footer />
        </div>
    )
}

export default Layout