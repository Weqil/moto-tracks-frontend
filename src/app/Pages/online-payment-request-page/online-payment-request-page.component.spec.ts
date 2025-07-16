import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { OnlinePaymentRequestPageComponent } from './online-payment-request-page.component';

describe('OnlinePaymentRequestPageComponent', () => {
  let component: OnlinePaymentRequestPageComponent;
  let fixture: ComponentFixture<OnlinePaymentRequestPageComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ OnlinePaymentRequestPageComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(OnlinePaymentRequestPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
