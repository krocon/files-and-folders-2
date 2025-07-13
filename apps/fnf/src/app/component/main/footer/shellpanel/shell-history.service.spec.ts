import {TestBed} from '@angular/core/testing';
import {ShellHistoryService} from "./shell-history.service";


describe('ShellHistoryService', () => {
  let service: ShellHistoryService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ShellHistoryService);
    service.clear();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getHistory', () => {
    it('should return an empty array initially', () => {
      const history = service.getHistory();
      expect(history).toEqual([]);
    });

    it('should return the current history', () => {
      // Add some items to history
      service.addHistory('command1');
      service.addHistory('command2');

      const history = service.getHistory();
      expect(history).toEqual(['command1', 'command2']);
    });
  });

  describe('addHistory', () => {
    it('should add an item to the history', () => {
      service.addHistory('test command');

      const history = service.getHistory();
      expect(history).toContain('test command');
      expect(history.length).toBe(1);
    });

    it('should add multiple items to the history', () => {
      service.addHistory('command1');
      service.addHistory('command2');
      service.addHistory('command3');

      const history = service.getHistory();
      expect(history).toEqual(['command1', 'command2', 'command3']);
      expect(history.length).toBe(3);
    });

    it('should maintain history in the order items were added', () => {
      service.addHistory('first');
      service.addHistory('second');
      service.addHistory('third');

      const history = service.getHistory();
      expect(history[0]).toBe('first');
      expect(history[1]).toBe('second');
      expect(history[2]).toBe('third');
    });

    it('should remove oldest items when exceeding MAX_HISTORY_LENGTH', () => {
      // Add more items than MAX_HISTORY_LENGTH
      for (let i = 0; i < ShellHistoryService.MAX_HISTORY_LENGTH + 5; i++) {
        service.addHistory(`command${i}`);
      }

      const history = service.getHistory();
      expect(history.length).toBe(ShellHistoryService.MAX_HISTORY_LENGTH);

      // First 5 items should be removed, so history should start with command5
      expect(history[0]).toBe('command5');
      expect(history[history.length - 1]).toBe(`command${ShellHistoryService.MAX_HISTORY_LENGTH + 4}`);
    });
  });

  describe('clear', () => {
    it('should empty the history', () => {
      // Add some items
      service.addHistory('command1');
      service.addHistory('command2');

      // Verify items were added
      expect(service.getHistory().length).toBe(2);

      // Clear history
      service.clear();

      // Verify history is empty
      expect(service.getHistory()).toEqual([]);
    });
  });


  describe('valueChanges$', () => {
    it('should return a BehaviorSubject', () => {
      const valueChanges = service.valueChanges$();
      expect(valueChanges).toBeTruthy();
      expect(valueChanges.constructor.name).toBe('BehaviorSubject');
    });

    it('should emit the current history initially', () => {
      // Add some items to history
      service.addHistory('command1');
      service.addHistory('command2');

      // Get the valueChanges$ and subscribe to it
      const valueChanges = service.valueChanges$();
      let emittedValue: string[] | null = null;

      valueChanges.subscribe(value => {
        emittedValue = value;
      });

      // Check that the emitted value matches the current history
      expect(emittedValue).toEqual(['command1', 'command2']);
    });

    it('should emit when history is added', () => {
      const valueChanges = service.valueChanges$();
      const emittedValues: string[][] = [];

      // Subscribe to valueChanges$
      const subscription = valueChanges.subscribe(value => {
        emittedValues.push([...value]); // Clone the array to avoid reference issues
      });

      // Initial empty history should be emitted
      expect(emittedValues.length).toBe(1);
      expect(emittedValues[0]).toEqual([]);

      // Add an item and check that the new history is emitted
      service.addHistory('new command');
      expect(emittedValues.length).toBe(2);
      expect(emittedValues[1]).toEqual(['new command']);

      // Add another item
      service.addHistory('another command');
      expect(emittedValues.length).toBe(3);
      expect(emittedValues[2]).toEqual(['new command', 'another command']);

      subscription.unsubscribe();
    });

    it('should emit when history is cleared', () => {
      // Add some items to history
      service.addHistory('command1');
      service.addHistory('command2');

      const valueChanges = service.valueChanges$();
      const emittedValues: string[][] = [];

      // Subscribe to valueChanges$
      const subscription = valueChanges.subscribe(value => {
        emittedValues.push([...value]); // Clone the array to avoid reference issues
      });

      // Initial history should be emitted
      expect(emittedValues.length).toBe(1);
      expect(emittedValues[0]).toEqual(['command1', 'command2']);

      // Clear the history and check that empty array is emitted
      service.clear();
      expect(emittedValues.length).toBe(2);
      expect(emittedValues[1]).toEqual([]);

      subscription.unsubscribe();
    });
  });


});