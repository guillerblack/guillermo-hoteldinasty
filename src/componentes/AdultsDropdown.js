import React, { useContext } from "react";
// contexto de la habitación
import { ContextoHabitacion } from "../contexto/ContextoHabitacion";
// menú de Headless UI
import { Menu } from "@headlessui/react";
// iconos
import { BsChevronDown } from "react-icons/bs";

const opcionesAdultos = [
  { name: " 1 Adulto" },
  { name: " 2 Adultos" },
  { name: " 3 Adultos" },
  { name: " 4 Adultos" },
];

const AdultsDropdown = () => {
  const { adultos, setAdultos } = useContext(ContextoHabitacion);
  return (
    <Menu as="div" className="w-full h-full bg-white relative">
      <Menu.Button className="w-full h-full flex items-center justify-between px-8">
        {adultos}
        <BsChevronDown className="text-base text-accent-hover" />
      </Menu.Button>
      {/* items */}
      <Menu.Items
        as="ul"
        className="bg-white absolute w-full flex flex-col z-40"
      >
        {opcionesAdultos.map((opcion, index) => {
          return (
            <Menu.Item
              onClick={() => setAdultos(opcion.name)}
              as="li"
              className="border-b last-of-type:border-b-0 h-12 hover:bg-accent hover:text-white w-full flex justify-center items-center cursor-pointer"
              key={index}
            >
              {opcion.name}
            </Menu.Item>
          );
        })}
      </Menu.Items>
    </Menu>
  );
};

export default AdultsDropdown;
