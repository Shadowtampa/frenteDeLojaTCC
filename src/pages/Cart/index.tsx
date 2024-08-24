import React from 'react';
import {
  MdDelete,
  MdAddCircleOutline,
  MdRemoveCircleOutline,
} from 'react-icons/md';

import { useCart } from '../../hooks/useCart';
import { formatPrice } from '../../util/format';
import { Container, ProductTable, Total } from './styles';
import { api } from '../../services/api';
import { toast } from 'react-toastify';

interface Product {
  id: number;
  title: string;
  price: number;
  image: string;
  amount: number;
}

const Cart = (): JSX.Element => {
  const { cart, removeProduct, updateProductAmount, removeAllProducts } = useCart();

  const cartFormatted = cart.map(product => {
    return (
      <tr data-testid="product" key={product.id}>
        <td>
          <img src={product.image} alt={product.title} />
        </td>
        <td>
          <strong>{product.title}</strong>
          <span>{formatPrice(product.price)}</span>
        </td>
        <td>
          <div>
            <button
              type="button"
              data-testid="decrement-product"
              disabled={product.amount <= 1}
              onClick={() => handleProductDecrement(product)}
            >
              <MdRemoveCircleOutline size={20} />
            </button>
            <input
              type="text"
              data-testid="product-amount"
              readOnly
              value={product.amount}
            />
            <button
              type="button"
              data-testid="increment-product"
              onClick={() => handleProductIncrement(product)}
            >
              <MdAddCircleOutline size={20} />
            </button>
          </div>
        </td>
        <td>
          <strong>{formatPrice(product.amount * product.price)}</strong>
        </td>
        <td>
          <button
            type="button"
            data-testid="remove-product"
            onClick={() => handleRemoveProduct(product.id)}
          >
            <MdDelete size={20} />
          </button>
        </td>
      </tr>
    )
  })

  const total =
    formatPrice(
      cart.reduce((sumTotal, product) => {
        return sumTotal + (product.price * product.amount)
      }, 0)
    )

  function handleProductIncrement(product: Product) {
    updateProductAmount({ productId: product.id, amount: product.amount +1 })
  }

  function handleProductDecrement(product: Product) {
    updateProductAmount({ productId: product.id, amount: product.amount -1 })
  }

  function handleRemoveProduct(productId: number) {
    removeProduct(productId)
  }

  function handleFinalizeOrder() {

    cart.length > 0 && toast.success(`Compra de ${total} Finalizada!` );

    cart.forEach(product => {
      // Enviar uma requisição PATCH para o endpoint "products/<product.id>/"
      // Passar no corpo da requisição o novo valor de "amount"
      // Manter os campos "title", "image" e "price" inalterados
      api.patch(`products/${product.id}`, { amount: product.amount })
        .then(response => {
          if (response.status === 200) {

            removeAllProducts()
          } else {
            // Lidar com possíveis erros na requisição
            throw new Error('Erro ao finalizar o pedido');
          }
        })
        .catch(error => {
          // Lidar com erros na requisição
          console.error(error);
        });
    });

    
  }

  return (
    <Container>
      <ProductTable>
        <thead>
          <tr>
            <th aria-label="product image" />
            <th>PRODUTO</th>
            <th>QTD</th>
            <th>SUBTOTAL</th>
            <th aria-label="delete icon" />
          </tr>
        </thead>
        <tbody>
          {cartFormatted}
        </tbody>
      </ProductTable>

      <footer>
      <button type="button" onClick={handleFinalizeOrder}>
          Finalizar pedido
        </button>
        <Total>
          <span>TOTAL</span>
          <strong>{total}</strong>
        </Total>
      </footer>
    </Container>
  );
};

export default Cart;
