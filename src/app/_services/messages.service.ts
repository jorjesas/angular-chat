import { Injectable } from '@angular/core';
import { Subject,Observable } from 'rxjs';
import { User } from '../_models/user.model';
import { Thread } from '../_models/thread.model';
import { Message } from '../_models/message.model';

const initialMessages:Message[] = [];

interface IMessagesOperation extends Function {
    (messages: Message[]): Message[];
}

@Injectable()
export class MessagesService {
    // a stream that publishes new messages only once
    // emits inidivual messages 
    newMessages: Subject<Message> = new Subject<Message>();

    // `messages` is a stream that emits an array of the most up to date messages
    messages: Observable<Message[]>;

    // `updates` receives _operations_ to be applied to our `messages`
    // it's a way we can perform changes on *all* messages (that are currently
    // stored in `messages`)
    updates: Subject<any> = new Subject<any>();

    // action streams
    create: Subject<Message> = new Subject<Message>();
    markThreadAsRead: Subject<any> = new Subject<any>();

    constructor() {
        /*  This code introduces a new stream function: scan⁸⁶. If you’re familiar with functional programming,
            scan is a lot like reduce: it runs the function for each element in the incoming stream and
            accumulates a value. What’s special about scan is that it will emit a value for each intermediate
            result. That is, it doesn’t wait for the stream to complete before emitting a result, which is exactly
            what we want. */
        this.messages = this.updates.scan((messages: Message[], operation: IMessagesOperation) => {
            return operation(messages);
        }, initialMessages).publishReplay(1).refCount();

        // this stream will emit a function which accepts the list of Messages and adds this Message to our list of messages.
        this.create.map(function(message: Message): IMessagesOperation {
            return (messages: Message[]) => {
                return messages.concat(message);
            };
        }).subscribe(this.updates);

        this.newMessages.subscribe(this.create);

        // similarly, `markThreadAsRead` takes a Thread and then puts an operation
        // on the `updates` stream to mark the Messages as read
        this.markThreadAsRead
        .map( (thread: Thread) => {
            return (messages: Message[]) => {
                return messages.map( (message: Message) => {
                // note that we're manipulating `message` directly here. Mutability
                // can be confusing and there are lots of reasons why you might want
                // to, say, copy the Message object or some other 'immutable' here
                if (message.thread.id === thread.id) {
                    message.isRead = true;
                }
                return message;
            });
            };
        })
        .subscribe(this.updates); 
    }

    // define a helper method to add Messages to this stream
    addMessage(message: Message): void {
        this.newMessages.next(message);
    }
    
    // a stream of “everyone else’s messages in this Thread.
    messagesForThreadUser(thread: Thread, user: User): Observable<Message> {
        return this.newMessages
          .filter((message: Message) => {
                   // belongs to this thread
            return (message.thread.id === thread.id) &&
                   // and isn't authored by this user
                   (message.author.id !== user.id);
          });
      } 
}

export const messagesServiceInjectables: Array<any> = [
    MessagesService
  ]; 