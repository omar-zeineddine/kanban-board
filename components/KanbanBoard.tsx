"use client";
import React from "react";
import PlusIcon from "@/icons/PlusIcon";
import { Col } from "@/types";

const KanbanBoard = () => {
  const [cols, setCols] = React.useState<Col[]>([]);
  console.log(cols);

  // creates New columns of type Col
  const createNewCol = () => {
    const colToAdd: Col = {
      id: generateId(),
      title: `Col ${cols.length + 1}`,
    };
    setCols([...cols, colToAdd]);
  };

  function generateId() {
    return Math.floor(Math.random() * 10001);
  }

  return (
    <div className="m-auto flex min-h-screen w-full items-center overflow-x-auto overflow-y-hidden px-[40px]">
      <div className="m-auto">
        <button
          className="bg-mainBackgroundColor border-colBackgroundColor flex h-[60px] w-[350px] min-w-[350px] cursor-pointer items-center gap-2 rounded-lg border-2 ring-rose-500 hover:ring-2"
          onClick={createNewCol}
        >
          <div className="mx-4 size-5">
            <PlusIcon />
          </div>
          Add Column
        </button>
      </div>
    </div>
  );
};

export default KanbanBoard;
