import Header from "./Header";

export default function Page({ children }) {
  return (
    <div>
      <Header />
      <h2>Page</h2>
      {children}
    </div>
  );
}
