import { Component, inject } from '@angular/core';
import {FormControl,FormGroup,ReactiveFormsModule,Validators} from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, MatCardModule, MatFormFieldModule, MatInputModule, MatButtonModule],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class Login {

  private auth = inject(AuthService);
  private router = inject(Router);

  erro = '';
  entrando = false;

  form = new FormGroup({

    usuario: new FormControl('', [
      Validators.required
    ]),

    senha: new FormControl('', [
      Validators.required
    ])

  });

  entrar(): void {

    if (this.form.invalid) {

      this.form.markAllAsTouched();

      return;
    }

    this.entrando = true;
    this.erro = '';

    const usuario = this.form.controls.usuario.value ?? '';
    const senha = this.form.controls.senha.value ?? '';

    this.auth.login(usuario, senha).subscribe({

      next: (resposta) => {

        if (resposta.sucesso) {

          this.router.navigate(['/gestao']);

        } else {

          this.erro =
            resposta.mensagem ??
            'Usuário ou senha incorretos.';

        }

        this.entrando = false;
      },

      error: (erro) => {

        console.error('Erro no login:', erro);

        this.erro =
          erro.error?.mensagem ??
          'Não foi possível realizar o login.';

        this.entrando = false;
      }

    });
  }
}