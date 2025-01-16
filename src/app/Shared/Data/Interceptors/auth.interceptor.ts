import { HttpHandlerFn, HttpInterceptorFn, HttpRequest } from "@angular/common/http";
import { inject } from "@angular/core";
import { AuthService } from "../Services/Auth/auth.service";

//Добавляю токен к кажджому запросу
export const authTokenInterceptor: HttpInterceptorFn = (req: HttpRequest<any>, next:HttpHandlerFn)=>{
    const token = inject(AuthService).token.value
    console.log(token)
    if(!token) return next(req)
    //Добавляю токен в заголовки запроса если он есть. Для этого нужно склонировать запрос.
    req = req.clone({
        setHeaders: {
            Authorization: `Bearer ${token}`
        }
    })
    return next(req)
}