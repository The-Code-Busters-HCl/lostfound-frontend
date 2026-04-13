import React, { useState, useEffect } from 'react';

const BASE_URL = import.meta.env.VITE_BASE_URL;

const Items = () => {
  const [items, setItems] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    itemName: '',
    itemLocation: '',
    status: false
  });

  const token = localStorage.getItem("token");
  console.log(token);
  // ✅ FETCH ITEMS
  const fetchItems = async () => {
    try {
      const res = await fetch(`${BASE_URL}/items/`, { // ❗ removed trailing /
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });

      const data = await res.json();
      setItems(data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  // ✅ ADD ITEM
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await fetch(`${BASE_URL}/items/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      setShowModal(false);
      setFormData({ itemName: '', itemLocation: '', status: false });
      fetchItems();
    } catch (err) {
      console.error(err);
    }
  };

  // ✅ TOGGLE STATUS
  const handleStatusChange = async (id, currentStatus) => {
    try {
      await fetch(`${BASE_URL}/items/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ status: !currentStatus })
      });

      fetchItems();
    } catch (err) {
      console.error(err);
    }
  };

  // ✅ DELETE ITEM
  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this item?")) {
      try {
        await fetch(`${BASE_URL}/items/${id}`, {
          method: "DELETE",
          headers: {
            "Authorization": `Bearer ${token}`
          }
        });

        fetchItems();
      } catch (err) {
        console.error(err);
      }
    }
  };

  return (
    <div className="container mt-5">

      {/* HEADER */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Lost & Found Items</h2>
        <button className="btn btn-primary" onClick={() => setShowModal(true)}>
          Report Item
        </button>
      </div>

      {/* TABLE */}
      <div className="table-responsive">
        <table className="table table-striped table-bordered shadow-sm bg-white">
          <thead className="table-dark">
            <tr>
              <th>ID</th>
              <th>Item Name</th>
              <th>Location</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {items.map(item => (
              <tr key={item.itemId}>
                <td>{item.itemId}</td>
                <td>{item.itemName || "N/A"}</td>
                <td>{item.itemLocation || "N/A"}</td>

                <td>
                  <span className={`badge ${item.status ? 'bg-success' : 'bg-warning'}`}>
                    {item.status ? 'Found/Returned' : 'Lost'}
                  </span>
                </td>

                <td>
                  <button
                    className="btn btn-outline-success btn-sm me-2"
                    onClick={() => handleStatusChange(item.itemId, item.status)}
                  >
                    Toggle
                  </button>

                  <button
                    className="btn btn-outline-danger btn-sm"
                    onClick={() => handleDelete(item.itemId)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}

            {items.length === 0 && (
              <tr>
                <td colSpan="5" className="text-center">
                  No items reported yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* ✅ MODAL (Bootstrap native) */}
      {showModal && (
        <div className="modal d-block" tabIndex="-1">
          <div className="modal-dialog">
            <div className="modal-content">

              <div className="modal-header">
                <h5 className="modal-title">Report New Item</h5>
                <button className="btn-close" onClick={() => setShowModal(false)}></button>
              </div>

              <div className="modal-body">
                <form onSubmit={handleSubmit}>

                  <div className="mb-3">
                    <label className="form-label">Item Name</label>
                    <input
                      type="text"
                      className="form-control"
                      required
                      value={formData.itemName}
                      onChange={(e) =>
                        setFormData({ ...formData, itemName: e.target.value })
                      }
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Location</label>
                    <input
                      type="text"
                      className="form-control"
                      required
                      value={formData.itemLocation}
                      onChange={(e) =>
                        setFormData({ ...formData, itemLocation: e.target.value })
                      }
                    />
                  </div>

                  <div className="form-check mb-3">
                    <input
                      type="checkbox"
                      className="form-check-input"
                      checked={formData.status}
                      onChange={(e) =>
                        setFormData({ ...formData, status: e.target.checked })
                      }
                    />
                    <label className="form-check-label">
                      Found/Returned
                    </label>
                  </div>

                  <button className="btn btn-primary w-100" type="submit">
                    Submit
                  </button>

                </form>
              </div>

            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default Items;