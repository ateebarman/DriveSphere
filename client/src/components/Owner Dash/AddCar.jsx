import { useState } from "react";
import { API_END_POINT_CarOwner, API_END_POINT_admin } from "../../utils/constants";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";

const AddCar = () => {
  const userRole = useSelector((state) => state.app.user.role);

  const [formData, setFormData] = useState({
    brand: "",
    model: "",
    year: "",
    regNumber: "",
    type: "sedan",
    color: "",
    rentalPricePerDay: "",
    fuelType: "petrol",
    transmission: "manual",
    seats: "",
    status: "available",
    mileage: "",
    description: "",
    images: [""],
    currentLocation: "",
  });

  const [activeField, setActiveField] = useState(null);
  const [imageInputs, setImageInputs] = useState([""]);

  const navigate = useNavigate();


  const handleFileChange = (e) => {
    setFormData({ ...formData, images: Array.from(e.target.files) });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleImageChange = (index, value) => {
    const updatedImages = [...formData.images];
    updatedImages[index] = value;
    setFormData({ ...formData, images: updatedImages });
  };

  const addImageField = () => {
    setImageInputs([...imageInputs, ""]);
    setFormData({ ...formData, images: [...formData.images, ""] });
  };

  const removeImageField = (index) => {
    const updatedImages = formData.images.filter((_, i) => i !== index);
    setImageInputs(imageInputs.filter((_, i) => i !== index));
    setFormData({ ...formData, images: updatedImages });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.regNumber) {
      toast.error("Registration number is required");
      return;
    }

    const endpoint =
      userRole === "admin"
        ? `${API_END_POINT_admin}/addcar`
        : `${API_END_POINT_CarOwner}/addcar`;

    const formDataToSend = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      if (key === "images") {
        value.forEach((file) => formDataToSend.append("images", file));
      } else {
        formDataToSend.append(key, value);
      }
    });

    try {
      const res = await axios.post(endpoint, formDataToSend, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        withCredentials: true,
      });


      toast.success("Car added successfully!");
      userRole === "carOwner" ? navigate("/carownerdash") : navigate("/admindash");
    } catch (error) {
      toast.error("Error adding car: " + (error.response?.data?.message || error.message));
    }
  };

  return (
    <div className="max-w-5xl mx-auto">
      <div className="relative group">
        <div className="absolute -inset-1 bg-gradient-to-r from-primary-500/20 to-accent-500/20 blur-2xl opacity-50 group-hover:opacity-75 transition duration-1000" />

        <div className="relative bg-surface-900/50 backdrop-blur-3xl border border-white/10 rounded-[3rem] p-8 md:p-12 shadow-premium">
          <div className="mb-12 text-center">
            <h2 className="text-4xl font-display font-black text-white tracking-tight uppercase">Register New Asset</h2>
            <p className="text-surface-500 mt-2 font-medium italic">Onboard a vehicle to the global DriveSphere fleet.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-10">
            {/* Primary Details Section */}
            <div className="space-y-6">
              <h3 className="text-xs font-black text-primary-500 uppercase tracking-[0.3em] flex items-center gap-3">
                <span className="w-8 h-px bg-primary-500/20" />
                Technical Specifications
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                  { name: "brand", label: "Manufacturer", placeholder: "e.g. Tesla" },
                  { name: "model", label: "Model Variant", placeholder: "e.g. Model S" },
                  { name: "year", label: "Manufacturing Year", type: "number", placeholder: "2024" },
                  { name: "regNumber", label: "Registration ID", placeholder: "DS-EV-001" },
                  { name: "color", label: "Exterior Finish", placeholder: "e.g. Obsidian Black" },
                  { name: "rentalPricePerDay", label: "Daily Rate (₹)", type: "number", placeholder: "15000" },
                  { name: "seats", label: "Passenger Capacity", type: "number", placeholder: "5" },
                  { name: "mileage", label: "Efficiency (km/unit)", type: "number", placeholder: "350" },
                  { name: "currentLocation", label: "Primary Deployment Hub", placeholder: "e.g. Bangalore" },
                ].map((field) => (
                  <div key={field.name} className="space-y-2">
                    <label className="block text-[10px] font-black text-surface-400 uppercase tracking-widest ml-1">{field.label}</label>
                    <input
                      type={field.type || "text"}
                      name={field.name}
                      value={formData[field.name]}
                      onChange={handleChange}
                      placeholder={field.placeholder}
                      className="w-full p-4 rounded-xl bg-surface-800 border border-white/5 text-white placeholder-surface-600 focus:outline-none focus:border-primary-500/50 transition-all text-sm font-medium"
                      required={field.name === "regNumber"}
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Configuration Section */}
            <div className="space-y-6">
              <h3 className="text-xs font-black text-accent-500 uppercase tracking-[0.3em] flex items-center gap-3">
                <span className="w-8 h-px bg-accent-500/20" />
                Operational Logic
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {[
                  { name: "type", label: "Body Architecture", options: ["sedan", "suv", "hatchback"] },
                  { name: "fuelType", label: "Energy Source", options: ["petrol", "diesel", "electric"] },
                  { name: "transmission", label: "Drive System", options: ["manual", "automatic"] },
                  { name: "status", label: "Availability Status", options: ["available", "booked", "maintenance"] },
                ].map((field) => (
                  <div key={field.name} className="space-y-2">
                    <label className="block text-[10px] font-black text-surface-400 uppercase tracking-widest ml-1">{field.label}</label>
                    <select
                      name={field.name}
                      value={formData[field.name]}
                      onChange={handleChange}
                      className="w-full p-4 rounded-xl bg-surface-800 border border-white/5 text-white focus:outline-none focus:border-accent-500/50 transition-all appearance-none cursor-pointer text-sm"
                    >
                      {field.options.map((option) => (
                        <option key={option} value={option} className="bg-surface-900">
                          {option.charAt(0).toUpperCase() + option.slice(1)}
                        </option>
                      ))}
                    </select>
                  </div>
                ))}
              </div>
            </div>

            {/* Content & Media Section */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="md:col-span-2 space-y-2">
                <label className="block text-[10px] font-black text-surface-400 uppercase tracking-widest ml-1">Asset Description</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows="4"
                  placeholder="Summarize the character and condition of this asset..."
                  className="w-full p-5 rounded-2xl bg-surface-800 border border-white/5 text-white placeholder-surface-600 focus:outline-none focus:border-primary-500/50 transition-all text-sm resize-none"
                />
              </div>

              <div className="space-y-4">
                <label className="block text-[10px] font-black text-surface-400 uppercase tracking-widest ml-1">Visual Assets</label>
                <div className="relative group/upload">
                  <input
                    type="file"
                    name="images"
                    multiple
                    onChange={handleFileChange}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                  />
                  <div className="p-8 rounded-2xl border-2 border-dashed border-white/10 bg-white/[0.02] group-hover/upload:border-primary-500/50 group-hover/upload:bg-primary-500/5 transition-all flex flex-col items-center justify-center text-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-surface-500 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <p className="text-[10px] font-black text-surface-400 uppercase tracking-widest">Select HD Media</p>
                    <p className="text-[9px] text-surface-600 mt-1">PNG, JPG or WEBP encouraged</p>
                  </div>
                </div>
                {formData.images.length > 0 && formData.images[0] !== "" && (
                  <p className="text-[10px] text-emerald-400 font-bold uppercase tracking-widest text-center">
                    {formData.images.length} files detected for upload
                  </p>
                )}
              </div>
            </div>

            <button
              type="submit"
              className="w-full relative overflow-hidden rounded-2xl p-6 font-black uppercase tracking-[0.3em] text-sm text-white bg-primary-500 hover:bg-primary-600 transition-all duration-500 shadow-premium active:scale-[0.98]"
            >
              Onboard Vehicle to Registry
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddCar;
