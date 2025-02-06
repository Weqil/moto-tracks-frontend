import { inject } from "@angular/core"
import { LoginService } from "../../Data/Services/Auth/login.service"
import { AuthService } from "../../Data/Services/Auth/auth.service"
import { NavController } from "@ionic/angular/standalone"
import { UserService } from "../../Data/Services/User/user.service"
export const canActivateEmailConfirm = ()=>{
    const navController:NavController = inject(NavController)
    let isEmailVerificate:boolean = inject(UserService).isEmailVerified()
    if(isEmailVerificate && inject(UserService).user.value){
        return true
    }
    return navController.navigateForward('/verification')
}