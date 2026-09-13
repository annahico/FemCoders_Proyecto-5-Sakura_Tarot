export const Alert = (props) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 px-4">
      <div className="bg-[#fde8EE] w-full max-w-sm rounded-2xl px-6 sm:px-10 pt-5 pb-5 flex flex-col items-center">
        <p className="text-[#6a4a4a] text-base sm:text-xl font-[Cormorant Garamond] text-center wrap-break-word">{props.alertmessage}</p>
      </div>
    </div>
  );
};
