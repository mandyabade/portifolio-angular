import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';

interface RespostaLogin {
  sucesso: boolean;
  mensagem?: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private http = inject(HttpClient);

  private url = 'https://jubilant-adventure-5g69x95p4gpwcvvgr-8000.app.github.dev/api';

  login(usuario: string, senha: string): Observable<RespostaLogin> {

    return this.http.post<RespostaLogin>(
      `${this.url}/login.php`,
      {
        usuario,
        senha
      },
      {
        withCredentials: true
      }
    ).pipe(

      tap((resposta) => {

        if (resposta.sucesso) {
          localStorage.setItem('logado', 'true');
        }

      })

    );
  }

  logout(): void {

    this.http.post(
      `${this.url}/logout.php`,
      {},
      {
        withCredentials: true
      }
    ).subscribe();

    localStorage.removeItem('logado');
  }

  estaLogado(): boolean {

    return localStorage.getItem('logado') === 'true';

  }
}