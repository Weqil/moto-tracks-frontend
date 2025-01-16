import { inject } from "@angular/core"
import { LoginService } from "../../Data/Services/Auth/login.service"
import { AuthService } from "../../Data/Services/Auth/auth.service"
import { NavController } from "@ionic/angular/standalone"
import { UserService } from "../../Data/Services/User/user.service"
export const canActivateAuth = ()=>{
    const navController:NavController = inject(NavController)
    let isLoggedIn:boolean = inject(AuthService).isAuthenticated()
    if(isLoggedIn && inject(UserService).user.value){
        return true
    }
    return navController.navigateForward('/login')
}