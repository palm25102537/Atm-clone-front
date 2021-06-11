import axios from 'axios'
import React, { useEffect, useState } from 'react'
import Head from '../component/Header'
import Error from '../component/Error'
import { useMyContext } from '../context/myContext'

function TransactionPage() {

  const { show1, show2, setShow1, setShow2 } = useMyContext()

  const [detail, setDetail] = useState(null)

  const [transactionDetail, setTransactionDetail] = useState([])

  async function getMe() {
    const response = await axios.get('/account/me')
    const { data: { accountDetail, transaction } } = response
    setDetail(accountDetail)
    setTransactionDetail(transaction)

  }

  const [cashThatWeHave, setCashThatWehave] = useState([])

  async function howMuchWeHaveCash() {
    const response = await axios.get('/cash')
    const { data: { cash } } = response
    setCashThatWehave(cash)
  }

  useEffect(() => {
    getMe()
    howMuchWeHaveCash()
  }, [])

  const [selectedTransaction, setSelectedTransaction] = useState({
    showTransfer: false,
    selected: '',
  })
  function handleSelectTransaction(event) {
    const { title } = event.target
    if (title === 'transfer') {
      setSelectedTransaction({ showTransfer: true, selected: title })
    } else {
      setSelectedTransaction({ showTransfer: false, selected: title })
    }
  }
  const [transactionInput, setTransactionInput] = useState({
    amount: '',
    transferToId: ''
  })
  function handleTransactionInput(event) {
    const { id, value } = event.target
    setTransactionInput((previous) => ({ ...previous, [id]: value }))
    if (id === 'amount') {
      if (isNaN(value)) {
        setShow1(true)
      } else {
        setShow1(false)
      }
    }
    if (id === 'transfertoId') {
      if (isNaN(value)) {
        setShow2(true)
      } else {
        setShow2(false)
      }
    }
  }
  async function submitTransaction() {
    const { amount, transferToId } = transactionInput
    const { selected } = selectedTransaction

    const sendData = { amount: +amount, transactionToId: +transferToId, transaction: selected }



    setTransactionInput({
      amount: '',
      transfertoId: ''
    })
    setSelectedTransaction({
      showTransfer: false,
      selected: '',
    })


    if (selected === 'withdraw') {
      let sumCashThatWehave = (cashThatWeHave[0].amount * 1000) + (cashThatWeHave[1].amount * 500) + (cashThatWeHave[0].amount * 100)
      if (amount > sumCashThatWehave) return alert('Cannot make a transaction')
      let Onethousand = Math.floor(+amount / 1000)
      let remainfromOneThousand = +amount - (Onethousand * 1000)
      let newBalanceOneThousand = cashThatWeHave[0]?.amount - Onethousand


      if (newBalanceOneThousand < 0) {
        Onethousand = Math.floor(+amount / 1000) + newBalanceOneThousand
        remainfromOneThousand = +amount - (Onethousand * 1000)
      }

      let Fivehundred = Math.floor(remainfromOneThousand / 500)
      let newBalanceFiveHundred = cashThatWeHave[1]?.amount - Fivehundred
      let remainfromFiveHundred = remainfromOneThousand - (Fivehundred * 500)
      if (remainfromFiveHundred % 100 !== 0) return alert('Error')

      if (newBalanceFiveHundred < 0) {
        Fivehundred = Math.floor(remainfromOneThousand / 500) + newBalanceFiveHundred
        remainfromFiveHundred = remainfromOneThousand - (Fivehundred * 500)
      }

      let Onehundred = Math.floor(remainfromFiveHundred / 100)
      let newBalanceOneHundred = cashThatWeHave[2]?.amount - Onehundred

      if (newBalanceOneHundred < 0) {
        return alert('Only left One thousand, or five hundred notes')
      }
      await axios.put(`/cash/edit/${cashThatWeHave[0].id}`, { amount: newBalanceOneThousand })
      await axios.put(`/cash/edit/${cashThatWeHave[1].id}`, { amount: newBalanceFiveHundred })
      await axios.put(`/cash/edit/${cashThatWeHave[2].id}`, { amount: newBalanceOneHundred })
      window.confirm(`You will receive \n
      One thousand Note : ${Onethousand} \n
      Five hundred Note : ${Fivehundred} \n
      One hundred Note : ${Onehundred} \n

      Thank you for choosing us
      `)

    }
    const response = await axios.post('/transaction/create', sendData)
    const { data: { message, newBalance, ownNewBalance } } = response
    alert(`${message} \n new balance is ${newBalance || ownNewBalance}`)
    getMe()
    howMuchWeHaveCash()
  }

  return (
    <div>
      <Head />
      <div style={{ marginLeft: '15px' }}>
        <a style={{ textDecoration: 'none', color: 'grey' }} href='' onClick={() => console.log('click')}>Sign out</a>
      </div>
      <div className='transaction-grid'>
        <div style={{ marginLeft: '25px' }}>
          <p>History</p>

          {
            transactionDetail?.map((item) => {

              return (
                <div key={item.id} style={{ marginTop: '10px' }}>
                  <p >{item.transaction} {item.amount} Bath</p>
                </div>
              )
            })
          }
        </div>
        <div style={{ textAlign: 'center' }}>
          <h3>Dear {detail?.name} {detail?.surname}</h3>
          <h4>Your balance is {detail?.balance} Bath</h4>
          <br />
          <p >Make a Transaction</p>
          <br />
          <div className='transacion-button'>
            <div style={{ marginTop: '20px' }}>
              <button title='deposit' onClick={(e) => handleSelectTransaction(e)}>Deposit</button>
            </div>
            <div style={{ marginLeft: '10px', marginRight: '10px', marginTop: '20px' }}>
              <button title='withdraw' onClick={(e) => handleSelectTransaction(e)}>Withdraw</button>
            </div>
            <div style={{ marginTop: '20px' }}>
              <button title='transfer' onClick={(e) => handleSelectTransaction(e)}>Transfer</button>
            </div>
          </div>
          <br />
          <br />
          <div>
            <div>
              <label htmlFor='amount'>Amount : </label>
              <input value={transactionInput.amount} onChange={(e) => handleTransactionInput(e)} id='amount'></input> <span>Bath</span>
              {
                show1 ? (<Error />) : (
                  <div style={{ height: '14px', marginTop: '2px' }}>
                  </div>
                )
              }
            </div>
            <br />
            {
              selectedTransaction.showTransfer && (
                <div>
                  <label htmlFor='transferToId'>Transfer to Account : </label>
                  <input value={transactionInput.transferToId} onChange={(e) => handleTransactionInput(e)} id='transferToId'></input>
                  {
                    show2 ? (<Error />) : (
                      <div style={{ height: '14px', marginTop: '2px' }}>
                      </div>
                    )
                  }
                </div>
              )
            }
          </div>
          <div>
            <button onClick={submitTransaction}>Confirm</button>
          </div>
        </div>
        <div>
        </div>
      </div>
    </div>
  )
}

export default TransactionPage
