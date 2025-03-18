import { inject } from "@angular/core"
import { LoginService } from "../../Data/Services/Auth/login.service"
import { AuthService } from "../../Data/Services/Auth/auth.service"
import { NavController } from "@ionic/angular/standalone"
import { UserService } from "../../Data/Services/User/user.service"
import { ToastService } from "../../Services/toast.service"
import { ActivatedRouteSnapshot, CanActivateFn, RouterStateSnapshot } from "@angular/router"
export function canActivateUserHaveRole(roleName:string|undefined|null,roleNameInMessage:string): CanActivateFn {
    return (ars: ActivatedRouteSnapshot, rss: RouterStateSnapshot) => {
        const navController:NavController = inject(NavController)
        let roleId = inject(UserService).allRoles?.find((role)=>role.name === roleName)?.id
        if(roleId && inject(UserService).user.value?.roles.find((role)=> role.id==roleId) || inject(UserService).userHaveRoot()){
            return true
        }
        inject(ToastService).showToast(`Для того что бы сделать это вам нужно получить статус ${roleNameInMessage}`,'warning')
        return navController.navigateForward('/settings')
    }
  }
