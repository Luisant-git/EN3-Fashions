import React, { useEffect, useState } from "react";
import { Search, Filter, Plus, Edit, Trash2, Eye, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import DataTable from "../components/DataTable";
import {
  getProducts,
  getProduct,
  updateProduct,
  deleteProduct,
  getCategories,
  getBrands,
  uploadImage,
} from "../api";
import "../styles/pages/product-list.scss";

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

const ProductList = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [modal, setModal] = useState({ type: null, product: null });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [productsData, categoriesData, brandsData] = await Promise.all([
          getProducts(),
          getCategories(),
          getBrands(),
        ]);
        console.log("Products:", productsData);
        console.log("Categories:", categoriesData);
        console.log("Brands:", brandsData);
        console.log("API Base URL:", import.meta.env.VITE_API_BASE_URL);
        setProducts(productsData);
        setCategories(categoriesData);
        setBrands(brandsData);
      } catch (err) {
        console.error("Error loading data:", err);
        console.error("Error details:", err.message);
        const errorMsg = `Failed to load products: ${err.message}`;
        setError(errorMsg);
        toast.error(errorMsg);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Modal handlers
  const openModal = async (type, product) => {
    if (type === "view" || type === "edit") {
      try {
        const fullProduct = await getProduct(product.id);
        setModal({ type, product: fullProduct });
      } catch (err) {
        console.error("Error loading product details:", err);
        const errorMsg = `Failed to load product details: ${err.message}`;
        setError(errorMsg);
        toast.error(errorMsg);
      }
    } else {
      setModal({ type, product });
    }
  };
  const closeModal = () => setModal({ type: null, product: null });

  // Edit handler
  const handleEdit = async (updatedProduct) => {
    try {
      await updateProduct(updatedProduct.id, updatedProduct);
      setProducts(
        products.map((p) =>
          p.id === updatedProduct.id ? { ...p, ...updatedProduct } : p
        )
      );
      toast.success("Product updated successfully!");
      closeModal();
    } catch (err) {
      console.error("Error updating product:", err);
      const errorMsg = `Failed to update product: ${err.message}`;
      setError(errorMsg);
      toast.error(errorMsg);
    }
  };

  // Delete handler
  const handleDelete = async (id) => {
    try {
      await deleteProduct(id);
      setProducts(products.filter((p) => p.id !== id));
      toast.success("Product deleted successfully!");
      closeModal();
    } catch (err) {
      console.error("Error deleting product:", err);
      const errorMsg = `Failed to delete product: ${err.message}`;
      setError(errorMsg);
      toast.error(errorMsg);
    }
  };

  const handleNewArrivalsToggle = async (product) => {
    try {
      const updatedProduct = { ...product, newArrivals: !product.newArrivals };
      await updateProduct(product.id, updatedProduct);
      setProducts(
        products.map((p) =>
          p.id === product.id ? updatedProduct : p
        )
      );
      toast.success(`Product ${updatedProduct.newArrivals ? 'added to' : 'removed from'} New Arrivals!`);
    } catch (err) {
      console.error("Error updating product:", err);
      toast.error(`Failed to update product: ${err.message}`);
    }
  };

  const columns = [
    {
      key: "gallery",
      label: "Image",
      render: (value, row) => (
        <img
          src={row.gallery?.[0]?.url || row.colors?.[0]?.image || "/placeholder.svg"}
          alt="Product"
          className="product-thumbnail"
        />
      ),
    },
    { key: "name", label: "Product Name" },
    {
      key: "category",
      label: "Category",
      render: (value, row) => row.category?.name || "N/A",
    },
    {
      key: "basePrice",
      label: "Base Price",
      render: (value) => `₹${value}`,
    },
    {
      key: "colors",
      label: "Variants",
      render: (value) => (
        <span className="stock-badge in-stock">
          {value?.length || 0} colors
        </span>
      ),
    },
    {
      key: "newArrivals",
      label: "New Arrivals",
      render: (value, row) => (
        <input
          type="checkbox"
          checked={value || false}
          onChange={() => handleNewArrivalsToggle(row)}
          style={{ cursor: 'pointer', width: '18px', height: '18px' }}
        />
      ),
    },
    {
      key: "status",
      label: "Status",
      render: (value) => (
        <span
          className={`status-badge ${value.toLowerCase().replace(" ", "-")}`}
        >
          {value}
        </span>
      ),
    },
    {
      key: "actions",
      label: "Actions",
      render: (_, row) => (
        <div className="action-buttons">
          <button
            className="action-btn view"
            onClick={() => openModal("view", row)}
          >
            <Eye size={16} />
          </button>
          <button
            className="action-btn edit"
            onClick={() => openModal("edit", row)}
          >
            <Edit size={16} />
          </button>
          <button
            className="action-btn delete"
            onClick={() => openModal("delete", row)}
          >
            <Trash2 size={16} />
          </button>
        </div>
      ),
    },
  ];

  // Modal content for view
  const ViewModal = ({ product }) => (
    <div className="modal-content view-modal">
      <h2>Product Details</h2>
      {product.gallery && product.gallery.length > 0 && (
        <div style={{ display: 'flex', gap: '8px', marginBottom: '16px', flexWrap: 'wrap' }}>
          {product.gallery.map((img, i) => (
            <img
              key={i}
              src={img.url}
              alt={`${product.name} ${i + 1}`}
              style={{ width: '100px', height: '100px', objectFit: 'cover', borderRadius: '8px' }}
            />
          ))}
        </div>
      )}
      <div className="modal-product-info">
        <p>
          <strong>Name:</strong> {product.name}
        </p>
        <p>
          <strong>Description:</strong> {product.description || "N/A"}
        </p>
        <p>
          <strong>Category:</strong> {product.category?.name || "N/A"}
        </p>
        <p>
          <strong>SubCategory:</strong> {product.subCategory?.name || "N/A"}
        </p>
        <p>
          <strong>Brand:</strong> {product.brand?.name || "N/A"}
        </p>
        <p>
          <strong>Base Price:</strong> ₹{product.basePrice}
        </p>
        <p>
          <strong>Status:</strong> {product.status}
        </p>
        {product.tags && product.tags.length > 0 && (
          <p>
            <strong>Tags:</strong> {product.tags.join(", ")}
          </p>
        )}
        {product.colors && product.colors.length > 0 && (
          <div style={{ marginTop: '16px' }}>
            <strong>Color Variants:</strong>
            {product.colors.map((color, i) => (
              <div key={i} style={{ marginTop: '8px', padding: '8px', background: '#f9fafb', borderRadius: '6px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                  <div style={{ width: '20px', height: '20px', borderRadius: '50%', background: color.code, border: '1px solid #e5e7eb' }}></div>
                  <strong>{color.name}</strong>
                </div>
                <div style={{ fontSize: '13px', color: '#6b7280' }}>
                  Sizes: {color.sizes.map(s => `${s.size} (₹${s.price}, Qty: ${s.quantity})`).join(', ')}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );

  // Modal content for edit
  const EditModal = ({ product, onSave }) => {
    const [form, setForm] = useState({
      name: product.name,
      description: product.description || "",
      basePrice: product.basePrice,
      status: product.status,
      categoryId: product.categoryId,
      subCategoryId: product.subCategoryId || "",
      brandId: product.brandId || "",
      tags: product.tags || [],
      gallery: product.gallery || [],
      colors: product.colors || [],
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
        await onSave({ ...product, ...form });
      } finally {
        setSaving(false);
      }
    };

    return (
      <form className="modal-content edit-modal" onSubmit={handleSubmit}>
        <h2>Edit Product</h2>
        <div style={{ marginBottom: '16px' }}>
          <strong>Gallery Images:</strong>
          {form.gallery && form.gallery.length > 0 && (
            <div style={{ display: 'flex', gap: '8px', marginTop: '8px', flexWrap: 'wrap' }}>
              {form.gallery.map((img, i) => (
                <img
                  key={i}
                  src={img.url}
                  alt={`Gallery ${i + 1}`}
                  style={{ width: '60px', height: '60px', objectFit: 'cover', borderRadius: '6px' }}
                />
              ))}
            </div>
          )}
        </div>
        <label>
          Name
          <input
            value={form.name}
            onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
            required
          />
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
        <label>
          Category
          <select
            value={form.categoryId}
            onChange={(e) =>
              setForm((f) => ({ ...f, categoryId: parseInt(e.target.value) }))
            }
            required
          >
            <option value="">Select Category</option>
            {categories && categories.length > 0 ? (
              categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))
            ) : (
              <option disabled>No categories available</option>
            )}
          </select>
        </label>
        <label>
          Brand
          <select
            value={form.brandId}
            onChange={(e) =>
              setForm((f) => ({
                ...f,
                brandId: e.target.value ? parseInt(e.target.value) : null,
              }))
            }
          >
            <option value="">Select Brand</option>
            {brands && brands.length > 0 ? (
              brands.map((brand) => (
                <option key={brand.id} value={brand.id}>
                  {brand.name}
                </option>
              ))
            ) : (
              <option disabled>No brands available</option>
            )}
          </select>
        </label>
        <label>
          Base Price
          <input
            type="text"
            value={form.basePrice}
            onChange={(e) =>
              setForm((f) => ({ ...f, basePrice: e.target.value }))
            }
            required
          />
        </label>
        <div style={{ marginBottom: '16px' }}>
          <strong>Color Variants:</strong> {form.colors?.length || 0}
          <div style={{ fontSize: '13px', color: '#6b7280', marginTop: '4px' }}>
            Edit colors in Add Product page
          </div>
        </div>
        <label>
          Status
          <select
            value={form.status}
            onChange={(e) => setForm((f) => ({ ...f, status: e.target.value }))}
          >
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
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

  // Modal content for delete
  const DeleteModal = ({ product, onDelete }) => (
    <div className="modal-content delete-modal">
      <h2>Delete Product</h2>
      <p>
        Are you sure you want to delete <strong>{product.name}</strong>?
      </p>
      <div className="modal-actions">
        <button className="btn btn-outline" onClick={closeModal}>
          Cancel
        </button>
        <button className="btn btn-danger" onClick={() => onDelete(product.id)}>
          Delete
        </button>
      </div>
    </div>
  );

  return (
    <div className="product-list">
      <div className="page-header with-actions">
        <div className="header-left">
          <h1>Product List</h1>
          <p>Manage your product inventory</p>
        </div>
        <button
          className="btn btn-primary"
          onClick={() => navigate("/add-product")}
        >
          <Plus size={20} />
          Add Product
        </button>
      </div>

      {error && <div className="error-message">{error}</div>}

      {loading ? (
        <div className="loading-message">Loading products...</div>
      ) : (
        <>
          <div className="filters-section">
            <div className="search-container">
              <Search size={20} className="search-icon" />
              <input
                type="text"
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input"
              />
            </div>

            <div className="filter-group">
              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="filter-select"
              >
                <option value="all">All Categories</option>
                {categories && categories.length > 0 ? (
                  categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))
                ) : (
                  <option disabled>No categories found</option>
                )}
              </select>
            </div>
          </div>

          <DataTable
            data={products.filter(p => filterCategory === 'all' || p.categoryId === parseInt(filterCategory))}
            columns={columns}
            searchTerm={searchTerm}
            searchKey="name"
          />

          {/* Modals */}
          <Modal open={modal.type === "view"} onClose={closeModal}>
            {modal.product && <ViewModal product={modal.product} />}
          </Modal>
          <Modal open={modal.type === "edit"} onClose={closeModal}>
            {modal.product && (
              <EditModal product={modal.product} onSave={handleEdit} />
            )}
          </Modal>
          <Modal open={modal.type === "delete"} onClose={closeModal}>
            {modal.product && (
              <DeleteModal product={modal.product} onDelete={handleDelete} />
            )}
          </Modal>
        </>
      )}
    </div>
  );
};

export default ProductList;
