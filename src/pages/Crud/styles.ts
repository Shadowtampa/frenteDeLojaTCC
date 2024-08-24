import styled from 'styled-components';
import { darken } from 'polished';

export const Container = styled.div`
h2 {
  color: white;
}
`

export const ProductList = styled.ul`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-gap: 20px;
  list-style: none;

  li {
    display: flex;
    flex-direction: column;
    background: #fff;
    border-radius: 4px;
    padding: 20px;

    img {
      align-self: center;
      max-width: 250px;
    }

    > span {
      font-size: 16px;
      line-height: 20px;
      color: #333;
      margin-top: 5px;
    }

    > div {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-top: auto;

      .edit-button,
      .delete-button {
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 8px;
        border: 0;
        border-radius: 4px;
        transition: background 0.2s;
        cursor: pointer;

        svg {
          margin-right: 5px;
        }
      }

      .edit-button {
        background: #7159c1;
        color: #fff;

        &:hover {
          background: ${darken(0.06, '#7159c1')};
        }
      }

      .delete-button {
        background: #e74c3c;
        color: #fff;

        &:hover {
          background: ${darken(0.06, '#e74c3c')};
        }
      }
    }
  }
`;
export const FabContainer = styled.button`
  position: fixed;
  bottom: 20px;
  right: 20px;
  width: 56px;
  height: 56px;
  border-radius: 50%;
  background-color: #7159c1;
  color: #fff;
  border: none;
  box-shadow: 0px 2px 5px rgba(0, 0, 0, 0.25);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background-color: #5f4ac6;
  }

  svg {
    width: 24px;
    height: 24px;
  }
`;

export const ModalForm = styled.form`
  display: flex;
  flex-direction: column;
  align-items: center;

  h2 {
    color: white
  }
`;

export const FormLabel = styled.label`
margin-top: 12px;
color: white;
  font-size: 16px;
  margin-bottom: 5px;
`;

export const FormInput = styled.input`
  width: 300px;
  height: 30px;
  padding: 5px;
  margin-bottom: 10px;
`;

export const FormButton = styled.button`
  width: 150px;
  height: 40px;
  background-color: #7159c1;
  color: #fff;
  border: none;
  border-radius: 4px;
  font-size: 16px;
  font-weight: bold;
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background-color: #624aa7;
  }
`;
export const ModalConfirmation = styled.div`
  background: #fff;
  border-radius: 4px;
  padding: 20px;
  max-width: 400px;
  margin: 0 auto;
  text-align: center;

  h2 {
    margin-bottom: 10px;
    color: #333;
  }

  p {
    margin-bottom: 20px;
    color: #666;
  }

  .confirm-button {
    background: #4caf50;
    color: #fff;
    border: 0;
    border-radius: 4px;
    padding: 10px 20px;
    margin-right: 10px;
    cursor: pointer;
  }

  .cancel-button {
    background: #f44336;
    color: #fff;
    border: 0;
    border-radius: 4px;
    padding: 10px 20px;
    cursor: pointer;
  }
`;