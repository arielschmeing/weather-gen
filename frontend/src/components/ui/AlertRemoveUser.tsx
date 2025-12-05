import { useState } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "../base/AlertDialog";
import { Button } from "../base/Button";

interface AlertRemoveUserPropss {
  onClick: () => void;
}

export const AlertRemoveUser = ({ onClick }: AlertRemoveUserPropss) => {
  const [open, setOpen] = useState(false);

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <Button className="max-w-md w-full bg-red-400 font-semibold text-text-inverse hover:bg-red-500 transition-all duration-300">
          Excluir conta
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            Você tem certeza que deseja deletar a sua conta?
          </AlertDialogTitle>
          <AlertDialogDescription>
            Essa ação é irreversível e não podera voltar atrás.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancelar</AlertDialogCancel>
          <AlertDialogAction
            onClick={() => {
              onClick();
              setOpen(false);
            }}
            className="bg-red-400 font-semibold text-text-inverse hover:bg-red-500 transition-all duration-300"
          >
            Excluir
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
