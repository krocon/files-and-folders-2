# GuiExpert Table for Angular 20

This guide will help you understand how to use `@guiexpert/table` and `@guiexpert/angular-table` in your Angular 20
application. GuiExpert Table is a powerful, flexible, and high-performance table component that supports a wide range of
features.

> **Important Note**: The component selector can be used as either `<ge-table>` or `<guiexpert-table>` in your
> templates. Both selectors work the same way, but `<guiexpert-table>` is the full name and is used in many real-world
> applications.

## Installation

To install the GuiExpert Table packages in your Angular 20 project, run the following command:

```bash
npm install @guiexpert/table @guiexpert/angular-table
```

Then, import the `TableModule` in your Angular module:

```typescript
import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {TableModule} from '@guiexpert/angular-table';
import {AppComponent} from './app.component';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    TableModule
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
```

For standalone components in Angular 20, you can import the `TableComponent` directly:

```typescript
import {Component} from '@angular/core';
import {TableComponent} from '@guiexpert/angular-table';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [TableComponent],
  template: `
    <ge-table [tableModel]="tableModel"></ge-table>
  `
})
export class AppComponent {
  // Your component code
}
```

## Table Model

The `TableModelIf` interface is the core of the GuiExpert Table. It serves as a container for the header, body, and
footer models, and manages column information.

### Key Concepts

A `TableModelIf` implementation:

- Contains area models for header, body, and footer
- Manages column information (width, count, properties)
- Handles fixed columns (left and right)
- Supports sorting, filtering, and selection
- Manages column reordering and resizing

### Basic Structure

The table is divided into areas:

```
+----------------+-------------------+--------------+
|  header/west   |  header/center    | header/east  |
+----------------+-------------------+--------------+
|  body/west     |  body/center      | body/east    |
+----------------+-------------------+--------------+
|  footer/west   |  footer/center    | footer/east  |
+----------------+-------------------+--------------+
```

- **Header, Body, Footer**: The main horizontal areas of the table
- **West, Center, East**: Sections within each area (fixed left, scrollable, fixed right)

### Creating a Table Model

The easiest way to create a table model is using the `TableFactory`:

```typescript
import {TableFactory, TableModelIf} from '@guiexpert/table';

// Create a simple table model with array data
const tableModel: TableModelIf = TableFactory.createTableModel({
  headerData: [['ID', 'Name', 'Age']],
  bodyData: [
    [1, 'John', 30],
    [2, 'Jane', 25],
    [3, 'Bob', 40]
  ],
  footerData: [['', 'Average', 31.67]]
});
```

## Area Model

The `AreaModelIf` interface represents a specific area of the table (header, body, or footer). It provides methods for
accessing and manipulating data within that area.

### Key Concepts

An `AreaModelIf` implementation:

- Provides information about the number of rows
- Manages the content of each cell
- Controls cell styling (CSS classes, custom styles)
- Handles cell spanning (colspan, rowspan)
- Manages row heights
- Controls cell editability and selectability
- Handles row selection state
- Supports filtering and sorting

### Common Area Model Implementations

1. **AreaModelArrayOfArrays**: For simple 2D array data
2. **AreaModelObjectArray**: For array of objects with property access
3. **AreaModelTree**: For hierarchical tree data

## Examples

### Example with Array of Arrays

```typescript
import {Component, OnInit} from '@angular/core';
import {TableFactory, TableModelIf} from '@guiexpert/table';
import {TableComponent} from '@guiexpert/angular-table';

@Component({
  selector: 'app-array-example',
  standalone: true,
  imports: [TableComponent],
  template: `
    <ge-table [tableModel]="tableModel"></ge-table>
  `
})
export class ArrayExampleComponent implements OnInit {
  tableModel!: TableModelIf;

  ngOnInit() {
    // Create header data (array of arrays)
    const headerData = [['ID', 'Name', 'Age', 'City']];

    // Create body data (array of arrays)
    const bodyData = [
      [1, 'John', 30, 'New York'],
      [2, 'Jane', 25, 'San Francisco'],
      [3, 'Bob', 40, 'Chicago'],
      [4, 'Alice', 35, 'Boston']
    ];

    // Create footer data (array of arrays)
    const footerData = [['', 'Average', 32.5, '']];

    // Create the table model
    this.tableModel = TableFactory.createTableModel({
      headerData,
      bodyData,
      footerData,
      fixedLeftColumnCount: 1,  // Fix the ID column
      defaultRowHeights: {
        header: 40,
        body: 30,
        footer: 40
      }
    });
  }
}
```

### Example with Array of Objects

```typescript
import {Component, OnInit} from '@angular/core';
import {TableFactory, TableModelIf, ColumnDefIf} from '@guiexpert/table';
import {TableComponent} from '@guiexpert/angular-table';

interface Person {
  id: number;
  name: string;
  age: number;
  city: string;
}

@Component({
  selector: 'app-object-example',
  standalone: true,
  imports: [TableComponent],
  template: `
    <ge-table [tableModel]="tableModel"></ge-table>
  `
})
export class ObjectExampleComponent implements OnInit {
  tableModel!: TableModelIf;

  ngOnInit() {
    // Define data as an array of objects
    const data: Person[] = [
      {id: 1, name: 'John', age: 30, city: 'New York'},
      {id: 2, name: 'Jane', age: 25, city: 'San Francisco'},
      {id: 3, name: 'Bob', age: 40, city: 'Chicago'},
      {id: 4, name: 'Alice', age: 35, city: 'Boston'}
    ];

    // Define column definitions
    const columnDefs: ColumnDefIf[] = [
      {property: 'id', headerLabel: 'ID', width: 80},
      {property: 'name', headerLabel: 'Name', width: 150},
      {property: 'age', headerLabel: 'Age', width: 80},
      {property: 'city', headerLabel: 'City', width: 150}
    ];

    // Create the table model
    this.tableModel = TableFactory.createByObjectArray(
      data,                  // data array
      [['ID', 'Name', 'Age', 'City']], // header
      [],                    // footer (empty)
      1,                     // fixedLeftColumnCount
      0,                     // fixedRightColumnCount
      false,                 // rowCheckboxVisible
      {                      // defaultRowHeights
        header: 40,
        body: 30,
        footer: 40
      },
      columnDefs
    );
  }
}
```

## Features

### Custom Renderer

Custom renderers allow you to control how cells are displayed in the table.

