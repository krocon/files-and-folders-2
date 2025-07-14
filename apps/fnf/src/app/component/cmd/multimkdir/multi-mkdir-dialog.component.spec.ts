import {ComponentFixture, TestBed} from '@angular/core/testing';
import {ReactiveFormsModule} from '@angular/forms';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {NoopAnimationsModule} from '@angular/platform-browser/animations';
import {MultiMkdirDialogComponent} from './multi-mkdir-dialog.component';
import {MultiMkdirDialogData} from './data/multi-mkdir-dialog.data';
import {MultiMkdirService} from './multi-mkdir.service';

describe('MultiMkdirDialogComponent', () => {
  let component: MultiMkdirDialogComponent;
  let fixture: ComponentFixture<MultiMkdirDialogComponent>;
  let multiMkdirService: jest.Mocked<MultiMkdirService>;
  let dialogRef: { close: jest.Mock };

  beforeEach(async () => {
    const multiMkdirServiceMock = {
      generateDirectoryNames: jest.fn()
    } as unknown as jest.Mocked<MultiMkdirService>;

    const dialogRefMock = {
      close: jest.fn()
    };

    await TestBed.configureTestingModule({
      imports: [
        ReactiveFormsModule,
        NoopAnimationsModule,
        MultiMkdirDialogComponent
      ],
      providers: [
        {provide: MultiMkdirService, useValue: multiMkdirServiceMock},
        {provide: MatDialogRef, useValue: dialogRefMock},
        {provide: MAT_DIALOG_DATA, useValue: new MultiMkdirDialogData('Test[C]')}
      ]
    }).compileComponents();

    multiMkdirService = TestBed.inject(MultiMkdirService) as jest.Mocked<MultiMkdirService>;
    dialogRef = TestBed.inject(MatDialogRef) as unknown as { close: jest.Mock };

    // Mock the service to return test directory names
    multiMkdirService.generateDirectoryNames.mockReturnValue(['Test01', 'Test02', 'Test03']);
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MultiMkdirDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize form with default values', () => {
    expect(component.formGroup.get('folderNameTemplate')?.value).toBe('S[C]');
    expect(component.formGroup.get('counterStart')?.value).toBe(1);
    expect(component.formGroup.get('counterStep')?.value).toBe(1);
    expect(component.formGroup.get('counterEnd')?.value).toBe(5);
    expect(component.formGroup.get('counterDigits')?.value).toBe(2);
  });

  it('should update directory names when form values change', () => {
    // Initial call during ngOnInit
    expect(multiMkdirService.generateDirectoryNames).toHaveBeenCalled();
    expect(component.directoryNames).toEqual(['Test01', 'Test02', 'Test03']);

    // Reset the mock to clear previous calls
    multiMkdirService.generateDirectoryNames.mockClear();

    // Set up the mock to return new values
    multiMkdirService.generateDirectoryNames.mockReturnValue(['NewTest01', 'NewTest02']);

    // Create a form value with the updated template
    const updatedFormValue = {
      ...component.formGroup.value,
      folderNameTemplate: 'NewTest[C]'
    };

    // Directly call updateDirectoryNames with the updated form value
    // We need to access the private method, so we use any type
    (component as any).updateDirectoryNames(updatedFormValue);

    // Verify the service was called with the correct parameters
    expect(multiMkdirService.generateDirectoryNames).toHaveBeenCalledWith(
      expect.objectContaining({
        folderNameTemplate: 'NewTest[C]'
      }),
      expect.any(String)
    );

    expect(component.directoryNames).toEqual(['NewTest01', 'NewTest02']);
  });

  it('should close dialog with directory names when Create All is clicked', () => {
    component.directoryNames = ['Test01', 'Test02', 'Test03'];
    component.onCreateAllClicked();
    expect(dialogRef.close).toHaveBeenCalledWith(['Test01', 'Test02', 'Test03']);
  });

  it('should close dialog with undefined when Cancel is clicked', () => {
    component.onCancelClicked();
    expect(dialogRef.close).toHaveBeenCalledWith(undefined);
  });

  it('should reset form to default values when Reset is clicked', () => {
    // Change form values
    component.formGroup.patchValue({
      folderNameTemplate: 'Changed[C]',
      counterStart: 10,
      counterStep: 2,
      counterEnd: 20,
      counterDigits: 3
    });

    // Reset
    component.onResetClicked();

    // Check if form is reset to default values
    expect(component.formGroup.get('folderNameTemplate')?.value).toBe('S[C]');
    expect(component.formGroup.get('counterStart')?.value).toBe(1);
    expect(component.formGroup.get('counterStep')?.value).toBe(1);
    expect(component.formGroup.get('counterEnd')?.value).toBe(5);
    expect(component.formGroup.get('counterDigits')?.value).toBe(2);
  });
});
