import { Button } from "../atoms/Button";
import { FormTitles } from "../atoms/FormTitles";
import { ProteccionDatos } from "../atoms/ProteccionDatos";
import { FormInputsRegister } from "../molecules/FormInputs";
import { usersApi } from "../../services/usersApi";
import { Activity, useEffect, useState } from "react";
import { AlertDisplay } from "../molecules/AlertDisplay";
import { FormLogin } from "./FormLogIn";
import { useNavigate } from "react-router-dom"; 

export const FormRegister = () => { 
  const [showLogin, setShowLogin] = useState(false);
  const navigate = useNavigate(); 

  const handleClick = () => {
    setShowLogin(true);
  };

  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
  });

  const [alertMessage, setAlertMessage] = useState("");
  const { registerUser } = usersApi();

  useEffect(() => {
    if (alertMessage) {
      const timer = setTimeout(() => {
        setAlertMessage("");
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [alertMessage]);

  const handleChange = (event) => {
    setForm({ ...form, [event.target.name]: event.target.value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await registerUser(form);
      console.log(" Usuario registrado:", response);
      localStorage.setItem("user", JSON.stringify({ id: response.id, username: response.username }));
      setAlertMessage("¡Registro exitoso! Te estamos redirigiendo a la página....");

      setTimeout(() => {
        navigate("/tarot");
      }, 2000);

    } catch (error) {
      console.error("❌ Error al registrarse:", error);
      setAlertMessage("Error al registrarse: Inténtalo otra vez! ");
    }
  };

  return (
    <>
      {alertMessage && <AlertDisplay message={alertMessage} />}
      {showLogin ? (
        <FormLogin /> 
      ) : (
        <Activity mode="visible">
          <div className="bg-[#fde8EE] w-[90vw] max-w-sm z-20 rounded-2xl px-6 sm:px-10 py-5 flex flex-col relative shadow-xl">
            <a onClick={handleClick} className="inline-flex items-center font-medium text-[#551A8B] hover:underline cursor-pointer">
              Iniciar Session
            </a>
            <FormTitles></FormTitles>
            <div>
              <form onSubmit={handleSubmit}>
                <FormInputsRegister form={form} handleChange={handleChange}></FormInputsRegister>
                <ProteccionDatos></ProteccionDatos>
                <div className=" flex justify-center">
                  <Button type="submit" buttonname="Registrarse"></Button>
                </div>
              </form>
            </div>
          </div>
        </Activity>
      )}
    </>
  );
};