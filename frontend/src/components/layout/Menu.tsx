import { useMenu } from "@/hooks/useMenu";
import { Cloudy, User } from "lucide-react";
import {
  NavigationMenuItem,
  NavigationMenu,
  NavigationMenuList,
} from "../base/NavigationMenu";
import { NavigationMenuTrigger } from "@radix-ui/react-navigation-menu";

export const Menu = () => {
  const { buttons, view, actionButtons, defaultOnClick } = useMenu();

  return (
    <NavigationMenu className="flex min-w-full max-w-full py-6 shadow-md justify-between items-center px-20">
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuTrigger onClick={actionButtons.home.onClick}>
            <Cloudy
              className={`${
                view === "current" ? "stroke-green-600" : ""
              } transition-all duration-300 hover:stroke-green-600 cursor-pointer w-8 h-8`}
            />
          </NavigationMenuTrigger>
        </NavigationMenuItem>
      </NavigationMenuList>

      <NavigationMenuList>
        {buttons.map((button) => (
          <NavigationMenuItem key={button.name}>
            <NavigationMenuTrigger
              onClick={
                button.onClick ? button.onClick : () => defaultOnClick(button)
              }
            >
              <span
                className={`transition-all duration-300 whitespace-nowrap hover:text-green-600 mx-10 my-1 rounded-sm cursor-pointer ${
                  button.name === view ? "text-green-600 " : "text-text-primary"
                }`}
              >
                {button.text}
              </span>
            </NavigationMenuTrigger>
          </NavigationMenuItem>
        ))}
      </NavigationMenuList>

      <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuTrigger onClick={actionButtons.user.onClick}>
            <User
              className={`${
                view === "user" ? "stroke-green-600" : ""
              } transition-all duration-300 hover:stroke-green-600`}
            />
          </NavigationMenuTrigger>
        </NavigationMenuItem>

        <NavigationMenuItem>
          <NavigationMenuTrigger onClick={actionButtons.logout.onClick}>
            <span className="flex items-center transition-all bg-red-400 ml-8 px-5 py-1 font-semibold rounded-sm cursor-pointer text-text-inverse hover:bg-red-500">
              {actionButtons.logout.text}
            </span>
          </NavigationMenuTrigger>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  );
};
