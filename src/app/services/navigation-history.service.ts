import { Injectable, signal } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';

/*
 Estrutura de dados de um registro de navegação.
 Armazena a URL acessada e o horário em que foi visitada.
 */
export interface NavigationRecord {
  url: string;
  timestamp: string;
}

@Injectable({
  providedIn: 'root' // Torna o serviço global (singleton) em toda a aplicação.
})

export class NavigationHistoryService {

  private readonly STORAGE_KEY = 'navigation_history'; // Chave usada para armazenar os dados no localStorage.

  // Signal reativo que guarda o histórico de navegação.
  // Ele é atualizado automaticamente sempre que a navegação muda.
  private _history = signal<NavigationRecord[]>([]);

  constructor(private router: Router) {

    this.loadFromStorage(); //Carrega o histórico armazenado anteriormente no localStorage.

    // Log no console para confirmar que o serviço foi inicializado.
    console.debug('[NavHistory] Service instanciado. Histórico atual:', this._history());


    this.router.events // Escuta os eventos de navegação do Angular Router.
      .pipe(filter(e => e instanceof NavigationEnd))   // O filter() garante que só ouviremos o fim de cada navegação (NavigationEnd).
      .subscribe((e) => { // Quando o evento ocorre, o código é executado, pegando a URL final(urlAfterRedirects)
        const ev = e as NavigationEnd;

        console.debug('[NavHistory] NavigationEnd ->', ev.urlAfterRedirects); // Log no console para cada mudança de rota (para debug).

        this.addRecord(ev.urlAfterRedirects); // Adiciona a nova navegação ao histórico.
      });
  }

  // Retorna o signal de histórico como somente leitura.
  // Outros componentes podem observar mudanças, mas não alterar diretamente.
  get history() { return this._history.asReadonly(); }


  // Adiciona um novo registro de navegação ao histórico e salva no localStorage.
  // param url - URL acessada
  private addRecord(url: string) {
    try {
      const record: NavigationRecord = {
        url,
        timestamp: new Date().toISOString() // registra o horário exato do acesso
      };

      const updated = [...this._history(), record]; // Cria um novo array com o registro adicionado (imutabilidade).

      this._history.set(updated); // Atualiza o signal com o novo histórico.

      this.saveToStorage(); // Salva o histórico no navegador.

      console.debug('[NavHistory] Adicionado registro:', record);
    } catch (err) {
      console.error('[NavHistory] Erro ao adicionar registro', err);
    }
  }


  // Salva o histórico atual no localStorage.
  // É chamado automaticamente toda vez que o histórico é alterado.
  private saveToStorage() {
    try {
      if (typeof localStorage !== 'undefined') {
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this._history()));
      }
    } catch (err) {
      console.warn('[NavHistory] Falha ao salvar no localStorage', err);
    }
  }


  //Carrega o histórico do localStorage (caso exista) e atualiza o signal `_history` com os dados encontrados.
  private loadFromStorage() {
    try {
      if (typeof localStorage !== 'undefined') {
        const raw = localStorage.getItem(this.STORAGE_KEY);
        if (raw) {
          const parsed = JSON.parse(raw) as NavigationRecord[]; // Converte a string JSON em objeto JavaScript usando JSON.parse e trate isso como um array de NavigationRecord
          this._history.set(parsed);
        }
      }
    } catch (err) {
      console.warn('[NavHistory] Falha ao carregar do localStorage', err);
    }
  }
}
