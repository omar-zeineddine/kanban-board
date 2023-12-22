"use client";
import React from "react";
import PlusIcon from "@/icons/PlusIcon";
import { Col, Id } from "@/types";
import ColContainer from "./ColContainer";

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

  const deleteCol = (id: Id) => {
    const filteredCols = cols.filter((col) => col.id !== id);
    setCols(filteredCols);
  };

  function generateId() {
    return Math.floor(Math.random() * 10001);
  }

  return (
    <div className="m-auto flex min-h-screen w-full items-center overflow-x-auto overflow-y-hidden px-[40px]">
      <div className="m-auto flex gap-4">
        <div className="flex gap-4">
          {cols.map((col) => (
            <div key={col.id}>
              <ColContainer column={col} deleteColumn={deleteCol} />
            </div>
          ))}
        </div>
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
