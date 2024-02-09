"use client";
import React, { useMemo, useState } from "react";
import PlusIcon from "@/icons/PlusIcon";
import { Col, Id, Task } from "@/types";
import ColContainer from "./ColContainer";
import {
  DndContext,
  DragEndEvent,
  DragOverEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { SortableContext, arrayMove } from "@dnd-kit/sortable";
import { createPortal } from "react-dom";
import TaskCard from "./TaskCard";

const KanbanBoard = () => {
  const [cols, setCols] = React.useState<Col[]>([]);
  const colsId = useMemo(() => cols.map((col) => col.id), [cols]);
  // console.log(cols);

  const [tasks, setTasks] = useState<Task[]>([]);

  const [activeCol, setActiveCol] = React.useState<Col | null>(null);
  const [activeTask, setActiveTask] = React.useState<Task | null>(null);

  // fix delete button drag
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 20, // distance in px before dragging starts
      },
    }),
  );

  // creates New columns of type Col
  const createNewCol = () => {
    const colToAdd: Col = {
      id: generateId(),
      title: `Col ${cols.length + 1}`,
    };
    setCols([...cols, colToAdd]);
  };

  const deleteCol = (id: Id) => {
    const filteredCols = cols.filter((col) => col.id !== id);
    setCols(filteredCols);

    const newTasks = tasks.filter((task) => task.columnId !== id);
    setTasks(newTasks);
  };

  const updateCol = (id: Id, title: string) => {
    const newCols = cols.map((col) => {
      if (col.id !== id) {
        return col;
      }
      return { ...col, title };
    });
    setCols(newCols);
  };

  const createTask = (colId: Id) => {
    const newTask: Task = {
      id: generateId(),
      columnId: colId,
      content: `Task ${tasks.length + 1}`,
    };
    setTasks([...tasks, newTask]);
  };

  const deleteTask = (id: Id) => {
    const newTasks = tasks.filter((task) => task.id !== id);
    setTasks(newTasks);
  };

  const updateTask = (id: Id, content: string) => {
    const newTasks = tasks.map((task) => {
      if (task.id !== id) return task;
      return { ...task, content };
    });
    setTasks(newTasks);
  };

  function generateId() {
    return Math.floor(Math.random() * 10001);
  }

  const onDragStart = (event: DragStartEvent) => {
    console.log("Drag started", event);
    if (event.active.data.current?.type === "column") {
      setActiveCol(event.active.data.current.column);
      return;
    }

    if (event.active.data.current?.type === "Task") {
      setActiveTask(event.active.data.current.task);
      return;
    }
  };

  const onDragEnd = (event: DragEndEvent) => {
    setActiveCol(null);
    setActiveTask(null);

    const { active, over } = event;
    if (!over) return;

    const activeId = active.id;
    const overId = over.id;

    if (activeId === overId) return;

    setCols((columns) => {
      const activeColumnIndex = columns.findIndex((col) => col.id === activeId);

      const overColumnIndex = columns.findIndex((col) => col.id === overId);

      return arrayMove(columns, activeColumnIndex, overColumnIndex);
    });
  };

  const onDragOver = (event: DragOverEvent) => {
    const { active, over } = event;
    if (!over) return;

    const activeId = active.id;
    const overId = over.id;

    if (activeId === overId) return;

    // two cases
    const isActiveTask = active.data.current?.type === "Task";
    const isOverAtTask = over.data.current?.type === "Task";

    if (!isActiveTask) return;

    // drop task over another task
    if (isActiveTask && isOverAtTask) {
      setTasks((tasks) => {
        const activeIndex = tasks.findIndex((t) => t.id === activeId);
        const overIndex = tasks.findIndex((t) => t.id === overId);

        // if (tasks[activeIndex].columnId !== tasks[overIndex].columnId) {
        // tasks[activeIndex].columnId = tasks[overIndex].columnId;
        // }

        tasks[activeIndex].columnId = tasks[overIndex].columnId;

        return arrayMove(tasks, activeIndex, overIndex);
      });
      return;
    }

    const isOverAColumn = over.data.current?.type === "column";

    // drop task over a column
    if (isActiveTask && isOverAColumn) {
      setTasks((tasks) => {
        const activeIndex = tasks.findIndex((t) => t.id === activeId);

        tasks[activeIndex].columnId = overId;

        return arrayMove(tasks, activeIndex, activeIndex);
      });
      return;
    }
  };

  // Import useEffect hook from React
  // Inside your component
  React.useEffect(() => {
    // Check if document is available
    if (typeof document !== "undefined") {
      // Render the component
      {
        createPortal(
          <DragOverlay>
            {activeCol && (
              <ColContainer
                column={activeCol}
                deleteColumn={deleteCol}
                updateColumn={updateCol}
                createTask={createTask}
                tasks={tasks.filter((task) => task.columnId === activeCol.id)}
                deleteTask={deleteTask}
                updateTask={updateTask}
              />
            )}

            {activeTask && (
              <TaskCard
                task={activeTask}
                deleteTask={deleteTask}
                updateTask={updateTask}
              />
            )}
          </DragOverlay>,
          document.body,
        );
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="m-auto flex min-h-screen w-full items-center overflow-x-auto overflow-y-hidden px-[40px]">
      <DndContext
        sensors={sensors}
        onDragStart={onDragStart}
        onDragEnd={onDragEnd}
        onDragOver={onDragOver}
      >
        <div className="m-auto flex gap-4">
          <div className="flex gap-4">
            <SortableContext items={colsId}>
              {cols.map((col) => (
                <ColContainer
                  key={col.id}
                  column={col}
                  deleteColumn={deleteCol}
                  updateColumn={updateCol}
                  createTask={createTask}
                  tasks={tasks.filter((task) => task.columnId === col.id)}
                  deleteTask={deleteTask}
                  updateTask={updateTask}
                />
              ))}
            </SortableContext>
          </div>
          <button
            className="flex h-[60px] w-[350px] min-w-[350px] cursor-pointer items-center gap-2 rounded-lg border-2 border-colBackgroundColor bg-mainBackgroundColor ring-rose-500 hover:ring-2"
            onClick={createNewCol}
          >
            <div className="mx-4 size-5">
              <PlusIcon />
            </div>
            Add Column
          </button>
        </div>
      </DndContext>
    </div>
  );
};

export default KanbanBoard;
