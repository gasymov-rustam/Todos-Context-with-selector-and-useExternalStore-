import styles from './index.module.scss';
import { useEffect } from 'react';
import { todosSelectors, useSelectorShallow } from '../../data/stores/context';

export const ToDoListDone: React.FC = () => {
  const tasksDone = useSelectorShallow(todosSelectors.taskDoneSelector);
  const createTaskDone = useSelectorShallow(todosSelectors.taskDoneCreateSelector);

  useEffect(() => {
    console.log('🚀 => 👍 ==>> ToDoListDone ==>> Line #7 ==>> ');
  }, [tasksDone]);

  return (
    <article className={styles.article}>
      <h1 className={styles.articleTitle}>Done tasks</h1>
      {!tasksDone.length && <p className={styles.articleText}>There is no one done task.</p>}
      {tasksDone.map((task, index) => (
        <p key={task.id} className={styles.articleTextLeft}>
          {index + 1}. {task.title}
        </p>
      ))}
      <br />
      <button className={styles.articleButton} onClick={createTaskDone}>
        Add fake done task
      </button>
      <br />

      {/* <button
                onClick={deleteEverything}
            >Delete everything</button> */}
      <br />
    </article>
  );
};
