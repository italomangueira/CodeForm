import { Component, computed, inject } from '@angular/core';
import { FormService } from '../../services/form.service';
import { FieldTypesService } from '../../services/field-types.service';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSelectModule } from '@angular/material/select';
import { DynamicOptionsComponent } from './dynamic-options/dynamic-options.component';
import { OptionItem } from '../../models/field';

@Component({
  selector: 'app-field-settings',
  imports: [
    MatFormFieldModule,
    MatInput,
    FormsModule,
    MatCheckboxModule,
    MatSelectModule,
    DynamicOptionsComponent,
  ],
  template: `
    <div
      class="p-4 bg-white rounded-lg h-[calc(100vh-150px)] overflow-y-auto border-gray-200 shadow-sm"
    >
      @if (formService.selectedField(); as selectedFieldId) {
      <h3 class="text-xl text-primary font-medium mb-6">Field Properties</h3>
      <div class=" flex flex-col gap-6">
        @for(settings of fieldSettings(); track settings.key){ @switch
        (settings.type) { @case('text'){
        <mat-form-field appearance="outline" class=" w-full">
          <mat-label>{{ settings.label }}</mat-label>
          <input
            matInput
            [ngModel]="fieldValues()[settings.key]"
            (ngModelChange)="
              updateField(selectedFieldId.id, settings.key, $event)
            "
          />
        </mat-form-field>
        } @case('checkbox'){
        <div class="flex  items-center">
          <mat-checkbox
            [ngModel]="fieldValues()[settings.key]"
            (ngModelChange)="
              updateField(selectedFieldId.id, settings.key, $event)
            "
          >
            {{ settings.label }}
          </mat-checkbox>
        </div>
        } @case('select'){
        <mat-form-field appearance="outline" class=" w-full">
          <mat-label>{{ settings.label }}</mat-label>
          <mat-select
            [ngModel]="fieldValues()[settings.key]"
            (ngModelChange)="
              updateField(selectedFieldId.id, settings.key, $event)
            "
          >
            @for(option of settings.options || []; track option.value) {
            <mat-option [value]="option.value">
              {{ option.label }}
            </mat-option>
            }
          </mat-select>
        </mat-form-field>
        } @case('dynamic-options') {
        <app-dynamic-options
          [title]="settings.label"
          [options]="fieldValues()[settings.key]"
          (optionsChange)="
            updateField(selectedFieldId.id, settings.key, $event)
          "
        />
        } } }
      </div>
      }
    </div>
  `,
  styles: ``,
})
export class FieldSettingsComponent {
  formService = inject(FormService);
  fieldTypesService = inject(FieldTypesService);

  fieldSettings = computed(() => {
    const field = this.formService.selectedField();
    if (!field) return [];

    const fieldType = this.fieldTypesService.getFieldType(field.type);
    return fieldType?.settingsConfig || [];
  });

  fieldValues = computed(() => {
    const field = this.formService.selectedField();
    if (!field) return {};
    return field as any;
  });

  updateField(fieldId: string, key: string, value: any) {
    this.formService.updateField(fieldId, { [key]: value });
    console.log('fieldValues', this.fieldValues());
  }
}
