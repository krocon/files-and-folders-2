import {ComponentFixture, TestBed} from '@angular/core/testing';
import {FnfTextLogoComponent} from './fnf-text-logo.component';

describe('FnfTextLogoComponent', () => {
  let component: FnfTextLogoComponent;
  let fixture: ComponentFixture<FnfTextLogoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FnfTextLogoComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(FnfTextLogoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render the logo structure', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const logoDiv = compiled.querySelector('.div-logo');

    expect(logoDiv).toBeTruthy();
    expect(logoDiv?.children.length).toBe(3);
  });

  it('should render "Files" text in left div', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const leftDiv = compiled.querySelector('.div-left');

    expect(leftDiv).toBeTruthy();
    expect(leftDiv?.textContent?.trim()).toBe('Files');
  });

  it('should render "and" text in middle div', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const middleDiv = compiled.querySelector('.div-middle');

    expect(middleDiv).toBeTruthy();
    expect(middleDiv?.textContent?.trim()).toBe('and');
  });

  it('should render "Folders" text in right div', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const rightDiv = compiled.querySelector('.div-right');

    expect(rightDiv).toBeTruthy();
    expect(rightDiv?.textContent?.trim()).toBe('Folders');
  });

  it('should have correct CSS classes', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const leftDiv = compiled.querySelector('.div-left');
    const middleDiv = compiled.querySelector('.div-middle');
    const rightDiv = compiled.querySelector('.div-right');

    expect(leftDiv?.classList.contains('div-word')).toBeTruthy();
    expect(leftDiv?.classList.contains('div-left')).toBeTruthy();

    expect(middleDiv?.classList.contains('div-word')).toBeTruthy();
    expect(middleDiv?.classList.contains('div-middle')).toBeTruthy();

    expect(rightDiv?.classList.contains('div-word')).toBeTruthy();
    expect(rightDiv?.classList.contains('div-right')).toBeTruthy();
  });
});
