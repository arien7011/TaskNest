import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent implements OnInit {
  todoList = []; 

    ngOnInit(): void {
       this.getTodoList();
    }

   async getTodoList(){
  //   const url = `/api/v1/todo/todoList`
  //    const res = await fetch(url);
  //    const result = await res.json();
  //    this.todoList = result;
  //    console.log({toodolist:this.todoList});
   }
}
