import styled from 'styled-components';

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  z-index: 1;
`;

export const Label = styled.label`
  font-size: 1.2rem;
  margin-bottom: 0.5rem;
`;


export const SelectContainer = styled.div`
  position: relative;
  width: 100%;
`;

export const SelectInput = styled.input`
  width: 100%;
  padding: 0em;
  font-size: 1.2rem;
  border-radius: 0.5rem;
  border: none;
  background-color: transparent;
  appearance: none;
  cursor: pointer;
  &::-ms-expand {
    display: none;
  }
  position: relative;
`;

export const Dropdown = styled.div`
  position: absolute;
  width: 100%;
  max-height: 2000px;
  overflow-y: auto;
  margin-top: 0.5rem;
  border-radius: 0.5rem;
  border: 2px solid #ccc;
  background-color: #fff;
  z-index: 10;
`;

export const Option = styled.div<{ isSelected?: boolean }>`
  padding: 0.5rem 1rem;
  cursor: pointer;
  color: black;
  background-color: ${({ isSelected }) => isSelected ? '#ccc' : 'transparent'};
  &:hover {
    background-color: #ccc;
  }
  list-style: none;
  z-index: 100;
`;

export const Button = styled.button`
  padding: 1rem;
  font-size: 1.2rem;
  border-radius: 0.5rem;
  border: none;
  background-color: #0077cc;
  color: #fff;
  cursor: pointer;
  transition: background-color 0.3s ease;
  &:hover {
    background-color: #005fa3;
  }
`;


export const SelectWrapper = styled.div`
  position: relative;
  width: 100%;
`;

export const OptionList = styled.ul`
  position: absolute;
  // height: 1000px;
  top: 0;
  left: 0;
  width: 100%;
  margin: 0;
  padding: 0;
  list-style: none;
  border: 2px solid #ccc;
  border-top: none;
  border-radius: 0 0 0.5rem 0.5rem;
  background-color: #fff;
  z-index: 100;
  `;

export const OptionItem = styled.li<{ isSelected?: boolean }>`
  padding: 0.5rem 1rem;
  cursor: pointer;
  list-style: none;
  color: black;
  background-color: ${({ isSelected }) => isSelected ? '#ccc' : 'transparent'};
  &:hover {
    background-color: #ccc;
  }
  z-index: 100;
`;
