import { createContext, useState } from "react";

const AddressState = createContext();

const AddressContext = (props) => {
  const [addressList, setAddressList] = useState([]);
  const [getPlaces, setGetPlaces] = useState([]);
  const [addressTypes, setAddressTypes] = useState([]);
  const [stateCity, setStateCity] = useState([]);

  const updateAddress = (updatedAdd) => {
    setAddressList(updatedAdd);
  };
  const updateStateCity = (data) => {
    setStateCity(data);
  };
  const updatePlaces = (update) => {
    setGetPlaces(update);
  };

  const updateTypes = (update) => {
    setAddressTypes(update);
  };

  return (
    <AddressState.Provider
      value={{
        addressList,
        getPlaces,
        addressTypes,
        updateAddress,
        updatePlaces,
        updateTypes,
        stateCity,
        updateStateCity
      }}
    >
      {props.children}
    </AddressState.Provider>
  );
};

export { AddressState, AddressContext };
