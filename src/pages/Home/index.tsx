import React, { useState, useEffect } from 'react';
import { MdAddShoppingCart } from 'react-icons/md';

import { ProductList } from './styles';
import { api } from '../../services/api';
import { formatPrice } from '../../util/format';
import { useCart } from '../../hooks/useCart';

interface Product {
  id: number;
  title: string;
  price: number;
  image: string;
  amount: number;
}

interface ProductFormatted extends Product {
  priceFormatted: string;
}

interface CartItemsAmount {
  [key: number]: number;
}

const Home = (): JSX.Element => {
  const [products, setProducts] = useState<ProductFormatted[]>([]);
  const { addProduct, cart } = useCart();

  const cartItemsAmount = cart.reduce((sumAmount, product) => {

    //primeiro copia pra um objeto independente do tipo CartItemsAmount
    const newSumAmount = { ...sumAmount }

    //Acessa a prop do objeto = id do produto e o seta com o valor do amount
    newSumAmount[product.id] = product.amount

    //retorna
    return newSumAmount;
  }, {} as CartItemsAmount)


  function handleAddProduct(id: number) {
    addProduct(id)
  }


  useEffect(() => {
    async function loadProducts() {
      api.get('/products')
        .then(response => setProducts(response.data))
    }

    loadProducts();
  }, []);

  return (
    <>
      <ProductList>
        {products && products.map(product => {
          return (
            <li key={product.id}>
              <img src={product.image} alt={product.title} />
              <strong>{product.title}</strong>
              <span>{formatPrice(product.price)}</span>
              <button
                type="button"
                data-testid="add-product-button"
                onClick={() => handleAddProduct(product.id)}
              >
                <div data-testid="cart-product-quantity">
                  <MdAddShoppingCart size={16} color="#FFF" />
                  {cartItemsAmount[product.id] || 0}
                </div>

                <span>ADICIONAR AO CARRINHO</span>
              </button>
            </li>
          )
        })}
      </ProductList>
    </>
  );
};

export default Home;
