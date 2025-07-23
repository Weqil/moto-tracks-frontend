import { Grade } from './grade'

export interface IArrivals {
  appointment_race_id: number
  arrival: string
  command_id: number
  grade: Grade
  grade_id: number
  id: number
  place: number
  race_id: number
  scores: number
  time: number | null
  user_id: number
}

export interface IArrivalsWithGrades {
  grades: {
    id: number
    name: string
    description: string
    arrivals: IArrivals[]
  }[]
}
