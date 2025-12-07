import { toast } from "sonner";

export const useToast = () => {
  const success = (message: string, title = "Success") => {
    toast.success(title, {
      description: message,
    });
  };

  const error = (message: string, title = "Error") => {
    toast.error(title, {
      description: message,
    });
  };

  const info = (message: string, title = "Info") => {
    toast(title, {
      description: message,
    });
  };

  return {
    success,
    error,
    info,
  };
};
