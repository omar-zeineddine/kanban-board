import React from "react";
import { Col, Id } from "@/types";
import TrashIcon from "@/icons/TrashIcon";

interface Props {
  column: Col;
  deleteColumn: (id: Id) => void;
}

const ColContainer = (props: Props) => {
  const { column, deleteColumn } = props;

  return (
    <div className="bg-colBackgroundColor flex h-[500px] max-h-[500px] w-[350px] flex-col rounded-md">
      <div className="bg-mainBackgroundColor text-md border-colBackgroundColor flex h-[60px] cursor-grab justify-between rounded-md rounded-b-none border-4 p-3 font-bold">
        <div className="flex gap-2">
          <div className="bg-colBackgroundColor flex items-center justify-center rounded-full px-2 py-1 text-sm">
            0
          </div>
          {column.title}
        </div>
        <button
          className="hover:bg-colBackgroundColor size-6 rounded-md stroke-white px-1 py-2 hover:stroke-red-300"
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
