import { CommonModule } from '@angular/common';
import { Component, OnInit, signal, WritableSignal} from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Todo } from '../models/todo.model';
@Component({
  selector: 'app-root',
  imports: [RouterOutlet,CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent implements OnInit {
  search = '';
  statusFilter: 'all' | 'open' | 'done' = 'all';
   todos:WritableSignal<Todo[]> = signal<Todo[]>([]);
  loading = signal(false);
    ngOnInit(): void {
       this.getTodoList();
    }

async getTodoList() {
  try {
    const url = `/api/v1/todo/todoList`;
    const res = await fetch(url);

    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }

    const result = await res.json();
    // ✅ set todos with fetched result
    this.todos.set(result);

  } catch (error) {
    console.error("Failed to fetch todos:", error);
  }
}




  filteredTodos() {
    // Example filter: show all
    return this.todos();
  }

  addTodo() {
    // const newTodo: Todo = {
    //   id: Date.now(),
    //   title: 'New Todo',
    //   completed: false,
    //   priority: 'low',
    // };
    // this.todos.update((list) => [...list, newTodo]);
  }

  toggle() {
    // this.todos.update((list) =>
    //   list.map((t) =>
    //     t.id === todo.id ? { ...t, completed: !t.completed } : t
    //   )
    // );
  }

  edit(todo: Todo) {
    // Example: simple log
    console.log('Edit todo:', todo);
  }

  remove() {
    // this.todos.update((list) => list.filter((t) => t.id !== todo.id));
  }
}
