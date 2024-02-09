import React from "react";
import { Col, Id } from "@/types";
import TrashIcon from "@/icons/TrashIcon";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

interface Props {
  column: Col;
  deleteColumn: (id: Id) => void;
  updateColumn: (id: Id, title: string) => void;
}

const ColContainer = (props: Props) => {
  const { column, deleteColumn, updateColumn } = props;
  const [editMode, setEditMode] = React.useState(false);

  const {
    setNodeRef,
    attributes,
    listeners,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: column.id,
    data: {
      type: "column",
      column,
    },
    disabled: editMode,
  });

  const style = {
    transition,
    transform: CSS.Transform.toString(transform),
  };

  if (isDragging) {
    return (
      <div
        ref={setNodeRef}
        style={style}
        className="flex h-[500px] max-h-[500px] w-[350px] flex-col rounded-md border-2 border-rose-500 bg-colBackgroundColor opacity-30"
      ></div>
    );
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="flex h-[500px] max-h-[500px] w-[350px] flex-col rounded-md bg-colBackgroundColor"
    >
      {/* column title */}
      <div
        {...attributes}
        {...listeners}
        onClick={() => {
          setEditMode(true);
        }}
        className="text-md flex h-[60px] cursor-grab justify-between rounded-md rounded-b-none border-4 border-colBackgroundColor bg-mainBackgroundColor p-3 font-bold"
      >
        <div className="flex gap-2">
          <div className="flex items-center justify-center rounded-full bg-colBackgroundColor px-2 py-1 text-sm">
            0
          </div>
          {!editMode && column.title}
          {/* display input field when editMode is true */}
          {editMode && (
            <input
              className="text-md rounded border border-rose-500 bg-mainBackgroundColor px-2 outline-none focus:border-rose-500"
              value={column.title}
              onChange={(e) => updateColumn(column.id, e.target.value)}
              autoFocus
              onBlur={() => {
                setEditMode(false);
              }}
              onKeyDown={(e) => {
                if (e.key !== "Enter") return;
                setEditMode(false);
              }}
            />
          )}
        </div>
        <button
          className="size-6 rounded-md stroke-white px-1 py-2 hover:bg-colBackgroundColor hover:stroke-red-300"
          onClick={() => {
            deleteColumn(column.id);
          }}
        >
          <TrashIcon />
        </button>
      </div>
      {/* task container */}
      <div className="flex flex-grow">Content</div>
      {/* footer */}
      <div>Footer</div>
    </div>
  );
};

export default ColContainer;
