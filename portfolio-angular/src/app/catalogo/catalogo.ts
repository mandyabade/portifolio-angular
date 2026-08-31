import { Component, inject, OnInit, ChangeDetectorRef } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { TecnologiaService, Tecnologia } from '../tecnologia.service';

@Component({
  selector: 'app-catalogo',
  standalone: true,
  imports: [MatCardModule],
  templateUrl: './catalogo.html',
  styleUrl: './catalogo.css'
})
export class Catalogo implements OnInit {

  private service = inject(TecnologiaService);
  private cdr = inject(ChangeDetectorRef);

  tecnologias: Tecnologia[] = [];
  erro = '';

  ngOnInit() {
    this.carregar();
  }

  carregar() {
    this.service.listar().subscribe({
      next: (lista) => {
        this.tecnologias = [...lista];
        this.cdr.detectChanges();
      },

      error: (err) => {
        console.error(err);
        this.erro = 'Falha ao carregar o catálogo.';
        this.cdr.detectChanges();
      }
    });
  }
}