import {
  ApplicationRef,
  computed,
  inject,
  Injectable,
  signal,
} from '@angular/core';
import { FormRow } from '../models/form';
import { FormField } from '../models/field';
import { FieldTypesService } from './field-types.service';
import { startViewTransition } from '../utils/view-transition';

@Injectable({
  providedIn: 'root',
})
export class FormService {
  private _rows = signal<FormRow[]>([]);
  private _selecteFieldId = signal<string | null>(null);
  private fieldTypeService = inject(FieldTypesService);
  private appRef = inject(ApplicationRef);

  public readonly selectedField = computed(() =>
    this._rows()
      .flatMap((row) => row.fields)
      .find((field) => field.id === this._selecteFieldId())
  );

  public readonly rows = this._rows.asReadonly();

  constructor() {
    // Initialize with an empty row
    this._rows.set([{ id: crypto.randomUUID(), fields: [] }]);
  }

  addField(field: FormField, rowId: string, index?: number) {
    const rows = this._rows();
    const newRows = rows.map((row) => {
      if (row.id === rowId) {
        const updatedFields = [...row.fields];
        if (index !== undefined) {
          updatedFields.splice(index, 0, field);
        } else {
          updatedFields.push(field);
        }

        return { ...row, fields: updatedFields };
      }
      return row;
    });

    startViewTransition(() => {
      this._rows.set(newRows);
    });
  }
  deleteField(fieldId: string) {
    const rows = this._rows();
    const newRows = rows.map((row) => ({
      ...row,
      fields: row.fields.filter((f) => f.id !== fieldId),
    }));

    startViewTransition(() => {
      this._rows.set(newRows);
      this.appRef.tick();
    });
  }

  addRow() {
    const newRow: FormRow = {
      id: crypto.randomUUID(),
      fields: [],
    };

    const rows = this._rows();
    startViewTransition(() => {
      this._rows.set([...rows, newRow]);
    });
  }

  deleteRow(rowId: string) {
    if (this._rows().length <= 1) {
      console.warn('Cannot delete the last row');
      return;
    }

    const rows = this._rows();
    const newRows = rows.filter((row) => row.id !== rowId);
    startViewTransition(() => {
      this._rows.set(newRows);
    });
  }

  moveField(
    fieldId: string,
    sourceRowId: string,
    targetRowId: string,
    targetIndex: number = -1
  ) {
    startViewTransition(() => {
      const rows = this._rows();
      let fieldToMove: FormField | undefined;
      let sourceRowIndex = -1;
      let sourcefieldIndex = -1;

      rows.forEach((row, rowIndex) => {
        if (row.id === sourceRowId) {
          sourceRowIndex = rowIndex;
          sourcefieldIndex = row.fields.findIndex((f) => f.id === fieldId);
          if (sourcefieldIndex >= 0) {
            fieldToMove = row.fields[sourcefieldIndex];
          }
        }
      });
      if (!fieldToMove) return;

      const newRows = [...rows];
      const fieldsWhithRemoveField = newRows[sourceRowIndex].fields.filter(
        (f) => f.id !== fieldId
      );
      newRows[sourceRowIndex].fields = fieldsWhithRemoveField;

      const targetRowIndex = newRows.findIndex((row) => row.id === targetRowId);
      if (targetRowIndex >= 0) {
        const targetFields = [...newRows[targetRowIndex].fields];
        targetFields.splice(targetIndex, 0, fieldToMove);
        newRows[targetRowIndex].fields = targetFields;
      }

      this._rows.set(newRows);
      this.appRef.tick();
    });
  }

  setSelectedField(fieldId: string) {
    this._selecteFieldId.set(fieldId);
  }

  updateField(fieldId: string, data: Partial<FormField>) {
    const rows = this._rows();
    const newRows = rows.map((row) => ({
      ...row,
      fields: row.fields.map((field) =>
        field.id === fieldId ? { ...field, ...data } : field
      ),
    }));
    this._rows.set(newRows);
    console.log('Atualizou rows:', JSON.stringify(newRows));
  }

  moveRowUp(rowId: string) {
    const rows = this._rows();
    const index = rows.findIndex((row) => row.id === rowId);
    if (index > 0) {
      const newRows = [...rows];
      const temp = newRows[index - 1];
      newRows[index - 1] = newRows[index];
      newRows[index] = temp;
      startViewTransition(() => {
        this._rows.set(newRows);
      });
    }
  }

  moveRowDown(rowId: string) {
    const rows = this._rows();
    const index = rows.findIndex((row) => row.id === rowId);
    if (index < rows.length - 1) {
      const newRows = [...rows];
      const temp = newRows[index + 1];
      newRows[index + 1] = newRows[index];
      newRows[index] = temp;
      startViewTransition(() => {
        this._rows.set(newRows);
      });
    }
  }

  // Export Form Functionality
  exportForm() {
    const formCode = this.generateFormCode();
    const blob = new Blob([formCode], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'form.ts';
    link.click();
    window.URL.revokeObjectURL(url);
  }

  generateFormCode(): string {
    let code = this.generateImports();
    code += this.generateComponentDecorator();
    code += `   template: \`\n`;
    code += `     <form class=" flex flex-col gap-4">\n`;

    for (const row of this._rows()) {
      if (row.fields.length > 0) {
        code += `       <div class="flex flex-wrap gap-4">\n`;
        for (const field of row.fields) {
          code += `       <div class="flex-1">\n`;
          code += this.generateFieldCode(field);
          code += `       </div>\n`;
        }
        code += `       </div>\n`;
      }
    }
    code += `    </form>\n`;
    code += `\`\n`;
    code += `})\n`;
    code += `export class GeneratedFormComponent {\n`;
    code += `}\n`;

    return code;
  }

  generateFieldCode(field: FormField) {
    const fieldDef = this.fieldTypeService.getFieldType(field.type);
    return fieldDef?.generateCode(field) || '';
  }

  generateImports(): string {
    return (
      `import { Component } from '@angular/core';\n` +
      `import { CommonModule } from '@angular/common';\n` +
      `import { FormsModule } from '@angular/forms';\n` +
      `import { MatFormFieldModule } from '@angular/material/form-field';\n` +
      `import { MatInputModule } from '@angular/material/input';\n` +
      `import { MatButtonModule } from '@angular/material/button';\n` +
      `import { MatCheckboxModule } from '@angular/material/checkbox';\n` +
      `import { MatSelectModule } from '@angular/material/select';\n` +
      `import { MatRadioModule } from '@angular/material/radio';\n` +
      `import { MatDatepickerModule } from '@angular/material/datepicker';\n` +
      `import { MatNativeDateModule } from '@angular/material/core';\n`
    );
  }

  generateComponentDecorator(): string {
    return (
      `@Component({\n` +
      `selector: 'app-generated-form',\n` +
      `standalone: true,\n` +
      `imports: [\n` +
      `   CommonModule,\n` +
      `   FormsModule,\n` +
      `   MatFormFieldModule,\n` +
      `   MatInputModule,\n` +
      `   MatSelectModule,\n` +
      `   MatCheckboxModule,\n` +
      `   MatRadioModule,\n` +
      `   MatDatepickerModule,\n` +
      `   MatNativeDateModule,\n` +
      `   MatButtonModule,\n` +
      `  ],\n`
    );
  }
}
