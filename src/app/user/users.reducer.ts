import { User } from '../_models/user.model';

export interface UsersState {
    currentUser: User;
}

const initialState: UsersState = {
    currentUser: null
};

export const getUsersState = (state): UsersState => state.users;
