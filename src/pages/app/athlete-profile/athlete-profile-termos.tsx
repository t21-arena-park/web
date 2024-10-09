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

interface AthleteProfileTermosProps {
  athlete: Athlete | undefined
}

export function AthleteProfileTermos({ athlete }: AthleteProfileTermosProps) {
  const handleDownloadPdf = () => {
    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
    })

    doc.setFont('Arial', 'normal')
    doc.setFontSize(12)

    doc.setFontSize(16)
    doc.setFont('Arial', 'bold')
    doc.text('Termo de Responsabilidade', 105, 20, { align: 'center' })

    doc.setFontSize(12)
    doc.setFont('Arial', 'normal')

    const termoText = `Eu ${athlete?.responsible_name ?? '______________________________________________'}, portador do RG nº ${athlete?.rg ?? '__________'}, inscrito no CPF sob nº ${
      athlete?.cpf ?? '_____________________'
    }, responsável pelo atleta ${
      athlete?.athlete_name ?? '_____________________________________________________'
    }, tenho consciência de que o T21 Arena Park, não pode se responsabilizar pela integridade física do aluno, durante as aulas, jogos, torneios e campeonatos, pelo fato do futebol se caracterizar como um esporte de contato físico.
    
O responsável declara estar ciente de que, como qualquer outra atividade física, podem ocorrer lesões ou ferimentos nas aulas e/ou treinamentos, jogos, torneios e campeonatos. Sendo desejo do atleta e do responsável que o primeiro participe desses eventos, ambos isentam o projeto de Futsal Down T21 Arena Park de qualquer responsabilidade por eventuais lesões físicas, fraturas, acidentes em geral ou danos de qualquer natureza que venham ocorrer durante as atividades, cabendo-nos unicamente prestar assistência imediata no local em casos de ferimentos e pequenas contusões.
    
Lembrando que a afirmativa se refere à dentro da quadra de futsal durante as aulas, treinos, jogos, torneios e campeonatos no município de Itajubá e outras cidades.
    
Por estar de acordo com os itens estabelecidos, autorizo a participação do atleta nas atividades.
    `

    // Configurando margens e quebras de linha adequadas
    const margins = { top: 30, bottom: 30, left: 15, right: 15 }
    const pageWidth = doc.internal.pageSize.width - margins.left - margins.right

    // Dividindo o texto para caber na largura da página
    const splitText = doc.splitTextToSize(termoText, pageWidth)
    let currentHeight = margins.top + 10

    // Adicionando o texto com alinhamento justificado
    splitText.forEach((line: string | string[]) => {
      doc.text(line, margins.left, currentHeight, { align: 'justify' })
      currentHeight += 8 // Espaçamento entre as linhas
    })

    // Adicionando um rodapé com a assinatura
    currentHeight += 20 // Adicionando espaço antes do campo de assinatura
    doc.setFontSize(12)
    doc.text(
      `Assinatura do responsável: ________________________________________________`,
      margins.left,
      currentHeight,
      { align: 'left' }
    )

    // Gerando o download do PDF
    doc.save('termo_responsabilidade.pdf')
  }

  return (
    <DialogContent className="w-full max-w-lg mx-auto p-6 md:p-8 overflow-auto max-h-[90vh]" // Ajustes de responsividade
    > 
      <DialogHeader>
        <DialogTitle className="text-xl font-bold md:text-2xl">
          Termo de Responsabilidade
        </DialogTitle>
      <DialogDescription>  O Termo de Responsabilidade isenta o T21 Arena Park de qualquer responsabilidade por lesões durante atividades esportivas, reconhecendo os riscos do futebol e autorizando a participação do atleta nas atividades do projeto.</DialogDescription>
      </DialogHeader>

      <div className="flex flex-col gap-4 p-[2px] max-h-80 overflow-y-auto lg:max-h-96 xl:max-h-fit">
        <p className="font-bold text-slate-400">
          Eu{' '}
          <span className="font-bold text-slate-200">
            {athlete?.responsible_name ??
              '______________________________________________'}
          </span>
          , portador do RG nº{' '}
          <span className="font-bold text-slate-200">
            {athlete?.rg ?? '__________'}
          </span>
          , inscrito no CPF sob nº{' '}
          <span className="font-bold text-slate-200">
            {athlete?.cpf ?? '_____________________'}
          </span>{' '}
          responsável pelo atleta{' '}
          <span className="font-bold text-slate-200">
            {athlete?.athlete_name ??
              '_____________________________________________________'}
          </span>
          , tenho consciência de que o T21 Arena Park, não pode se
          responsabilizar pela integridade física do aluno, durante as aulas,
          jogos, torneios e campeonatos, pelo fato do futebol se caracterizar
          como um esporte de contato físico.
        </p>

        <p className="font-bold text-slate-400">
          O responsável declara estar ciente de que, como qualquer outra
          atividade física, podem ocorrer lesões ou ferimentos nas aulas e/ou
          treinamentos, jogos, torneios e campeonatos. Sendo desejo do atleta e
          do responsável que o primeiro participe desses eventos, ambos isentam
          o projeto de Futsal Down T21 Arena Park de qualquer responsabilidade
          por eventuais lesões físicas, fraturas, acidentes em geral ou danos de
          qualquer natureza que venham ocorrer durante as atividades,
          cabendo-nos unicamente, prestar assistência imediata no local em casos
          de ferimentos e pequenas contusões.
        </p>

        <p className="font-bold text-slate-400">
          Lembrando que a afirmativa se refere à dentro da quadra de futsal
          durante as aulas, treinos, jogos, torneios e campeonatos no município
          de Itajubá e outras cidades. Por estar de acordo com os itens
          estabelecidos, autorizo a participação do atleta nas atividades.
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
