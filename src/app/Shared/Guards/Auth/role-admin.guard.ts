import { inject } from "@angular/core"
import { LoginService } from "../../Data/Services/Auth/login.service"
import { AuthService } from "../../Data/Services/Auth/auth.service"
import { NavController } from "@ionic/angular/standalone"
import { UserService } from "../../Data/Services/User/user.service"
import { ToastService } from "../../Services/toast.service"
import { AuthErrosMessages } from "../../Data/Enums/erros"
import { userRoles } from "../../Data/Enums/roles"


export const canActivateRoleAdmin = ()=>{
    const navController:NavController = inject(NavController)
    const userService: UserService = inject(UserService)
    const toast: ToastService = inject(ToastService)

    const permission = userService.hasRole(userRoles.admin) || userService.hasRole(userRoles.root)|| userService.hasRole(userRoles.commission)

    if (permission) {
        return true
    }

    toast.showToast(AuthErrosMessages.notPermission, 'warning')
    return navController.navigateForward('/cabinet')
}