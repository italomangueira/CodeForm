import { Component, computed, inject, input } from '@angular/core';
import { NgComponentOutlet } from '@angular/common';
import { FieldTypesService } from '../../../services/field-types.service';
import { FormField } from '../../../models/field';

@Component({
  selector: 'app-field-preview',
  imports: [NgComponentOutlet],
  template: `
    <ng-container
      [ngComponentOutlet]="previewComponent()"
      [ngComponentOutletInputs]="{ field: field() }"
    ></ng-container>
  `,
  styles: ``,
})
export class FieldPreviewComponent {
  field = input.required<FormField>();
  fieldTypeService = inject(FieldTypesService);

  previewComponent = computed(() => {
    const type = this.fieldTypeService.getFieldType(this.field().type);
    return type?.component ?? null;
  });
}
