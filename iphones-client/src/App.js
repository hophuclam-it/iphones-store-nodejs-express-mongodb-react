import RoutesApp from "./routes";
import { CartProvider } from "./contexts/CartContext";

function App() {
  return (
    <div className="App">
      <CartProvider>
        <RoutesApp />
      </CartProvider>
    </div>
  );
}

export default App;
