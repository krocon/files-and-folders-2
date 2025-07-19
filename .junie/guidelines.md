# Angular Development Guidelines

## Template Syntax

### Control Flow

- Use the new Angular control flow syntax with `@if`, `@for`, `@switch`, etc. instead of the traditional structural
  directives (`*ngIf`, `*ngFor`, etc.).

```html
<!-- Preferred: New control flow syntax -->
@if (condition) {
<div>Content to show when condition is true</div>} @else {
<div>Content to show when condition is false</div>}

<!-- Avoid: Old structural directive syntax -->
<div *ngIf="condition; else elseBlock">Content to show when condition is true</div>
<ng-template #elseBlock>Content to show when condition is false</ng-template>
```

```html
<!-- Preferred: New for loop syntax -->
@for (item of items; track item.id) {
<div>{{ item.name }}</div>} @empty {
<div>No items available</div>}

<!-- Avoid: Old ngFor syntax -->
<div *ngFor="let item of items; trackBy: trackById">{{ item.name }}</div>
<div *ngIf="items.length === 0">No items available</div>
```

### State Management

- **Do not use Signals** for state management or reactivity. Instead, use traditional RxJS observables and the async
  pipe for handling asynchronous data.

```typescript
// Preferred: Using RxJS observables
import {Observable} from 'rxjs';

@Component({
  selector: 'app-example',
  template: `
    <div>{{ data$ | async }}</div>
  `
})
export class ExampleComponent {
  data$: Observable<string>;
}
```

```typescript
// Avoid: Using Signals
import {signal} from '@angular/core';

@Component({
  selector: 'app-example',
  template: `
    <div>{{ data() }}</div>
  `
})
export class ExampleComponent {
  data = signal('initial value'); // Do not use signals
}
```

## Component Architecture

- Continue using the OnPush change detection strategy for better performance.
- Prefer input/output bindings for component communication.
- Use services with RxJS for cross-component state management.

## Best Practices

- **IMPORTANT NOTICE**: For UI tables, you should use guiexpert-table. Please refer to the comprehensive guide at
  `.junie/instructions_guiexpert-table.md` for detailed implementation instructions.
- **IMPORTANT NOTICE**: When you are working on apps/fnf/src/edit.html: Please refer to the comprehensive guide at
  `.junie/edit.md` for detailed implementation instructions.
- Keep components small and focused on a single responsibility.
- Use typed forms for form handling.
- Implement lazy loading for feature modules.
- Write unit tests (jest) for components and services.
- Write e2e tests (cypress) for components.

These guidelines ensure consistency across the codebase while adopting the new Angular template syntax features without
using Signals.
