import { FormInputFields } from "../atoms/FormInputFields";

export const FormInputsRegister = ({ form, handleChange }) => {
  return (
    <>
      <p className="text-[#6a4a4a] font-[Cormorant Garamond] font-semibold pt-2 pb-2"> Ingresa tus datos: </p>
      <div className="flex gap-2 flex-col w-full">
        <FormInputFields inputname="Nombre" type="text" name="username" required={true} onChange={handleChange} value={form.username}></FormInputFields>
        <FormInputFields inputname="Email" type="email" name="email" required={true} onChange={handleChange} value={form.email}></FormInputFields>
        <FormInputFields inputname="Password" type="password" name="password" required={true} onChange={handleChange} value={form.password}></FormInputFields>
      </div>
    </>
  );
};

export const FormInputsLogIn = ({ form, handleChange }) => {
  return (
    <>
      <p className="text-[#6a4a4a] font-[Cormorant Garamond] font-semibold pt-2 pb-2"> Ingresa tus datos: </p>
      <div className="flex gap-2 flex-col w-full">
        <FormInputFields inputname="Email" type="email" name="email" required={true} onChange={handleChange} value={form.email}></FormInputFields>
        <FormInputFields inputname="Password" type="password" name="password" required={true} onChange={handleChange} value={form.password}></FormInputFields>
      </div>
    </>
  );
};
