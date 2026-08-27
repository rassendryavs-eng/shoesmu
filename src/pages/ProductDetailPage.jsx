import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { ArrowLeft, Save, Trash2, Plus, ChevronDown } from "lucide-react";
import Card from "../components/common/Card";
import Button from "../components/common/Button";
import Breadcrumb from "../components/navigation/Breadcrumb";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";
import { BRANDS, CATEGORIES } from "../config/constants";

export const ProductDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isSuperAdmin } = useAuth();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      const data = await api.getProductById(id);
      setProduct(data);
      setLoading(false);
    };
    fetchProduct();
  }, [id]);

  if (loading) {
    return <div className="py-12 text-center text-mute">Loading product details...</div>;
  }

  if (!product) {
    return (
      <div className="py-12 text-center">
        <p className="text-h4 text-ink font-semibold">Product not found</p>
        <Link to="/products" className="mt-4 inline-block">
          <Button variant="secondary">Back to Products</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Breadcrumb items={[{ label: "Products", path: "/products" }, { label: product.name }]} />

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link to="/products">
            <button className="btn-icon-circular">
              <ArrowLeft className="w-4 h-4" />
            </button>
          </Link>
          <div>
            <h2 className="text-h3 font-bold text-ink">{product.name}</h2>
            <p className="text-caption text-mute">SKU: {product.sku}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {isSuperAdmin && (
            <Button variant="danger" icon={Trash2}>
              Archive
            </Button>
          )}
          <Button variant="primary" icon={Save}>
            Save Changes
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Details Form */}
        <Card title="General Information" className="lg:col-span-2 space-y-4">
          <div>
            <label className="block text-caption font-semibold text-ink mb-1.5">
              Product Title
            </label>
            <input
              type="text"
              defaultValue={product.name}
              className="w-full bg-soft-cloud border border-gray-200 px-3.5 py-2 text-text2 text-ink focus:bg-canvas focus:border-ink outline-none"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-caption font-semibold text-ink mb-1.5">Brand</label>
              <div className="relative">
                <select
                  defaultValue={product.brand.toLowerCase()}
                  className="w-full appearance-none bg-soft-cloud border border-gray-200 pl-3.5 pr-9 py-2 text-text2 text-ink focus:bg-canvas focus:border-ink outline-none cursor-pointer"
                >
                  {BRANDS.map((b) => (
                    <option key={b.id} value={b.id}>
                      {b.name}
                    </option>
                  ))}
                </select>
                <ChevronDown className="w-4 h-4 text-gray-500 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>
            <div>
              <label className="block text-caption font-semibold text-ink mb-1.5">
                Category
              </label>
              <div className="relative">
                <select
                  defaultValue={product.category.toLowerCase()}
                  className="w-full appearance-none bg-soft-cloud border border-gray-200 pl-3.5 pr-9 py-2 text-text2 text-ink focus:bg-canvas focus:border-ink outline-none cursor-pointer"
                >
                  {CATEGORIES.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
                <ChevronDown className="w-4 h-4 text-gray-500 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>
          </div>

          {/* Pricing Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div>
              <label className="block text-caption font-semibold text-ink mb-1.5">
                Selling Price ($)
              </label>
              <input
                type="number"
                defaultValue={product.price}
                className="w-full bg-soft-cloud border border-gray-200 px-3.5 py-2 text-text2 text-ink focus:bg-canvas focus:border-ink outline-none"
              />
            </div>
            {isSuperAdmin ? (
              <div>
                <label className="block text-caption font-semibold text-ink mb-1.5">
                  Cost Price ($) <span className="text-mute font-normal">(Admin Only)</span>
                </label>
                <input
                  type="number"
                  defaultValue={product.costPrice}
                  className="w-full bg-soft-cloud border border-gray-200 px-3.5 py-2 text-text2 text-ink focus:bg-canvas focus:border-ink outline-none"
                />
              </div>
            ) : (
              <div className="p-3 bg-gray-50 border border-gray-200 text-caption text-mute flex items-center">
                🔒 Cost price is hidden for staff accounts.
              </div>
            )}
          </div>
        </Card>

        {/* Media & Variants Side */}
        <div className="space-y-6">
          <Card title="Product Media">
            <div className="aspect-square bg-soft-cloud border border-gray-200 overflow-hidden mb-3">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>
            <Button variant="secondary" className="w-full" size="sm">
              Replace Image
            </Button>
          </Card>

          <Card
            title="Variants & Sizes"
            action={
              <Button variant="ghost" size="sm" icon={Plus}>
                Add Variant
              </Button>
            }
          >
            <div className="divide-y divide-gray-100">
              {(product.variants || []).map((v, i) => (
                <div key={i} className="py-2.5 flex items-center justify-between text-caption">
                  <div>
                    <span className="font-semibold text-ink">{v.size}</span>
                    <p className="text-mute">{v.color}</p>
                  </div>
                  <div className="text-right">
                    <span className="font-bold text-ink">{v.stock} in stock</span>
                    <p className="text-[10px] text-mute">{v.sku}</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailPage;