```typescript
import {Component, OnInit} from '@angular/core';
import {TableFactory, TableModelIf, ColumnDefIf, CellRendererIf} from '@guiexpert/table';
import {TableComponent} from '@guiexpert/angular-table';

// Custom cell renderer for age values
class AgeCellRenderer implements CellRendererIf {
  render(cellDiv: HTMLDivElement, rowIndex: number, columnIndex: number, areaIdent: string, areaModel: any): void {
    const value = areaModel.getValueAt(rowIndex, columnIndex);

    // Apply different styles based on age
    if (value < 30) {
      cellDiv.innerHTML = `<span style="color: green">${value} (young)</span>`;
    } else if (value < 40) {
      cellDiv.innerHTML = `<span style="color: blue">${value} (adult)</span>`;
    } else {
      cellDiv.innerHTML = `<span style="color: purple">${value} (senior)</span>`;
    }
  }
}

@Component({
  selector: 'app-custom-renderer',
  standalone: true,
  imports: [TableComponent],
  template: `
    <ge-table [tableModel]="tableModel"></ge-table>
  `
})
export class CustomRendererComponent implements OnInit {
  tableModel!: TableModelIf;

  ngOnInit() {
    const data = [
      {id: 1, name: 'John', age: 30, city: 'New York'},
      {id: 2, name: 'Jane', age: 25, city: 'San Francisco'},
      {id: 3, name: 'Bob', age: 40, city: 'Chicago'},
      {id: 4, name: 'Alice', age: 35, city: 'Boston'}
    ];

    // Create a renderer map for the age column
    const ageRendererMap = {
      body: new AgeCellRenderer()
    };

    const columnDefs: ColumnDefIf[] = [
      {property: 'id', headerLabel: 'ID', width: 80},
      {property: 'name', headerLabel: 'Name', width: 150},
      {property: 'age', headerLabel: 'Age', width: 80, rendererMap: ageRendererMap},
      {property: 'city', headerLabel: 'City', width: 150}
    ];

    this.tableModel = TableFactory.createByObjectArray(
      data,
      [['ID', 'Name', 'Age', 'City']],
      [],
      0,
      0,
      false,
      undefined,
      columnDefs
    );
  }
}
```

### Row Sorting

```typescript
import {Component, OnInit} from '@angular/core';
import {TableFactory, TableModelIf, ColumnDefIf} from '@guiexpert/table';
import {TableComponent} from '@guiexpert/angular-table';

@Component({
  selector: 'app-sorting-example',
  standalone: true,
  imports: [TableComponent],
  template: `
    <ge-table [tableModel]="tableModel"></ge-table>
  `
})
export class SortingExampleComponent implements OnInit {
  tableModel!: TableModelIf;

  ngOnInit() {
    const data = [
      {id: 1, name: 'John', age: 30, city: 'New York'},
      {id: 2, name: 'Jane', age: 25, city: 'San Francisco'},
      {id: 3, name: 'Bob', age: 40, city: 'Chicago'},
      {id: 4, name: 'Alice', age: 35, city: 'Boston'}
    ];

    const columnDefs: ColumnDefIf[] = [
      {property: 'id', headerLabel: 'ID', width: 80, sortable: true},
      {property: 'name', headerLabel: 'Name', width: 150, sortable: true},
      {property: 'age', headerLabel: 'Age', width: 80, sortable: true},
      {property: 'city', headerLabel: 'City', width: 150, sortable: true}
    ];

    this.tableModel = TableFactory.createByObjectArray(
      data,
      [['ID', 'Name', 'Age', 'City']],
      [],
      0,
      0,
      false,
      undefined,
      columnDefs
    );
  }
}
```

### Column Re-ordering (Drag and Drop)

```typescript
import {Component, OnInit} from '@angular/core';
import {TableFactory, TableModelIf, ColumnDefIf} from '@guiexpert/table';
import {TableComponent, TableOptions} from '@guiexpert/angular-table';

@Component({
  selector: 'app-column-reorder',
  standalone: true,
  imports: [TableComponent],
  template: `
    <ge-table [tableModel]="tableModel" [tableOptions]="tableOptions"></ge-table>
  `
})
export class ColumnReorderComponent implements OnInit {
  tableModel!: TableModelIf;
  tableOptions: TableOptions = {
    columnsDraggable: true
  };

  ngOnInit() {
    const data = [
      {id: 1, name: 'John', age: 30, city: 'New York'},
      {id: 2, name: 'Jane', age: 25, city: 'San Francisco'},
      {id: 3, name: 'Bob', age: 40, city: 'Chicago'},
      {id: 4, name: 'Alice', age: 35, city: 'Boston'}
    ];

    const columnDefs: ColumnDefIf[] = [
      {property: 'id', headerLabel: 'ID', width: 80},
      {property: 'name', headerLabel: 'Name', width: 150},
      {property: 'age', headerLabel: 'Age', width: 80},
      {property: 'city', headerLabel: 'City', width: 150}
    ];

    this.tableModel = TableFactory.createByObjectArray(
      data,
      [['ID', 'Name', 'Age', 'City']],
      [],
      0,
      0,
      false,
      undefined,
      columnDefs
    );
  }
}
```

### Row Filtering

```typescript
import {Component, OnInit} from '@angular/core';
import {TableFactory, TableModelIf, ColumnDefIf} from '@guiexpert/table';
import {TableComponent} from '@guiexpert/angular-table';
import {FormControl} from '@angular/forms';
import {ReactiveFormsModule} from '@angular/forms';

@Component({
  selector: 'app-filtering-example',
  standalone: true,
  imports: [TableComponent, ReactiveFormsModule],
  template: `
    <div>
      <label>Filter by name: </label>
      <input [formControl]="nameFilter" placeholder="Enter name">
    </div>
    <ge-table [tableModel]="tableModel"></ge-table>
  `
})
export class FilteringExampleComponent implements OnInit {
  tableModel!: TableModelIf;
  nameFilter = new FormControl('');

  ngOnInit() {
    const data = [
      {id: 1, name: 'John', age: 30, city: 'New York'},
      {id: 2, name: 'Jane', age: 25, city: 'San Francisco'},
      {id: 3, name: 'Bob', age: 40, city: 'Chicago'},
      {id: 4, name: 'Alice', age: 35, city: 'Boston'}
    ];

    const columnDefs: ColumnDefIf[] = [
      {property: 'id', headerLabel: 'ID', width: 80},
      {property: 'name', headerLabel: 'Name', width: 150},
      {property: 'age', headerLabel: 'Age', width: 80},
      {property: 'city', headerLabel: 'City', width: 150}
    ];

    this.tableModel = TableFactory.createByObjectArray(
      data,
      [['ID', 'Name', 'Age', 'City']],
      [],
      0,
      0,
      false,
      undefined,
      columnDefs
    );

    // Apply filter when the input value changes
    this.nameFilter.valueChanges.subscribe(value => {
      if (!value) {
        // If empty, show all rows
        this.tableModel.getBodyModel().externalFilterChanged(() => true);
      } else {
        // Filter rows by name
        const filterValue = value.toLowerCase();
        this.tableModel.getBodyModel().externalFilterChanged(row =>
          row.name.toLowerCase().includes(filterValue)
        );
      }
    });
  }
}
```

### Rowspan and Colspan in Header and Body Area

