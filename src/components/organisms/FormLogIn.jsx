import { Button } from "../atoms/Button";
import { FormInputsLogIn } from "../molecules/FormInputs";
import { useEffect, useState } from "react";
import { usersApi } from "../../services/usersApi";
import { AlertDisplay } from "../molecules/AlertDisplay";
import { useNavigate } from "react-router-dom";

export const FormLogin = () => { 
  const [form, setForm] = useState({
    username: "", 
    email: "",
    password: "",
  });

  const [alertMessage, setAlertMessage] = useState("");
  const { loginUser } = usersApi();
  const navigate = useNavigate();

  useEffect(() => {
    if (alertMessage) {
      const timer = setTimeout(() => {
        setAlertMessage("");
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [alertMessage]);

  const handleChange = (event) => {
    setForm({
      ...form,
      [event.target.name]: event.target.value,
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await loginUser(form.email, form.password);
      
      if (response) {
        console.log("✅ Login exitoso:", response);
        localStorage.setItem("user", JSON.stringify({ id: response.id, username: response.username }));
        setAlertMessage("¡Bienvenida " + response.username + "!");

        setTimeout(() => {
          navigate("/tarot");
        }, 2000);
      }
    } catch (error) {
      console.error("❌ Error al iniciar sesión:", error);
      setAlertMessage("Error al iniciar sesión: " + error.message);
    }
  };

  return (
    <>
      {alertMessage && <AlertDisplay message={alertMessage} />}
      <div className="bg-[#fde8EE] w-[90vw] max-w-sm z-30 rounded-2xl px-6 sm:px-10 py-5 flex flex-col items-center relative shadow-xl">
        <h1 className="text-[#6a4a4a] text-2xl font-semibold p-2">Bienvenida</h1>
        <form onSubmit={handleSubmit}>
          <FormInputsLogIn form={form} handleChange={handleChange} />
          <div className="flex justify-center">
            <Button type="submit" buttonname="Iniciar Session" />
          </div>
        </form>
      </div>
    </>
  );
};