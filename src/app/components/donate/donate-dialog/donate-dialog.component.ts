import { Component, inject } from '@angular/core';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-donate-dialog',
  imports: [MatSnackBarModule],
  template: `
    <div class="p-6 bg-white rounded-2xl shadow-xl text-center">
      <h2 class="text-2xl font-bold text-gray-800 mb-2">
        🎉 Obrigado pelo apoio!
      </h2>
      <p class="text-sm text-gray-600 mb-4">
        Escaneie o QR Code abaixo para doar qualquer valor via Pix.
      </p>

      <div class="flex justify-center mb-4">
        <img
          src="https://github.com/italomangueira/CodeForm/blob/master/public/qrCode.jpg?raw=true"
          alt="QR Code Pix"
          class="w-52 h-52 rounded"
        />
      </div>

      <p class="text-gray-700 font-medium">Chave Pix:</p>
      <p class="text-sm bg-gray-100 text-gray-800 p-2 rounded mt-1 select-all">
        {{ chavePix }}
      </p>

      <button
        class="mt-3 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
        (click)="openSnackBar('Chave PIX copiada!', 'X')"
      >
        Copiar chave Pix
      </button>
    </div>
  `,
  styles: ``,
})
export class DonateDialogComponent {
  private _snackBar = inject(MatSnackBar);
  chavePix: string = '791f5649-04ec-478f-87f8-fc815433afd4';

  openSnackBar(message: string, action: string) {
    navigator.clipboard.writeText(this.chavePix).then(() => {
      this._snackBar.open(message, action);
    });
  }
}
