import { CommonModule } from '@angular/common';
import { Component, OnInit, CUSTOM_ELEMENTS_SCHEMA, inject } from '@angular/core';
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
import { MapService } from 'src/app/Shared/Data/Services/Map/map.service';
import { StandartRichInputComponent } from 'src/app/Shared/Components/Forms/standart-rich-input/standart-rich-input.component';
import { IonicModule } from '@ionic/angular';
import { StandartInputSelectComponent } from 'src/app/Shared/Components/UI/Selecteds/standart-input-select/standart-input-select.component';
import { ComandsService } from 'src/app/Shared/Data/Services/Comands/comands.service';
import { EventService } from 'src/app/Shared/Data/Services/Event/event.service';
import { ActivatedRoute } from '@angular/router';
import { StandartInputSearchComponent } from 'src/app/Shared/Components/Forms/standart-input-search/standart-input-search.component';

// Добавляем интерфейс для хранения информации о пользователе и его команде
interface UserWithTeam extends User {
  teamId?: number;
}

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
    StandartInputSelectComponent,
    StandartInputSearchComponent
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class GroupApplicationComponent implements OnInit {
  // Обновляем тип массива пользователей
  users: UserWithTeam[] = [];
  selectedUsers: User[] = [];
  teams: ICommand[] = [];
  
  isUserModalOpen = false;
  isPreviewModalOpen = false;
  mapService:MapService = inject(MapService)
  selectedUser: User | null = null;
  currentUser: User | null = null;
  regionModalState = false;
  searchRegionItems: any[] = [];
  
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
    {name: '4Т', value: '4Т'},
    {name: '2Т', value: '2Т'}
  ];

  // Добавляем регионы
  regions = [
    { id: 1, name: 'Адыгея республика', type: 'республика' },
    { id: 2, name: 'Алтай республика', type: 'республика' },
    { id: 3, name: 'Башкортостан республика', type: 'республика' },
    { id: 4, name: 'Бурятия республика', type: 'республика' },
    { id: 5, name: 'Дагестан республика', type: 'республика' },
    { id: 6, name: 'Ингушетия республика', type: 'республика' },
    { id: 7, name: 'Кабардино-Балкарская республика', type: 'республика' },
    { id: 8, name: 'Калмыкия республика', type: 'республика' },
    { id: 9, name: 'Карачаево-Черкесская республика', type: 'республика' },
    { id: 10, name: 'Карелия республика', type: 'республика' },
    { id: 11, name: 'Коми республика', type: 'республика' },
    { id: 12, name: 'Марий Эл республика', type: 'республика' },
    { id: 13, name: 'Мордовия республика', type: 'республика' },
    { id: 14, name: 'Саха (Якутия) республика', type: 'республика' },
    { id: 15, name: 'Северная Осетия - Алания республика', type: 'республика' },
    { id: 16, name: 'Татарстан республика', type: 'республика' },
    { id: 17, name: 'Тыва республика', type: 'республика' },
    { id: 18, name: 'Удмуртская республика', type: 'республика' },
    { id: 19, name: 'Хакасия республика', type: 'республика' },
    { id: 20, name: 'Чеченская республика', type: 'республика' },
    { id: 21, name: 'Чувашская республика', type: 'республика' },
    { id: 22, name: 'Алтайский край', type: 'край' },
    { id: 23, name: 'Забайкальский край', type: 'край' },
    { id: 24, name: 'Камчатский край', type: 'край' },
    { id: 25, name: 'Краснодарский край', type: 'край' },
    { id: 26, name: 'Красноярский край', type: 'край' },
    { id: 27, name: 'Пермский край', type: 'край' },
    { id: 28, name: 'Приморский край', type: 'край' },
    { id: 29, name: 'Ставропольский край', type: 'край' },
    { id: 30, name: 'Хабаровский край', type: 'край' },
    { id: 31, name: 'Амурская область', type: 'область' },
    { id: 32, name: 'Архангельская область', type: 'область' },
    { id: 33, name: 'Астраханская область', type: 'область' },
    { id: 34, name: 'Белгородская область', type: 'область' },
    { id: 35, name: 'Брянская область', type: 'область' },
    { id: 36, name: 'Владимирская область', type: 'область' },
    { id: 37, name: 'Волгоградская область', type: 'область' },
    { id: 38, name: 'Вологодская область', type: 'область' },
    { id: 39, name: 'Воронежская область', type: 'область' },
    { id: 40, name: 'Ивановская область', type: 'область' },
    { id: 41, name: 'Иркутская область', type: 'область' },
    { id: 42, name: 'Калининградская область', type: 'область' },
    { id: 43, name: 'Калужская область', type: 'область' },
    { id: 44, name: 'Кемеровская область', type: 'область' },
    { id: 45, name: 'Кировская область', type: 'область' },
    { id: 46, name: 'Костромская область', type: 'область' },
    { id: 47, name: 'Курганская область', type: 'область' },
    { id: 48, name: 'Курская область', type: 'область' },
    { id: 49, name: 'Ленинградская область', type: 'область' },
    { id: 50, name: 'Липецкая область', type: 'область' },
    { id: 51, name: 'Магаданская область', type: 'область' },
    { id: 52, name: 'Московская область', type: 'область' },
    { id: 53, name: 'Мурманская область', type: 'область' },
    { id: 54, name: 'Нижегородская область', type: 'область' },
    { id: 55, name: 'Новгородская область', type: 'область' },
    { id: 56, name: 'Новосибирская область', type: 'область' },
    { id: 57, name: 'Омская область', type: 'область' },
    { id: 58, name: 'Оренбургская область', type: 'область' },
    { id: 59, name: 'Орловская область', type: 'область' },
    { id: 60, name: 'Пензенская область', type: 'область' },
    { id: 61, name: 'Псковская область', type: 'область' },
    { id: 62, name: 'Ростовская область', type: 'область' },
    { id: 63, name: 'Рязанская область', type: 'область' },
    { id: 64, name: 'Самарская область', type: 'область' },
    { id: 65, name: 'Саратовская область', type: 'область' },
    { id: 66, name: 'Сахалинская область', type: 'область' },
    { id: 67, name: 'Свердловская область', type: 'область' },
    { id: 68, name: 'Смоленская область', type: 'область' },
    { id: 69, name: 'Тамбовская область', type: 'область' },
    { id: 70, name: 'Тверская область', type: 'область' },
    { id: 71, name: 'Томская область', type: 'область' },
    { id: 72, name: 'Тульская область', type: 'область' },
    { id: 73, name: 'Тюменская область', type: 'область' },
    { id: 74, name: 'Ульяновская область', type: 'область' },
    { id: 75, name: 'Челябинская область', type: 'область' },
    { id: 76, name: 'Ярославская область', type: 'область' },
    { id: 77, name: 'Москва', type: 'город' },
    { id: 78, name: 'Санкт-Петербург', type: 'город' },
    { id: 79, name: 'Севастополь', type: 'город' },
    { id: 80, name: 'Еврейская автономная область', type: 'автономная область' },
    { id: 81, name: 'Ненецкий автономный округ', type: 'автономный округ' },
    { id: 82, name: 'Ханты-Мансийский автономный округ - Югра', type: 'автономный округ' },
    { id: 83, name: 'Чукотский автономный округ', type: 'автономный округ' },
    { id: 84, name: 'Ямало-Ненецкий автономный округ', type: 'автономный округ' }
  ];

  // Добавляем переменные для модального окна региона
  selectedRegion: any = null;
  searchRegion = '';

  // Добавляем геттер для отфильтрованных регионов
  get filteredRegions() {
    if (!this.searchRegion) return this.regions;
    return this.regions.filter(region => 
      region.name.toLowerCase().includes(this.searchRegion.toLowerCase())
    );
  }

  // Добавляем методы для работы с модальным окном региона
  openRegionModal() {
    console.log('Opening region modal');
    this.regionModalState = true;
  }

  closeRegionModal() {
    console.log('Closing region modal');
    this.regionModalState = false;
  }

  setRegion(region: any) {
    this.personalUserForm.patchValue({
      region: region.name,
      locationId: region.value
    });
    this.closeRegionModal();
  }

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
    gradeId: { errorMessage: '' },
    comment: { errorMessage: '' }
  };

  eventService: EventService = inject(EventService);
  currentEvent: any = null;
  eventGrades: any[] = [];

  // Добавляем свойство для выбранной команды
  selectedTeam: ICommand | null = null;

  personalUserForm: FormGroup = new FormGroup({
    name: new FormControl('', [Validators.required]),
    surname: new FormControl('', [Validators.required]),
    patronymic: new FormControl('', [Validators.required]),
    dateOfBirth: new FormControl('', [Validators.required]),
    region: new FormControl('', [Validators.required]),
    city: new FormControl('', [Validators.required]),
    inn: new FormControl('', [Validators.required]),
    snils: new FormControl('', [Validators.required]),
    phoneNumber: new FormControl('', [Validators.required]),
    startNumber: new FormControl('', [Validators.required]),
    rank: new FormControl('', [Validators.required]),
    rankNumber: new FormControl(''),
    motoStamp: new FormControl('', [Validators.required]),
    engine: new FormControl('', [Validators.required]),
    numberAndSeria: new FormControl('', [Validators.required]),
    comment: new FormControl(''),
    gradeId: new FormControl(''),
    locationId: new FormControl('', [Validators.required])
  });

  commandService: ComandsService = inject(ComandsService);

  constructor(
    private userService: UserService,
    private loadingService: LoadingService,
    private toastService: ToastService,
    private route: ActivatedRoute
  ) {
    addIcons({ closeCircle, warning, pencil });
  }

  ionViewWillEnter() {
    // Получаем ID гонки из параметров маршрута
    const eventId = this.route.snapshot.params['id'];
    if (eventId) {
      this.loadingService.showLoading().then(loader => {
        this.eventService.getEventById(eventId).pipe(
          finalize(() => this.loadingService.hideLoading(loader))
        ).subscribe({
          next: (response: any) => {
            this.currentEvent = response.race;
            this.eventGrades = response.race.grades || [];
            // Получаем команды пользователя
            this.getUserTeams();
          },
          error: (error) => {
            console.error('Ошибка при получении гонки:', error);
            this.toastService.showToast('Ошибка при получении данных гонки', 'danger');
          }
        });
      });
    }
  }

  private getUserTeams() {
    const currentUser = this.userService.user.value;
    if (currentUser?.id) {
      this.loadingService.showLoading().then(loader => {
        this.commandService.getComands({ownerId:currentUser?.id}).pipe(
          finalize(() => this.loadingService.hideLoading(loader))
        ).subscribe({
          next: (response: any) => {
            this.teams = response.commands;
            // Получаем пользователей для каждой команды
            this.teams.forEach(team => {
              this.loadingService.showLoading().then(usersLoader => {
                this.commandService.getMembersForCoach(team.id).pipe(
                  finalize(() => this.loadingService.hideLoading(usersLoader))
                ).subscribe({
                  next: (usersResponse: any) => {
                    // Добавляем пользователей в общий массив с информацией о команде
                    const usersWithTeam = usersResponse.members.map((user: User) => ({
                      ...user,
                      teamId: team.id
                    }));
                    this.users = [...this.users, ...usersWithTeam];
                  },
                  error: (error) => {
                    console.error(`Ошибка при получении пользователей для команды ${team.id}:`, error);
                    this.toastService.showToast('Ошибка при получении пользователей команды', 'danger');
                  }
                });
              });
            });
          },
          error: (error) => {
            console.error('Ошибка при получении команд пользователя:', error);
            this.toastService.showToast('Ошибка при получении команд', 'danger');
          }
        });
      });
    }
  }

  ngOnInit() {
    this.getRegions()
  }

  // Обновляем метод для фильтрации пользователей по команде
  getFilteredUsers(): UserWithTeam[] {
    if (!this.selectedTeam) {
      return this.users;
    }
    return this.users.filter(user => user.teamId === this.selectedTeam?.id);
  }

  // Обновляем метод для проверки выбранных пользователей
  hasSelectedUsers(): boolean {
    return this.selectedUsers.length > 0;
  }

  // Обновляем метод для проверки неполных данных
  hasIncompleteData(user: UserWithTeam): boolean {
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
      user.personal.moto_stamp,
      user.personal.engine,
      user.personal.number_and_seria,
      user.personal.location?.id,
      user.personal.race_class
    ];

    return requiredFields.some(field => !field || field === '');
  }

  getIncompleteFields(user: User): string[] {
    if (!user.personal) return ['Все поля'];
    
    const fields = [
      { name: 'Имя', value: user.personal.name, required: true },
      { name: 'Фамилия', value: user.personal.surname, required: true },
      { name: 'Отчество', value: user.personal.patronymic, required: true },
      { name: 'Дата рождения', value: user.personal.date_of_birth, required: true },
      { name: 'Город', value: user.personal.city, required: true },
      { name: 'ИНН', value: user.personal.inn, required: true },
      { name: 'СНИЛС', value: user.personal.snils, required: true },
      { name: 'Телефон', value: user.personal.phone_number, required: true },
      { name: 'Стартовый номер', value: user.personal.start_number, required: true },
      { name: 'Разряд', value: user.personal.rank, required: true },
      { name: 'Номер удостоверения', value: user.personal.rank_number, required: false },
      { name: 'Марка мотоцикла', value: user.personal.moto_stamp, required: true },
      { name: 'Двигатель', value: user.personal.engine, required: true },
      { name: 'Паспорт', value: user.personal.number_and_seria, required: true },
      { name: 'Класс', value: user.personal.race_class, required: true }
    ];

    return fields
      .filter(field => field.required && (!field.value || field.value === ''))
      .map(field => field.name);
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
    
    // Проверяем наличие класса
    if (!user.personal?.race_class) {
      this.toastService.showToast('Сначала необходимо выбрать класс для пользователя', 'danger');
      return;
    }
    
    this.currentUser = user;
    this.isUserModalOpen = true;
    this.fillFormWithUserData(user);
  }

  closeUserModal() {
    this.isUserModalOpen = false;
    this.currentUser = null;
    this.resetForms();
  }

  fillFormWithUserData(user: UserWithTeam) {
    if (user.personal) {
      this.personalUserForm.patchValue({
        name: user.personal.name,
        surname: user.personal.surname,
        patronymic: user.personal.patronymic,
        dateOfBirth: user.personal.date_of_birth,
        city: user.personal.city,
        region: user.personal.region || '',
        inn: user.personal.inn,
        snils: user.personal.snils,
        phoneNumber: user.personal.phone_number,
        startNumber: user.personal.start_number,
        rank: user.personal.rank,
        rankNumber: user.personal.rank_number,
        motoStamp: user.personal.moto_stamp,
        engine: user.personal.engine,
        numberAndSeria: user.personal.number_and_seria,
        gradeId: user.personal.race_class || '',
        locationId: user.personal.location?.id || ''
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
            engine: this.personalUserForm.get('engine')?.value || '',
            number_and_seria: this.personalUserForm.get('numberAndSeria')?.value || '',
            command_id: this.selectedTeam?.id.toString() || '',
            location: {
              id: this.personalUserForm.get('locationId')?.value || '',
              name: this.personalUserForm.get('region')?.value || ''
            },
            race_class: this.personalUserForm.get('gradeId')?.value || ''
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

  getRegions() {
    this.mapService.getAllRegions().subscribe({
      next: (response: any) => {
        this.searchRegionItems = response.data.map((region: any) => ({
          name: `${region.name} ${region.type}`,
          value: region.id
        }));
      },
      error: (error: any) => {
        console.error('Error fetching regions:', error);
      }
    });
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
          `Для отправки заявки необходимо выбрать класс для следующих пользователей: ${userNames}`,
          'danger'
        );
        return;
      }

      this.isPreviewModalOpen = true;
    }
  }

  // Обновляем метод для получения текущего класса пользователя
  getUserClass(user: User): string {
    return user.personal?.race_class || '';
  }

  // Обновляем метод для обработки выбора класса
  onClassSelect(user: User, gradeId: string) {
    if (user.personal) {
      console.log(gradeId)
      const selectedGrade = this.eventGrades.find(grade => grade.id.toString() === gradeId);
      console.log(selectedGrade)
      if (selectedGrade) {
        // Обновляем пользователя в массиве users
        this.users = this.users.map(u => {
          if (u.id === user.id && u.personal) {
            console.log(selectedGrade)
            return {
              ...u,
              personal: {
                ...u.personal,
                race_class: selectedGrade.name
              }
            };
          }
          return u;
        });

        // Также обновляем в selectedUsers если пользователь там есть
        this.selectedUsers = this.selectedUsers.map(u => {
          if (u.id === user.id && u.personal) {
            return {
              ...u,
              personal: {
                ...u.personal,
                race_class: selectedGrade.name
              }
            };
          }
          return u;
        });
      }
    }
  }

  // Обновляем массив классов для селекта
  get raceClassesForSelect() {
    return this.eventGrades.map(grade => ({
      name: grade.name,
      value: grade.id.toString()
    }));
  }

  get teamsForSelect() {
    return this.teams.map(team => ({
      name: team.name,
      value: team.id.toString()
    }));
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
    console.log('Setting engine:', event);
    this.personalUserForm.patchValue({
      engine: event.value
    });
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

  // Добавляем метод для выбора команды
  onTeamSelect(teamId: string) {
    this.selectedTeam = this.teams.find(team => team.id.toString() === teamId) || null;
  }
}
