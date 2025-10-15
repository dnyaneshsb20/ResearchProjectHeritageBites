import React, { useEffect, useState } from 'react';
import { supabase } from '../../../supabaseClient';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const ViewProductModal = ({ farmerId, isOpen, onClose }) => {
    const [products, setProducts] = useState([]);
    const [farmer, setFarmer] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (isOpen && farmerId) {
            fetchFarmerAndProducts();
        }
        // clear state when modal closes
        if (!isOpen) {
            setProducts([]);
            setFarmer(null);
            setLoading(true);
        }
    }, [isOpen, farmerId]);

    const fetchFarmerAndProducts = async () => {
        setLoading(true);

        // Fetch farmer info (including user name if available)
        const { data: farmerData, error: farmerError } = await supabase
            .from('farmers')
            .select(`
        farmer_id,
        contact_info,
        location,
        certifications,
        bio,
        users:user_id ( name, email )
      `)
            .eq('farmer_id', farmerId)
            .single();

        if (farmerError) {
            console.error('Error fetching farmer info:', farmerError);
            setFarmer(null);
        } else {
            setFarmer(farmerData);
        }

        // Fetch products for farmer
        const { data: productData, error: productError } = await supabase
            .from('products')
            .select('product_id, name, price, certifications')
            .eq('farmer_id', farmerId)
            .order('created_at', { ascending: false });

        if (productError) {
            console.error('Error fetching products:', productError);
            setProducts([]);
        } else {
            setProducts(productData || []);
        }

        setLoading(false);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm mt-20">
            <div className="bg-card rounded-xl shadow-xl w-full max-w-2xl max-h-[80vh] overflow-hidden p-6 relative flex flex-col">
                {/* Top-right close icon */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-muted-foreground hover:text-foreground"
                    aria-label="Close"
                >
                    <Icon name="X" size={20} />
                </button>

                {/* Farmer header */}
                <div className="mb-4 border-b border-border pb-4">
                    <div className="flex items-start justify-between">
                        <div>
                            <h2 className="text-xl font-heading font-semibold text-foreground flex items-center gap-2">
                                <Icon name="User" size={18} className="text-primary" />
                                {farmer?.users?.name || 'Unnamed Farmer'}
                            </h2>
                            <p className="text-sm text-muted-foreground mt-1">
                                {farmer?.bio || ''}
                            </p>
                        </div>

                        {/* Contact & location */}
                        <div className="text-sm text-right mr-8">
                            <div className="mb-1">
                                <span className="inline-flex items-center space-x-2">
                                    <Icon name="Phone" size={14} />
                                    <span className="text-muted-foreground">
                                        {farmer?.contact_info || 'No contact info'}
                                    </span>
                                </span>
                            </div>
                            <div>
                                <span className="inline-flex items-center space-x-2">
                                    <Icon name="MapPin" size={14} />
                                    <span className="text-muted-foreground">
                                        {farmer?.location || 'Location not available'}
                                    </span>
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Products table (scrollable area) */}
                <div className="overflow-y-auto flex-1 px-0">
                    {loading ? (
                        <div className="py-6">
                            <p className="text-muted-foreground">Loading products...</p>
                        </div>
                    ) : products.length === 0 ? (
                        <div className="py-6">
                            <p className="text-muted-foreground">No products available.</p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full border border-border rounded-lg text-sm table-auto">
                                <thead className="bg-muted text-foreground">
                                    <tr>
                                        <th className="px-4 py-3 text-left font-medium w-12">Sr. No</th>
                                        <th className="px-4 py-3 text-left font-medium">Name</th>
                                        <th className="px-4 py-3 text-left font-medium">Price</th>
                                        <th className="px-4 py-3 text-left font-medium">Certifications</th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {products.map((product, idx) => (
                                        <tr
                                            key={product.product_id}
                                            className={idx % 2 === 0 ? 'bg-background' : 'bg-card'}
                                        >
                                            <td className="px-4 py-3 align-top">{idx + 1}</td>
                                            <td className="px-4 py-3 align-top">{product.name}</td>
                                            <td className="px-4 py-3 align-top">
                                                {product.price !== null && product.price !== undefined
                                                    ? Number(product.price).toLocaleString(undefined, {
                                                        minimumFractionDigits: 2,
                                                        maximumFractionDigits: 2,
                                                    })
                                                    : '—'}
                                            </td>
                                            <td className="px-4 py-3 align-top">
                                                {product.certifications || '—'}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ViewProductModal;
