import React, { useState, useEffect } from 'react';
import { supabase } from './supabaseClient';
import './App.css';

function App() {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState('');
  const [editingTask, setEditingTask] = useState(null);
  const [editedTaskText, setEditedTaskText] = useState('');

  useEffect(() => {
    fetchTasks();
  }, []);

  async function fetchTasks() {
    const { data, error } = await supabase
      .from('tasks')
      .select('*')
      .order('id', { ascending: true });
    
    if (error) console.log('Error fetching tasks:', error);
    else setTasks(data);
  }

  async function addTask() {
    if (newTask.trim() === '') return;
    
    const { data, error } = await supabase
      .from('tasks')
      .insert([{ title: newTask, is_complete: false }])
      .select();
    
    if (error) console.log('Error adding task:', error);
    else {
      setTasks([...tasks, data[0]]);
      setNewTask('');
    }
  }

  async function toggleComplete(id, currentStatus) {
    const { error } = await supabase
      .from('tasks')
      .update({ is_complete: !currentStatus })
      .eq('id', id);

    if (error) console.log('Error updating task:', error);
    else {
      setTasks(tasks.map(task => 
        task.id === id ? { ...task, is_complete: !currentStatus } : task
      ));
    }
  }

  async function deleteTask(id) {
    const { error } = await supabase
      .from('tasks')
      .delete()
      .eq('id', id);

    if (error) console.log('Error deleting task:', error);
    else {
      setTasks(tasks.filter(task => task.id !== id));
    }
  }

  function startEditing(task) {
    setEditingTask(task.id);
    setEditedTaskText(task.title);
  }

  function cancelEditing() {
    setEditingTask(null);
    setEditedTaskText('');
  }

  async function saveEditedTask(id) {
    if (editedTaskText.trim() === '') return;

    const { error } = await supabase
      .from('tasks')
      .update({ title: editedTaskText })
      .eq('id', id);

    if (error) console.log('Error updating task:', error);
    else {
      setTasks(tasks.map(task => 
        task.id === id ? { ...task, title: editedTaskText } : task
      ));
      setEditingTask(null);
      setEditedTaskText('');
    }
  }

  return (
    <div className="App">
      <h1>To-Do App</h1>
      <div>
        <input
          type="text"
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          placeholder="Enter a new task"
        />
        <button onClick={addTask}>Add Task</button>
      </div>
      <ul>
        {tasks.map((task) => (
          <li key={task.id} className={task.is_complete ? 'completed' : ''}>
            {editingTask === task.id ? (
              <>
                <input
                  type="text"
                  value={editedTaskText}
                  onChange={(e) => setEditedTaskText(e.target.value)}
                  className="edit-input"
                />
                <button 
                  className="save-btn" 
                  onClick={() => saveEditedTask(task.id)}
                  title="Save changes"
                ></button>
                <button 
                  className="cancel-btn" 
                  onClick={cancelEditing}
                  title="Cancel editing"
                ></button>
              </>
            ) : (
              <>
                <input
                  type="checkbox"
                  checked={task.is_complete}
                  onChange={() => toggleComplete(task.id, task.is_complete)}
                />
                <span>{task.title}</span>
                <button 
                  className="edit-btn" 
                  onClick={() => startEditing(task)}
                  title="Edit task"
                ></button>
                <button 
                  className="delete-btn" 
                  onClick={() => deleteTask(task.id)}
                  title="Delete task"
                ></button>
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;