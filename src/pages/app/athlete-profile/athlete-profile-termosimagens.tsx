import {
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { DownloadIcon } from 'lucide-react'
import { jsPDF } from 'jspdf'

interface Athlete {
  responsible_name: string
  rg: string
  cpf: string
  athlete_name: string
}

interface AthleteProfileTermosImagemProps {
  athlete: Athlete | undefined
}

export function AthleteProfileTermosImagem({ athlete }: AthleteProfileTermosImagemProps) {
  const handleDownloadPdf = () => {
    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
    })

    doc.setFont('Arial', 'normal')
    doc.setFontSize(12)

    // Adicionando título do Termo de Autorização do Uso de Imagem
    doc.setFontSize(16)
    doc.setFont('Arial', 'bold')
    doc.text('Termo de Autorização do Uso de Imagem', 105, 20, { align: 'center' })

    // Adicionando o texto do Termo de Autorização
    const autorizacaoText = `Eu ${athlete?.responsible_name ?? '______________________________________________'}, portador do RG nº ${athlete?.rg ?? '__________'}, inscrito no CPF sob nº ${athlete?.cpf ?? '_____________________'}, autorizo o uso da imagem do atleta ${athlete?.athlete_name ?? '____________________________________________________'}, em todo material ligado aos meios de comunicação, para ser utilizada em campanhas promocionais e redes sociais vinculadas ao Projeto T21 Arena Park, sejam essas destinadas à divulgação ao público em geral e/ou apenas para uso interno deste projeto, desde que não haja desvirtuamento da sua finalidade.

A presente autorização é concedida a título gratuito, abrangendo o uso da imagem acima mencionada em todo território nacional e no exterior, em todas as suas modalidades e, em destaque, das seguintes formas: folhetos em geral (banner, encartes, mala direta, catálogo, etc.); folder de apresentação; home page; instagram; facebook; cartazes.

Por esta ser a expressão da minha vontade declaro que autorizo o uso acima descrito durante o tempo que o atleta mencionado acima estiver participando do T21 Arena Park, sem que nada haja a ser reclamado a título de direitos conexos à sua imagem ou a qualquer outro, e assino a presente autorização.

Itajubá, ____ de __________ de 2024.


____________________________________________________
Assinatura do Responsável`

    const margins = { top: 30, bottom: 30, left: 15, right: 15 }
    const pageWidth = doc.internal.pageSize.width - margins.left - margins.right

    // Dividindo o texto para caber na largura da página
    const splitAutorizacaoText = doc.splitTextToSize(autorizacaoText, pageWidth)
    let currentHeight = margins.top + 10

    // Adicionando o texto do Termo de Autorização com alinhamento justificado
    splitAutorizacaoText.forEach((line: string | string[]) => {
      doc.text(line, margins.left, currentHeight, { align: 'justify' })
      currentHeight += 8 // Espaçamento entre as linhas
    })

    // Gerando o download do PDF
    doc.save('termo_de_autorizacao_uso_imagem.pdf')
  }

  return (
    <DialogContent className="w-full max-w-lg mx-auto p-4 md:p-2 overflow-auto max-h-[100vh]">
      <DialogHeader>
        <DialogTitle className="text-xl font-bold md:text-2xl">
          Termo de Autorização de Uso de Imagem
        </DialogTitle>
        <DialogDescription> Este termo concede permissão para o uso da imagem do atleta nas campanhas promocionais
          e redes sociais do projeto T21 Arena Park, assegurando a integridade e a não modificação
          da finalidade de sua imagem.</DialogDescription>
      </DialogHeader>
      

      <div className="flex flex-col gap-4 p-[2px] max-h-80 overflow-y-auto lg:max-h-96 xl:max-h-fit">
        <p className="font-bold text-slate-400">
          Eu{' '}
          <span className="font-bold text-slate-200">
            {athlete?.responsible_name ?? '______________________________________________'}
          </span>
          , portador do RG nº{' '}
          <span className="font-bold text-slate-200">
            {athlete?.rg ?? '__________'}
          </span>
          , inscrito no CPF sob nº{' '}
          <span className="font-bold text-slate-200">
            {athlete?.cpf ?? '_____________________'}</span>{' '}
          autorizo o uso da imagem do atleta{' '}
          <span className="font-bold text-slate-200">
            {athlete?.athlete_name ?? '____________________________________________________'}
          </span>
          , em todo material ligado aos meios de comunicação, para ser utilizada
          em campanhas promocionais e redes sociais vinculadas ao Projeto T21
          Arena Park, sejam essas destinadas à divulgação ao público em geral e/ou
          apenas para uso interno deste projeto, desde que não haja
          desvirtuamento da sua finalidade.
        </p>

        <p className="font-bold text-slate-400">
          A presente autorização é concedida a título gratuito, abrangendo o
          uso da imagem acima mencionada em todo território nacional e no
          exterior, em todas as suas modalidades e, em destaque, das seguintes
          formas: folhetos em geral (banner, encartes, mala direta, catálogo,
          etc.); folder de apresentação; home page; instagram; facebook;
          cartazes.
        </p>

        <p className="font-bold text-slate-400">
          Por esta ser a expressão da minha vontade declaro que autorizo o uso
          acima descrito durante o tempo que o atleta mencionado acima estiver
          participando do T21 Arena Park, sem que nada haja a ser reclamado a
          título de direitos conexos à sua imagem ou a qualquer outro, e assino
          a presente autorização.
        </p>

        <p className="font-bold text-slate-400">
          Itajubá, ____ de __________ de 2024.
        </p>

        <p className="font-bold text-slate-400">
          Assinatura do Responsável:
          <span className="font-bold text-slate-200">
            __________________________________________________
          </span>
        </p>
      </div>

      <DialogFooter className="mt-4 flex flex-col md:flex-row justify-between gap-3">
        <DialogClose asChild>
          <Button
            type="button"
            variant="default"
            className="w-full md:w-auto rounded-md"
            size="sm"
          >
            Fechar
          </Button>
        </DialogClose>

        <Button
          type="button"
          variant="primary"
          className="w-full md:w-auto rounded-md flex items-center gap-2"
          size="sm"
          onClick={handleDownloadPdf}
        >
          <DownloadIcon className="size-4" />
          <span>Download</span>
        </Button>
      </DialogFooter>
    </DialogContent>
  )
}
