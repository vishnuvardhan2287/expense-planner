import React, {useState, useEffect} from 'react';
import './App.css';

import Alert from './components/Alert';
import ExpenseForm from './components/ExpenseForm';
import ExpenseList from './components/ExpenseList';

import uuid from 'uuid/v4';

// const initialExpenses = [
//  {id: uuid(), charge:'Rent', amount:1600},
//  {id: uuid(), charge:'Car Rent', amount:600},
//  {id: uuid(), charge:'House Rent', amount:1000}
// ]

const initialExpenses = localStorage.getItem('expenses')
? JSON.parse(localStorage.getItem('expenses')) :[]; 

function App() {
  const [expenses,setExpenses] = useState(initialExpenses);
  const [charge,setCharge] = useState('');
  const [amount,setAmount] = useState('');
  const [budget,setBudget] = useState(10000);
  const [balance,setBalance] = useState('');
  const [alert,setAlert] = useState({show: false});
  const [edit,setEdit] = useState(false);
  const [id,setId] = useState(0);

  useEffect(() => {
    console.log("called");

    localStorage.setItem("expenses", JSON.stringify(expenses));
  }, [expenses]);
  
  const handleCharge = e =>{
    setCharge(e.target.value);
  }

  const handleAmount = e =>{
    setAmount(e.target.value)
  }

  const handleAlert = ({type,text}) =>{
    setAlert({show: true,type,text});
    setTimeout(() =>{
      setAlert({show: false})
    }, 2000)
  }

  const handleSubmit = e =>{
    e.preventDefault();
    if(charge !== "" && amount > 0){
      if(edit){
         let tempExpenses = expenses.map(item =>{
           return item.id === id ? { ...item, charge, amount} : item;
         });
         setExpenses(tempExpenses);
         setEdit(false);
         handleAlert({type:"success",text:'Item Edited!!'})
      } else{
        const singleExpense = { id: uuid(), charge, amount};
        setExpenses([...expenses, singleExpense]);
        handleAlert({type:"success",text:'Item Added!!'})
      }
      setCharge("");
      setAmount("");
    } else{
      handleAlert({
        type:"danger",
        text:"Charge should not be empty value and amount should be greater than 0"
      })
    }
  }

  const clearItems =() =>{
     setExpenses([]);
     handleAlert({type:'danger', text:'All Items Cleared!!!'})
  }

  const handleEdit = id =>{
    let expense = expenses.find(item => item.id === id)
     let {charge,amount} = expense;
     setCharge(charge);
     setAmount(amount);
     setEdit(true)
     setId(id);
    }

  const handleDelete = id =>{
    const tempExpenses = expenses.filter(item => item.id !== id);
    setExpenses(tempExpenses);
    handleAlert({type:'danger',text:'Item Deleted!!'})
  }

  return (
    <>
        {alert.show && <Alert type={alert.type} text={alert.text} />}
        <Alert />
         <h1>Expense Calculator</h1>
         <main className="App">
          <ExpenseForm 
            charge={charge}
            amount={amount}
            handleCharge={handleCharge}
            handleAmount={handleAmount}
            handleSubmit={handleSubmit}
            edit={edit}
          />
          <ExpenseList expenses={expenses} 
            handleEdit={handleEdit} 
            handleDelete={handleDelete} 
            clearItems={clearItems}
          />
         </main> 
         <h1>
            Total Expense: {" "}
            <span className="total">
              $ {expenses.reduce((acc,cur) =>{
                return (acc += parseInt(cur.amount))
              }, 0)}
            </span>
          </h1> 
          <h1>
             Total Budget: {" "}
             <span className="total">
                ${budget}
             </span>
          </h1> 
    </>
  );
}

export default App;
