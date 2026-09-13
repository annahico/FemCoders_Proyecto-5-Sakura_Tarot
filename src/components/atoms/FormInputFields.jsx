export const FormInputFields = (props) => {
  return (
    <div className="flex flex-col gap-1">
      <label htmlFor={props.name} className="text-[#6a4a4a] font-[Cormorant Garamond] text-sm font-medium pl-1">
        {props.inputname}
      </label>
      <input
        id={props.name}
        type={props.type}
        name={props.name}
        value={props.value}
        onChange={props.onChange}
        placeholder={props.inputname}
        required={props.required}
        className="text-[#6a4a4a] font-[Cormorant Garamond] bg-white rounded-lg p-2 pl-5"
      />
    </div>
  );
};
