import { useState, useEffect } from "react";
import axios from "axios";
import { Route, Routes, useNavigate, useLocation  } from 'react-router-dom';

import { List, AddList, Tasks } from './components';

import listPng from './assets/img/list.png';

function App() {
  const [lists, setLists] = useState(null);
  const [colors, setColors] = useState(null);
  const [activeItem, setActiveItem] = useState(null);

  let navigate = useNavigate();
  let location = useLocation();

  useEffect(() => {
    axios.get('http://localhost:3001/lists?_expand=color&_embed=tasks')
      .then(({ data }) => {
        setLists(data);
      });
    axios.get('http://localhost:3001/colors')
      .then(({ data }) => {
        setColors(data);
      })

  }, []);

  const onAddList = obj => {
    const newList = [...lists, obj];
    setLists(newList);
  }

  const onAddTask = (listId, taskObj) => {
    const newList =  lists.map(item => {
      if (item.id === listId) {
        item.tasks = [...item.tasks, taskObj]
      }
      return item;
    });
    setLists(newList);
  };

  const onEditTask = (listId, taskObj) => {
    const newTaskText = window.prompt('Текст завдання', taskObj.text);

    if (!newTaskText) {
      return;
    }

    const newList = lists.map(list => {
      if (list.id === listId) {
        list.tasks = list.tasks.map(task => {
          if (task.id === taskObj.id) {
            task.text = newTaskText;
          }
          return task;
        });
      }
      return list;
    });
    setLists(newList);

    axios
        .patch('http://localhost:3001/tasks/' + taskObj.id, { 
          text: newTaskText 
        })
        .catch(() => {
            alert('Не вдалося змінити назву завдання!');
        });
    
  };

  const onRemoveTask = (listId, taskId) => {
    if (window.confirm('Ви дійсно бажаєте видалити завдання?')) {
      const newList = lists.map(item => {
        if (item.id === listId) {
          item.tasks = item.tasks.filter(task => task.id !== taskId);
        }
        return item;
      });
      setLists(newList);

      axios
          .delete('http://localhost:3001/tasks/' + taskId)
          .catch(() => {
              alert('Не вдалося видалити завдання!');
          });
    }
  };

  const onCompleteTask = (listId, taskId, completed) => {
    const newList = lists.map(list => {
      if (list.id === listId) {
        list.tasks = list.tasks.map(task => {
          if (task.id === taskId) {
            task.completed = completed;
          }
          return task;
        });
      }
      return list;
    });
    setLists(newList);

    axios
        .patch('http://localhost:3001/tasks/' + taskId, { 
          completed
        })
        .catch(() => {
            alert('Не вдалося оновити завдання!');
        });
  }

  const onEditListTitle = (id, title) => {
    const newList = lists.map(item => {
      if (item.id === id) {
        item.name = title;
      }
      return item;
    });
    setLists(newList);
  };



  useEffect(() => {
    const listId = location.pathname.split('lists/')[1];
    if (lists) {
      const list = lists.find(list => list.id === Number(listId));
      setActiveItem(list);
    }
  }, [lists, location.pathname]);

  return (
    <div className="todo">
      <div className='todo__sidebar'>
        <List 
          onClickItem={list => {
            navigate('/');
          }}
          items={[
            {
              active: location.pathname === '/',
              icon: <img src={listPng} alt="List icon"/>,
              name: 'Всі задачі',
            }
          ]}
        />
        {lists ? (
          <List 
            items={lists}
            onRemove={id => { 
              const newLists = lists.filter(item => item.id !== id);
              setLists(newLists);
            }}
            onClickItem={list => {
              navigate(`/lists/${list.id}`)
            }}
            activeItem={activeItem}
            isRemovable
          />
        ) : (
          'Завантаження...'
        )}
          <AddList onAdd={onAddList} colors={colors} />
        </div>
        <div className="todo__tasks">
          <Routes>
            <Route 
              path="/" 
              element={lists && 
                lists.map(list => (
                  <Tasks
                    key={list.id} 
                    list={list}
                    onAddTask={onAddTask}
                    onEditTitle={onEditListTitle}
                    onRemoveTask={onRemoveTask}
                    onEditTask={onEditTask}
                    onCompleteTask={onCompleteTask}
                    withoutEmpty
                  />
                ))} 
            />
            <Route 
              path="/lists/:id" 
              element={lists && activeItem && (
                <Tasks 
                  list={activeItem}
                  onAddTask={onAddTask}
                  onEditTitle={onEditListTitle}
                  onRemoveTask={onRemoveTask}
                  onEditTask={onEditTask}
                  onCompleteTask={onCompleteTask}
                />
              )}
            />
          </Routes>
        </div>
    </div>
  );
}

export default App;
