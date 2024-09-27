import React from "react";
import { Extra } from "../../_types/booking";

interface Props {
  items: Extra[];
  setExtrasState: React.Dispatch<
    React.SetStateAction<{ [key: number]: number | boolean }>
  >;
  extrasState: { [key: number]: number | boolean };
}

const ItemList: React.FC<Props> = ({ items, setExtrasState, extrasState }) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, checked, type } = e.target;
    setExtrasState({
      ...extrasState,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  return (
    <>
      {items.map((item) => (
        <div
          key={item.apiId}
          className={`item__row ${
            item.valueType === "Boolean" ? "item__row--checkbox mt-25" : ""
          } ${item.valueType === "Int" ? "flex" : ""}`}
        >
          {item.valueType === "Int" && (
            <>
              <div className="label label__lg">
                {item.name}
                <span className="highlight">({item.price})</span>
              </div>
              <div className="value value__sm">
                <input
                  type="number"
                  className="form-control"
                  name={item.apiId + ""}
                  value={extrasState[item.apiId] as number}
                  onChange={handleChange}
                />
              </div>
            </>
          )}

          {item.valueType === "Boolean" && (
            <div className="align-left">
              <input
                type="checkbox"
                className="form-control"
                name={item.apiId + ""}
                id={item.apiId + ""}
                checked={Boolean(extrasState[item.apiId])}
                onChange={handleChange}
              />
              <label htmlFor={`${item.apiId}`}>
                {item.name} <span className="highlight">({item.price})</span>
              </label>
              <p>{typeof extrasState[item.apiId]}</p>
            </div>
          )}
        </div>
      ))}
    </>
  );
};

export default ItemList;
