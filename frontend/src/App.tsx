import { useState } from "react";
import type { Closet, ClothingItem } from "./types/closet.types";
import Title from "./components/Title";

import "./App.css";
import InfoSection from "./components/InfoSection";
import ClosetControls from "./components/ClosetControls";

function App() {
  // ----- STATE MANAGEMENT
  const [infoMessage, setInfoMessage] = useState<string | null>(null);
  const [closet, setCloset] = useState<Closet>({
    isOpen: false,
    clothes: [],
  });

  // ----- FUNCTIONS TO MANAGE CLOSET STATE -----
  const openCloset = () => {
    setCloset((prevCloset) => ({ ...prevCloset, isOpen: true }));
  };
  const closeCloset = () => {
    setCloset((prevCloset) => ({ ...prevCloset, isOpen: false }));
  };
  const addClothingItem = (item: ClothingItem) => {
    setCloset((prevCloset) => ({
      ...prevCloset,
      clothes: [...prevCloset.clothes, item],
    }));
  };
  const removeClothingItem = (id: number) => {
    setCloset((prevCloset) => ({
      ...prevCloset,
      clothes: prevCloset.clothes.filter((item) => item.id !== id),
    }));
  };

  // ----- EVENT HANDLERS -----
  const handleOpenCloset = () => {
    openCloset();
    setInfoMessage("Closet is now open !");
  };

  const handleCloseCloset = () => {
    closeCloset();
    setInfoMessage("Closet is now closed !");
  };

  const handleAddItem = () => {
    const newItem: ClothingItem = {
      id: Date.now(),
      name: "New T-Shirt",
      type: { category: "top", subcategory: "t-shirt" },
      style: "casual",
      color: "blue",
      isFavorite: false,
    };
    addClothingItem(newItem);
    setInfoMessage("Added a new clothing item !");
  };

  const handleRemoveItem = (id: number) => {
    removeClothingItem(id);
    setInfoMessage("Removed a clothing item !");
  };

  return (
    <>
      <Title />
      <InfoSection infoMessage={infoMessage} />
      <ClosetControls
        closetIsOpen={closet.isOpen}
        onOpen={handleOpenCloset}
        onClose={handleCloseCloset}
        onAddItem={handleAddItem}
      />

      {/* CLOTHING ITEMS LIST */}
      {closet.isOpen && (
        <div>
          <h2>Clothing Items:</h2>
          {closet.clothes.length === 0 ? (
            <p>No clothing items in the closet.</p>
          ) : (
            <ul>
              {closet.clothes.map((item) => (
                <li key={item.id}>
                  {item.name} - {item.type.category} ({item.style}, {item.color}
                  )
                  <button onClick={() => handleRemoveItem(item.id)}>
                    Remove
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </>
  );
}

export default App;
