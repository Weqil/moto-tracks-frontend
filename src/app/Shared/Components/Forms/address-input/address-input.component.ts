import { Component, EventEmitter, inject, Input, OnInit, Output, SimpleChanges } from '@angular/core'
import { AngularYandexMapsModule, YaEvent, YaGeocoderService, YaReadyEvent } from 'angular8-yandex-maps'
import { FormControl, FormGroup, Validators } from '@angular/forms'
import { BehaviorSubject, Subject, takeUntil, tap } from 'rxjs'
import { ReactiveFormsModule } from '@angular/forms'
import { CommonModule } from '@angular/common'
@Component({
  selector: 'app-address-input',
  templateUrl: './address-input.component.html',
  styleUrls: ['./address-input.component.scss'],
  imports: [ReactiveFormsModule, CommonModule,  AngularYandexMapsModule,]
})
export class AddressInputComponent implements OnInit {
  constructor(
    private yaGeocoderService: YaGeocoderService,
  ) {}

  @Input() control?: any
  @Input() type: string = ''
  @Input() label: string = ''
  @Input() placeholder: string = ''
  @Input() readonly: boolean = false
  @Input() openPassword: boolean = false
  @Input() invalid: boolean = false
  @Input() disabled: boolean = false
  @Input() coords!: any
  @Input() placeId!: string
  @Output() addressEditEmit = new EventEmitter()
  placemark!: ymaps.Placemark
  private readonly destroy$ = new Subject<void>()
  map: any
  address: any
  addressForm!: FormGroup
  public addressChange: BehaviorSubject<boolean> = new BehaviorSubject(true)
  setFirstCoords() {
    this.coords = [55.751574, 37.573856] // Москва по умолчанию
    this.setAdress()
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.setFirstCoords()
    if (this.map) {
      setTimeout(() => {
        this.addPlacemark(this.coords)
      }, 0)
    }
  }
  emitForm() {
    this.addressEditEmit.emit(this.addressForm.value)
  }

  onMapReady(event: YaReadyEvent<ymaps.Map>) {
    this.map = event
    this.addPlacemark(this.coords)
    const search = new ymaps.SuggestView('search-map-')
    search.events.add('select', (event: any) => {
      this.map.target.geoObjects.removeAll()
      this.address = event.originalEvent.item.displayName
      let geocodeResult = this.yaGeocoderService.geocode(this.address, {
        results: 1,
      })
      geocodeResult.pipe(takeUntil(this.destroy$)).subscribe((result: any) => {
        const firstGeoObject = result.geoObjects.get(0)
        this.coords = firstGeoObject.geometry.getCoordinates()
        this.setLongitudelatitude()
        this.setAdress()
        this.addPlacemark(this.coords)
      })
    })
  }
  clearInput(event: HTMLInputElement) {
    event.value = ''
  }
  addPlacemark(coords: number[]) {
    this.map.target.geoObjects.removeAll()
    this.placemark = new ymaps.Placemark(coords)
    this.map.target.geoObjects.add(this.placemark)
  }
  onMapClick(e: YaEvent<ymaps.Map>) {
    const { target, event } = e
    this.map.target.geoObjects.removeAll()
    this.addPlacemark([event.get('coords')[0], event.get('coords')[1]])
    this.coords = [event.get('coords')[0], event.get('coords')[1]]
    this.setAdress()
    this.setLongitudelatitude()
  }
  setAdress() {
    const geocodeResult = this.yaGeocoderService.geocode(this.coords, {
      results: 1,
    })
    geocodeResult
      .pipe(
        takeUntil(this.destroy$),
        tap((result: any) => {
          const firstGeoObject = result.geoObjects.get(0)
          // this.address = firstGeoObject.getAddressLine()
          if (firstGeoObject) {
            this.addressForm.value.address = firstGeoObject.getAddressLine()
          }
        }),
      )
      .subscribe((result: any) => {
        
      })
  }
  setLongitudelatitude() {
    this.addressForm.value.longitude = this.coords[1]
    this.addressForm.value.latitude = this.coords[0]
  }

  ngAfterViewInit() {
    this.setFirstCoords()
  }
  testLog() {}
  setFormInLoad() {
    this.setLongitudelatitude()
    this.setAdress()
  }

  ngOnInit() {
    this.addressForm = new FormGroup({
      placeId: new FormControl(this.placeId, [Validators.required]),
      address: new FormControl('', [Validators.required]),
      longitude: new FormControl('', [Validators.required]),
      latitude: new FormControl('', [Validators.required]),
      location_id: new FormControl('', [Validators.required]),
    })
  }
}
