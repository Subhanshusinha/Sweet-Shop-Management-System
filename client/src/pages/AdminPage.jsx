import { useState } from 'react';
import { Plus, Trash2, RefreshCw } from 'lucide-react';
import { mockSweets } from '../data/mockSweets';

const AdminPage = () => {
    const [sweets, setSweets] = useState(mockSweets);
    const [formData, setFormData] = useState({ name: '', category: '', price: '', quantity: '' });
    const [restockQty, setRestockQty] = useState({});

    const handleCreate = (e) => {
        e.preventDefault();
        const newSweet = {
            _id: Date.now().toString(),
            name: formData.name,
            category: formData.category,
            price: Number(formData.price),
            quantity: Number(formData.quantity),
            image: '🍬'
        };
        setSweets([...sweets, newSweet]);
        setFormData({ name: '', category: '', price: '', quantity: '' });
    };

    const handleDelete = (id) => {
        if (confirm('Are you sure?')) {
            setSweets(sweets.filter(s => s._id !== id));
        }
    };

    const handleRestock = (id) => {
        const qty = Number(restockQty[id]);
        if (!qty || qty <= 0) return;

        setSweets(sweets.map(s => {
            if (s._id === id) return { ...s, quantity: s.quantity + qty };
            return s;
        }));
        setRestockQty({ ...restockQty, [id]: '' });
    };

    return (
        <div className="space-y-8">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold text-slate-800">Inventory Management (Mock)</h1>
            </div>

            {/* Add Sweet Form */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
                    <Plus className="w-5 h-5 text-pink-500" /> Add New Sweet
                </h2>
                <form onSubmit={handleCreate} className="grid grid-cols-1 md:grid-cols-5 gap-4">
                    <input required placeholder="Name" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} className="px-4 py-2 rounded-lg border border-slate-200 outline-none focus:border-pink-500" />
                    <input required placeholder="Category" value={formData.category} onChange={e => setFormData({ ...formData, category: e.target.value })} className="px-4 py-2 rounded-lg border border-slate-200 outline-none focus:border-pink-500" />
                    <input required type="number" placeholder="Price" value={formData.price} onChange={e => setFormData({ ...formData, price: e.target.value })} className="px-4 py-2 rounded-lg border border-slate-200 outline-none focus:border-pink-500" />
                    <input required type="number" placeholder="Qty" value={formData.quantity} onChange={e => setFormData({ ...formData, quantity: e.target.value })} className="px-4 py-2 rounded-lg border border-slate-200 outline-none focus:border-pink-500" />
                    <button type="submit" className="bg-slate-900 text-white rounded-lg font-bold hover:bg-slate-800 transition-colors">Add Sweet</button>
                </form>
            </div>

            {/* Table */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-slate-50 border-b border-slate-200">
                        <tr>
                            <th className="px-6 py-4 font-bold text-slate-700">Name</th>
                            <th className="px-6 py-4 font-bold text-slate-700">Category</th>
                            <th className="px-6 py-4 font-bold text-slate-700">Price</th>
                            <th className="px-6 py-4 font-bold text-slate-700">Stock</th>
                            <th className="px-6 py-4 font-bold text-slate-700 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {sweets.map(sweet => (
                            <tr key={sweet._id} className="hover:bg-slate-50 transition-colors">
                                <td className="px-6 py-4 font-medium text-slate-800">{sweet.name}</td>
                                <td className="px-6 py-4 text-slate-500">
                                    <span className="px-2 py-1 bg-slate-100 rounded-full text-xs font-semibold">{sweet.category}</span>
                                </td>
                                <td className="px-6 py-4 text-slate-600">${sweet.price.toFixed(2)}</td>
                                <td className="px-6 py-4 font-mono font-medium text-slate-700">{sweet.quantity}</td>
                                <td className="px-6 py-4 flex justify-end items-center gap-3">
                                    <div className="flex items-center gap-2">
                                        <input
                                            type="number"
                                            placeholder="+Qty"
                                            className="w-16 px-2 py-1 text-sm border border-slate-200 rounded"
                                            value={restockQty[sweet._id] || ''}
                                            onChange={(e) => setRestockQty({ ...restockQty, [sweet._id]: e.target.value })}
                                        />
                                        <button onClick={() => handleRestock(sweet._id)} title="Restock" className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors">
                                            <RefreshCw className="w-4 h-4" />
                                        </button>
                                    </div>
                                    <div className="w-px h-6 bg-slate-200 mx-2"></div>
                                    <button onClick={() => handleDelete(sweet._id)} title="Delete" className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AdminPage;
