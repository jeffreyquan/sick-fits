import { useState } from "react";
import useForm from "../lib/useForm";

export default function CreateProduct() {
  const { inputs, handleChange, clearForm, resetForm } = useForm({
    name: "Nice shoes",
    price: 123213,
    description: "The best shoes",
  });

  return (
    <form>
      <label htmlFor="name">
        <input
          type="text"
          id="name"
          name="name"
          placeholder="name"
          value={inputs.name}
          onChange={handleChange}
        />
      </label>
      <label htmlFor="price">
        <input
          type="number"
          id="price"
          name="price"
          placeholder="price"
          value={inputs.price}
          onChange={handleChange}
        />
      </label>

      <button type="button" onClick={clearForm}>
        Clear Form
      </button>
      <button type="button" onClick={resetForm}>
        Reset Form
      </button>
    </form>
  );
}
