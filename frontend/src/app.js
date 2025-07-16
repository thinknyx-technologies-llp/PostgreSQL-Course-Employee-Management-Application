import React, { useState } from 'react';
import axios from 'axios';

function App() {
  const [form, setForm] = useState({
    empid: '',
    name: '',
    dept_id: '',
    salary: '',
    hire_date: ''
  });

  const [viewData, setViewData] = useState([]);
  const [deptData, setDeptData] = useState([]);
  const [isEditMode, setIsEditMode] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const resetForm = () => {
    setForm({
      empid: '',
      name: '',
      dept_id: '',
      salary: '',
      hire_date: ''
    });
    setIsEditMode(false);
  };

  const showAlert = (msg) => {
    alert(msg);
    setTimeout(() => window.scrollTo({ top: 0, behavior: 'smooth' }), 300);
  };

  const validateFields = (...fields) => {
    return fields.every(f => String(f).trim() !== '');
  };

  const addEmployee = () => {
    const { empid, name, dept_id, salary, hire_date } = form;
    if (!validateFields(empid, name, dept_id, salary, hire_date)) {
      return showAlert("Please fill in all fields before submitting.");
    }

    axios.post('http://localhost:5000/add_employee', form)
      .then(res => {
        showAlert(res.data.message);
        setViewData([]);
        setDeptData([]);
        resetForm();
      })
      .catch(err => showAlert(err.response?.data?.message || err.message));
  };

  const updateEmployee = () => {
    const { empid, name, dept_id, salary, hire_date } = form;

    if (!String(empid).trim()) {
      return showAlert("Please enter Emp ID.");
    }

    if (!isEditMode) {
      axios.get('http://localhost:5000/get_employee', {
        params: { empid }
      })
        .then(res => {
          const [data] = res.data;
          console.log(data)
          if (!data) {
            return showAlert("No employee found with this ID.");
          }

          setForm({
            empid: String(data.empid),
            name: data.name,
            dept_id: String(data.dept_id),
            salary: String(data.salary),
            hire_date: new Date(data.hire_date).toISOString().split('T')[0] 
          });

          setIsEditMode(true);
          showAlert("Employee data loaded. Now modify fields and click Update again.");
        })
        .catch(() => showAlert("Failed to fetch employee details."));
    } else {
      if (!validateFields(empid, name, dept_id, salary, hire_date)) {
        return showAlert("Please fill in all fields before updating.");
      }

      axios.put(`http://localhost:5000/update_employee/${empid}`, form)
        .then(res => {
          showAlert(res.data.message);
          setViewData([]);
          setDeptData([]);
          resetForm();
        })
        .catch(err => showAlert(err.response?.data?.message || err.message));
    }
  };

  const deleteEmployee = () => {
    if (!String(form.empid).trim()) {
      return showAlert("Please enter Emp ID to delete.");
    }

    axios.delete(`http://localhost:5000/delete_employee/${form.empid}`)
      .then(res => {
        showAlert(res.data.message);
        setViewData([]);
        setDeptData([]);
        resetForm();
      })
      .catch(err => showAlert(err.response?.data?.message || err.message));
  };

  const viewEmployee = () => {
    if (!form.empid && !form.name) {
      return showAlert("Please enter either Emp ID or Name to view.");
    }

    axios.get(`http://localhost:5000/get_employee`, {
      params: {
        empid: form.empid || undefined,
        name: form.name || undefined
      }
    })
      .then(res => {
        setViewData(res.data);
        setDeptData([]);
      })
      .catch(() => showAlert("No data found or error occurred."));
  };

  const viewAllWithDept = () => {
    axios.get('http://localhost:5000/get_employees_with_department')
      .then(res => {
        setDeptData(res.data);
        setViewData([]);
      })
      .catch(() => showAlert("Failed to fetch department data."));
  };

  return (
    <div className="container mt-5">
      <h2 className="mb-4">Employee Management</h2>

      <div className="row mb-3">
        <div className="col-md-6">
          <input className="form-control" name="empid" placeholder="Emp ID" onChange={handleChange} value={form.empid} />
        </div>
        <div className="col-md-6">
          <input className="form-control" name="name" placeholder="Name" onChange={handleChange} value={form.name} />
        </div>
        <div className="col-md-6 mt-3">
          <input className="form-control" name="dept_id" placeholder="Dept ID" onChange={handleChange} value={form.dept_id} />
        </div>
        <div className="col-md-6 mt-3">
          <input className="form-control" name="salary" placeholder="Salary" onChange={handleChange} value={form.salary} />
        </div>
        <div className="col-md-6 mt-3">
          <input type='date' className="form-control" name="hire_date" placeholder="Hire Date (YYYY-MM-DD)" onChange={handleChange} value={form.hire_date} />
        </div>
      </div>

      <div className="d-flex flex-wrap gap-2 mb-4">
        <button className="btn btn-primary" onClick={addEmployee}>Add Employee</button>
        <button className="btn btn-warning" onClick={updateEmployee}>Update Employee</button>
        <button className="btn btn-danger" onClick={deleteEmployee}>Delete Employee</button>
        <button className="btn btn-info" onClick={viewEmployee}>View Employee</button>
        <button className="btn btn-success" onClick={viewAllWithDept}>View All With Department</button>
        <button className="btn btn-secondary" onClick={resetForm}>Clear Form</button>
      </div>

      {viewData.length > 0 && (
        <div>
          <h5>Employee Details</h5>
          <table className="table table-bordered table-hover">
            <thead className="table-dark">
              <tr>
                <th>Emp ID</th>
                <th>Name</th>
                <th>Dept ID</th>
                <th>Salary</th>
                <th>Hire Date</th>
                <th>Department</th>
              </tr>
            </thead>
            <tbody>
              {viewData.map((emp, i) => (
                <tr key={i}>
                  <td>{emp.empid}</td>
                  <td>{emp.name}</td>
                  <td>{emp.dept_id}</td>
                  <td>{emp.salary}</td>
                  <td>{new Date(emp.hire_date).toLocaleDateString()}</td>
                  <td>{emp.department_name}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {deptData.length > 0 && (
        <div>
          <h5>Employees with Department</h5>
          <table className="table table-striped table-bordered">
            <thead className="table-dark">
              <tr>
                <th>Emp ID</th>
                <th>Name</th>
                <th>Salary</th>
                <th>Hire Date</th>
                <th>Department</th>
              </tr>
            </thead>
            <tbody>
              {deptData.map((emp, i) => (
                <tr key={i}>
                  <td>{emp.empid}</td>
                  <td>{emp.name}</td>
                  <td>{emp.salary}</td>
                  <td>{new Date(emp.hire_date).toLocaleDateString()}</td>
                  <td>{emp.department_name}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default App;
