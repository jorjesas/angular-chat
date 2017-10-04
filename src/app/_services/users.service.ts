import { Injectable } from '@angular/core';
import { Subject, BehaviorSubject } from 'rxjs';
import { User } from '../_models/user.model';

/**
 * UserService manages our current user
 */
@Injectable()
export class UsersService {
    /* setup a stream which we will use to manage our current user */
    /* However, the first value of this stream is null (the constructor argument) */
    /* You can think of a Subject as a “read/write” stream. */
    currentUser: Subject<User> = new BehaviorSubject<User>(null);

    // Update current user -> publish a new user to the stream whenever the current user changes
    public setCurrentUser(newUser: User): void {
        this.currentUser.next(newUser); 
    }
}

export const userSeviceInjectables: Array<any> = [UsersService];
