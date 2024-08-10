import { api } from '@/lib/axios'

export type UpdateAnswerParams = {
  id: string
  sectionId: number
  questionId: number
}

export type UpdateAnswerBody = {
  value?: string
  observation?: string
}

export async function updateAnswer(
  params: UpdateAnswerParams,
  body: UpdateAnswerBody,
) {
  const { id, sectionId, questionId } = params

  await api.patch(
    `/anamnesis/${id}/section/${sectionId}/question/${questionId}/answer`,
    body,
  )
}
