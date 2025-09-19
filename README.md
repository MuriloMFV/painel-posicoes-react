# Desafio Selsyn - Painel de Posições React

## Descrição

Este projeto é um painel de posições em tempo real desenvolvido em **React**.  
Ele consome dados de uma API REST para exibir informações de veículos, como **identificador, tipo, localização, velocidade, ignição, odômetro e data/hora**.  

O painel tem como objetivo:
- Filtrar os dados por **tipo de veículo** e **estado da ignição**  
- Ordenar as colunas  
- Recarregar os dados manualmente  

---

## Funcionalidades
- **Listagem de posições** com dados detalhados  
- **Filtros** por tipo de veículo (CARRO, MOTO, CARRETA) e ignição (Ligada/Desligada)  
- **Ordenação ascendente/descendente** por colunas  
- **Cálculo e exibição da velocidade média** dos veículos filtrados  
- **Recarregamento manual** dos dados  
- **Interface responsiva e estilizada** com Tailwind CSS  
- **Efeitos visuais de hover** nas linhas da tabela  

---

## Tecnologias Utilizadas
- React 18+  
- Tailwind CSS  
- React Icons  
- Fetch API (para consumo de dados)  
- Node.js (ambiente de desenvolvimento)  

---

## Pré-requisitos
- Node.js instalado (**versão 16 ou superior recomendada**)  
- npm ou yarn instalado  
- API REST disponível e rodando localmente (proxy) em `http://localhost:4000/posicoes`  
  > ou ajuste a URL no código, no arquivo **`App.jsx`**

---

## 



## Como rodar o projeto

### 1. Instalação
- **Node.js** (versão 16 ou superior recomendada)  
```bash
 npm install
```

---

### 2. Instalação Proxy

- no seu cmd:
```bash
cd painel-posicoes-react\proxy-api 
npm install
```

### 3. Clonar o repositório (ou baixar o ZIP do projeto)
```bash
git clone https://github.com/seu-usuario/painel-posicoes-react.git
cd painel-posicoes-react
```

### 4. Rodar o Servidor Proxy

- no seu CMD:

```bash
cd painel-posicoes-react\proxy-api 
node index.js
```
### 5. Rodar o Projeto

```bash
npm run dev
```

