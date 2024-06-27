import React, { useContext } from "react";
// contexto de la habitación
import { ContextoHabitacion } from "../contexto/ContextoHabitacion";
// menú de Headless
import { Menu } from "@headlessui/react";
// iconos
import { BsChevronDown } from "react-icons/bs";

const opcionesKids = [
  { name: " 0 Niños" },
  { name: " 1 Niño" },
  { name: " 2 Niños" },
  { name: " 3 Niños" },
  { name: " 4 Niños" },
];

const KidsDropdown = () => {
  const { niños, setNiños } = useContext(ContextoHabitacion);
  return (
    <Menu as="div" className="w-full h-full bg-white relative">
      <Menu.Button className="w-full h-full flex items-center justify-between px-8">
        {niños === "0 Niños" ? "Sin niños" : niños}
        <BsChevronDown className="text-base text-accent-hover" />
      </Menu.Button>
      {/* items */}
      <Menu.Items
        as="ul"
        className="bg-white absolute w-full flex flex-col z-40"
      >
        {opcionesKids.map((opción, index) => {
          return (
            <Menu.Item
              onClick={() => setNiños(opción.name)}
              as="li"
              className="border-b last-of-type:border-b-0 h-12 hover:bg-accent hover:text-white w-full flex justify-center items-center cursor-pointer"
              key={index}
            >
              {opción.name}
            </Menu.Item>
          );
        })}
      </Menu.Items>
    </Menu>
  );
};

export default KidsDropdown;
