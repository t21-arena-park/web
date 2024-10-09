/* eslint-disable prettier/prettier */
import { Button } from "@/components/ui/button";
import {
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Download, UploadCloud } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export function ImportDialog() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0] || null;
    setSelectedFile(file);
  }

  function handleFileUpload() {
    if (!selectedFile) {
      toast.error("Nenhum arquivo selecionado.");
      return;
    }

    toast.success(`Arquivo "${selectedFile.name}" foi importado com sucesso!`);
  }

  function handleExportTemplate() {
    const fileUrl = "../../../assets/teste.csv";
    const link = document.createElement("a");
    link.href = fileUrl;
    link.download = "atletas.csv";
    link.click();
  }

  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Cadastro de atletas em lote</DialogTitle>
        <DialogDescription>
          Selecione um arquivo CSV para importar dados.
        </DialogDescription>
      </DialogHeader>

      <div className="flex flex-col gap-4 border-dashed">
        <div className="flex flex-col gap-2 ">
          <Input variant="import">
            <input
              id="csvFile"
              type="file"
              accept=".csv"
              className="text-sm opacity-0 absolute inset-0"
              onChange={handleFileChange}
            />
            <UploadCloud className="size-6" />
            <p>Clique aqui para fazer o download</p>
          </Input>

          {selectedFile && (
            <span className="text-sm text-lime-600">
              Arquivo selecionado: {selectedFile.name}
            </span>
          )}
        </div>
      </div>

      <DialogFooter className="mt-3 space-x-0 flex flex-row !justify-between">
        <Button
          type="button"
          variant="secondary"
          className="rounded-md flex gap-2"
          size="sm"
          onClick={handleExportTemplate}
        >
          <Download className="size-5" />
          Exportar Modelo
        </Button>

        <div className="flex gap-2">
          <DialogClose asChild>
            <Button
              type="button"
              variant="default"
              className="rounded-md"
              size="sm"
            >
              Fechar
            </Button>
          </DialogClose>

          <Button
            type="button"
            variant="primary"
            className="rounded-md"
            size="sm"
            disabled={!selectedFile}
            onClick={handleFileUpload}
          >
            Confirmar
          </Button>
        </div>
      </DialogFooter>
    </DialogContent>
  );
}