```typescript
import {Component, OnInit} from '@angular/core';
import {TableFactory, TableModelIf, AreaModelIf} from '@guiexpert/table';
import {TableComponent} from '@guiexpert/angular-table';

// Custom area model with rowspan and colspan support
class CustomHeaderAreaModel implements AreaModelIf {
  constructor(private data: string[][]) {
    this.areaIdent = 'header';
  }

  areaIdent: 'header';
  rowSelectionModel = undefined;

  getRowCount(): number {
    return this.data.length;
  }

  getValueAt(rowIndex: number, columnIndex: number): any {
    return this.data[rowIndex][columnIndex];
  }

  getTextValueAt(rowIndex: number, columnIndex: number): string {
    return String(this.getValueAt(rowIndex, columnIndex) || '');
  }

  getRowHeight(_rowIndex: number): number {
    return 40;
  }

  getRowByIndex(rowIndex: number): any {
    return this.data[rowIndex];
  }

  // Implement colspan for the header
  getColspanAt(rowIndex: number, columnIndex: number): number {
    // First row, first column spans 2 columns
    if (rowIndex === 0 && columnIndex === 0) {
      return 2;
    }
    return 1;
  }

  // Implement rowspan for the header
  getRowspanAt(rowIndex: number, columnIndex: number): number {
    // Last column spans 2 rows
    if (rowIndex === 0 && columnIndex === 3) {
      return 2;
    }
    return 1;
  }

  getMaxColspan(): number {
    return 2;
  }

  getMaxRowspan(): number {
    return 2;
  }

  // Implement other required methods with default values
  changeColumnOrder() {
  }

  setValue() {
    return false;
  }

  init() {
  }

  getCustomClassesAt() {
    return [];
  }

  getCustomStyleAt() {
    return undefined;
  }

  getTooltipAt() {
    return undefined;
  }

  getCellRenderer() {
    return undefined;
  }

  getYPosByRowIndex(rowIndex: number) {
    return rowIndex * 40;
  }

  isEditable() {
    return false;
  }

  isSelectable() {
    return true;
  }

  isRowCheckable() {
    return false;
  }

  isRowChecked() {
    return undefined;
  }

  setRowChecked() {
  }

  isFilterable() {
    return false;
  }

  externalFilterChanged() {
  }

  doSort() {
    return false;
  }

  sort() {
  }
}

@Component({
  selector: 'app-span-example',
  standalone: true,
  imports: [TableComponent],
  template: `
    <ge-table [tableModel]="tableModel"></ge-table>
  `
})
export class SpanExampleComponent implements OnInit {
  tableModel!: TableModelIf;

  ngOnInit() {
    // Create header data with 2 rows
    const headerData = [
      ['Personal Info', '', 'Contact', 'Address'],
      ['ID', 'Name', 'Email', ''] // Empty cell for Address (rowspan)
    ];

    // Create body data
    const bodyData = [
      [1, 'John', 'john@example.com', 'New York'],
      [2, 'Jane', 'jane@example.com', 'San Francisco'],
      [3, 'Bob', 'bob@example.com', 'Chicago']
    ];

    // Create a basic table model
    const tableModel = TableFactory.createTableModel({
      bodyData
    });

    // Replace the header model with our custom one
    const customHeaderModel = new CustomHeaderAreaModel(headerData);
    tableModel.getAreaModel('header').init = customHeaderModel.init;
    tableModel.getAreaModel('header').getRowCount = customHeaderModel.getRowCount;
    tableModel.getAreaModel('header').getValueAt = customHeaderModel.getValueAt;
    tableModel.getAreaModel('header').getColspanAt = customHeaderModel.getColspanAt;
    tableModel.getAreaModel('header').getRowspanAt = customHeaderModel.getRowspanAt;
    tableModel.getAreaModel('header').getMaxColspan = customHeaderModel.getMaxColspan;
    tableModel.getAreaModel('header').getMaxRowspan = customHeaderModel.getMaxRowspan;

    this.tableModel = tableModel;
  }
}
```

### Two Fixed Columns

```typescript
import {Component, OnInit} from '@angular/core';
import {TableFactory, TableModelIf, ColumnDefIf} from '@guiexpert/table';
import {TableComponent} from '@guiexpert/angular-table';

@Component({
  selector: 'app-fixed-columns',
  standalone: true,
  imports: [TableComponent],
  template: `
    <ge-table [tableModel]="tableModel"></ge-table>
  `
})
export class FixedColumnsComponent implements OnInit {
  tableModel!: TableModelIf;

  ngOnInit() {
    const data = [
      {id: 1, name: 'John', age: 30, city: 'New York', country: 'USA', occupation: 'Developer'},
      {id: 2, name: 'Jane', age: 25, city: 'San Francisco', country: 'USA', occupation: 'Designer'},
      {id: 3, name: 'Bob', age: 40, city: 'Chicago', country: 'USA', occupation: 'Manager'},
      {id: 4, name: 'Alice', age: 35, city: 'Boston', country: 'USA', occupation: 'Engineer'}
    ];

    const columnDefs: ColumnDefIf[] = [
      {property: 'id', headerLabel: 'ID', width: 80},
      {property: 'name', headerLabel: 'Name', width: 150},
      {property: 'age', headerLabel: 'Age', width: 80},
      {property: 'city', headerLabel: 'City', width: 150},
      {property: 'country', headerLabel: 'Country', width: 120},
      {property: 'occupation', headerLabel: 'Occupation', width: 150}
    ];

    this.tableModel = TableFactory.createByObjectArray(
      data,
      [['ID', 'Name', 'Age', 'City', 'Country', 'Occupation']],
      [],
      2,  // Fix the first 2 columns (ID and Name)
      0,
      false,
      undefined,
      columnDefs
    );
  }
}
```

### Real-time Updates

```typescript
import {Component, OnInit} from '@angular/core';
import {TableFactory, TableModelIf, ColumnDefIf} from '@guiexpert/table';
import {TableComponent} from '@guiexpert/angular-table';
import {interval} from 'rxjs';

interface StockData {
  symbol: string;
  price: number;
  change: number;
  volume: number;
  lastUpdate: Date;
}

@Component({
  selector: 'app-realtime-updates',
  standalone: true,
  imports: [TableComponent],
  template: `
    <ge-table [tableModel]="tableModel"></ge-table>
  `
})
export class RealtimeUpdatesComponent implements OnInit {
  tableModel!: TableModelIf;
  data: StockData[] = [
    {symbol: 'AAPL', price: 150.25, change: 0.5, volume: 1000000, lastUpdate: new Date()},
    {symbol: 'MSFT', price: 290.10, change: -0.3, volume: 800000, lastUpdate: new Date()},
    {symbol: 'GOOGL', price: 2750.80, change: 1.2, volume: 500000, lastUpdate: new Date()},
    {symbol: 'AMZN', price: 3300.45, change: -0.8, volume: 600000, lastUpdate: new Date()}
  ];

  ngOnInit() {
    const columnDefs: ColumnDefIf[] = [
      {property: 'symbol', headerLabel: 'Symbol', width: 100},
      {property: 'price', headerLabel: 'Price', width: 100},
      {property: 'change', headerLabel: 'Change', width: 100},
      {property: 'volume', headerLabel: 'Volume', width: 120},
      {property: 'lastUpdate', headerLabel: 'Last Update', width: 180}
    ];

    this.tableModel = TableFactory.createByObjectArray(
      this.data,
      [['Symbol', 'Price', 'Change', 'Volume', 'Last Update']],
      [],
      1,
      0,
      false,
      undefined,
      columnDefs
    );

    // Update data every 2 seconds
    interval(2000).subscribe(() => {
      // Update each stock with random changes
      this.data.forEach(stock => {
        const changePercent = (Math.random() - 0.5) * 2; // -1% to +1%
        stock.change = parseFloat((changePercent).toFixed(2));
        stock.price = parseFloat((stock.price * (1 + changePercent / 100)).toFixed(2));
        stock.volume = Math.floor(stock.volume * (0.9 + Math.random() * 0.2));
        stock.lastUpdate = new Date();
      });

      // Update the table model with the new data
      const bodyModel = this.tableModel.getBodyModel();
      if (bodyModel && 'setRows' in bodyModel) {
        (bodyModel as any).setRows([...this.data]);
      }
    });
  }
}
```

