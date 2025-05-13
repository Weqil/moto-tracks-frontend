import { Component, inject, OnInit } from '@angular/core';
import { HeaderModule } from 'src/app/Shared/Modules/header/header.module';
import { SharedModule } from 'src/app/Shared/Modules/shared/shared.module';
import { HeaderComponent } from "../../../Shared/Components/UI/header/header.component";
import { AbstractControl, FormControl, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { IonModal, NavController } from '@ionic/angular/standalone';
import { ActivatedRoute } from '@angular/router';
import { catchError, EMPTY, finalize, Subject, takeUntil } from 'rxjs';
import { RecoveryPasswordService } from 'src/app/Shared/Data/Services/Auth/recovery-password.service';
import { LoadingService } from 'src/app/Shared/Services/loading.service';
import { serverError } from 'src/app/Shared/Data/Interfaces/errors';
import { ToastService } from 'src/app/Shared/Services/toast.service';
import { FormsModule } from "../../../Shared/Modules/forms/forms.module";
import { IconButtonComponent } from "../../../Shared/Components/UI/LinarikUI/buttons/icon-button/icon-button.component";

@Component({
  selector: 'app-recovery-password-page',
  templateUrl: './recovery-password-page.component.html',
  styleUrls: ['./recovery-password-page.component.scss'],
  imports: [SharedModule, HeaderComponent, FormsModule, IonModal, FormsModule, IconButtonComponent],
})
export class RecoveryPasswordPageComponent  implements OnInit {

  route: ActivatedRoute = inject(ActivatedRoute)
  private readonly destroy$ = new Subject<void>()
  recoveryPasswordService: RecoveryPasswordService = inject(RecoveryPasswordService)
  loaderService:LoadingService = inject(LoadingService)
  toastService:ToastService = inject(ToastService)
  navController: NavController = inject(NavController)

  token: string = ''

  constructor() { }
  
  passwordMatchValidator: ValidatorFn = (group: AbstractControl) => {
    const password = group.get('password')?.value;
    const confirmPassword = group.get('password_confirmation')?.value;
    return password === confirmPassword ? null : { mismatch: true };
  }

  recoveryForm:FormGroup = new FormGroup({
    password: new FormControl('', [Validators.required, Validators.minLength(8)]),
    password_confirmation: new FormControl('', [Validators.required, Validators.minLength(3)]),
    token: new FormControl('')
  }, { validators: this.passwordMatchValidator });

  errorText:any
  recoveryInvalid = {
    localError: false,
    serverError: false,
    password_confirmation: {
      status: false,
      message: '',
    },
    password: {
      status: false,
      message: '',
    },
  }

 

  validateForm() {
    this.recoveryInvalid.localError = false
    if (this.recoveryForm.get('password')?.errors) {
      this.recoveryInvalid.localError = true
      this.recoveryInvalid.password.status = true
      this.recoveryInvalid.password.message = this.recoveryForm.get('password')?.hasError('required')
        ? 'Поле не может быть пустым'
        : 'Пароль должен быть не менее 8 символов'
    } else {
      this.recoveryInvalid.password.status = false
      this.recoveryInvalid.password.message = ''
    }

    if(this.recoveryForm.get('password_confirmation')?.value !== this.recoveryForm.get('password')?.value){
      this.recoveryInvalid.localError = true
      this.recoveryInvalid.password_confirmation.status = true
      this.recoveryInvalid.password.status = true
      this.recoveryInvalid.password_confirmation.message = 'Пароли не совпадают'
    }else{
      this.recoveryInvalid.password_confirmation.status = false
      this.recoveryInvalid.password_confirmation.message = ''
    }
  }

  clearErrors() {
    if (this.recoveryInvalid.localError || this.recoveryInvalid.serverError) {
      this.validateForm()
    }
  }

  recoveryPasswordMethod(){
    this.validateForm()

    let loader:HTMLIonLoadingElement
    this.loaderService.showLoading().then((res:HTMLIonLoadingElement)=>{
      loader = res
    })
    this.recoveryPasswordService.recoveryPassword(this.recoveryForm.value).pipe(finalize(()=>{
      this.loaderService.hideLoading(loader);
    })
    ).subscribe((res:any)=>{
      this.toastService.showToast('Пароль успешно изменен', "success");
      this.navController.navigateForward(['/cabinet'])
    })
    catchError((err: serverError) => {
      this.toastService.showToast(err.error.message, 'danger');
      return EMPTY;
    })

  }

  ionViewWillEnter(){
    this.route.params.pipe(
      takeUntil(this.destroy$)
    ).subscribe(params => {
      this.token = params['token'];
      this.recoveryForm.patchValue({ token: this.token });
    });
  }

  ngOnInit() {
    
  }

}
