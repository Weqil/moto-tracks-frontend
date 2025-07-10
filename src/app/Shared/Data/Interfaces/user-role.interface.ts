import { UserStatuses } from "@app/Shared/Enums/user-status"

export interface UserRole {
  index: number
  name: UserStatuses[]
  client?: boolean
}
