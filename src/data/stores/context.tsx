import { ReactNode, useCallback, useState } from 'react';
import { createContextWithSelectors } from '../AtomProvider';
import { generateId } from '../helpers';

interface Task {
  id: string;
  title: string;
  createdAt: number;
}

interface ITodoItemState {
  tasks: Task[];
  tasksDone: Task[];
  removeTask: (id: string) => void;
  createTaskDone: () => void;
  createTask: (title: string) => void;
  updateTask: (id: string, title: string) => void;
  deleteEverything: () => void;
}

const { Provider, useSelector, useSelectorShallow } = createContextWithSelectors<ITodoItemState>('TodosState');

export { useSelector, useSelectorShallow };

export const TodosContextProvider = ({ children }: { children: ReactNode }) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [tasksDone, setTasksDone] = useState<Task[]>([]);

  const removeTask = useCallback((id: string) => {
    let task: Task | undefined;
    setTasks((prev) => {
      task = prev.find((task) => task.id !== id);
      return prev.filter((task) => task.id !== id);
    });

    setTasksDone((prev) => {
      return task ? [...prev, task] : prev;
    });
  }, []);

  const createTaskDone = useCallback(() => {
    const newTask = {
      id: generateId(),
      title: 'Fake repeated title',
      createdAt: Date.now(),
    };
    setTasksDone((prev) => [...prev, newTask]);
  }, []);

  const createTask = useCallback((title: string) => {
    const newTask = {
      id: generateId(),
      title,
      createdAt: Date.now(),
    };
    setTasks((prev) => [...prev, newTask]);
  }, []);

  const updateTask = useCallback((id: string, title: string) => {
    setTasks((prev) => {
      return prev.map((task) => {
        if (task.id === id) {
          return {
            ...task,
            title,
          };
        }
        return task;
      });
    });
  }, []);

  const deleteEverything = useCallback(() => {
    setTasks([]);
    setTasksDone([]);
  }, []);

  return (
    <Provider
      value={{
        tasks,
        tasksDone,
        removeTask,
        createTaskDone,
        createTask,
        updateTask,
        deleteEverything,
      }}
    >
      {children}
    </Provider>
  );
};

const taskDoneSelector = (state: ITodoItemState) => state.tasksDone;
const taskDoneCreateSelector = (state: ITodoItemState) => state.createTaskDone;

const tasksSelector = (state: ITodoItemState) => state.tasks;
const tasksCreateSelector = (state: ITodoItemState) => state.createTask;
const tasksUpdateSelector = (state: ITodoItemState) => state.updateTask;
const tasksDeleteSelector = (state: ITodoItemState) => state.deleteEverything;
const tasksRemoveSelector = (state: ITodoItemState) => state.removeTask;

export const todosSelectors = {
  taskDoneSelector,
  taskDoneCreateSelector,
  tasksSelector,
  tasksCreateSelector,
  tasksUpdateSelector,
  tasksDeleteSelector,
  tasksRemoveSelector,
}
