import {Component} from '@angular/core';
import {LivroService} from "../../service/livro.service";
import {catchError, filter, map, switchMap, tap } from 'rxjs/operators';
import {Item, LivrosResultado} from 'src/app/models/interfaces';
import {LivroVolumeInfo} from "../../models/livroVolumeInfo";
import {FormControl} from "@angular/forms";
import {debounceTime, of, throwError} from "rxjs";

const PAUSA = 300;
@Component({
  selector: 'app-lista-livros',
  templateUrl: './lista-livros.component.html',
  styleUrls: ['./lista-livros.component.css']
})
export class ListaLivrosComponent {

  campoBusca = new FormControl();
  mensagemError = '';
  livrosResultado: LivrosResultado;
  constructor(private service: LivroService) { }

  /*totalDeLivros$ = this.campoBusca.valueChanges.pipe(
    debounceTime(PAUSA),
    filter((valorDigitado) => valorDigitado.length > 3),
    tap( () => console.log('Fluxo inicial')),
    switchMap((valorDigitado) => this.service.buscar(valorDigitado)),
    map(resultado => this.livrosResultado = resultado),
    catchError(erro => {
      console.log(erro)
      return of()
    })
  )*/

  livrosEncontrados$ = this.campoBusca.valueChanges.pipe(
    debounceTime(PAUSA),
    filter((valorDigitado) => valorDigitado.length > 3),
    switchMap((valorDigitado) => this.service.buscar(valorDigitado)),
    map(resultado => this.livrosResultado = resultado),
    map(resultado => resultado.items ?? []),
    map(items => this.livrosResultadosParaLivros(items)),
    catchError(erro => {
      console.log(erro)
      return throwError(() => new Error(this.mensagemError = 'Ops. Algo deu errado'))
    })
  )

  livrosResultadosParaLivros(items: Item[]): LivroVolumeInfo[]{
    return items.map(item => {
      return new LivroVolumeInfo(item)
    });
  }

}



