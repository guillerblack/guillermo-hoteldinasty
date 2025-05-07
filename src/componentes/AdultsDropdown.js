import React, { useContext } from "react";
import { ContextoHabitacion } from "../contexto/ContextoHabitacion";
import { Menu } from "@headlessui/react";
import { BsChevronDown } from "react-icons/bs";

const opcionesAdultos = [1, 2, 3, 4]; // Cambiado a números

const AdultsDropdown = () => {
  const { adultos, setAdultos } = useContext(ContextoHabitacion);
  return (
    <Menu as="div" className="w-full h-full bg-white relative">
      <Menu.Button className="w-full h-full flex items-center justify-between px-8">
        {adultos} Adulto(s)
        <BsChevronDown className="text-base text-accent-hover" />
      </Menu.Button>
      <Menu.Items
        as="ul"
        className="bg-white absolute w-full flex flex-col z-40"
      >
        {opcionesAdultos.map((opcion, index) => (
          <Menu.Item
            onClick={() => setAdultos(opcion)}
            as="li"
            className="border-b last-of-type:border-b-0 h-12 hover:bg-accent hover:text-white w-full flex justify-center items-center cursor-pointer"
            key={index}
          >
            {opcion} Adulto(s)
          </Menu.Item>
        ))}
      </Menu.Items>
    </Menu>
  );
};

export default AdultsDropdown;
