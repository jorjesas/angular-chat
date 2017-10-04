import { Injectable } from '@angular/core';
import { Subject,BehaviorSubject,Observable } from 'rxjs'; 
import { Thread } from '../_models/thread.model';
import { Message } from '../_models/message.model';
import { MessagesService } from '../_services/messages.service';
import * as _ from 'lodash';

@Injectable()
export class ThreadsService {
    // `threads` is a observable that contains the most up to date list of threads
    // Notice that this stream will emit a map (an object) with the id of the Thread being the string key and the Thread itself will be the value.
    threads: Observable<{ [key: string]: Thread }>;

    // `orderedThreads` contains a newest-first chronological list of threads
    orderedThreads: Observable<Thread[]>;

    // `currentThread` contains the currently selected thread
    // Notice that we’re issuing an empty Thread as the default value.
    currentThread: Subject<Thread> = new BehaviorSubject<Thread>(new Thread());

    // `currentThreadMessages` contains the set of messages for the currently selected thread
    currentThreadMessages: Observable<Message[]>;

    constructor(public messagesService: MessagesService) {
        
        this.threads = messagesService.messages
            .map( (messages: Message[]) => {
            const threads: {[key: string]: Thread} = {};
            // Store the message's thread in our accumulator `threads`
            messages.map((message: Message) => {
                threads[message.thread.id] = threads[message.thread.id] ||
                message.thread;
    
                // Cache the most recent message for each thread
                const messagesThread: Thread = threads[message.thread.id];
                if (!messagesThread.lastMessage ||
                    messagesThread.lastMessage.sentAt < message.sentAt) {
                messagesThread.lastMessage = message;
                }
            });
            return threads;
            });
        
        this.orderedThreads = this.threads
            .map((threadGroups: { [key: string]: Thread }) => {
            const threads: Thread[] = _.values(threadGroups);
            return _.sortBy(threads, (t: Thread) => t.lastMessage.sentAt).reverse();
            });
        
        
        /* Whether or not we should be marking messages as read here is debatable. The biggest
            drawback is that we’re mutating objects in what is, essentially, a “read” thread. i.e. this is a
            read operation with a side effect, which is generally a Bad Idea. That said, in this application
            the currentThreadMessages only applies to the currentThread and the currentThread
            should always have its messages marked as read. That said, the “read with side-effects” is
            not a pattern I recommend in general. */
        this.currentThreadMessages = this.currentThread
        .combineLatest(messagesService.messages,
                        (currentThread: Thread, messages: Message[]) => {
        if (currentThread && messages.length > 0) {
            return _.chain(messages)
            .filter((message: Message) =>
                    (message.thread.id === currentThread.id))
            .map((message: Message) => {
                message.isRead = true;
                return message; })
            .value();
        } else {
            return [];
        }
        });
        
        this.currentThread.subscribe(this.messagesService.markThreadAsRead);
    }
        
    setCurrentThread(newThread: Thread): void {
        this.currentThread.next(newThread);
    }
        
}
        
export const threadsServiceInjectables: Array<any> = [
    ThreadsService
]; 