import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';

import { FirebaseService } from './Firebase.service';
import { Todo } from '../Models/DentalClinic.module';

@Injectable({
    providedIn: 'root'
})
export class TodoService extends FirebaseService {

    getAllTodos(): Observable<Todo[]> {
        return this.get<{ [key: string]: any }>('todos').pipe(
            map(data => {
                if (data && Object.keys(data).length) {
                    return Object.keys(data).map(key => {
                        let todo = data[key];
                        todo.id = key;
                        return todo;
                    });
                }
                return [];
            })
        );
    }

    addTodo(todo: Todo): Observable<Todo> {
        return this.post<Todo>('todos', todo);
    }

    deleteTodo(todoId: string): Observable<void> {
        return this.delete(`todos/${todoId}`);
    }

    updateTodo(todoId: string, todo: Todo): Observable<void> {
        return this.put(`todos/${todoId}`, todo);
    }
}
