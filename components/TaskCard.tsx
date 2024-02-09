import React from "react";
import { Task, Id } from "@/types";
import TrashIcon from "@/icons/TrashIcon";

type Props = {
  task: Task;
  deleteTask: (id: Id) => void;
};

const TaskCard = ({ task, deleteTask }: Props) => {
  const [mouseOver, setMouseOver] = React.useState(false);

  return (
    <div
      className="relative flex h-[100px] min-h-[100px] cursor-grab items-center rounded-xl bg-mainBackgroundColor p-2 text-left hover:ring-2 hover:ring-inset hover:ring-rose-500"
      onMouseEnter={() => setMouseOver(true)}
      onMouseLeave={() => setMouseOver(false)}
    >
      {task.content}
      {mouseOver && (
        <button
          className="absolute right-5 top-1/2 size-5 -translate-y-1/2 rounded-md stroke-white opacity-50 hover:bg-colBackgroundColor hover:opacity-100"
          onClick={() => {
            deleteTask(task.id);
          }}
        >
          <TrashIcon />
        </button>
      )}
    </div>
  );
};

export default TaskCard;
