import { Outlet } from "react-router-dom"
import AppHeader from "components/layout/app.header"
import AppFooter from "./components/layout/app.footer"
import { useState } from "react"

function Layout() {
  const [searchItem, setSearchItem] = useState<string>("")
  return (
    <>
      <div>
        <AppHeader
          searchItem={searchItem}
          setSearchItem={setSearchItem}
        />
        <Outlet context={[searchItem, setSearchItem]} />
        <AppFooter />
      </div>
    </>
  )
}

export default Layout
