import {Component, inject, OnInit, ChangeDetectorRef} from '@angular/core';
import { FormGroup, FormControl, Validators, ReactiveFormsModule} from '@angular/forms';
import { ProjetoService, Projeto } from '../projeto.service';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';

@Component({
  selector: 'app-gestao',
  imports: [ReactiveFormsModule, MatCardModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatSelectModule],
  templateUrl: './gestao.html',
  styleUrl: './gestao.css'
})

export class Gestao implements OnInit {
  private service = inject(ProjetoService);
  private cdr = inject(ChangeDetectorRef);
  private auth = inject(AuthService);
  private router = inject(Router);

  projetos: Projeto[] = [];
  erro = '';
  editandoId: number | null = null;
  salvando = false;

  form = new FormGroup({
    nome: new FormControl('', [Validators.required, Validators.minLength(3)]),
    descricao: new FormControl(''),
    tecnologias: new FormControl(''),
    link_github: new FormControl(''),
    ano: new FormControl(2026, [Validators.required]),
    status: new FormControl<'rascunho' | 'publicado'>(
      'rascunho', [Validators.required])
  });

  ngOnInit() {
    this.carregar();
  }

  carregar() {
    this.service.listar(true).subscribe({
      next: (lista) => {
        this.projetos = [...lista];
        this.cdr.detectChanges();
      },
      error: (erro) => {
        console.error('Erro ao carregar projetos:', erro);
        this.erro = 'Não foi possível carregar os projetos.';
        this.cdr.detectChanges();
      }
    });
  }

  editar(p: Projeto) {
    this.editandoId = p.id ?? null;
    this.form.patchValue({
      nome: p.nome,
      descricao: p.descricao,
      tecnologias: p.tecnologias,
      link_github: p.link_github,
      ano: p.ano,
      status: p.status === 'publicado'
        ? 'publicado'
        : 'rascunho'
    });
  }

  salvar() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.salvando = true;
    this.erro = '';
    const dados = this.form.value as Projeto;
    const requisicao = this.editandoId
      ? this.service.atualizar(this.editandoId, dados)
      : this.service.criar(dados);
    
    requisicao.subscribe({
      next: () => {
        this.salvando = false;
        this.editandoId = null;
        this.form.reset({
          nome: '',
          descricao: '',
          tecnologias: '',
          link_github: '',
          ano: 2026,
          status: 'rascunho'
        });
        this.carregar();
      },

      error: (erro) => {
        console.error('Erro ao salvar projeto:', erro);
        this.salvando = false;
        this.erro = 'Não foi possível salvar. Tente de novo.';
      }
    });
  }

  excluir(p: Projeto) {
    if (!p.id) {
      return;
    }
    if (
      !confirm(
        `Excluir o projeto "${p.nome}"? Esta ação não pode ser desfeita.`
      )
    ) {
      return;
    }

    this.service.excluir(p.id).subscribe({
      next: () => {
        this.projetos = this.projetos.filter(
          (x) => x.id !== p.id
        );
        this.cdr.detectChanges();
      },

      error: (erro) => {
        console.error('Erro ao excluir projeto:', erro);
        this.erro = 'Não foi possível excluir. Tente de novo.';
        this.cdr.detectChanges();
      }
    });
  }

  sair(): void {

    this.auth.logout();

    this.router.navigate(['/login']);

  }
}