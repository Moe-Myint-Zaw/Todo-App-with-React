import Todo from './Todo';

export default function TodoList({ filterTodos,deleteTodo,updateTodo }) {
    return (
        filterTodos.map(todo=>(
           <Todo todo={todo} deleteTodo={deleteTodo} updateTodo={updateTodo} key={todo.id}/>
        ))
    )
}
