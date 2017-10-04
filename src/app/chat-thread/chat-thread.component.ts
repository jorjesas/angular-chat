import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter
} from '@angular/core';
import { Observable } from 'rxjs';
import { ThreadsService } from '../_services/threads.service';
import { Thread } from '../_models/thread.model';

@Component({
  selector: 'app-chat-thread',
  templateUrl: './chat-thread.component.html',
  styleUrls: ['./chat-thread.component.css']
})
export class ChatThreadComponent implements OnInit {
  @Input() thread: Thread;
  selected = false;

  constructor(public threadsService: ThreadsService) { 
  }

  // A key reason we will use ngOnInit is because our thread property won’t be available in the constructor.
  ngOnInit() {
    this.threadsService.currentThread.subscribe((currentThread : Thread) => {
      this.selected = currentThread && this.thread && (currentThread.id === this.thread.id);
    });
  }

  clicked(event: any): void {
    this.threadsService.setCurrentThread(this.thread);
    event.preventDefault();
  }

}
