import React from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Funções reutilizáveis
export const notifySuccess = (mensagem = "Operação realizada com sucesso!") => {
  toast.success(mensagem, {
    position: toast.POSITION.TOP_RIGHT,
    autoClose: 3000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
  });
};

export const notifyError = (mensagem = "Ocorreu um erro. Tente novamente!") => {
  toast.error(mensagem, {
    position: toast.POSITION.TOP_RIGHT,
    autoClose: 3000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
  });
};

// Componente com o ToastContainer
const Notifications = () => {
  return <ToastContainer position="top-right" autoClose={3000} />;
};

export default Notifications;
