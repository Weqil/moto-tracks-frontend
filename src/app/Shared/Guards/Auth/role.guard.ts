import { inject } from "@angular/core"
import { LoginService } from "../../Data/Services/Auth/login.service"
import { AuthService } from "../../Data/Services/Auth/auth.service"
import { NavController } from "@ionic/angular/standalone"
import { UserService } from "../../Data/Services/User/user.service"
import { ToastService } from "../../Services/toast.service"
import { ActivatedRouteSnapshot, CanActivateFn, RouterStateSnapshot } from "@angular/router"
import { isArray } from "lodash"
import { firstValueFrom } from "rxjs"

export function canActivateUserHaveRole(roleName:string|undefined|null|string[],roleNameInMessage:string,): CanActivateFn {
    return async (ars: ActivatedRouteSnapshot, rss: RouterStateSnapshot) => {
        // Получаем все необходимые сервисы в синхронном контексте
        const navController = inject(NavController)
        const userService = inject(UserService)
        const toastService = inject(ToastService)
        
        // Проверяем, есть ли данные о пользователе
        if (!userService.user.value) {
            try {
                const userData = await firstValueFrom(userService.getUserFromServerWithToken())
                userService.setUserInLocalStorage(userData.user, userService.getAuthToken())
            } catch (error) {
                return navController.navigateForward('/cabinet')
            }
        }
        
        // Проверяем, загружены ли роли
        if (!userService.allRoles) {
            try {
                const rolesData = await firstValueFrom(userService.getChangeRoles())
                if (!Array.isArray(rolesData)) {
                    throw new Error('Некорректный формат данных ролей')
                }
                userService.allRoles = rolesData as Array<{id:number,name:string}>
            } catch (error) {
                return navController.navigateForward('/cabinet')
            }
        }

        if(userService.userHaveRoot()){
            return true
        }

        if (roleName && !isArray(roleName)) {
            const roleId = userService.allRoles?.find((role)=>role.name === roleName)?.id
            if(roleId && userService.user.value?.roles.find((role)=> role.id==roleId) || userService.userHaveRoot()){
                return true
            }
        }

        if (roleName && isArray(roleName)) {
            let userHaveRole:boolean = false
            for (const roleInArray of roleName) {
                const roleId = userService.allRoles?.find((role)=>role.name === roleInArray)?.id
                if(roleId && userService.user.value?.roles.find((role)=> role.id==roleId)){
                    userHaveRole = true
                    break
                }
            }
            
            if(userHaveRole){
                return true
            }
        }
      
        return navController.navigateForward('/cabinet')
    }
}
