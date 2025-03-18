import { inject } from "@angular/core"
import { LoginService } from "../../Data/Services/Auth/login.service"
import { AuthService } from "../../Data/Services/Auth/auth.service"
import { NavController } from "@ionic/angular/standalone"
import { UserService } from "../../Data/Services/User/user.service"
import { ToastService } from "../../Services/toast.service"
import { ActivatedRouteSnapshot, CanActivateFn, RouterStateSnapshot } from "@angular/router"
import { isArray } from "lodash"
export function canActivateUserHaveRole(roleName:string|undefined|null|string[],roleNameInMessage:string,): CanActivateFn {
    return (ars: ActivatedRouteSnapshot, rss: RouterStateSnapshot) => {
        const navController:NavController = inject(NavController)
        if(inject(UserService).userHaveRoot()){
            return true
        }
        if (roleName && !isArray(roleName)) {
            let roleId = inject(UserService).allRoles?.find((role)=>role.name === roleName)?.id
            if(roleId && inject(UserService).user.value?.roles.find((role)=> role.id==roleId) || inject(UserService).userHaveRoot()){
                return true
            }
        }
        if (roleName && isArray(roleName)) {
            console.log(roleName)
            let userHaveRole:boolean = false
            roleName.forEach((roleInArray)=>{
                let roleId = inject(UserService).allRoles?.find((role:any)=>role.name === roleInArray)?.id
                if(roleId && inject(UserService).user.value?.roles.find((role)=> role.id==roleId)){
                    userHaveRole = true
                }
            })
            
            if(userHaveRole){
                return true
            }
        }
      
        inject(ToastService).showToast(`Для того что бы сделать это вам нужно получить статус ${roleNameInMessage}`,'warning')
        return navController.navigateForward('/settings')
    }
  }
