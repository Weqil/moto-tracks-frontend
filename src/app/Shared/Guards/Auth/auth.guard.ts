import { inject } from "@angular/core"
import { LoginService } from "../../Data/Services/Auth/login.service"
import { AuthService } from "../../Data/Services/Auth/auth.service"
import { NavController } from "@ionic/angular/standalone"

export const canActivateAuth = ()=>{
    const navController:NavController = inject(NavController)
    const isLoggedIn:boolean = inject(AuthService).isAuthenticated()
    if(isLoggedIn){
        return true
    }
    return navController.navigateForward('/login')
}