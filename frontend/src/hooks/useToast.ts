import { toast } from "sonner";

export const useToast = () => {
  const success = (message: string, title = "Sucesso") => {
    toast.success(title, {
      description: message,
      className: "!text-green-500 text-text-primary",
    });
  };

  const error = (message: string, title = "Erro") => {
    toast.error(title, {
      description: message,
      className: "!text-red-500 text-text-primary",
    });
  };

  const info = (message: string, title = "Info") => {
    toast(message, {
      description: title,
      className: "!text-blue-500 text-text-primary",
    });
  };

  return {
    success,
    error,
    info,
  };
};
