$(function () {
  var todos = [
    {
      task : 'learn jQuery',
      isCompleted: false
    },
    {
      task:'take a nap',
      isCompleted:true
    }

  ];
  // Initial Setup
  var app = {
    showTodos: () => {
      var todosListEl = $('#todos-list');

      todosListEl.html('');
      todos.forEach((todo) => {
        var taskClasses = 'todo-task' + (todo.isCompleted ? ' is-completed':'');

        todosListEl.append(`
          <tr>
            <td class="${taskClasses}">${todo.task}</td>
            <td>
              <button class="edit-button">Edit</button>
              <button class="delete-button">Delete</button>
              <button class="save-button">Save</button>
              <button class="cancel-button">Cancel</button>
            </td>
          </tr>
          `);
      });
    },

    addTodo: function(event) {
      //prevent the page from refreshing
      event.preventDefault();

      var createInput = $('#create-input');
      var createInputValue = createInput.val();

      var error = null;
      if(!createInputValue){
        error = 'Task input cannot be empty.';
      } else {
        todos.forEach(function(todo){
          if(todo.task === createInputValue){
            error = 'Task already exists.';
          }
        });
      }
      if(error){
        app.showError(error);
        return;
      }

      todos.push({
        task:createInputValue,
        isCompleted:false
      });
      createInput.val('');
      app.showTodos();
    },

    toggleTodo: function() {
      todos.forEach(function(todo) {
        if(todo.task === $(this).text()){
          todo.isCompleted = !todo.isCompleted;
        }
      }.bind(this));
      app.showTodos();
    },

    enterEditMode: function() {
      var actionCell = $(this).closest('td');
      var taskCell = actionCell.prev();

      actionCell.find('.save-button').show();
      actionCell.find('.cancel-button').show();
      actionCell.find('.edit-button').hide();
      actionCell.find('.delete-button').hide();

      taskCell.removeClass('todo-task');
      app.currentTask = taskCell.text();
      taskCell.html(`<input type="text" class="edit-input" value="${app.currentTask}" >`);
    },

    exitEditMode: function() {
      var actionCell = $(this).closest('td');
      var taskCell = actionCell.prev();

      actionCell.find('.save-button').hide();
      actionCell.find('.cancel-button').hide();
      actionCell.find('.edit-button').show();
      actionCell.find('.delete-button').show();

      taskCell.addClass('todo-task');
      taskCell.html(app.currentTask);
    },

    saveTask: function() {
      var newTask = $('.edit-input').val();

      todos.forEach(function(todo) {
        if(app.currentTask === todo.task){
          todo.task = newTask;
        }
      });
      app.currentTask = newTask;
      app.exitEditMode.call(this);
    },

    deleteTask : function() {
      var taskToDelete = $(this).parent('td').prev().text();
      var found=false;
      todos.forEach(function(todo,index){
        if(!found && taskToDelete === todo.task){
          todos.splice(index,1);
          found=true;
        }
      });
      app.showTodos();
    },

    showError: function(message){
      $('.error-message').html(message).slideDown();
    },

    clearError: function(){
      $('.error-message').fadeOut();
    }
  };

  $('#create-form button').css('background','blue');
  $('#create-form button').css({
    color:'yellow',
    borderRadius: '8px'
  });

  app.showTodos();
//  $('.todo-task').on('click',app.toggleTodo);
  $('table').on('click','.todo-task',app.toggleTodo);
  $('#create-form').on('submit',app.addTodo);
  $('#create-input').on('keyup',app.clearError);
  $('table').on('click','.edit-button',app.enterEditMode);
  $('table').on('click','.cancel-button',app.exitEditMode);
  $('table').on('click','.save-button',app.saveTask);
  $('table').on('click','.delete-button',app.deleteTask);
});
