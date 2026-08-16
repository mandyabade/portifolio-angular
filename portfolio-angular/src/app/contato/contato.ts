import { Component, inject } from '@angular/core';
import {ReactiveFormsModule, FormBuilder, Validators} from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { ContatoService } from '../contato.service';

@Component({
  selector: 'app-contato',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './contato.html',
  styleUrl: './contato.css',
})
export class Contato {

  private fb = inject(FormBuilder);
  private service = inject(ContatoService);

  enviando = false;
  sucesso = '';
  erro = '';

  form = this.fb.nonNullable.group({
    nome: ['', [Validators.required, Validators.minLength(3)]],
    email: ['', [Validators.required, Validators.email]],
    mensagem: ['', [Validators.required, Validators.minLength(10)]],
  });

  onSubmit() {
    this.sucesso = '';
    this.erro = '';

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      const primeiroInvalido = document.querySelector(
        'input.ng-invalid, textarea.ng-invalid'
      ) as HTMLElement | null;
       primeiroInvalido?.focus();

      return;
    }

    this.enviando = true;

    this.service.enviar(this.form.getRawValue()).subscribe({
      next: (resp) => {
        this.sucesso = resp.mensagem;
        this.form.reset();
        this.enviando = false;
      },
      error: (err: HttpErrorResponse) => {

        const errosBack = err.error?.erros;

        if (Array.isArray(errosBack)) {
          this.erro = errosBack.join(' ');
        } else {
          this.erro = 'Não foi possível enviar, tente de novo.';
        }
        this.enviando = false;
      },
    });
  }
}