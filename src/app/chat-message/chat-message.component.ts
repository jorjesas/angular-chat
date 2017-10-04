import {
  Component,
  OnInit,
  Input
} from '@angular/core';
import { Observable } from 'rxjs';

import { UsersService } from '../_services/users.service';
import { ThreadsService } from '../_services/threads.service';
import { MessagesService } from '../_services/messages.service';

import { Message } from '../_models/message.model';
import { Thread } from '../_models/thread.model';
import { User } from '../_models/user.model';

@Component({
  selector: 'app-chat-message',
  templateUrl: './chat-message.component.html',
  styleUrls: ['./chat-message.component.css']
})
export class ChatMessageComponent implements OnInit {
  @Input() message: Message;
  currentUser: User;
  incoming: boolean; 

  constructor(public UsersService: UsersService) {
  } 

  ngOnInit(): void {
    this.UsersService.currentUser
      .subscribe(
        (user: User) => {
          this.currentUser = user;
          if (this.message.author && user) {
            this.incoming = this.message.author.id !== user.id;
          }
        });
  } 

}
