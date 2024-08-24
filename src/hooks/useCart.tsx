import { createContext, ReactNode, useContext, useState } from 'react';
import { toast } from 'react-toastify';
import { api } from '../services/api';
import { Product, Stock } from '../types';

interface CartProviderProps {
  children: ReactNode;
}

interface UpdateProductAmount {
  productId: number;
  amount: number;
}

interface CartContextData {
  cart: Product[];
  addProduct: (productId: number) => Promise<void>;
  removeProduct: (productId: number) => void;
  updateProductAmount: ({ productId, amount }: UpdateProductAmount) => void;
  removeAllProducts: () => void;
}

const CartContext = createContext<CartContextData>({} as CartContextData);

export function CartProvider({ children }: CartProviderProps): JSX.Element {
  const [cart, setCart] = useState<Product[]>(() => {
    const storagedCart = localStorage.getItem('@RocketShoes:cart');

    if (storagedCart) {
      return JSON.parse(storagedCart);
    }

    return [];
  });

  const addProduct = async (productId: number) => {
    try {

      let cancel = false;

      const exists = cart.find(product => product.id === productId)

      let currentAmountOfProducts = exists !== undefined?exists.amount + 1:1 ; 


      await api.get(`stock/${productId}`)
        .then(response => cancel = response.data.amount - (currentAmountOfProducts) < 0)
      if (cancel) {

        toast.error('Quantidade solicitada fora de estoque')
        throw "out of stock"
      }

      exists !== undefined
        ? updateProductAmount({
          productId: exists.id,
          amount: exists.amount + 1,
        })
        : api.get(`products/${productId}`)
          .then(response => {
            setCart([...cart, {
              id: response.data.id,
              title: response.data.title,
              price: response.data.price,
              image: response.data.image,
              amount: 1,
            }])

            localStorage.setItem('@RocketShoes:cart', JSON.stringify([...cart, {
              id: response.data.id,
              title: response.data.title,
              price: response.data.price,
              image: response.data.image,
              amount: 1,
            }]))
          },

          )


    } catch (err) {
      if (err === "out of stock") toast.error('Quantidade solicitada fora de estoque')
      else toast.error('Erro na adição do produto');
    }

  };

  const removeProduct = (productId: number) => {
    try {
      const exists = cart.filter(product => product.id !== productId)

      if (exists.length === cart.length) {
        throw "error"
      }

      setCart(exists)

      localStorage.setItem('@RocketShoes:cart', JSON.stringify(exists))
    } catch {
      toast.error('Erro na remoção do produto');
    }
  };

  const removeAllProducts = () => {
    try {
      setCart([]);

      localStorage.setItem('@RocketShoes:cart', JSON.stringify([]))
    } catch {
      toast.error('Erro na remoção do produto');
    }
  };

  const updateProductAmount = async ({
    productId,
    amount,
  }: UpdateProductAmount) => {
    try {

      const exists = cart.find(product => product.id === productId)

      const newObjArr = cart.map(product => {
        if ([productId].includes(product.id)) {
          return { ...product, amount: amount }
        }
        return product;
      }
      )



      if (!exists) {
        throw "error"
      }

      let cancel = false;

      if (exists?.amount <= 0) throw "error"
      if (amount <= 0) throw "error"

      await api.get(`stock/${productId}`)
        .then(response => cancel = amount < 0 ? response.data.amount - amount < 0 : amount > response.data.amount)

      if (cancel) {
        throw "out";
      }

      setCart(newObjArr)

      localStorage.setItem('@RocketShoes:cart', JSON.stringify(newObjArr))

    } catch (error) {
      error === "out"
        ? toast.error('Quantidade solicitada fora de estoque')
        : toast.error('Erro na alteração de quantidade do produto');
    }
  };

  return (
    <CartContext.Provider
      value={{ cart, addProduct, removeProduct, updateProductAmount, removeAllProducts }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart(): CartContextData {
  const context = useContext(CartContext);

  return context;
}
