import { useState, useEffect } from 'react';
import api from '../services/api';
import toast from 'react-hot-toast';
import { Edit, Trash2 } from 'lucide-react';

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [productForm, setProductForm] = useState({
    name: '', type: '', size: '', price: '', imageUrl: '', description: '', stockQuantity: ''
  });
  const [uploading, setUploading] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const fetchProducts = async () => {
    try {
      const { data } = await api.get('/products');
      setProducts(data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const uploadFileHandler = async (e) => {
    const file = e.target.files[0];
    const formData = new FormData();
    formData.append('image', file);
    setUploading(true);

    try {
      const config = {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      };
      const { data } = await api.post('/upload', formData, config);
      setProductForm({ ...productForm, imageUrl: data.image });
      setUploading(false);
    } catch (error) {
      console.error(error);
      setUploading(false);
      toast.error('Image upload failed');
    }
  };

  const handleAddProduct = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await api.put(`/products/${editingId}`, { ...productForm, stockQuantity: Number(productForm.stockQuantity) });
        toast.success('Product updated successfully!');
      } else {
        await api.post('/products', { ...productForm, stockQuantity: Number(productForm.stockQuantity) });
        toast.success('Product added successfully!');
      }
      setProductForm({ name: '', type: '', size: '', price: '', imageUrl: '', description: '', stockQuantity: '' });
      setEditingId(null);
      fetchProducts();
    } catch (error) {
      toast.error(editingId ? 'Failed to update product' : 'Failed to add product');
      console.error(error);
    }
  };

  const handleEdit = (product) => {
    setProductForm({
      name: product.name,
      type: product.type,
      size: product.size,
      price: product.price,
      imageUrl: product.imageUrl,
      description: product.description,
      stockQuantity: product.stockQuantity
    });
    setEditingId(product._id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await api.delete(`/products/${id}`);
        toast.success('Product deleted successfully');
        fetchProducts();
      } catch (error) {
        toast.error('Failed to delete product');
        console.error(error);
      }
    }
  };

  const cancelEdit = () => {
    setProductForm({ name: '', type: '', size: '', price: '', imageUrl: '', description: '', stockQuantity: '' });
    setEditingId(null);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-5xl mx-auto bg-industrial-800 p-8 rounded-lg border border-industrial-700 mb-12">
        <h2 className="text-2xl font-bold mb-6">{editingId ? 'Edit Product' : 'Add New Product to Catalog'}</h2>
        <form onSubmit={handleAddProduct} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-400 mb-1 text-sm">Product Name</label>
              <input required type="text" className="input-field" value={productForm.name} onChange={e => setProductForm({...productForm, name: e.target.value})} />
            </div>
            <div>
              <label className="block text-gray-400 mb-1 text-sm">Category / Type</label>
              <input required type="text" list="category-options" className="input-field" placeholder="Select or type new category" value={productForm.type} onChange={e => setProductForm({...productForm, type: e.target.value})} />
              <datalist id="category-options">
                {Array.from(new Set(['Flanges', 'Connectors', 'Machined Parts', 'Valves', 'Tools', ...products.map(p => p.type).filter(Boolean)])).map(cat => (
                  <option key={cat} value={cat} />
                ))}
              </datalist>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-gray-400 mb-1 text-sm">Size / Dimensions</label>
              <input required type="text" className="input-field" placeholder="e.g. 12 inch" value={productForm.size} onChange={e => setProductForm({...productForm, size: e.target.value})} />
            </div>
            <div>
              <label className="block text-gray-400 mb-1 text-sm">Price (₹)</label>
              <input required type="number" step="0.01" className="input-field" value={productForm.price} onChange={e => setProductForm({...productForm, price: e.target.value})} />
            </div>
            <div>
              <label className="block text-gray-400 mb-1 text-sm">Initial Stock</label>
              <input required type="number" className="input-field" value={productForm.stockQuantity} onChange={e => setProductForm({...productForm, stockQuantity: e.target.value})} />
            </div>
          </div>
          <div>
            <label className="block text-gray-400 mb-1 text-sm">Product Image</label>
            <input required={!productForm.imageUrl && !editingId} type="file" onChange={uploadFileHandler} className="input-field text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-industrial-orange file:text-white hover:file:bg-industrial-orange/80" />
            {uploading && <p className="text-industrial-orange mt-2 text-sm">Uploading...</p>}
            {productForm.imageUrl && <p className="text-green-500 mt-2 text-sm truncate">Image Selected: {productForm.imageUrl}</p>}
          </div>
          <div>
            <label className="block text-gray-400 mb-1 text-sm">Description</label>
            <textarea required className="input-field h-32" value={productForm.description} onChange={e => setProductForm({...productForm, description: e.target.value})}></textarea>
          </div>
          <div className="flex gap-4">
            <button type="submit" className="flex-1 btn-primary py-3">
              {editingId ? 'Update Product' : 'Publish Product'}
            </button>
            {editingId && (
              <button type="button" onClick={cancelEdit} className="flex-1 bg-gray-600 hover:bg-gray-500 text-white rounded font-medium py-3 transition-colors">
                Cancel Edit
              </button>
            )}
          </div>
        </form>
      </div>

      <div className="max-w-5xl mx-auto bg-industrial-800 rounded-lg border border-industrial-700 overflow-hidden">
        <div className="p-6 border-b border-industrial-700">
          <h3 className="text-xl font-bold">Current Products Catalog</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-gray-300">
            <thead className="bg-industrial-900 text-gray-400">
              <tr>
                <th className="p-4">Image</th>
                <th className="p-4">Name</th>
                <th className="p-4">Category</th>
                <th className="p-4">Price</th>
                <th className="p-4">Stock</th>
                <th className="p-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map(product => (
                <tr key={product._id} className="border-b border-industrial-700 hover:bg-industrial-700/50 transition-colors">
                  <td className="p-4">
                    {product.imageUrl ? (
                      <img src={product.imageUrl} alt={product.name} className="w-12 h-12 object-cover rounded" />
                    ) : (
                      <div className="w-12 h-12 bg-gray-700 rounded flex items-center justify-center text-xs">No img</div>
                    )}
                  </td>
                  <td className="p-4 font-medium text-white">{product.name}</td>
                  <td className="p-4">{product.type}</td>
                  <td className="p-4">₹{product.price?.toFixed(2)}</td>
                  <td className="p-4">{product.stockQuantity}</td>
                  <td className="p-4 text-center space-x-3">
                    <button onClick={() => handleEdit(product)} className="text-blue-400 hover:text-blue-300 transition-colors" title="Edit">
                      <Edit className="w-5 h-5 inline" />
                    </button>
                    <button onClick={() => handleDelete(product._id)} className="text-red-400 hover:text-red-300 transition-colors" title="Delete">
                      <Trash2 className="w-5 h-5 inline" />
                    </button>
                  </td>
                </tr>
              ))}
              {products.length === 0 && (
                <tr>
                  <td colSpan="6" className="p-8 text-center text-gray-500">No products found. Add one above!</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
