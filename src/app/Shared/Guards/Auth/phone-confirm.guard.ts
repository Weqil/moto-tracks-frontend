import { inject } from "@angular/core"
import { LoginService } from "../../Data/Services/Auth/login.service"
import { AuthService } from "../../Data/Services/Auth/auth.service"
import { NavController } from "@ionic/angular/standalone"
import { UserService } from "../../Data/Services/User/user.service"
export const canActivatePhoneConfirm = ()=>{
    const navController:NavController = inject(NavController)
    let isPhoneVerified:boolean = inject(UserService).isPhoneVerified()
    let isLoggedIn:boolean = inject(AuthService).isAuthenticated()
    if(isPhoneVerified && isLoggedIn){
        return true
    }
    return navController.navigateForward('/confirm-phone')
}