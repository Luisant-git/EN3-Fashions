import React, { useState, useEffect } from "react";
import {
  Search,
  Filter,
  Plus,
  Edit,
  Trash2,
  Eye,
  X,
  Upload,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import DataTable from "../components/DataTable";
import {
  getSubCategories,
  getSubCategory,
  updateSubCategory,
  deleteSubCategory,
  uploadImage,
  getCategories,
} from "../api";

// Modal component
const Modal = ({ open, onClose, children }) => {
  if (!open) return null;
  return (
    <div className="modal-backdrop">
      <div className="modal">
        <button className="modal-close" onClick={onClose}>
          <X size={20} />
        </button>
        {children}
      </div>
    </div>
  );
};

const SubCategoryList = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [subCategories, setSubCategories] = useState([]);
  const [categories, setCategories] = useState([]);
  const [modal, setModal] = useState({ type: null, subCategory: null });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [subCategoriesData, categoriesData] = await Promise.all([
          getSubCategories(),
          getCategories(),
        ]);
        setSubCategories(subCategoriesData);
        setCategories(categoriesData);
      } catch (err) {
        const errorMsg = `Failed to load data: ${err.message}`;
        setError(errorMsg);
        toast.error(errorMsg);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const openModal = async (type, subCategory) => {
    if (type === "view" || type === "edit") {
      try {
        const fullSubCategory = await getSubCategory(subCategory.id);
        setModal({ type, subCategory: fullSubCategory });
      } catch (err) {
        toast.error(`Failed to load subcategory details: ${err.message}`);
      }
    } else {
      setModal({ type, subCategory });
    }
  };
  const closeModal = () => setModal({ type: null, subCategory: null });

  const handleEdit = async (updatedSubCategory) => {
    try {
      await updateSubCategory(updatedSubCategory.id, updatedSubCategory);
      setSubCategories(
        subCategories.map((sc) =>
          sc.id === updatedSubCategory.id
            ? {
                ...sc,
                ...updatedSubCategory,
                category: categories.find(
                  (c) => c.id === updatedSubCategory.categoryId
                ),
              }
            : sc
        )
      );
      toast.success("Subcategory updated successfully!");
      closeModal();
    } catch (err) {
      toast.error(`Failed to update subcategory: ${err.message}`);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteSubCategory(id);
      setSubCategories(subCategories.filter((sc) => sc.id !== id));
      toast.success("Subcategory deleted successfully!");
      closeModal();
    } catch (err) {
      toast.error(`Failed to delete subcategory: ${err.message}`);
    }
  };

  const ViewModal = ({ subCategory }) => (
    <div className="modal-content view-modal">
      <h2>Subcategory Details</h2>
      <img
        src={subCategory.image || "/placeholder.svg"}
        alt={subCategory.name}
        className="modal-product-image"
      />
      <div className="modal-product-info">
        <p>
          <strong>Name:</strong> {subCategory.name}
        </p>
        <p>
          <strong>Parent Category:</strong>{" "}
          {subCategory.category?.name || "N/A"}
        </p>
        <p>
          <strong>Description:</strong> {subCategory.description || "N/A"}
        </p>
      </div>
    </div>
  );

  const EditModal = ({ subCategory, onSave }) => {
    const [form, setForm] = useState({
      name: subCategory.name,
      description: subCategory.description || "",
      image: subCategory.image || "",
      categoryId: subCategory.categoryId,
    });
    const [saving, setSaving] = useState(false);
    const [imageUploading, setImageUploading] = useState(false);

    const handleImageUpload = async (e) => {
      const file = e.target.files[0];
      if (file) {
        setImageUploading(true);
        try {
          const uploadResult = await uploadImage(file);
          setForm((f) => ({ ...f, image: uploadResult.url }));
          toast.success("Image uploaded successfully!");
        } catch (err) {
          toast.error("Failed to upload image");
        } finally {
          setImageUploading(false);
        }
      }
    };

    const handleSubmit = async (e) => {
      e.preventDefault();
      setSaving(true);
      try {
        await onSave({ ...subCategory, ...form });
      } finally {
        setSaving(false);
      }
    };

    return (
      <form className="modal-content edit-modal" onSubmit={handleSubmit}>
        <h2>Edit Subcategory</h2>
        <label>
          Subcategory Image
          <div className="image-edit-section">
            {form.image && (
              <img
                src={form.image}
                alt="Subcategory"
                className="current-image"
                style={{
                  width: "100px",
                  height: "100px",
                  objectFit: "cover",
                  marginBottom: "10px",
                }}
              />
            )}
            <div
              className="image-upload-area"
              onClick={() =>
                document.getElementById("edit-image-upload").click()
              }
            >
              <input
                type="file"
                id="edit-image-upload"
                accept="image/*"
                onChange={handleImageUpload}
                style={{ display: "none" }}
              />
              <div className="upload-label">
                <Upload size={24} />
                <span>{imageUploading ? "Uploading..." : "Change Image"}</span>
              </div>
            </div>
          </div>
        </label>
        <label>
          Name
          <input
            value={form.name}
            onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
            required
          />
        </label>
        <label>
          Parent Category
          <select
            value={form.categoryId}
            onChange={(e) =>
              setForm((f) => ({ ...f, categoryId: parseInt(e.target.value) }))
            }
            required
          >
            <option value="">Select Category</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
        </label>
        <label>
          Description
          <textarea
            value={form.description}
            onChange={(e) =>
              setForm((f) => ({ ...f, description: e.target.value }))
            }
          />
        </label>
        <div className="modal-actions">
          <button
            type="button"
            onClick={closeModal}
            className="btn btn-outline"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="btn btn-primary"
            disabled={saving || imageUploading}
          >
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </form>
    );
  };

  const DeleteModal = ({ subCategory, onDelete }) => (
    <div className="modal-content delete-modal">
      <h2>Delete Subcategory</h2>
      <p>
        Are you sure you want to delete <strong>{subCategory.name}</strong>?
      </p>
      <div className="modal-actions">
        <button className="btn btn-outline" onClick={closeModal}>
          Cancel
        </button>
        <button
          className="btn btn-danger"
          onClick={() => onDelete(subCategory.id)}
        >
          Delete
        </button>
      </div>
    </div>
  );

  const columns = [
    {
      key: "image",
      label: "Image",
      render: (value, row) => (
        <img
          src={value || "/placeholder.svg"}
          alt={row.name}
          className="product-thumbnail"
        />
      ),
    },
    { key: "name", label: "Subcategory Name" },
    {
      key: "category",
      label: "Parent Category",
      render: (value) => value?.name || "N/A",
    },
    { key: "description", label: "Description" },
    {
      key: "createdAt",
      label: "Created",
      render: (value) => new Date(value).toLocaleDateString("en-GB"),
    },
    {
      key: "actions",
      label: "Actions",
      render: (_, row) => (
        <div className="action-buttons">
          <button
            className="action-btn view"
            title="View"
            onClick={() => openModal("view", row)}
          >
            <Eye size={16} />
          </button>
          <button
            className="action-btn edit"
            onClick={() => openModal("edit", row)}
            title="Edit"
          >
            <Edit size={16} />
          </button>
          <button
            className="action-btn delete"
            onClick={() => openModal("delete", row)}
            title="Delete"
          >
            <Trash2 size={16} />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="subcategory-list">
      <div className="page-header with-actions">
        <div className="header-left">
          <h1>Sub Categories</h1>
          <p>Manage your product subcategories</p>
        </div>
        <button
          className="btn btn-primary"
          onClick={() => navigate("/add-sub-category")}
        >
          <Plus size={20} />
          Add Sub Category
        </button>
      </div>

      {error && <div className="error-message">{error}</div>}

      <div className="filters-section">
        <div className="search-container">
          <Search size={20} className="search-icon" />
          <input
            type="text"
            placeholder="Search subcategories..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>
      </div>

      {loading ? (
        <div className="loading-message">Loading subcategories...</div>
      ) : (
        <>
          <DataTable
            data={subCategories}
            columns={columns}
            searchTerm={searchTerm}
            searchKey="name"
          />

          <Modal open={modal.type === "view"} onClose={closeModal}>
            {modal.subCategory && <ViewModal subCategory={modal.subCategory} />}
          </Modal>
          <Modal open={modal.type === "edit"} onClose={closeModal}>
            {modal.subCategory && (
              <EditModal subCategory={modal.subCategory} onSave={handleEdit} />
            )}
          </Modal>
          <Modal open={modal.type === "delete"} onClose={closeModal}>
            {modal.subCategory && (
              <DeleteModal
                subCategory={modal.subCategory}
                onDelete={handleDelete}
              />
            )}
          </Modal>
        </>
      )}
    </div>
  );
};

export default SubCategoryList;
