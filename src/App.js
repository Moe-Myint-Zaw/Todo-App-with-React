import './reset.css';
import './App.css';
import TodoForm from './components/TodoForm.js';
import TodoList from './components/TodoList.js';
import CheckAllAndRemaining from './components/CheckAllAndRemaining.js';
import TodoFilters from './components/TodoFilters.js';
import ClearCompletedBtn from './components/ClearCompletedBtn.js';
import { useCallback, useEffect, useState } from 'react';

function App() {
  let [todos,setTodos]=useState([]);
  let [filterTodos,setFilterTodos]=useState(todos);
  useEffect(()=>{
    fetch('http://localhost:3001/todos')
    .then(res=>res.json())
    .then(todos=>setTodos(todos))
  },[])
  let addTodo=(todo)=>{
    fetch('http://localhost:3001/todos',{
      method : 'POST',
      headers : {
        'Content-Type' : 'application/json'
      },
      body : JSON.stringify(todo)
  })
    setTodos(prevState => [...prevState,todo])
  }

  let updateTodo=(todo)=>{
    fetch(`http://localhost:3001/todos/${todo.id}`,{
      method : 'PATCH',
      headers : {
        'Content-Type' : 'application/json'
      },
      body : JSON.stringify(todo)
    })
    setTodos(prevState=>prevState.map(t=>{
      if(t.id === todo.id){
        return todo;
      }
        return t;
    }))
  }
  let deleteTodo=(todoId)=>{
    fetch(`http://localhost:3001/todos/${todoId}`,{
      method : 'DELETE',
    })
    setTodos(prevState=>{
      return prevState.filter((t)=>{
        return t.id !== todoId
      })
    }
    )
  }
  let remainingCount = todos.filter(todo => !todo.completed).length;

  let checkAll= ()=>{
   todos.forEach(t=>{
    t.completed = true;
    updateTodo(t);
   })
   setTodos(prevState=>prevState.map(t=>{
    return {...t,completed:true}
   }
    
   ))
  }
  let clearCompleted = ()=>{
      todos.map(todo=>{
        if(todo.completed){
          deleteTodo(todo.id);
        }
        return todo;
      })
      setTodos(prevState=>prevState.filter(t=>{
        return !t.completed;
      }))
  }
  let filterBy = useCallback((filter)=>{
      if(filter === 'All'){
        setFilterTodos(todos);
      }
      if(filter === 'Active'){
        setFilterTodos(todos.filter(t=>{
          return !t.completed;
        }))
      }
      if(filter === 'Completed'){
        setFilterTodos(
          todos.filter(t=>{
            return t.completed;
         }))
      }
  },[todos])
  return (
    <div className="todo-app-container">
      <div className="todo-app">
        <h2>Todo App</h2>
        <TodoForm addTodo={addTodo}/>
        <TodoList filterTodos={filterTodos} deleteTodo={deleteTodo} updateTodo={updateTodo}/>
        <CheckAllAndRemaining remainingCount={remainingCount} checkAll={checkAll}/>
        <div className="other-buttons-container">
          <TodoFilters filterBy={filterBy}/>
          <ClearCompletedBtn clearCompleted={clearCompleted}/>
        </div>
      </div>
    </div>
  );
}

export default App;
