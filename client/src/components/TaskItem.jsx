import { HiOutlinePencilSquare, HiOutlineTrash } from 'react-icons/hi2';

export default (props) => {
  return (
    <div className="flex gap-x-4">
      <button onClick={props.handleEdit} className="cursor-pointer">
        <HiOutlinePencilSquare />
      </button>
      <button onClick={props.handleDelete} className="cursor-pointer">
        <HiOutlineTrash />
      </button>
    </div>
  );
};
