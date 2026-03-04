import { computed, Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class MessageService {
  private _messages = signal<string[]>([]);
  public messages = this._messages.asReadonly();

  public messageCounter = computed(() => this._messages().length);

  public add(message: string) {
    this._messages.update((msgs) => [...msgs, message]);
  }

  public clear() {
    this._messages.set([]);
  }
}
