interface ErrorMessagePros {
  message?: string;
}

const ErrorMessage = ({ message }: ErrorMessagePros) => {
  if (!message) return null;

  return <span className="text-error text-sm ml-2 ">{message}</span>;
};

export { ErrorMessage };
