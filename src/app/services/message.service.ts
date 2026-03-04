import { computed, Injectable, signal } from '@angular/core';

export interface MessageInterface {
  id: number;
  message: string;
}

@Injectable({
  providedIn: 'root',
})
export class MessageService {
  private _messages = signal<MessageInterface[]>([]);
  public messages = this._messages.asReadonly();

  public messageCounter = computed(() => this._messages().length);

  public add(message: string) {
    this._messages.update((msgs) => [
      ...msgs,
      {
        id: msgs.length + 1,
        message: `${new Date().toLocaleTimeString()} ${message}`,
      },
    ]);
  }

  public clear() {
    this._messages.set([]);
  }
}
