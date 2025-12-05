import { Button } from "../base/Button";
import { useActionsWeather } from "@/hooks/useActionsWeather";

export const ActionsWeather = () => {
  const { buttons } = useActionsWeather();

  return (
    <>
      {buttons.map((button) => (
        <Button
          onClick={button.onClick}
          key={button.text}
          className="bg-green-600 hover:bg-green-500 font-semibold text-text-inverse text-md"
        >
          <button.icon />
          {button.text}
        </Button>
      ))}
    </>
  );
};
