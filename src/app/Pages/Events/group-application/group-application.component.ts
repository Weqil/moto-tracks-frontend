import { CommonModule } from '@angular/common';
import { Component, OnInit, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { IonContent, IonCheckbox, IonButton, IonList, IonItem, IonLabel, IonIcon, IonModal } from "@ionic/angular/standalone";
import { HeaderModule } from 'src/app/Shared/Modules/header/header.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { UserSectionComponent } from 'src/app/Shared/Components/UserElements/user-section/user-section.component';
import { User } from 'src/app/Shared/Data/Interfaces/user-model';
import { addIcons } from 'ionicons';
import { closeCircle, warning, pencil } from 'ionicons/icons';
import { ButtonsModule } from 'src/app/Shared/Modules/buttons/buttons.module';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { StandartInputComponent } from 'src/app/Shared/Components/Forms/standart-input/standart-input.component';
import { LoadingService } from 'src/app/Shared/Services/loading.service';
import { ToastService } from 'src/app/Shared/Services/toast.service';
import { UserService } from 'src/app/Shared/Data/Services/User/user.service';
import { finalize } from 'rxjs';
import { ICommand } from 'src/app/Shared/Data/Interfaces/command';
import { userRoles } from 'src/app/Shared/Data/Enums/roles';
import { StandartRichInputComponent } from 'src/app/Shared/Components/Forms/standart-rich-input/standart-rich-input.component';
import { IonicModule } from '@ionic/angular';
import { StandartInputSelectComponent } from 'src/app/Shared/Components/UI/Selecteds/standart-input-select/standart-input-select.component';

@Component({
  selector: 'app-group-application',
  templateUrl: './group-application.component.html',
  styleUrls: ['./group-application.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    HeaderModule,
    FormsModule,
    UserSectionComponent,
    IonButton,
    IonList,
    IonItem,
    IonLabel,
    IonIcon,
    ButtonsModule,
    ReactiveFormsModule,
    StandartInputComponent,
    IonModal,
    StandartRichInputComponent,
    StandartInputSelectComponent
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class GroupApplicationComponent implements OnInit {
  // Добавляем список классов
  raceClasses = [
    { id: 1, name: 'Класс 1 - Мотоциклы до 250 куб.см' },
    { id: 2, name: 'Класс 2 - Мотоциклы до 450 куб.см' },
    { id: 3, name: 'Класс 3 - Мотоциклы до 650 куб.см' },
    { id: 4, name: 'Класс 4 - Мотоциклы свыше 650 куб.см' },
    { id: 5, name: 'Класс 5 - Эндуро' },
    { id: 6, name: 'Класс 6 - Квадроциклы' }
  ];

  // Добавляем список команд
  teams: ICommand[] = [
    {
      id: 1,
      name: 'МотоСпорт',
      full_name: 'МотоСпорт Клуб',
      location: {
        id: 1,
        name: 'Москва',
        type: 'город'
      },
      avatar: '/assets/icons/team-bg.png',
      city: 'Москва'
    },
    {
      id: 2,
      name: 'Скорость',
      full_name: 'МотоКлуб Скорость',
      location: {
        id: 2,
        name: 'Санкт-Петербург',
        type: 'город'
      },
      avatar: '/assets/icons/team-bg.png',
      city: 'Санкт-Петербург'
    },
    {
      id: 3,
      name: 'Адреналин',
      full_name: 'МотоКлуб Адреналин',
      location: {
        id: 3,
        name: 'Казань',
        type: 'город'
      },
      avatar: '/assets/icons/team-bg.png',
      city: 'Казань'
    }
  ];

  selectedTeam: ICommand | null = null;

  users: User[] = [
    {
      id: 1,
      name: 'Иван',
      surname: 'Петров',
      email: 'ivan@example.com',
      email_verified_at: null,
      avatar: null,
      city: 'Москва',
      rank: 'КМС',
      roles: [{ id: 1, name: 'rider' }],
      personal: {
        name: 'Иван',
        surname: 'Петров',
        patronymic: 'Иванович',
        date_of_birth: '1990-01-01',
        city: 'Москва',
        inn: '1234567890',
        command_id: '1',
        snils: 12345678901,
        phone_number: '+79001234567',
        start_number: '123',
        group: 'A',
        ranks: 'КМС',
        command: this.teams[0],
        rank: 'КМС',
        rank_number: '123',
        community: 'МотоСпорт',
        location: {
          id: '1',
          name: 'Москва'
        },
        coach: 'Тренер 1',
        moto_stamp: 'Honda',
        engines: '250cc',
        number_and_seria: '123456'
      }
    },
    {
      id: 2,
      name: 'Анна',
      surname: 'Сидорова',
      email: 'anna@example.com',
      email_verified_at: null,
      avatar: null,
      city: 'Санкт-Петербург',
      rank: 'МС',
      roles: [{ id: 1, name: 'rider' }],
      personal: {
        name: 'Анна',
        surname: 'Сидорова',
        patronymic: 'Андреевна',
        date_of_birth: '1992-05-15',
        city: 'Санкт-Петербург',
        inn: '0987654321',
        command_id: '2',
        snils: 98765432109,
        phone_number: '+79009876543',
        start_number: '456',
        group: 'B',
        ranks: 'МС',
        command: this.teams[1],
        rank: 'МС',
        rank_number: '456',
        community: 'Скорость',
        location: {
          id: '2',
          name: 'Санкт-Петербург'
        },
        coach: 'Тренер 2',
        moto_stamp: 'Yamaha',
        engines: '450cc',
        number_and_seria: '654321'
      }
    },
    {
      id: 3,
      name: 'Дмитрий',
      surname: 'Козлов',
      email: 'dmitry@example.com',
      email_verified_at: null,
      avatar: null,
      city: 'Казань',
      rank: 'КМС',
      roles: [{ id: 1, name: 'rider' }],
      personal: {
        name: 'Дмитрий',
        surname: 'Козлов',
        patronymic: 'Сергеевич',
        date_of_birth: '1988-08-20',
        city: 'Казань',
        inn: '1122334455',
        command_id: '3',
        snils: 11223344556,
        phone_number: '+79001122334',
        start_number: '789',
        group: 'A',
        ranks: 'КМС',
        command: this.teams[2],
        rank: 'КМС',
        rank_number: '789',
        community: 'Адреналин',
        location: {
          id: '3',
          name: 'Казань'
        },
        coach: 'Тренер 3',
        moto_stamp: 'KTM',
        engines: '350cc',
        number_and_seria: '789012'
      }
    }
  ];

  selectedUsers: User[] = [];
  isUserModalOpen = false;
  isPreviewModalOpen = false;
  selectedUser: User | null = null;
  currentUser: User | null = null;
  comandSelectModalStateValue = false;
  allComands: any[] = [];
  searchRegionItems: any[] = [];
  selectRegionInCommandModal: any = {};

  sportRankItems: {name: string, value: string}[] = [
    {name: 'МСМК', value: 'МСМК'},
    {name: 'МС', value: 'МС'},
    {name: 'КМС', value: 'КМС'},
    {name: 'I', value: 'I'},
    {name: 'II', value: 'II'},
    {name: 'III', value: 'III'},
    {name: 'Iю', value: 'Iю'},
    {name: 'IIю', value: 'IIю'},
    {name: 'IIIю', value: 'IIIю'},
    {name: 'б/р', value: 'б/р'},
  ];

  motoStampItems: {name: string, value: string}[] = [
    {name: 'Kaw', value: 'Kaw'},
    {name: 'KTM', value: 'KTM'},
    {name: 'Yam', value: 'Yam'},
    {name: 'Gas-Gas', value: 'Gas-Gas'},
    {name: 'Hon', value: 'Hon'},
    {name: 'BSE', value: 'BSE'},
    {name: 'Husq', value: 'Husq'},
    {name: 'Kayo', value: 'Kayo'},
    {name: 'Fantic', value: 'Fantic'},
    {name: 'Урал', value: 'Урал'},
    {name: 'Zabel', value: 'Zabel'},
    {name: 'MTX', value: 'MTX'},
    {name: 'TRIUMPH', value: 'TRIUMPH'},
  ];

  engineItems: {name: string, value: string}[] = [
    {name: '2Т', value: '2Т'},
    {name: '4Т', value: '4Т'},
  ];

  formErrors: any = {
    name: { errorMessage: '' },
    surname: { errorMessage: '' },
    patronymic: { errorMessage: '' },
    dateOfBirth: { errorMessage: '' },
    city: { errorMessage: '' },
    region: { errorMessage: '' },
    inn: { errorMessage: '' },
    snils: { errorMessage: '' },
    phoneNumber: { errorMessage: '' },
    startNumber: { errorMessage: '' },
    rank: { errorMessage: '' },
    rankNumber: { errorMessage: '' },
    motoStamp: { errorMessage: '' },
    engine: { errorMessage: '' },
    numberAndSeria: { errorMessage: '' },
    commandId: { errorMessage: '' },
    group: { errorMessage: '' },
    gradeId: { errorMessage: '' },
    community: { errorMessage: '' },
    locationId: { errorMessage: '' },
    coach: { errorMessage: '' },
    comment: { errorMessage: '' }
  };

  personalUserForm: FormGroup = new FormGroup({
    name: new FormControl('', [Validators.required]),
    surname: new FormControl('', [Validators.required]),
    patronymic: new FormControl('', [Validators.required]),
    dateOfBirth: new FormControl('', [Validators.required]),
    region: new FormControl('', [Validators.required]),
    city: new FormControl('', [Validators.required]),
    inn: new FormControl('', [Validators.required]),
    snils: new FormControl('', [Validators.required]),
    commandId: new FormControl('', [Validators.required]),
    phoneNumber: new FormControl('', [Validators.required]),
    startNumber: new FormControl('', [Validators.required]),
    group: new FormControl('', [Validators.required]),
    rank: new FormControl('', [Validators.required]),
    gradeId: new FormControl('', [Validators.required]),
    rankNumber: new FormControl('', [Validators.required]),
    community: new FormControl('Лично', [Validators.required]),
    locationId: new FormControl('', [Validators.required]),
    coach: new FormControl('', [Validators.required]),
    motoStamp: new FormControl('', [Validators.required]),
    engine: new FormControl('', [Validators.required]),
    numberAndSeria: new FormControl('', [Validators.required]),
    comment: new FormControl('', [Validators.required])
  });

  constructor(
    private userService: UserService,
    private loadingService: LoadingService,
    private toastService: ToastService
  ) {
    addIcons({ closeCircle, warning, pencil });
  }

  ngOnInit() {}

  hasSelectedUsers(): boolean {
    return this.selectedUsers.length > 0;
  }

  hasIncompleteData(user: User): boolean {
    if (!user.personal) return true;
    
    const requiredFields = [
      user.personal.name,
      user.personal.surname,
      user.personal.patronymic,
      user.personal.date_of_birth,
      user.personal.city,
      user.personal.inn,
      user.personal.snils,
      user.personal.phone_number,
      user.personal.start_number,
      user.personal.rank,
      user.personal.rank_number,
      user.personal.moto_stamp,
      user.personal.engines,
      user.personal.number_and_seria,
      user.personal.race_class
    ];

    return requiredFields.some(field => !field || field === '');
  }

  getIncompleteFields(user: User): string[] {
    if (!user.personal) return ['Все поля'];
    
    const fields = [
      { name: 'Имя', value: user.personal.name },
      { name: 'Фамилия', value: user.personal.surname },
      { name: 'Отчество', value: user.personal.patronymic },
      { name: 'Дата рождения', value: user.personal.date_of_birth },
      { name: 'Город', value: user.personal.city },
      { name: 'ИНН', value: user.personal.inn },
      { name: 'СНИЛС', value: user.personal.snils },
      { name: 'Телефон', value: user.personal.phone_number },
      { name: 'Стартовый номер', value: user.personal.start_number },
      { name: 'Разряд', value: user.personal.rank },
      { name: 'Номер удостоверения', value: user.personal.rank_number },
      { name: 'Марка мотоцикла', value: user.personal.moto_stamp },
      { name: 'Двигатель', value: user.personal.engines },
      { name: 'Паспорт', value: user.personal.number_and_seria },
      { name: 'Класс', value: user.personal.race_class }
    ];

    return fields.filter(field => !field.value || field.value === '').map(field => field.name);
  }

  onUserSelect(user: User, isSelected: boolean, event: Event) {
    event.stopPropagation();
    if (isSelected) {
      this.selectedUsers.push(user);
    } else {
      this.selectedUsers = this.selectedUsers.filter(u => u.id !== user.id);
    }
  }

  isUserSelected(user: User): boolean {
    return this.selectedUsers.some(u => u.id === user.id);
  }

  openUserModal(user: User, event: Event) {
    event.stopPropagation();
    this.currentUser = user;
    this.isUserModalOpen = true;
    this.fillFormWithUserData(user);
  }

  closeUserModal() {
    this.isUserModalOpen = false;
    this.currentUser = null;
    this.resetForms();
  }

  setFormValue(user: User) {
    if (user.personal) {
      this.personalUserForm.patchValue({
        name: user.personal.name,
        surname: user.personal.surname,
        patronymic: user.personal.patronymic,
        dateOfBirth: user.personal.date_of_birth,
        city: user.personal.city,
        region: user.personal.location?.name || '',
        inn: user.personal.inn,
        snils: user.personal.snils,
        phoneNumber: user.personal.phone_number,
        startNumber: user.personal.start_number,
        rank: user.personal.rank,
        rankNumber: user.personal.rank_number,
        motoStamp: user.personal.moto_stamp,
        engine: user.personal.engines,
        numberAndSeria: user.personal.number_and_seria
      });
    }
  }

  submitValidate(): boolean {
    let valid = true;
    Object.keys(this.personalUserForm.controls).forEach((key) => {
      const control = this.personalUserForm.get(key);
      if (!control!.valid) {
        if (this.formErrors[key]) {
          this.formErrors[key].errorMessage = 'Обязательное поле';
          valid = false;
        }
      } else {
        if (this.formErrors[key]) {
          this.formErrors[key].errorMessage = '';
        }
      }
    });
    return valid;
  }

  saveUserData() {
    if (this.submitValidate()) {
      if (this.currentUser && this.currentUser.personal) {
        const updatedUser: User = {
          ...this.currentUser,
          personal: {
            ...this.currentUser.personal,
            name: this.personalUserForm.get('name')?.value || '',
            surname: this.personalUserForm.get('surname')?.value || '',
            patronymic: this.personalUserForm.get('patronymic')?.value || '',
            date_of_birth: this.personalUserForm.get('dateOfBirth')?.value || '',
            region: this.personalUserForm.get('region')?.value || '',
            city: this.personalUserForm.get('city')?.value || '',
            inn: this.personalUserForm.get('inn')?.value || '',
            snils: Number(this.personalUserForm.get('snils')?.value) || 0,
            phone_number: this.personalUserForm.get('phoneNumber')?.value || '',
            start_number: this.personalUserForm.get('startNumber')?.value || '',
            rank: this.personalUserForm.get('rank')?.value || '',
            rank_number: this.personalUserForm.get('rankNumber')?.value || '',
            moto_stamp: this.personalUserForm.get('motoStamp')?.value || '',
            engines: this.personalUserForm.get('engine')?.value || '',
            number_and_seria: this.personalUserForm.get('numberAndSeria')?.value || '',
            command_id: this.currentUser.personal.command_id,
            ranks: this.currentUser.personal.ranks || ''
          }
        };

        // Обновляем пользователя в локальном массиве
        this.users = this.users.map(user => 
          user.id === this.currentUser?.id ? updatedUser : user
        );

        // Обновляем выбранного пользователя в массиве selectedUsers
        this.selectedUsers = this.selectedUsers.map(user => 
          user.id === this.currentUser?.id ? updatedUser : user
        );

        this.currentUser = updatedUser;
        this.closeUserModal();
        this.toastService.showToast('Данные успешно сохранены', 'success');
      }
    } else {
      this.toastService.showToast('Пожалуйста, заполните все обязательные поля', 'danger');
    }
  }

  // Добавляем метод для валидации всех пользователей
  validateAllUsers(): boolean {
    const invalidUsers = this.selectedUsers.filter(user => this.hasIncompleteData(user));
    
    if (invalidUsers.length > 0) {
      const userNames = invalidUsers.map(user => 
        `${user.personal?.surname || ''} ${user.personal?.name || ''}`
      ).join(', ');
      
      this.toastService.showToast(
        `Следующие пользователи имеют незаполненные данные: ${userNames}`,
        'danger'
      );
      return false;
    }
    
    return true;
  }

  // Обновляем метод submitApplication
  submitApplication() {
    if (this.validateAllUsers()) {
      // Проверяем, что у всех выбранных пользователей указан класс
      const usersWithoutClass = this.selectedUsers.filter(user => !user.personal?.race_class);
      
      if (usersWithoutClass.length > 0) {
        const userNames = usersWithoutClass.map(user => 
          `${user.personal?.surname || ''} ${user.personal?.name || ''}`
        ).join(', ');
        
        this.toastService.showToast(
          `Следующие пользователи не выбрали класс: ${userNames}`,
          'danger'
        );
        return;
      }

      console.log('Отправка заявки с пользователями:', this.selectedUsers);
      this.isPreviewModalOpen = true;
    }
  }

  // Обновляем метод для получения текущего класса пользователя
  getUserClass(user: User): string {
    if (!user.personal?.race_class) return '';
    return user.personal.race_class;
  }

  // Обновляем метод для обработки выбора класса
  onClassSelect(user: User, className: string) {
    if (user.personal) {
      user.personal.race_class = className;
      // Обновляем пользователя в массиве selectedUsers, если он там есть
      if (this.isUserSelected(user)) {
        this.selectedUsers = this.selectedUsers.map(u => 
          u.id === user.id ? user : u
        );
      }
    }
  }

  // Обновляем массив классов для селекта
  get raceClassesForSelect() {
    return this.raceClasses.map(c => ({
      name: c.name,
      value: c.name
    }));
  }

  // Добавляем метод для фильтрации пользователей по команде
  getFilteredUsers(): User[] {
    if (!this.selectedTeam) {
      return this.users;
    }
    return this.users.filter(user => user.personal?.command_id === this.selectedTeam?.id?.toString());
  }

  // Добавляем метод для выбора команды
  onTeamSelect(teamId: string) {
    this.selectedTeam = this.teams.find(team => team.id.toString() === teamId) || null;
  }

  get teamsForSelect() {
    return this.teams.map(team => ({
      name: team.name,
      value: team.id.toString()
    }));
  }

  fillFormWithUserData(user: User) {
    if (user.personal) {
      this.personalUserForm.patchValue({
        name: user.personal.name,
        surname: user.personal.surname,
        patronymic: user.personal.patronymic,
        dateOfBirth: user.personal.date_of_birth,
        city: user.personal.city,
        region: user.personal.location?.name || '',
        inn: user.personal.inn,
        snils: user.personal.snils,
        phoneNumber: user.personal.phone_number,
        startNumber: user.personal.start_number,
        rank: user.personal.rank,
        rankNumber: user.personal.rank_number,
        motoStamp: user.personal.moto_stamp,
        engine: user.personal.engines,
        numberAndSeria: user.personal.number_and_seria
      });
    }
  }

  resetForms() {
    this.personalUserForm.reset();
  }

  setRank(event: any) {
    this.personalUserForm.patchValue({
      rank: event.value
    });
  }

  setMotoStamp(event: any) {
    this.personalUserForm.patchValue({
      motoStamp: event.value
    });
  }

  setEngine(event: any) {
    this.personalUserForm.patchValue({
      engine: event.value
    });
  }

  openComandSelectModalStateValue() {
    this.comandSelectModalStateValue = true;
  }

  closeComandSelectModalStateValue() {
    this.comandSelectModalStateValue = false;
  }

  setComand(event: any) {
    this.personalUserForm.patchValue({
      community: event.name
    });
    this.closeComandSelectModalStateValue();
  }

  createNewComand(event: any) {
    // Логика создания новой команды
  }

  selectRegionInCommandModalFunction(event: any) {
    this.selectRegionInCommandModal = event;
  }

  clearRegionInComandFilter() {
    this.selectRegionInCommandModal = {};
  }

  showToastInfoFileUpload() {
    // Показать уведомление о загрузке файла
  }

  closePreviewModal() {
    this.isPreviewModalOpen = false;
  }

  confirmApplication() {
    // Логика подтверждения заявки
    this.closePreviewModal();
  }
}
