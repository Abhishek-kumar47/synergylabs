import './index.css'
import React, { useEffect, useState } from 'react'
import { Routes, Route, Link, useNavigate, useParams } from 'react-router-dom'
const Spinner = () => (
  <div className="flex justify-center items-center h-64">
    <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-500"></div>
  </div>
)
const UserList = ({ users, setUsers }) => {
  const navigate = useNavigate()

  const handleDelete = async (id) => {
    try {
      await fetch(`https://jsonplaceholder.typicode.com/users/${id}`, { method: 'DELETE' })
      setUsers(users.filter(user => user.id !== id))
      alert('User deleted successfully (simulated)')
    } catch (err) {
      alert('Error deleting user')
    }
  }

  if (!users.length) return <Spinner />
  return (
    <div className="p-6 max-w-5xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">User Management</h1>
        <button
          onClick={() => navigate('/create')}
          className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
        >
          + Add User
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border rounded-lg shadow-md">
          <thead>
            <tr className="bg-gray-100 text-left">
              <th className="py-2 px-4">Name</th>
              <th className="py-2 px-4">Email</th>
              <th className="py-2 px-4">Phone</th>
              <th className="py-2 px-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map(user => (
              <tr key={user.id} className="border-t hover:bg-gray-50">
                <td className="py-2 px-4">{user.name}</td>
                <td className="py-2 px-4">{user.email}</td>
                <td className="py-2 px-4">{user.phone}</td>
                <td className="py-2 px-4 flex gap-2">
                  <button
                    onClick={() => navigate(`/edit/${user.id}`)}
                    className="bg-gray-500 text-white px-3 py-1 rounded hover:bg-yellow-600"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(user.id)}
                    className="bg-gray-600 text-white px-3 py-1 rounded hover:bg-red-700"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
const UserForm = ({ users, setUsers, isEdit }) => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [formData, setFormData] = useState({ name: '', email: '', phone: '' })

  useEffect(() => {
    if (isEdit && id) {
      const userToEdit = users.find(u => u.id === Number(id))
      if (userToEdit) setFormData(userToEdit)
    }
  }, [id, isEdit, users])

  const handleSubmit = async (e) => {
    e.preventDefault()

    const method = isEdit ? 'PUT' : 'POST'
    const url = isEdit
      ? `https://jsonplaceholder.typicode.com/users/${id}`
      : 'https://jsonplaceholder.typicode.com/users'

    try {
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })
      const data = await res.json()

      if (isEdit) {
        setUsers(users.map(u => (u.id === Number(id) ? { ...u, ...formData } : u)))
      } else {
        setUsers([...users, { ...data, id: users.length + 1 }])
      }

      alert(`User ${isEdit ? 'updated' : 'created'} successfully`)
      navigate('/')
    } catch (error) {
      alert('Error submitting data')
    }
  }
  return (
    <div className="p-6 max-w-md mx-auto">
      <h2 className="text-2xl font-semibold mb-4 text-center">
        {isEdit ? 'Edit User' : 'Create User'}
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4 bg-white shadow-md rounded p-4">
        <input
          type="text"
          placeholder="Name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          className="w-full border px-3 py-2 rounded focus:outline-none focus:ring focus:ring-blue-300"
          required
        />
        <input
          type="email"
          placeholder="Email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          className="w-full border px-3 py-2 rounded focus:outline-none focus:ring focus:ring-blue-300"
          required
        />
        <input
          type="text"
          placeholder="Phone"
          value={formData.phone}
          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
          className="w-full border px-3 py-2 rounded focus:outline-none focus:ring focus:ring-blue-300"
          required
        />
        <div className="flex justify-between">
          <button type="submit" className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700">
            {isEdit ? 'Update' : 'Create'}
          </button>
          <button type="button" onClick={() => navigate('/')} className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600">
            Cancel
          </button>
        </div>
      </form>
    </div>
  )
}

const App = () => {
  const [users, setUsers] = useState([])

  useEffect(() => {
    fetch('https://jsonplaceholder.typicode.com/users')
      .then(res => res.json())
      .then(data => setUsers(data))
  }, [])

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-gray-600 text-white p-4 shadow-md">
        <div className="max-w-5xl mx-auto flex justify-between items-center">
          <Link to="/" className="text-xl font-bold">User CRUD</Link>
        </div>
      </nav>

      <Routes>
        <Route path="/" element={<UserList users={users} setUsers={setUsers} />} />
        <Route path="/create" element={<UserForm users={users} setUsers={setUsers} isEdit={false} />} />
        <Route path="/edit/:id" element={<UserForm users={users} setUsers={setUsers} isEdit={true} />} />
      </Routes>
    </div>
  )
}

export default App
