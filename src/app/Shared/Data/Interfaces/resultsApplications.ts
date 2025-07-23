import { personal } from './user-model'

export interface retsultsApplicationsGet {
  id: number
  user?: {
    personal?: personal
  }
  name?: string
  surname?: string
  offline?: boolean
  patronymic?: string
  start_number?: string
}
