import { CdkDragDrop, DragDropModule } from '@angular/cdk/drag-drop';
import { Component, inject } from '@angular/core';
import { FormService } from '../../../services/form.service';
import { FieldTypeDefinition, FormField } from '../../../models/field';
import { FormFieldComponent } from '../form-field/form-field.component';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-form-editor',
  imports: [
    DragDropModule,
    FormFieldComponent,
    MatIconModule,
    MatButtonModule,
    DragDropModule,
  ],
  template: `
    <div class=" p-4">
      @for(row of formService.rows(); track row.id){
      <div
        cdkDropList
        [cdkDropListData]="row.id"
        (cdkDropListDropped)="onDropInRow($event, row.id)"
        [cdkDropListOrientation]="'mixed'"
        [style.view-transition-name]="'row' + row.id"
        class=" relative p-5 pt-2 ps-10 mb-4 rounded-lg border-2 border-dashed border-gray-200"
      >
        <div class="flex justify-between items-center">
          <span class=" text-primary">Row</span>
          <button mat-icon-button (click)="formService.deleteRow(row.id)">
            <mat-icon>close</mat-icon>
          </button>
        </div>
        <div class=" flex gap-4 flex-wrap">
          @for(field of row.fields; track field.id) {
          <app-form-field
            cdkDrag
            [cdkDragData]="field"
            class="flex-1"
            [field]="field"
            [style.view-transition-name]="'field-' + field.id"
            [style.view-transition-class]="'field-transition'"
          />
          } @empty {
          <div
            class="w-full bg-background p-4 border border-dashed border-primary rounded-lg"
          >
            drag and drop form elemnts here
          </div>
          }
        </div>
        <div
          class=" absolute left-0 flex gap-0 flex-col top-1/2 -translate-y-1/2"
        >
          <button
            mat-icon-button
            [disabled]="$first"
            (click)="formService.moveRowUp(row.id)"
          >
            <mat-icon>keyboard_arrow_up</mat-icon>
          </button>
          <button
            mat-icon-button
            [disabled]="$last"
            (click)="formService.moveRowDown(row.id)"
          >
            <mat-icon>keyboard_arrow_down</mat-icon>
          </button>
        </div>
      </div>
      }
    </div>
  `,
  styles: ``,
})
export class FormEditorComponent {
  formService = inject(FormService);

  onDropInRow(event: CdkDragDrop<string>, rowId: string) {
    if (event.previousContainer.data === 'field-selector') {
      const fieldType = event.item.data as FieldTypeDefinition;
      const newfield: FormField = {
        id: crypto.randomUUID(),
        type: fieldType.type,
        ...fieldType.defaultConfig,
      };
      this.formService.addField(newfield, rowId, event.currentIndex);
      return;
    }
    const dragData = event.item.data as FormField;
    const previusRowId = event.previousContainer.data as string;

    this.formService.moveField(
      dragData.id,
      previusRowId,
      rowId,
      event.currentIndex
    );
  }
}
