import "../styles/title.css";
import TodoList from "./TodoList";
import AddTodo from "./AddTodo";
import { useState, useEffect } from "react";
import { collection, query, orderBy, onSnapshot } from "firebase/firestore";
import { auth, db, logout } from "../firebase";
import { useNavigate } from "react-router-dom";

function Title() {
  const [openAddModal, setOpenAddModal] = useState(false);
  const [tasks, setTasks] = useState([]);
  const navigate = useNavigate(); // Get navigation function

  useEffect(() => {
    const q = query(collection(db, "tasks"), orderBy("created", "desc"));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      setTasks(
        querySnapshot.docs.map((doc) => ({
          id: doc.id,
          data: doc.data(),
        }))
      );
    });

    return () => unsubscribe(); // Cleanup function to prevent memory leaks
    
  }, []);

  return (
    <div className="title">
      <header>Todo App</header>
      <button className="dashboard__btn" onClick={() => logout(navigate)}>
        Logout
      </button>
      <div className="title__container">
        <button onClick={() => setOpenAddModal(true)}>New Task +</button>

        {/* Render tasks from Firebase */}
        {tasks.map((task) => (
          <TodoList
            key={task.id}
            id={task.id}
            completed={task.data.completed}
            title={task.data.title}
            description={task.data.description}
          />
        ))}
      </div>

      {openAddModal && <AddTodo onClose={() => setOpenAddModal(false)} open={openAddModal} />}
    </div>
  );
}

export default Title;
