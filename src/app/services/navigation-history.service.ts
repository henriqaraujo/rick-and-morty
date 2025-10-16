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
  // Chave usada para armazenar os dados no localStorage.
  private readonly STORAGE_KEY = 'navigation_history';

  // Signal reativo que guarda o histórico de navegação.
  // Ele é atualizado automaticamente sempre que a navegação muda.
  private _history = signal<NavigationRecord[]>([]);

  constructor(private router: Router) {
    //Carrega o histórico armazenado anteriormente no localStorage.
    this.loadFromStorage();

    // Log no console para confirmar que o serviço foi inicializado.
    console.debug('[NavHistory] Service instanciado. Histórico atual:', this._history());

    // Escuta os eventos de navegação do Angular Router.
    // O filter() garante que só ouviremos o fim de cada navegação (NavigationEnd).
    this.router.events
      .pipe(filter(e => e instanceof NavigationEnd))
      .subscribe((e) => {
        const ev = e as NavigationEnd;

        // Loga no console cada mudança de rota (para debug).
        console.debug('[NavHistory] NavigationEnd ->', ev.urlAfterRedirects);

        // Adiciona a nova navegação ao histórico.
        this.addRecord(ev.urlAfterRedirects);
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

      // Cria um novo array com o registro adicionado (imutabilidade).
      const updated = [...this._history(), record];

      // Atualiza o signal com o novo histórico.
      this._history.set(updated);

      // Persiste o histórico atualizado no localStorage.
      this.saveToStorage();

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
          const parsed = JSON.parse(raw) as NavigationRecord[];
          this._history.set(parsed);
        }
      }
    } catch (err) {
      console.warn('[NavHistory] Falha ao carregar do localStorage', err);
    }
  }
}
