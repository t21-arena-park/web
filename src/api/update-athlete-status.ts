import type { AthleteStatus } from '@/components/athlete-status'

import { api } from '@/lib/axios'

export interface UpdateAthleteStatusParams {
  athleteId: string
  status?: AthleteStatus
}

export async function updateAthleteStatus({
  athleteId,
}: UpdateAthleteStatusParams) {
  await api.patch(`/athletes/${athleteId}/status`)
}
