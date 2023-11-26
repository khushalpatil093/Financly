import React, { useContext, useEffect, useState } from 'react'
import Header from '../Components/Header'
import Cards from '../Components/Cards'
import AddExpense from '../Components/Modals/addExpense';
import AddIncome from '../Components/Modals/addIncome';
import { addDoc, collection, getDoc, getDocs, query } from 'firebase/firestore';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth, db } from '../../firebase';
import { toast } from 'react-toastify';
import TransactionsTable from '../Components/TransactionsTable';
import Charts from '../Components/Charts';
import NoTransactions from '../Components/NoTransactions';

const Dashboard = () => {

  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [user] = useAuthState(auth)
  const [isExpenseModalVisible, setIsExpenseModalVisible] = useState(false);
  const [isIncomeModalVisible, setIsIncomeModalVisible] = useState(false);
  const [income, setIncome] = useState(0);
  const [expense, setExpense] = useState(0);
  const [totalBalance, setTotalBalance] = useState(0);


  const showIncomeModal = () => {
    setIsIncomeModalVisible(true);
  }

  const showExpenseModal = () => {
    setIsExpenseModalVisible(true);
  }

  const handleExpenseCancel = () => {
    setIsExpenseModalVisible(false);
  }

  const handleIncomeCancel = () => {
    setIsIncomeModalVisible(false);
  }

  const onFinish = (values, type) => {
    const newTransaction = {
      type: type,
      date: values.date.format("YYYY-MM-DD"),
      amount: parseFloat(values.amount),
      tag: values.tag,
      name: values.name,
    };
    addTransaction(newTransaction);
  }

  async function addTransaction(transaction, many) {
    try {
      const docRef = await addDoc(
        collection(db, `users/${user.uid}/transactions`),
        transaction
      );
      console.log("Document written with ID: ",docRef.id);
      if(!many) toast.success("Transaction Added!");
      let newArr = transactions;
      newArr.push(transaction);
      setTransactions(newArr);
      calculateBalance();
    } catch (e) {
      console.error("Error adding document: ", e);
      if(!many) toast.error("Couldn't add transaction");
    }
  }

  const resetBalance = () => {
    setIncome(0);
    setExpense(0);
    setTotalBalance(0);
  };

  useEffect(() => {
    fetchTransactions();
  }, [user]);

  useEffect(() => {
    calculateBalance();
  }, [transactions])

  function calculateBalance(){
    let incomeTotal = 0;
    let expenseTotal = 0;

    transactions.forEach((transaction) => {
      if(transaction.type === "income") {
        incomeTotal += transaction.amount;
      } else {
        expenseTotal += transaction.amount;
      }
    });

    setIncome(incomeTotal);
    setExpense(expenseTotal);
    setTotalBalance(incomeTotal - expenseTotal);
  };

  async function fetchTransactions() {
    setLoading(true);
    if(user) {
      const q = query(collection(db, `users/${user.uid}/transactions`));
      try {
        const querySnapshot = await getDocs(q);
        let transactionsArray = [];
        querySnapshot.forEach((doc) => {
          transactionsArray.push(doc.data());
        });
        setTransactions(transactionsArray);
        console.log(transactionsArray);
        // toast.success("Transactions Fetched!");
      } catch (error) {
        console.error("Error fetching documents: ", error);
        // toast.error("Couldn't fetch transactions");
      }
    }
    setLoading(false);
  }

  let sortedTransactions = transactions.sort((a, b) => {
      return new Date(a.date) - new Date(b.date);
  })

  return (
    <div>
      <Header/>
      {loading ? (
        <div style={{
          height: "100vh",
          width: "100vw", 
          display: "flex", 
          justifyContent: "center", 
          alignItems: "center"
        }}>
          <p style={{ fontSize: "2rem", fontWeight: "bold", color: "#1287FF"}}>Loading...</p>
        </div>
      ) : ( 
      <>
        <Cards
          income={income}
          expense={expense}
          totalBalance={totalBalance}
          showExpenseModal={showExpenseModal}
          showIncomeModal={showIncomeModal}
          resetBalance={resetBalance}
        />
        {transactions && transactions.length != 0 ? <Charts sortedTransactions={sortedTransactions} />:<NoTransactions/>}
        <AddExpense
          isExpenseModalVisible={isExpenseModalVisible}
          handleExpenseCancel={handleExpenseCancel}
          onFinish={onFinish}
        />
        <AddIncome
          isIncomeModalVisible={isIncomeModalVisible}
          handleIncomeCancel={handleIncomeCancel}
          onFinish={onFinish}
        />
        <TransactionsTable 
          transactions={transactions}
          addTransaction={addTransaction}
          fetchTransactions={fetchTransactions}
        />
    </>)}
    </div>
  )
}

export default Dashboard