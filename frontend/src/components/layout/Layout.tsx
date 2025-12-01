import { Outlet } from "react-router"
import { Menu } from "./Menu"
import { MenuViewProvider } from "@/app/context/menuView/useMenuView.provider"

export const Layout = () => {
  return (
    <MenuViewProvider>
      <Menu />
      <Outlet />
    </MenuViewProvider>
  )
}