### Resizable Column Widths

```typescript
import {Component, OnInit} from '@angular/core';
import {TableFactory, TableModelIf, ColumnDefIf} from '@guiexpert/table';
import {TableComponent, TableOptions} from '@guiexpert/angular-table';

@Component({
  selector: 'app-resizable-columns',
  standalone: true,
  imports: [TableComponent],
  template: `
    <ge-table [tableModel]="tableModel" [tableOptions]="tableOptions"></ge-table>
  `
})
export class ResizableColumnsComponent implements OnInit {
  tableModel!: TableModelIf;
  tableOptions: TableOptions = {
    columnResizeHandleWidth: 8,  // Width of the resize handle in pixels
    columnResizable: true        // Enable column resizing
  };

  ngOnInit() {
    const data = [
      {id: 1, name: 'John', age: 30, city: 'New York'},
      {id: 2, name: 'Jane', age: 25, city: 'San Francisco'},
      {id: 3, name: 'Bob', age: 40, city: 'Chicago'},
      {id: 4, name: 'Alice', age: 35, city: 'Boston'}
    ];

    const columnDefs: ColumnDefIf[] = [
      {property: 'id', headerLabel: 'ID', width: 80},
      {property: 'name', headerLabel: 'Name', width: 150},
      {property: 'age', headerLabel: 'Age', width: 80},
      {property: 'city', headerLabel: 'City', width: 150}
    ];

    this.tableModel = TableFactory.createByObjectArray(
      data,
      [['ID', 'Name', 'Age', 'City']],
      [],
      0,
      0,
      false,
      undefined,
      columnDefs
    );
  }
}
```

### Tree Table

```typescript
import {Component, OnInit} from '@angular/core';
import {TableFactory, TableModelIf, ColumnDefIf, TreeFactory, TreeRow} from '@guiexpert/table';
import {TableComponent} from '@guiexpert/angular-table';

interface FileNode {
  name: string;
  type: 'file' | 'folder';
  size?: number;
  children?: FileNode[];
}

@Component({
  selector: 'app-tree-table',
  standalone: true,
  imports: [TableComponent],
  template: `
    <ge-table [tableModel]="tableModel"></ge-table>
  `
})
export class TreeTableComponent implements OnInit {
  tableModel!: TableModelIf;

  ngOnInit() {
    // Define hierarchical data
    const fileSystem: FileNode[] = [
      {
        name: 'Documents',
        type: 'folder',
        children: [
          {name: 'report.pdf', type: 'file', size: 2048},
          {name: 'presentation.pptx', type: 'file', size: 4096},
          {
            name: 'Projects',
            type: 'folder',
            children: [
              {name: 'project1.docx', type: 'file', size: 1024},
              {name: 'project2.docx', type: 'file', size: 2048}
            ]
          }
        ]
      },
      {
        name: 'Pictures',
        type: 'folder',
        children: [
          {name: 'vacation.jpg', type: 'file', size: 3072},
          {name: 'family.jpg', type: 'file', size: 5120}
        ]
      },
      {name: 'notes.txt', type: 'file', size: 512}
    ];

    // Convert hierarchical data to TreeRows
    const treeData: TreeRow<FileNode>[] = TreeFactory.createTreeRows(
      fileSystem,
      (item: FileNode) => item.children || []
    );

    // Define column definitions
    const columnDefs: ColumnDefIf[] = [
      {property: 'name', headerLabel: 'Name', width: 250},
      {property: 'type', headerLabel: 'Type', width: 100},
      {property: 'size', headerLabel: 'Size (KB)', width: 100}
    ];

    // Create the table model
    this.tableModel = TableFactory.createTreeTableModel(
      treeData,
      columnDefs,
      true  // expandedAll
    );
  }
}
```

### Editable Table

```typescript
import {Component, OnInit} from '@angular/core';
import {TableFactory, TableModelIf, ColumnDefIf} from '@guiexpert/table';
import {TableComponent, TableOptions} from '@guiexpert/angular-table';

@Component({
  selector: 'app-editable-table',
  standalone: true,
  imports: [TableComponent],
  template: `
    <ge-table [tableModel]="tableModel" [tableOptions]="tableOptions"></ge-table>
  `
})
export class EditableTableComponent implements OnInit {
  tableModel!: TableModelIf;
  tableOptions: TableOptions = {
    hoverColumnVisible: true,
    editMode: 'cell'  // Enable cell editing
  };

  ngOnInit() {
    const data = [
      {id: 1, name: 'John', age: 30, city: 'New York'},
      {id: 2, name: 'Jane', age: 25, city: 'San Francisco'},
      {id: 3, name: 'Bob', age: 40, city: 'Chicago'},
      {id: 4, name: 'Alice', age: 35, city: 'Boston'}
    ];

    const columnDefs: ColumnDefIf[] = [
      {property: 'id', headerLabel: 'ID', width: 80, editable: () => false},  // ID not editable
      {property: 'name', headerLabel: 'Name', width: 150, editable: () => true},
      {property: 'age', headerLabel: 'Age', width: 80, editable: () => true},
      {property: 'city', headerLabel: 'City', width: 150, editable: () => true}
    ];

    this.tableModel = TableFactory.createByObjectArray(
      data,
      [['ID', 'Name', 'Age', 'City']],
      [],
      0,
      0,
      false,
      undefined,
      columnDefs
    );
  }
}
```

### Multi Selection Area

