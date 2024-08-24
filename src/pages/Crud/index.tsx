import React, { useState, useEffect } from 'react';
import {
  MdDelete,
  MdAddCircleOutline,
  MdRemoveCircleOutline,
  MdEdit,
  MdAdd,
} from 'react-icons/md';

import { useCart } from '../../hooks/useCart';
import { formatPrice } from '../../util/format';
import { ProductList, FabContainer, ModalForm, FormLabel, FormInput, FormButton, ModalConfirmation, Container} from './styles';

import Modal from 'react-modal';
import { api } from '../../services/api';

interface Product {
  id: number;
  title: string;
  price: number;
  image: string;
  amount: number;
}

const Crud = (): JSX.Element => {
  const [modalIsOpen, setIsOpen] = useState(false);
  const [confirmModalIsOpen, setConfirmModalIsOpen] = useState(false);
  const [deletingProductId, setDeletingProductId] = useState<number | null>(null);


  const createNewProduct = () => {
    setFormData({
      id: 0,
      title: '',
      price: 0,
      image: '',
      amount: 0,
    });
    openModal();
  }

  function openModal() {
    setIsOpen(true);
  }

  function closeModal() {
    setIsOpen(false);
  }

  function openConfirmModal(productId: number) {
    setDeletingProductId(productId);
    setConfirmModalIsOpen(true);
  }

  function closeConfirmModal() {
    setDeletingProductId(null);
    setConfirmModalIsOpen(false);
  }

  const [products, setProducts] = useState<Product[]>([]);
  const [editingProductId, setEditingProductId] = useState<number | null>(null);

  const customStyles = {
    content: {
      top: '50%',
      left: '50%',
      right: 'auto',
      bottom: 'auto',
      marginRight: '-50%',
      transform: 'translate(-50%, -50%)',
      background: '#22222b'
    },
  };

  Modal.setAppElement('#root');

  // useEffect(() => {
  //   // Aqui você pode buscar os dados dos produtos de um armazenamento real, como um banco de dados ou um arquivo JSON
  //   setProducts(initialStateProducts);
  // }, []);

  const handleEdit = (productId: number) => {
    const productToEdit = products.find((product) => product.id === productId);
    if (productToEdit) {
      setFormData({
        id: productToEdit.id,
        title: productToEdit.title,
        price: productToEdit.price,
        image: productToEdit.image,
        amount: productToEdit.amount,
      });
      setEditingProductId(productId);
      openModal();
    }
  };

  const handleDelete = (productId: number) => {
    openConfirmModal(productId);
  };

  const confirmDelete = async () => {
    try {
      await api.delete(`/products/${deletingProductId}`);
      const updatedProducts = products.filter((product) => product.id !== deletingProductId);
      setProducts(updatedProducts);
      closeConfirmModal();
    } catch (error) {
      // Tratar o erro
      console.log(error);
    }
  };

  const [formData, setFormData] = useState({
    id: 0,
    title: '',
    price: 0,
    image: '',
    amount: 0,
  });

  const handleChange = (e: { target: { name: any; value: any; }; }) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: { preventDefault: () => void; }) => {
    e.preventDefault();
  
    try {
      if (formData.id !== 0) {
        // Requisição de alteração com verbo PUT
        await api.put(`/products/${formData.id}`, formData);


      } else {
        // Requisição de criação com verbo POST
        await api.post('/products', formData);
      }
  
      closeModal();
    } catch (error) {
      // Tratar o erro
      console.log(error);
    }

    window.location.reload();
  };
  


  useEffect(() => {
    async function loadProducts() {
      api.get('/products')
        .then(response => setProducts(response.data))
    }

    loadProducts();
  }, []);

  return (
    <Container>
      <h2>Lista de Produtos</h2>
      <ProductList>
        {products.map((product) => (
          <li key={product.id}>
              <img src={product.image} alt={product.title} />
              <strong>{product.title}</strong>
              <span>{formatPrice(product.price)}</span>
            {
              <div>
                <button className="edit-button" onClick={() => handleEdit(product.id)}>
                  Editar <MdEdit />
                </button>
                <button className="delete-button" onClick={() => handleDelete(product.id)}>
                  Excluir <MdDelete />
                </button>
              </div>
            }
          </li>
        ))}
      </ProductList>
      <FabContainer onClick={createNewProduct}>
        <MdAdd />
      </FabContainer>
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        style={customStyles}
        contentLabel="Example Modal"
      >
          
        <ModalForm onSubmit={handleSubmit}>
        <h2>{formData.id == 0 ? "Adicionar Novo Produto" : `Editando Produto ${formData.title}`}</h2>
          <FormLabel htmlFor="title">Título:</FormLabel>
          <FormInput
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
          />

          <FormLabel htmlFor="price">Preço:</FormLabel>
          <FormInput
            type="number"
            id="price"
            name="price"
            value={formData.price}
            onChange={handleChange}
          />

          <FormLabel htmlFor="image">URL Imagem:</FormLabel>
          <FormInput
            type="text"
            id="image"
            name="image"
            value={formData.image}
            onChange={handleChange}
            required
          />

          <FormLabel htmlFor="amount">Quantidade:</FormLabel>
          <FormInput
            type="number"
            id="amount"
            name="amount"
            value={formData.amount}
            onChange={handleChange}
          />

          <FormButton type="submit">
            {editingProductId ? 'Salvar Alterações' : 'Adicionar Produto'}
          </FormButton>
        </ModalForm>
      </Modal>

      <Modal
        isOpen={confirmModalIsOpen}
        onRequestClose={closeConfirmModal}
        style={customStyles}
        contentLabel="Confirm Delete Modal"
      >
        <ModalConfirmation>
          <h2>Confirmar Exclusão</h2>
          <p>Deseja realmente excluir o produto?</p>
          <div>
            <button className="confirm-button" onClick={confirmDelete}>
              Confirmar
            </button>
            <button className="cancel-button" onClick={closeConfirmModal}>
              Cancelar
            </button>
          </div>
        </ModalConfirmation>
      </Modal>
    </Container>
  );
};

export default Crud;