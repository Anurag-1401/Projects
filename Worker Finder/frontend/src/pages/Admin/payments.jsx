import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import '../../Styles/admin.css';

const PaymentPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, worker } = location.state || {};

  const filteredPayments = user?.payments?.filter(
    (payment) => String(payment.workerId) === String(worker?._id)
  ) || [];

  return (
    <div>
      <div style={{ marginLeft:'43%',marginTop:'30px',height: '50px', width: '300px', 
        backgroundColor: 'wheat', display: 'flex', alignItems: 'center', justifyContent: 'center',
        borderRadius:'10px'
        }}>
        <h2 style={{ margin: 0 }}>Payments For: {worker?.workername}</h2>
      </div>

      <div className='list-container' style={{ position: 'relative', left: '23.5%'}}>
        {filteredPayments.length === 0 ? (
          <p className="text-gray-600">No payments found for this worker.</p>
        ) : (
          <table className="worker-table">
            <thead>
              <tr>
                <th>Client Name</th>
                <th>Contact</th>
                <th>Amount</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody className='body'>
              {filteredPayments.map((payment, index) => (
                <tr key={index}>
                  <td>{payment.client}</td>
                  <td>{payment.contact}</td>
                  <td>{payment.amount}</td>
                  <td>{new Date(payment.date).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <button className="contact-btn" style={{ position: 'relative', left: '49%',marginBottom:'30px',color:'black'}}
      onClick={()=>navigate(`/admin/${user.categories}`)}>Back
        </button>
    </div>
  );
};

export default PaymentPage;
