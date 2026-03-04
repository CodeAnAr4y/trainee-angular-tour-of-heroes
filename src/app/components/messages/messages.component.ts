import { Component, inject } from '@angular/core';
import { MessageService } from '../../services/message.service';

@Component({
  selector: 'app-messages',
  templateUrl: './messages.component.html',
  styleUrl: './messages.component.css',
  standalone: true,
  imports: [],
})
export class MessagesComponent {
  messageService = inject(MessageService);
}
