import { create } from 'zustand';
import { taskApi } from '../services/api';

const useTaskStore = create((set, get) => ({
  // State
  tasks: [],
  selectedTask: null,
  isLoading: false,
  error: null,
  filter: 'all', // 'all', 'active', 'completed'
  isFormOpen: false,


  // Actions
  fetchTasks: async () => {
    set({ isLoading: true, error: null });
    try {
      const tasks = await taskApi.getAllTasks();
      set({ tasks, isLoading: false });
    } catch (error) {
      set({ error: error.message, isLoading: false });
      console.error('Error fetching tasks:', error);
    }
  },

  addTask: async (taskData) => {
    set({ isLoading: true, error: null });
    try {
      const newTask = await taskApi.createTask(taskData);
      set((state) => ({
        tasks: [newTask, ...state.tasks],
        isLoading: false,
      }));
      return newTask;
    } catch (error) {
      set({ error: error.message, isLoading: false });
      console.error('Error adding task:', error);
      throw error;
    }
  },

  updateTask: async (id, taskData) => {
    set({ isLoading: true, error: null });
    try {
      const updatedTask = await taskApi.updateTask(id, taskData);
      set((state) => ({
        tasks: state.tasks.map((task) =>
          task._id === id ? updatedTask : task
        ),
        isLoading: false,
      }));
      return updatedTask;
    } catch (error) {
      set({ error: error.message, isLoading: false });
      console.error('Error updating task:', error);
      throw error;
    }
  },

  deleteTask: async (id) => {
    set({ isLoading: true, error: null });
    try {
      await taskApi.deleteTask(id);
      set((state) => ({
        tasks: state.tasks.filter((task) => task._id !== id),
        isLoading: false,
      }));
    } catch (error) {
      set({ error: error.message, isLoading: false });
      console.error('Error deleting task:', error);
      throw error;
    }
  },

  toggleTaskCompletion: async (id) => {
    set({ isLoading: true, error: null });
    try {
      const updatedTask = await taskApi.toggleTaskCompletion(id);
      set((state) => ({
        tasks: state.tasks.map((task) =>
          task._id === id ? updatedTask : task
        ),
        isLoading: false,
      }));
      return updatedTask;
    } catch (error) {
      set({ error: error.message, isLoading: false });
      console.error('Error toggling task:', error);
      throw error;
    }
  },

    openTaskForm: (task = null) => {
    set({ 
      selectedTask: task,
      isFormOpen: true,
      error: null // Clear any previous errors
    });
  },

  closeTaskForm: () => {
    set({ 
      selectedTask: null,
      isFormOpen: false 
    });
  },
  
  setSelectedTask: (task) => set({ selectedTask: task }),
  clearSelectedTask: () => set({ selectedTask: null }),

  setFilter: (filter) => set({ filter }),

  // Computed values (Getters)
  getFilteredTasks: () => {
    const { tasks, filter } = get();
    switch (filter) {
      case 'active':
        return tasks.filter((task) => !task.completed);
      case 'completed':
        return tasks.filter((task) => task.completed);
      default:
        return tasks;
    }
  },

  getTaskCounts: () => {
    const { tasks } = get();
    const total = tasks.length;
    const completed = tasks.filter((task) => task.completed).length;
    const active = total - completed;
    return { total, completed, active };
  },
}));



export default useTaskStore;