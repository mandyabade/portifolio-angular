import { Component, inject, OnInit, ChangeDetectorRef } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { ProjetoService, Projeto } from '../projeto.service';

@Component({
  selector: 'app-projetos',
  imports: [MatCardModule, MatButtonModule],
  templateUrl: './projetos.html',
  styleUrl: './projetos.css'
})
export class Projetos implements OnInit {

  private service = inject(ProjetoService);
  private cdr = inject(ChangeDetectorRef);

  projetos: Projeto[] = [];
  erro = '';

  ngOnInit() {
    this.carregar();
  }

  carregar() {
    this.service.listar().subscribe({
      next: (lista) => {
        this.projetos = [...lista];

        this.cdr.detectChanges();
      },

      error: (err) => {
        console.error(err);

        this.erro = 'Falha ao carregar os projetos.';

        this.cdr.detectChanges();
      }
    });
  }
}