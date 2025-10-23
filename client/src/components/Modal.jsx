export default (props) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
      <div className="bg-white p-8 rounded-lg shadow-lg 2-96 max-w-[90%]">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-semibold">{props.title}</h2>
          <button
            onClick={props.onClose}
            className="text-gray-600 hover:text-gray-900 text-xl cursor-pointer"
          >
            ✕
          </button>
        </div>
        {props.children}
      </div>
    </div>
  );
};
