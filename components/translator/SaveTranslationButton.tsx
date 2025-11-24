"use client";

import { FC } from "react";
import { Button } from "@/components/ui/button";

type SaveTranslationButtonProps = {
  disabled?: boolean;
  loading?: boolean;
  onClick: () => void;
};

export const SaveTranslationButton: FC<SaveTranslationButtonProps> = ({
  disabled,
  loading,
  onClick,
}) => {
  return (
    <div className="flex justify-end mt-3">
      <Button
        type="button"
        size="sm"
        onClick={onClick}
        disabled={disabled || loading}
      >
        {loading ? "Guardando..." : "Guardar en historial"}
      </Button>
    </div>
  );
};
