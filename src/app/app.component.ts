import { Component, Inject } from '@angular/core';

import { UsersService } from './_services/users.service';
import { ThreadsService } from './_services/threads.service';
import { MessagesService } from './_services/messages.service';

import { ChatExampleData } from './_helpers/chat-example-data';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  
  constructor(public messagesService: MessagesService,
    public threadsService: ThreadsService,
    public usersService: UsersService) {
      ChatExampleData.init(messagesService, threadsService, usersService);
  }

}