```typescript
import {Component, OnInit} from '@angular/core';
import {TableFactory, TableModelIf, ColumnDefIf, SelectionModel} from '@guiexpert/table';
import {TableComponent, TableOptions} from '@guiexpert/angular-table';

@Component({
  selector: 'app-selection-example',
  standalone: true,
  imports: [TableComponent],
  template: `
    <ge-table [tableModel]="tableModel" [tableOptions]="tableOptions"></ge-table>
    <div class="selection-info" *ngIf="selectedCells.length">
      <h3>Selected Cells:</h3>
      <ul>
        <li *ngFor="let cell of selectedCells">
          Row: {{cell.rowIndex}}, Column: {{cell.columnIndex}}, Value: {{cell.value}}
        </li>
      </ul>
    </div>
  `
})
export class MultiSelectionComponent implements OnInit {
  tableModel!: TableModelIf;
  tableOptions: TableOptions = {
    selectionMode: 'multi-range'  // Enable multi-range selection
  };
  selectedCells: { rowIndex: number, columnIndex: number, value: any }[] = [];

  ngOnInit() {
    const data = [
      {id: 1, name: 'John', age: 30, city: 'New York'},
      {id: 2, name: 'Jane', age: 25, city: 'San Francisco'},
      {id: 3, name: 'Bob', age: 40, city: 'Chicago'},
      {id: 4, name: 'Alice', age: 35, city: 'Boston'}
    ];

    const columnDefs: ColumnDefIf[] = [
      {property: 'id', headerLabel: 'ID', width: 80},
      {property: 'name', headerLabel: 'Name', width: 150},
      {property: 'age', headerLabel: 'Age', width: 80},
      {property: 'city', headerLabel: 'City', width: 150}
    ];

    // Create the table model with a selection model
    this.tableModel = TableFactory.createByObjectArray(
      data,
      [['ID', 'Name', 'Age', 'City']],
      [],
      0,
      0,
      false,
      undefined,
      columnDefs
    );

    // Create and set a selection model
    const selectionModel = new SelectionModel();

    // Listen for selection changes
    selectionModel.selectionChanged$.subscribe(ranges => {
      this.selectedCells = [];

      // Process each selection range
      ranges.forEach(range => {
        const bodyModel = this.tableModel.getBodyModel();

        // Iterate through the range and collect cell information
        for (let rowIndex = range.r1; rowIndex <= range.r2; rowIndex++) {
          for (let colIndex = range.c1; colIndex <= range.c2; colIndex++) {
            const value = bodyModel.getValueAt(rowIndex, colIndex);
            this.selectedCells.push({
              rowIndex,
              columnIndex: colIndex,
              value
            });
          }
        }
      });
    });

    // Set the selection model on the table model
    (this.tableModel as any).setSelectionModel(selectionModel);
  }
}
```

### Table Filter

```typescript
import {Component, OnInit} from '@angular/core';
import {TableFactory, TableModelIf, ColumnDefIf} from '@guiexpert/table';
import {TableComponent} from '@guiexpert/angular-table';
import {FormControl, ReactiveFormsModule} from '@angular/forms';
import {CommonModule} from '@angular/common';

@Component({
  selector: 'app-table-filter',
  standalone: true,
  imports: [TableComponent, ReactiveFormsModule, CommonModule],
  template: `
    <div class="filter-controls">
      <div>
        <label>Name: </label>
        <input [formControl]="nameFilter" placeholder="Filter by name">
      </div>
      <div>
        <label>Age: </label>
        <select [formControl]="ageFilter">
          <option value="">All</option>
          <option value="young">Young (< 30)</option>
          <option value="adult">Adult (30-40)</option>
          <option value="senior">Senior (> 40)</option>
        </select>
      </div>
      <button (click)="resetFilters()">Reset Filters</button>
    </div>
    <ge-table [tableModel]="tableModel"></ge-table>
  `
})
export class TableFilterComponent implements OnInit {
  tableModel!: TableModelIf;
  nameFilter = new FormControl('');
  ageFilter = new FormControl('');

  ngOnInit() {
    const data = [
      {id: 1, name: 'John', age: 30, city: 'New York'},
      {id: 2, name: 'Jane', age: 25, city: 'San Francisco'},
      {id: 3, name: 'Bob', age: 45, city: 'Chicago'},
      {id: 4, name: 'Alice', age: 35, city: 'Boston'},
      {id: 5, name: 'Charlie', age: 50, city: 'Seattle'},
      {id: 6, name: 'Diana', age: 28, city: 'Miami'}
    ];

    const columnDefs: ColumnDefIf[] = [
      {property: 'id', headerLabel: 'ID', width: 80},
      {property: 'name', headerLabel: 'Name', width: 150},
      {property: 'age', headerLabel: 'Age', width: 80},
      {property: 'city', headerLabel: 'City', width: 150}
    ];

    this.tableModel = TableFactory.createByObjectArray(
      data,
      [['ID', 'Name', 'Age', 'City']],
      [],
      0,
      0,
      false,
      undefined,
      columnDefs
    );

    // Apply filters when they change
    this.nameFilter.valueChanges.subscribe(() => this.applyFilters());
    this.ageFilter.valueChanges.subscribe(() => this.applyFilters());
  }

  applyFilters() {
    const nameValue = this.nameFilter.value?.toLowerCase() || '';
    const ageValue = this.ageFilter.value || '';

    this.tableModel.getBodyModel().externalFilterChanged(row => {
      // Name filter
      const nameMatch = !nameValue || row.name.toLowerCase().includes(nameValue);

      // Age filter
      let ageMatch = true;
      if (ageValue === 'young') {
        ageMatch = row.age < 30;
      } else if (ageValue === 'adult') {
        ageMatch = row.age >= 30 && row.age <= 40;
      } else if (ageValue === 'senior') {
        ageMatch = row.age > 40;
      }

      return nameMatch && ageMatch;
    });
  }

  resetFilters() {
    this.nameFilter.setValue('');
    this.ageFilter.setValue('');
    this.tableModel.getBodyModel().externalFilterChanged(() => true);
  }
}
```

### Look & Feel Demo (Customizable via CSS Variables)

