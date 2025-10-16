import { Injectable, signal } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';

export interface NavigationRecord {
  url: string;
  timestamp: string;
}

@Injectable({
  providedIn: 'root',
})
export class NavigationHistoryService {
  private readonly STORAGE_KEY = 'navigation_history';
  private _history = signal<NavigationRecord[]>([]);

  constructor(private router: Router) {
    this.loadFromStorage();

    // Escuta mudanças de rota
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe((event) => {
        const nav = event as NavigationEnd;
        this.addRecord(nav.urlAfterRedirects);
      });
  }

  // Getter do histórico
  get history() {
    return this._history.asReadonly();
  }

  // Adiciona um registro
  private addRecord(url: string) {
    const newRecord: NavigationRecord = {
      url,
      timestamp: new Date().toISOString(),
    };

    const updated = [...this._history(), newRecord];
    this._history.set(updated);
    this.saveToStorage();
  }

  // Persiste no localStorage
  private saveToStorage() {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this._history()));
  }

  // Carrega do localStorage ao iniciar
  private loadFromStorage() {
    const data = localStorage.getItem(this.STORAGE_KEY);
    if (data) {
      this._history.set(JSON.parse(data));
    }
  }

}
