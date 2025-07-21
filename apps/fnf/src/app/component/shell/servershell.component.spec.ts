import {ComponentFixture, TestBed} from '@angular/core/testing';
import {NoopAnimationsModule} from '@angular/platform-browser/animations';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {Router} from '@angular/router';
import {ChangeDetectorRef} from '@angular/core';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import {MatInputModule} from '@angular/material/input';
import {MatTooltipModule} from '@angular/material/tooltip';
import {ServershellComponent} from './servershell.component';
import {ServershellHistoryService} from './service/servershell-history.service';
import {ServershellService} from './service/servershell.service';
import {ServershellAutocompleteService} from './service/servershell-autocomplete.service';
import {AppService} from '../../app.service';
import {ShellSpawnResultIf} from '@fnf/fnf-data';
import {of} from 'rxjs';

describe('ServershellComponent', () => {
  let component: ServershellComponent;
  let fixture: ComponentFixture<ServershellComponent>;
  let mockRouter: jest.Mocked<Router>;
  let mockShellHistoryService: jest.Mocked<ServershellHistoryService>;
  let mockShellService: jest.Mocked<ServershellService>;
  let mockShellAutocompleteService: jest.Mocked<ServershellAutocompleteService>;
  let mockAppService: jest.Mocked<AppService>;
  let mockChangeDetectorRef: jest.Mocked<ChangeDetectorRef>;

  beforeEach(async () => {
    const routerMock = {
      navigate: jest.fn()
    } as unknown as jest.Mocked<Router>;

    const shellHistoryServiceMock = {
      getHistory: jest.fn().mockReturnValue(['ls -al', 'pwd', 'cd /tmp']),
      addHistory: jest.fn(),
      clear: jest.fn(),
      valueChanges$: jest.fn()
    } as unknown as jest.Mocked<ServershellHistoryService>;

    const shellServiceMock = {
      doSpawn: jest.fn(),
      doCancelSpawn: jest.fn()
    } as unknown as jest.Mocked<ServershellService>;

    const shellAutocompleteServiceMock = {
      getAutocompleteSuggestions: jest.fn().mockReturnValue(of(['ls', 'pwd', 'cd']))
    } as unknown as jest.Mocked<ServershellAutocompleteService>;

    const appServiceMock = {
      getActiveTabOnActivePanel: jest.fn().mockReturnValue({path: '/test/path'})
    } as unknown as jest.Mocked<AppService>;

    const changeDetectorRefMock = {
      detectChanges: jest.fn()
    } as unknown as jest.Mocked<ChangeDetectorRef>;

    await TestBed.configureTestingModule({
      imports: [
        ServershellComponent,
        NoopAnimationsModule,
        FormsModule,
        ReactiveFormsModule,
        MatAutocompleteModule,
        MatInputModule,
        MatTooltipModule
      ],
      providers: [
        {provide: Router, useValue: routerMock},
        {provide: ServershellHistoryService, useValue: shellHistoryServiceMock},
        {provide: ServershellService, useValue: shellServiceMock},
        {provide: ServershellAutocompleteService, useValue: shellAutocompleteServiceMock},
        {provide: AppService, useValue: appServiceMock},
        {provide: ChangeDetectorRef, useValue: changeDetectorRefMock}
      ]
    }).compileComponents();

    mockRouter = TestBed.inject(Router) as jest.Mocked<Router>;
    mockShellHistoryService = TestBed.inject(ServershellHistoryService) as jest.Mocked<ServershellHistoryService>;
    mockShellService = TestBed.inject(ServershellService) as jest.Mocked<ServershellService>;
    mockShellAutocompleteService = TestBed.inject(ServershellAutocompleteService) as jest.Mocked<ServershellAutocompleteService>;
    mockAppService = TestBed.inject(AppService) as jest.Mocked<AppService>;
    mockChangeDetectorRef = TestBed.inject(ChangeDetectorRef) as jest.Mocked<ChangeDetectorRef>;
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ServershellComponent);
    component = fixture.componentInstance;

    // Clear all mock calls
    jest.clearAllMocks();

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with correct path and history', () => {
    expect(component.path).toBe('/test/path');
    expect(mockAppService.getActiveTabOnActivePanel).toHaveBeenCalled();
    expect(mockShellHistoryService.getHistory).toHaveBeenCalled();
  });

  describe('Keyboard Event Handling', () => {
    beforeEach(() => {
      component.text = 'current command';
      // Set up the component's currentHistory properly
      component['currentHistory'] = ['ls -al', 'pwd', 'cd /tmp'];
      component['historyIndex'] = -1;
    });

    it('should navigate history up with ArrowUp key', () => {
      // Test the navigateHistory method directly first
      (component as any).navigateHistory(-1);

      expect(component.text).toBe('cd /tmp'); // Last command in history (newest first)
      expect(component['historyIndex']).toBe(0); // Should be at first history item
    });

    it('should navigate history up with ArrowUp key via onKeyDown', () => {
      const event = new KeyboardEvent('keydown', {key: 'ArrowUp'});
      jest.spyOn(event, 'preventDefault');

      component.onKeyDown(event);

      expect(event.preventDefault).toHaveBeenCalled();
      expect(component.text).toBe('cd /tmp'); // Last command in history (newest first)
      expect(component['historyIndex']).toBe(0); // Should be at first history item
    });

    it('should navigate history down with ArrowDown key', () => {
      // First go up to get into history
      const upEvent = new KeyboardEvent('keydown', {key: 'ArrowUp'});
      component.onKeyDown(upEvent);
      expect(component.text).toBe('cd /tmp');

      // Go up again to get to previous command
      component.onKeyDown(upEvent);
      expect(component.text).toBe('pwd');

      // Then go down
      const downEvent = new KeyboardEvent('keydown', {key: 'ArrowDown'});
      jest.spyOn(downEvent, 'preventDefault');

      component.onKeyDown(downEvent);

      expect(downEvent.preventDefault).toHaveBeenCalled();
      expect(component.text).toBe('cd /tmp'); // Should go back to more recent command
    });

    it('should clear text with Escape key', () => {
      const event = new KeyboardEvent('keydown', {key: 'Escape'});
      jest.spyOn(event, 'preventDefault');

      component.onKeyDown(event);

      expect(event.preventDefault).toHaveBeenCalled();
      expect(component.text).toBe('');
      // Note: detectChanges is called but we cleared mocks, so we need to check after the call
    });

    it('should handle empty history gracefully', () => {
      mockShellHistoryService.getHistory.mockReturnValue([]);
      component.ngOnInit();

      const event = new KeyboardEvent('keydown', {key: 'ArrowUp'});
      component.onKeyDown(event);

      // Should not change text when history is empty
      expect(component.text).toBe('current command');
    });
  });

  describe('Command Execution', () => {
    it('should execute command and add to history', () => {
      component.text = 'ls -al';
      const mockCallback = jest.fn();
      mockShellService.doSpawn.mockImplementation((para, callback) => {
        callback({
          out: 'file1.txt\nfile2.txt',
          error: '',
          code: 0,
          done: true
        } as ShellSpawnResultIf);
      });

      component.execute();

      expect(mockShellHistoryService.addHistory).toHaveBeenCalledWith('ls -al');
      expect(mockShellService.doSpawn).toHaveBeenCalledWith(
        expect.objectContaining({
          cmd: 'ls -al',
          timeout: 60000
        }),
        expect.any(Function)
      );
      expect(component.text).toBe(''); // Should clear after execution
      expect(component.displayText).toContain('file1.txt\nfile2.txt');
    });

    it('should handle command execution errors', () => {
      component.text = 'invalid-command';
      mockShellService.doSpawn.mockImplementation((para, callback) => {
        callback({
          out: '',
          error: 'Command not found',
          code: 1,
          done: true
        } as ShellSpawnResultIf);
      });

      component.execute();

      expect(component.errorMsg).toBe('Command not found');
      // detectChanges is called but we cleared mocks in beforeEach
    });

    it('should skip execution for empty command', () => {
      component.text = '';

      component.execute();

      expect(mockShellService.doSpawn).not.toHaveBeenCalled();
      expect(mockShellHistoryService.addHistory).not.toHaveBeenCalled();
    });

    it('should skip execution for whitespace-only command', () => {
      component.text = '   ';

      component.execute();

      expect(mockShellService.doSpawn).not.toHaveBeenCalled();
      expect(mockShellHistoryService.addHistory).not.toHaveBeenCalled();
    });
  });

  describe('Focus Handling', () => {
    it('should emit focus changed event on focus in', () => {
      jest.spyOn(component.focusChanged, 'emit');

      component.onFocusIn();

      expect(component.hasFocus).toBe(true);
      expect(component.focusChanged.emit).toHaveBeenCalledWith(true);
    });

    it('should emit focus changed event on focus out', () => {
      jest.spyOn(component.focusChanged, 'emit');

      component.onFocusOut();

      expect(component.hasFocus).toBe(false);
      expect(component.focusChanged.emit).toHaveBeenCalledWith(false);
    });
  });

  describe('Autocomplete', () => {
    it('should update text when option is selected', () => {
      const command = 'ls -la';

      component.onOptionSelected(command);

      expect(component.text).toBe(command);
      // detectChanges is called but we cleared mocks in beforeEach
    });

    it('should filter commands on text change', () => {
      component.text = 'ls';

      component.onTextChange();

      expect(component.errorMsg).toBe('');
      // The textChange$ subject should be triggered, but we can't easily test the debounced behavior
    });
  });

  describe('Navigation', () => {
    it('should navigate to files', () => {
      component.navigateToFiles();

      expect(mockRouter.navigate).toHaveBeenCalledWith(['/files']);
    });
  });

  describe('Component Lifecycle', () => {
    it('should send cancel message on destroy', () => {
      component.ngOnDestroy();

      expect(mockShellService.doCancelSpawn).toHaveBeenCalledWith(
        expect.stringContaining('cancelServerShell')
      );
    });

    it('should complete textChange$ subject on destroy', () => {
      const completeSpy = jest.spyOn((component as any).textChange$, 'complete');

      component.ngOnDestroy();

      expect(completeSpy).toHaveBeenCalled();
      expect((component as any).alive).toBe(false);
    });
  });
});