```typescript
import {Component, OnInit} from '@angular/core';
import {TableFactory, TableModelIf, ColumnDefIf} from '@guiexpert/table';
import {TableComponent} from '@guiexpert/angular-table';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';

@Component({
  selector: 'app-look-feel-demo',
  standalone: true,
  imports: [TableComponent, CommonModule, FormsModule],
  template: `
    <div class="theme-controls">
      <div>
        <label>Theme: </label>
        <select [(ngModel)]="selectedTheme" (change)="applyTheme()">
          <option value="default">Default</option>
          <option value="dark">Dark</option>
          <option value="blue">Blue</option>
          <option value="green">Green</option>
        </select>
      </div>
      <div>
        <label>Header Background: </label>
        <input type="color" [(ngModel)]="headerBgColor" (change)="updateCustomColors()">
      </div>
      <div>
        <label>Row Hover Color: </label>
        <input type="color" [(ngModel)]="rowHoverColor" (change)="updateCustomColors()">
      </div>
    </div>
    <ge-table [tableModel]="tableModel" [ngClass]="selectedTheme"></ge-table>
  `,
  styles: [`
    .dark {
      --ge-table-header-bg-color: #333;
      --ge-table-header-color: #fff;
      --ge-table-bg-color: #222;
      --ge-table-color: #eee;
      --ge-table-border-color: #555;
      --ge-table-row-odd-bg-color: #2a2a2a;
      --ge-table-row-even-bg-color: #333;
      --ge-table-row-hover-color: #444;
      --ge-table-selection-bg-color: rgba(65, 105, 225, 0.5);
    }

    .blue {
      --ge-table-header-bg-color: #1a5276;
      --ge-table-header-color: white;
      --ge-table-bg-color: #eef5f9;
      --ge-table-color: #333;
      --ge-table-border-color: #a9cce3;
      --ge-table-row-odd-bg-color: #d4e6f1;
      --ge-table-row-even-bg-color: #eef5f9;
      --ge-table-row-hover-color: #a9cce3;
      --ge-table-selection-bg-color: rgba(52, 152, 219, 0.5);
    }

    .green {
      --ge-table-header-bg-color: #1e8449;
      --ge-table-header-color: white;
      --ge-table-bg-color: #e9f7ef;
      --ge-table-color: #333;
      --ge-table-border-color: #a9dfbf;
      --ge-table-row-odd-bg-color: #d4efdf;
      --ge-table-row-even-bg-color: #e9f7ef;
      --ge-table-row-hover-color: #a9dfbf;
      --ge-table-selection-bg-color: rgba(46, 204, 113, 0.5);
    }

    .theme-controls {
      margin-bottom: 20px;
      display: flex;
      gap: 20px;
    }
  `]
})
export class LookFeelDemoComponent implements OnInit {
  tableModel!: TableModelIf;
  selectedTheme = 'default';
  headerBgColor = '#f0f0f0';
  rowHoverColor = '#e0e0e0';

  ngOnInit() {
    const data = [
      {id: 1, name: 'John', age: 30, city: 'New York'},
      {id: 2, name: 'Jane', age: 25, city: 'San Francisco'},
      {id: 3, name: 'Bob', age: 40, city: 'Chicago'},
      {id: 4, name: 'Alice', age: 35, city: 'Boston'}
    ];

    const columnDefs: ColumnDefIf[] = [
      {property: 'id', headerLabel: 'ID', width: 80},
      {property: 'name', headerLabel: 'Name', width: 150},
      {property: 'age', headerLabel: 'Age', width: 80},
      {property: 'city', headerLabel: 'City', width: 150}
    ];

    this.tableModel = TableFactory.createByObjectArray(
      data,
      [['ID', 'Name', 'Age', 'City']],
      [],
      0,
      0,
      false,
      undefined,
      columnDefs
    );
  }

  applyTheme() {
    if (this.selectedTheme === 'default') {
      this.headerBgColor = '#f0f0f0';
      this.rowHoverColor = '#e0e0e0';
    } else if (this.selectedTheme === 'dark') {
      this.headerBgColor = '#333';
      this.rowHoverColor = '#444';
    } else if (this.selectedTheme === 'blue') {
      this.headerBgColor = '#1a5276';
      this.rowHoverColor = '#a9cce3';
    } else if (this.selectedTheme === 'green') {
      this.headerBgColor = '#1e8449';
      this.rowHoverColor = '#a9dfbf';
    }
  }

  updateCustomColors() {
    document.documentElement.style.setProperty('--ge-table-header-bg-color', this.headerBgColor);
    document.documentElement.style.setProperty('--ge-table-row-hover-color', this.rowHoverColor);
  }
}
```

### Table Events

```typescript
import {Component, OnInit} from '@angular/core';
import {TableFactory, TableModelIf, ColumnDefIf, TableApi} from '@guiexpert/table';
import {TableComponent} from '@guiexpert/angular-table';
import {CommonModule} from '@angular/common';

@Component({
  selector: 'app-table-events',
  standalone: true,
  imports: [TableComponent, CommonModule],
  template: `
    <div class="events-log">
      <h3>Events Log:</h3>
      <button (click)="clearLog()">Clear Log</button>
      <div class="log-container">
        <div *ngFor="let event of eventsLog" class="log-entry">
          <span class="event-type">{{event.type}}</span>
          <span class="event-details">{{event.details}}</span>
        </div>
      </div>
    </div>
    <ge-table 
      [tableModel]="tableModel" 
      (tableReady)="onTableReady($event)"
      (cellClick)="onCellClick($event)"
      (headerClick)="onHeaderClick($event)"
      (selectionChanged)="onSelectionChanged($event)"
    ></ge-table>
  `,
  styles: [`
    .events-log {
      margin-bottom: 20px;
      border: 1px solid #ccc;
      padding: 10px;
    }

    .log-container {
      max-height: 200px;
      overflow-y: auto;
      border: 1px solid #eee;
      padding: 5px;
    }

    .log-entry {
      padding: 5px;
      border-bottom: 1px solid #eee;
    }

    .event-type {
      font-weight: bold;
      margin-right: 10px;
    }
  `]
})
export class TableEventsComponent implements OnInit {
  tableModel!: TableModelIf;
  tableApi?: TableApi;
  eventsLog: { type: string, details: string }[] = [];

  ngOnInit() {
    const data = [
      {id: 1, name: 'John', age: 30, city: 'New York'},
      {id: 2, name: 'Jane', age: 25, city: 'San Francisco'},
      {id: 3, name: 'Bob', age: 40, city: 'Chicago'},
      {id: 4, name: 'Alice', age: 35, city: 'Boston'}
    ];

    const columnDefs: ColumnDefIf[] = [
      {property: 'id', headerLabel: 'ID', width: 80},
      {property: 'name', headerLabel: 'Name', width: 150},
      {property: 'age', headerLabel: 'Age', width: 80},
      {property: 'city', headerLabel: 'City', width: 150}
    ];

    this.tableModel = TableFactory.createByObjectArray(
      data,
      [['ID', 'Name', 'Age', 'City']],
      [],
      0,
      0,
      false,
      undefined,
      columnDefs
    );
  }

  onTableReady(api: TableApi) {
    this.tableApi = api;
    this.logEvent('TableReady', 'Table component initialized');
  }

  onCellClick(event: any) {
    const {rowIndex, columnIndex, areaIdent} = event;
    const value = this.tableModel.getAreaModel(areaIdent).getValueAt(rowIndex, columnIndex);
    this.logEvent('CellClick', `Area: ${areaIdent}, Row: ${rowIndex}, Column: ${columnIndex}, Value: ${value}`);
  }

  onHeaderClick(event: any) {
    const {columnIndex} = event;
    const headerValue = this.tableModel.getAreaModel('header').getValueAt(0, columnIndex);
    this.logEvent('HeaderClick', `Column: ${columnIndex}, Header: ${headerValue}`);
  }

  onSelectionChanged(event: any) {
    const {ranges} = event;
    this.logEvent('SelectionChanged', `Selected ${ranges.length} range(s)`);
  }

  logEvent(type: string, details: string) {
    this.eventsLog.unshift({type, details});
    if (this.eventsLog.length > 50) {
      this.eventsLog.pop();
    }
  }

  clearLog() {
    this.eventsLog = [];
  }
}
```

### Download Excel, Copy to Clipboard

