"use client";
import React, { useMemo } from "react";
import PlusIcon from "@/icons/PlusIcon";
import { Col, Id } from "@/types";
import ColContainer from "./ColContainer";
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { SortableContext, arrayMove } from "@dnd-kit/sortable";
import { createPortal } from "react-dom";

const document = globalThis.document;

const KanbanBoard = () => {
  const [cols, setCols] = React.useState<Col[]>([]);
  const colsId = useMemo(() => cols.map((col) => col.id), [cols]);
  // console.log(cols);
  const [activeCol, setActiveCol] = React.useState<Col | null>(null);

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

  function generateId() {
    return Math.floor(Math.random() * 10001);
  }

  const onDragStart = (event: DragStartEvent) => {
    console.log("Drag started", event);
    if (event.active.data.current?.type === "column") {
      setActiveCol(event.active.data.current.column);
      return;
    }
  };

  const onDragEnd = (event: DragEndEvent) => {
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

  return (
    <div className="m-auto flex min-h-screen w-full items-center overflow-x-auto overflow-y-hidden px-[40px]">
      <DndContext
        onDragStart={onDragStart}
        onDragEnd={onDragEnd}
        sensors={sensors}
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
        {createPortal(
          <DragOverlay>
            {activeCol && (
              <ColContainer
                column={activeCol}
                deleteColumn={deleteCol}
                updateColumn={updateCol}
              />
            )}
          </DragOverlay>,
          document.body,
        )}
      </DndContext>
    </div>
  );
};

export default KanbanBoard;
