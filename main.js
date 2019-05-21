var filters ={
    all(todos){
      return todos
    },
    active(todos){
        return todos.filter(function(todo){
            return !todo.completed
        })
    },
    completed(todos){
       return todos.filter(function(todo){
            return todo.completed
        })
    }
}
var STORAGE_KEY = 'todos-vuejs-2.0'
var todoStorage={
    fetch(){
        var todos = JSON.parse(localStorage.getItem(STORAGE_KEY)||'[]')
        todos.forEach((todo,index)=>{
            todo.id=index
        })
        return todos
    },
    save(todos){
       localStorage.setItem(STORAGE_KEY,JSON.stringify(todos))
    }
}


let app=new Vue({
    el:".todoapp",
    data:{
        todos:todoStorage.fetch(),
        newTodo:'',
        visibility:'all',
        editedTodo:null
    },
    watch:{
        todos:{
            handler(todos){
              todoStorage.save(todos)
            },
            deep:true
        }    
    },
    methods:{
        addTodo(){
            let value= this.newTodo&&this.newTodo.trim()
            if(!value) return
            this.todos.push({id:todoStorage.uid++,title:value,completed:false})
            this.newTodo=''
        },
        editTodo(todo){
            this.beforeEditCache = todo.title
            this.editedTodo = todo
        },
        removeTodo(todo){
         this.todos.splice(this.todos.indexOf(todo),1)
        },
        doneEdit(todo){
            if(!this.editedTodo){
                return
            }
            this.editedTodo = null
            todo.title=todo.title.trim()
            if(!todo.title){
                this.removeTodo(todo)
            }
        },
        clear(){
           this.todos=filters.active(this.todos)  
        }
    
    },
    computed:{
        filteredTodos(){
            return filters[this.visibility](this.todos)
        },
        remaining(){
            return filters.active(this.todos).length
        }
    }
    })
 
 function onHashChange(){
     let visiblity = window.location.hash.replace(/#\/?/,'')
     if(filters[visiblity]){
         app.visibility = visiblity
     }else{
         window.location.hash=''
         app.visiblity = 'all'
     }
 }
 window.addEventListener('hashchange',onHashChange)
 onHashChange()