```typescript
import {Component, OnInit} from '@angular/core';
import {TableFactory, TableModelIf, ColumnDefIf, TableApi} from '@guiexpert/table';
import {TableComponent} from '@guiexpert/angular-table';
import {CommonModule} from '@angular/common';

@Component({
  selector: 'app-export-example',
  standalone: true,
  imports: [TableComponent, CommonModule],
  template: `
    <div class="export-controls">
      <button (click)="copyToClipboard()">Copy to Clipboard</button>
      <button (click)="downloadExcel()">Download Excel</button>
    </div>
    <ge-table [tableModel]="tableModel" (tableReady)="onTableReady($event)"></ge-table>
  `
})
export class ExportExampleComponent implements OnInit {
  tableModel!: TableModelIf;
  tableApi?: TableApi;

  ngOnInit() {
    const data = [
      {id: 1, name: 'John', age: 30, city: 'New York', country: 'USA'},
      {id: 2, name: 'Jane', age: 25, city: 'San Francisco', country: 'USA'},
      {id: 3, name: 'Bob', age: 40, city: 'Chicago', country: 'USA'},
      {id: 4, name: 'Alice', age: 35, city: 'Boston', country: 'USA'},
      {id: 5, name: 'Charlie', age: 45, city: 'London', country: 'UK'},
      {id: 6, name: 'Diana', age: 28, city: 'Paris', country: 'France'}
    ];

    const columnDefs: ColumnDefIf[] = [
      {property: 'id', headerLabel: 'ID', width: 80},
      {property: 'name', headerLabel: 'Name', width: 150},
      {property: 'age', headerLabel: 'Age', width: 80},
      {property: 'city', headerLabel: 'City', width: 150},
      {property: 'country', headerLabel: 'Country', width: 120}
    ];

    this.tableModel = TableFactory.createByObjectArray(
      data,
      [['ID', 'Name', 'Age', 'City', 'Country']],
      [],
      0,
      0,
      false,
      undefined,
      columnDefs
    );
  }

  onTableReady(api: TableApi) {
    this.tableApi = api;
  }

  copyToClipboard() {
    if (this.tableApi) {
      this.tableApi.copyToClipboard();
      alert('Table data copied to clipboard!');
    }
  }

  downloadExcel() {
    if (this.tableApi) {
      this.tableApi.exportExcel('table_data.xlsx');
    }
  }
}
```

### In-place Cell Editing

```typescript
import {Component, OnInit} from '@angular/core';
import {TableFactory, TableModelIf, ColumnDefIf} from '@guiexpert/table';
import {TableComponent, TableOptions} from '@guiexpert/angular-table';

@Component({
  selector: 'app-cell-editing',
  standalone: true,
  imports: [TableComponent],
  template: `
    <ge-table [tableModel]="tableModel" [tableOptions]="tableOptions"></ge-table>
  `
})
export class CellEditingComponent implements OnInit {
  tableModel!: TableModelIf;
  tableOptions: TableOptions = {
    hoverColumnVisible: true,
    editMode: 'cell',  // Enable cell editing
    autoFocus: true    // Auto focus on cell when editing starts
  };

  ngOnInit() {
    const data = [
      {id: 1, name: 'John', email: 'john@example.com', age: 30, active: true},
      {id: 2, name: 'Jane', email: 'jane@example.com', age: 25, active: true},
      {id: 3, name: 'Bob', email: 'bob@example.com', age: 40, active: false},
      {id: 4, name: 'Alice', email: 'alice@example.com', age: 35, active: true}
    ];

    // Define custom validators
    const emailValidator = (value: string) => {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return emailRegex.test(value) ? true : 'Invalid email format';
    };

    const ageValidator = (value: number) => {
      return value >= 18 && value <= 100 ? true : 'Age must be between 18 and 100';
    };

    const columnDefs: ColumnDefIf[] = [
      {
        property: 'id',
        headerLabel: 'ID',
        width: 80,
        editable: () => false  // ID not editable
      },
      {
        property: 'name',
        headerLabel: 'Name',
        width: 150,
        editable: () => true
      },
      {
        property: 'email',
        headerLabel: 'Email',
        width: 200,
        editable: () => true,
        validator: emailValidator
      },
      {
        property: 'age',
        headerLabel: 'Age',
        width: 80,
        editable: () => true,
        validator: ageValidator
      },
      {
        property: 'active',
        headerLabel: 'Active',
        width: 100,
        editable: () => true,
        inputType: 'checkbox'  // Use checkbox for boolean values
      }
    ];

    this.tableModel = TableFactory.createByObjectArray(
      data,
      [['ID', 'Name', 'Email', 'Age', 'Active']],
      [],
      1,  // Fix ID column
      0,
      false,
      undefined,
      columnDefs
    );
  }
}
```

### State Persistence (Row Sorting, Column Order, Selection)

```typescript
import {Component, OnInit} from '@angular/core';
import {TableFactory, TableModelIf, ColumnDefIf, TableApi, TableOptions} from '@guiexpert/table';
import {TableComponent} from '@guiexpert/angular-table';

@Component({
  selector: 'app-state-persistence',
  standalone: true,
  imports: [TableComponent],
  template: `
    <div class="state-controls">
      <button (click)="saveState()">Save State</button>
      <button (click)="loadState()">Load State</button>
      <button (click)="resetState()">Reset State</button>
    </div>
    <ge-table 
      [tableModel]="tableModel" 
      [tableOptions]="tableOptions"
      (tableReady)="onTableReady($event)"
    ></ge-table>
  `
})
export class StatePersistenceComponent implements OnInit {
  tableModel!: TableModelIf;
  tableApi?: TableApi;
  tableState?: any;
  tableOptions: TableOptions = {
    columnsDraggable: true,
    columnResizable: true,
    selectionMode: 'multi-range'
  };

  ngOnInit() {
    const data = [
      {id: 1, name: 'John', age: 30, city: 'New York', country: 'USA'},
      {id: 2, name: 'Jane', age: 25, city: 'San Francisco', country: 'USA'},
      {id: 3, name: 'Bob', age: 40, city: 'Chicago', country: 'USA'},
      {id: 4, name: 'Alice', age: 35, city: 'Boston', country: 'USA'},
      {id: 5, name: 'Charlie', age: 45, city: 'London', country: 'UK'},
      {id: 6, name: 'Diana', age: 28, city: 'Paris', country: 'France'}
    ];

    const columnDefs: ColumnDefIf[] = [
      {property: 'id', headerLabel: 'ID', width: 80, sortable: true},
      {property: 'name', headerLabel: 'Name', width: 150, sortable: true},
      {property: 'age', headerLabel: 'Age', width: 80, sortable: true},
      {property: 'city', headerLabel: 'City', width: 150, sortable: true},
      {property: 'country', headerLabel: 'Country', width: 120, sortable: true}
    ];

    this.tableModel = TableFactory.createByObjectArray(
      data,
      [['ID', 'Name', 'Age', 'City', 'Country']],
      [],
      0,
      0,
      false,
      undefined,
      columnDefs
    );

    // Try to load saved state from localStorage
    const savedState = localStorage.getItem('tableState');
    if (savedState) {
      this.tableState = JSON.parse(savedState);
    }
  }

  onTableReady(api: TableApi) {
    this.tableApi = api;

    // Apply saved state if available
    if (this.tableState) {
      this.loadState();
    }
  }

  saveState() {
    if (this.tableApi) {
      // Get current state
      const state = {
        sortedColumns: this.tableApi.getSortItems(),
        columnOrder: this.tableApi.getColumnOrder(),
        columnWidths: this.tableApi.getColumnWidths(),
        selection: this.tableApi.getSelectionRanges()
      };

      // Save to localStorage
      localStorage.setItem('tableState', JSON.stringify(state));
      this.tableState = state;

      alert('Table state saved!');
    }
  }

  loadState() {
    if (this.tableApi && this.tableState) {
      // Apply column order
      if (this.tableState.columnOrder) {
        this.tableApi.setColumnOrder(this.tableState.columnOrder);
      }

      // Apply column widths
      if (this.tableState.columnWidths) {
        this.tableApi.setColumnWidths(this.tableState.columnWidths);
      }

      // Apply sorting
      if (this.tableState.sortedColumns) {
        this.tableApi.setSortItems(this.tableState.sortedColumns);
      }

      // Apply selection
      if (this.tableState.selection) {
        this.tableApi.setSelectionRanges(this.tableState.selection);
      }

      alert('Table state loaded!');
    }
  }

  resetState() {
    if (this.tableApi) {
      // Reset to default state
      this.tableApi.resetColumnOrder();
      this.tableApi.setSortItems([]);
      this.tableApi.clearSelection();

      // Clear saved state
      localStorage.removeItem('tableState');
      this.tableState = undefined;

      alert('Table state reset!');
    }
  }
}
```

