import { Component, input, output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { OptionItem } from '../../../models/field';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-dynamic-options',
  imports: [
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
  ],
  template: `
    <div>
      <div class="flex justify-between items-center ">
        <h3 class=" font-medium text-primary">{{ title() }}</h3>
        <button mat-icon-button (click)="addOption()">
          <mat-icon>add_circle</mat-icon>
        </button>
      </div>
      <div class=" flex flex-col gap-2 mt-2 mb-4">
        @for(option of options(); track option.value; let i = $index) {
        <div class=" flex items-center">
          <mat-form-field appearance="outline" class=" flex-1 compact">
            <input
              matInput
              [ngModel]="option.label"
              (ngModelChange)="updateOption(i, $event)"
            />
          </mat-form-field>
          <button mat-icon-button (click)="removeOption(i)">
            <mat-icon>delete</mat-icon>
          </button>
        </div>
        }
      </div>
    </div>
  `,
  styles: `
  @use "@angular/material" as mat;

  mat-form-field {
  @include mat.theme(
    (
      density: -5,
    )
  );
}
  `,
})
export class DynamicOptionsComponent {
  title = input('');
  options = input.required<OptionItem[]>();
  optionsChange = output<OptionItem[]>();

  addOption() {
    const currentOptions = this.options();
    const newOption = [...currentOptions];
    newOption.push({
      label: `Option ${newOption.length + 1}`,
      value: `option-${newOption.length + 1}`,
    });
    this.optionsChange.emit(newOption);
  }

  removeOption(index: number) {
    const currentOptions = this.options();
    const newOption = [...currentOptions];
    newOption.splice(index, 1);
    this.optionsChange.emit(newOption);
  }

  updateOption(index: number, newLabel: string) {
    const newOptions = this.options().map((option, i) =>
      i === index ? { ...option, label: newLabel } : option
    );
    this.optionsChange.emit(newOptions);
  }
}
