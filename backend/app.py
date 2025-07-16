from flask import Flask, request, jsonify
from flask_cors import CORS
import psycopg2
from dotenv import load_dotenv
import os

app = Flask(__name__)
CORS(app)

# Load environment variables
load_dotenv()
print("Host:", os.getenv("DB_HOST"))
print("DB:", os.getenv("DB_NAME"))
print("User:", os.getenv("DB_USER"))
print("Password:", os.getenv("DB_PASSWORD"))

# Connect to PostgreSQL
conn = psycopg2.connect(
    host=os.getenv("DB_HOST"),
    database=os.getenv("DB_NAME"),
    user=os.getenv("DB_USER"),
    password=os.getenv("DB_PASSWORD")
)
cur = conn.cursor()

@app.route('/add_employee', methods=['POST'])
def add_employee():
    data = request.json
    cur.execute(
        "INSERT INTO testing_project (empid, name, dept_id, salary, hire_date) VALUES (%s, %s, %s, %s, %s)",
        (data['empid'], data['name'], data['dept_id'], data['salary'], data['hire_date'])
    )
    conn.commit()
    return jsonify({'message': 'Employee added successfully'})

@app.route('/update_employee/<int:empid>', methods=['PUT'])
def update_employee(empid):
    data = request.json
    cur.execute(
        "UPDATE testing_project SET name=%s, dept_id=%s, salary=%s, hire_date=%s WHERE empid=%s",
        (data['name'], data['dept_id'], data['salary'], data['hire_date'], empid)
    )
    conn.commit()
    return jsonify({'message': 'Employee updated successfully'})

@app.route('/delete_employee/<int:empid>', methods=['DELETE'])
def delete_employee(empid):
    cur.execute("DELETE FROM testing_project WHERE empid = %s", (empid,))
    conn.commit()
    return jsonify({'message': 'Employee deleted successfully'})

@app.route('/get_employee', methods=['GET'])
def get_employee():
    empid = request.args.get('empid')
    name = request.args.get('name')

    if empid:
        cur.execute("SELECT e.empid, e.name,e.dept_id, e.salary, e.hire_date, d.department_name FROM testing_project e JOIN department d ON e.dept_id = d.dept_id WHERE empid = %s", (empid,))
    elif name:
        cur.execute("SELECT e.empid, e.name,e.dept_id, e.salary, e.hire_date, d.department_name FROM testing_project e JOIN department d ON e.dept_id = d.dept_id WHERE name LIKE %s", ('%' + name + '%',))
    else:
        return jsonify({'error': 'Provide empid or name'}), 400

    rows = cur.fetchall()
    print(rows)
    columns = ['empid', 'name','dept_id', 'salary', 'hire_date', 'department_name']
    results = [dict(zip(columns, row)) for row in rows]
    return results

@app.route('/get_employees_with_department', methods=['GET'])
def get_employees_with_department():
    cur.execute("""
        SELECT e.empid, e.name, e.salary, e.hire_date, d.department_name
        FROM testing_project e
        JOIN department d ON e.dept_id = d.dept_id ORDER BY e.empid
    """)
    rows = cur.fetchall()
    columns = ['empid', 'name', 'salary', 'hire_date', 'department_name']
    results = [dict(zip(columns, row)) for row in rows]
    return jsonify(results)

if __name__ == '__main__':
    app.run(debug=True)
