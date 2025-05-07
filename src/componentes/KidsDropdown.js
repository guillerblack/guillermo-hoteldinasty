import React, { useContext } from "react";
import { ContextoHabitacion } from "../contexto/ContextoHabitacion";
import { Menu } from "@headlessui/react";
import { BsChevronDown } from "react-icons/bs";

const opcionesKids = [0, 1, 2, 3, 4]; // Cambiado a números

const KidsDropdown = () => {
  const { niños, setNiños } = useContext(ContextoHabitacion);
  return (
    <Menu as="div" className="w-full h-full bg-white relative">
      <Menu.Button className="w-full h-full flex items-center justify-between px-8">
        {niños} Niño(s)
        <BsChevronDown className="text-base text-accent-hover" />
      </Menu.Button>
      <Menu.Items
        as="ul"
        className="bg-white absolute w-full flex flex-col z-40"
      >
        {opcionesKids.map((opcion, index) => (
          <Menu.Item
            onClick={() => setNiños(opcion)}
            as="li"
            className="border-b last-of-type:border-b-0 h-12 hover:bg-accent hover:text-white w-full flex justify-center items-center cursor-pointer"
            key={index}
          >
            {opcion} Niño(s)
          </Menu.Item>
        ))}
      </Menu.Items>
    </Menu>
  );
};

export default KidsDropdown;
