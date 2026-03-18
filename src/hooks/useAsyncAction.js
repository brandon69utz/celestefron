import { useState } from "react";

export default function useAsyncAction() {
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState({
    open: false,
    type: "success",
    title: "",
    message: "",
  });

  const runAction = async ({
    action,
    successTitle = "Operación exitosa",
    successMessage = "La operación se completó correctamente.",
    errorTitle = "Ocurrió un error",
    getErrorMessage,
  }) => {
    setLoading(true);

    try {
      const result = await action();

      setAlert({
        open: true,
        type: "success",
        title: successTitle,
        message:
          typeof successMessage === "function"
            ? successMessage(result)
            : successMessage,
      });

      return result;
    } catch (err) {
      const fallback =
        err?.response?.data?.message ||
        "No se pudo completar la operación.";

      setAlert({
        open: true,
        type: "error",
        title: errorTitle,
        message: getErrorMessage ? getErrorMessage(err) : fallback,
      });

      throw err;
    } finally {
      setLoading(false);
    }
  };

  const closeAlert = () => {
    setAlert((prev) => ({ ...prev, open: false }));
  };

  return {
    loading,
    alert,
    runAction,
    closeAlert,
  };
}