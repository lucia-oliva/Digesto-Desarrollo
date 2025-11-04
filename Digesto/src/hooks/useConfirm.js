import React, { useState } from "react";
import { ConfirmDialog } from "../components/ui/ConfirmDialog";

export const useConfirm = () => {
  const [state, setState] = useState({
    isOpen: false,
    title: "",
    message: "",
    resolve: null,
  });

  const confirm = (title, message) =>
    new Promise((resolve) => {
      setState({
        isOpen: true,
        title,
        message,
        resolve,
      });
    });

  const handleConfirm = () => {
    if (state.resolve) state.resolve(true);
  };

  const handleCancel = () => {
    if (state.resolve) state.resolve(false);
  };

  const ConfirmUI = React.createElement(ConfirmDialog, {
    isOpen: state.isOpen,
    setIsOpen: (open) => {
      if (!open) {
        setState((s) => ({ ...s, isOpen: false }));
      }
    },
    title: state.title,
    message: state.message,
    onConfirm: handleConfirm,
    onCancel: handleCancel,
  });

  return { confirm, ConfirmUI };
};