### Integration with Dialog and UI Components

The GuiExpert Table can be seamlessly integrated with other UI components and dialogs. Here's an example of using the
table in a dialog with filtering controls:

```typescript
import {Component, OnInit} from '@angular/core';
import {TableFactory, TableModelIf, ColumnDefIf, TableApi} from '@guiexpert/table';
import {TableComponent} from '@guiexpert/angular-table';
import {FormsModule} from '@angular/forms';
import {MatDialogRef} from '@angular/material/dialog';
import {CommonModule} from '@angular/common';
import {MatFormFieldModule, MatInputModule} from '@angular/material/input';
import {MatSliderModule} from '@angular/material/slider';
import {MatButtonModule} from '@angular/material/button';

@Component({
  selector: 'app-directory-browser-dialog',
  standalone: true,
  imports: [
    CommonModule,
    TableComponent,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSliderModule,
    MatButtonModule
  ],
  template: `
    <h2 mat-dialog-title>Browse Directories</h2>

    <mat-dialog-content>
      <div class="table-container">
        <div class="filter-controls">
          <mat-form-field>
            <mat-label>Filter</mat-label>
            <input
              (keyup)="applyFilter()"
              [(ngModel)]="filterText"
              matInput
              placeholder="Filter directories">
          </mat-form-field>

          <div class="depth-slider">
            <mat-label>Depth: {{depth}}</mat-label>
            <mat-slider
              [max]="10"
              [min]="1"
              [step]="1"
              [discrete]="true">
              <input
                (valueChange)="applyFilter()"
                matSliderThumb
                [(ngModel)]="depth">
            </mat-slider>
          </div>
        </div>

        <guiexpert-table
          (mouseClicked)="onRowClicked($event)"
          (tableReady)="onTableReady($event)"
          [tableModel]="tableModel"
          [tableOptions]="tableOptions"
          class="directory-table">
        </guiexpert-table>
      </div>
    </mat-dialog-content>

    <mat-dialog-actions>
      <button (click)="onCancelClick()" mat-button>Cancel</button>
    </mat-dialog-actions>
  `,
  styles: [`
    .table-container {
      height: 400px;
      width: 600px;
    }

    .filter-controls {
      display: flex;
      align-items: center;
      margin-bottom: 16px;
      gap: 16px;
    }

    .directory-table {
      height: 350px;
    }

    mat-form-field {
      flex: 1;
    }

    .depth-slider {
      display: flex;
      align-items: center;
      gap: 8px;
      min-width: 200px;
    }
  `]
})
export class DirectoryBrowserDialogComponent implements OnInit {
  tableModel!: TableModelIf;
  tableApi?: TableApi;
  tableOptions = {
    hoverColumnVisible: true,
    verticalBorderVisible: true,
    headerHeight: 40,
    footerHeight: 0,
    rowHeight: 32
  };

  filterText = '';
  depth = 3;
  directories: any[] = [];

  constructor(
    private dialogRef: MatDialogRef<DirectoryBrowserDialogComponent>
  ) {
  }

  ngOnInit() {
    // Fetch directory data (simplified example)
    this.fetchDirectories();
  }

  fetchDirectories() {
    // In a real app, this would be an API call or service
    this.directories = [
      {path: '/home/user', name: 'user', level: 1},
      {path: '/home/user/documents', name: 'documents', level: 2},
      {path: '/home/user/documents/work', name: 'work', level: 3},
      {path: '/home/user/documents/personal', name: 'personal', level: 3},
      {path: '/home/user/pictures', name: 'pictures', level: 2},
      {path: '/home/user/pictures/vacation', name: 'vacation', level: 3},
      {path: '/home/user/pictures/family', name: 'family', level: 3},
      {path: '/home/user/music', name: 'music', level: 2}
    ];

    this.createTableModel();
  }

  createTableModel() {
    const columnDefs: ColumnDefIf[] = [
      {property: 'name', headerLabel: 'Directory', width: 200},
      {property: 'path', headerLabel: 'Path', width: 400}
    ];

    this.tableModel = TableFactory.createByObjectArray(
      this.directories,
      [['Directory', 'Path']],
      [],
      0,
      0,
      false,
      {
        header: 40,
        body: 32,
        footer: 0
      },
      columnDefs
    );

    // Apply initial filter
    this.applyFilter();
  }

  applyFilter() {
    if (!this.tableModel) return;

    const filterText = this.filterText.toLowerCase();
    const maxDepth = this.depth;

    this.tableModel.getBodyModel().externalFilterChanged(row => {
      // Filter by depth
      if (row.level > maxDepth) {
        return false;
      }

      // Filter by text
      if (filterText) {
        return row.name.toLowerCase().includes(filterText) ||
          row.path.toLowerCase().includes(filterText);
      }

      return true;
    });
  }

  onTableReady(api: TableApi) {
    this.tableApi = api;
  }

  onRowClicked(event: any) {
    if (event.areaIdent === 'body') {
      const directory = this.directories[event.rowIndex];
      this.dialogRef.close(directory);
    }
  }

  onCancelClick() {
    this.dialogRef.close();
  }
}
```

This example demonstrates:

1. Integration with Angular Material dialog
2. Text filtering with real-time updates
3. Depth filtering using a slider control
4. Handling row clicks to select a directory
5. Proper layout and styling for the table within a dialog

## Conclusion

GuiExpert Table is a powerful and flexible table component for Angular 20 applications. It provides a wide range of
features and customization options to meet various requirements.

Key advantages:

- High performance with virtualized scrolling
- Flexible data models (arrays, objects, trees)
- Rich feature set (sorting, filtering, editing, etc.)
- Customizable appearance via CSS variables
- Comprehensive API for programmatic control
- Seamless integration with Angular Material and other UI components
- Support for both `<ge-table>` and `<guiexpert-table>` selectors

For more examples and detailed documentation, visit
the [GuiExpert Table GitHub repository](https://github.com/guiexperttable/ge-table).
