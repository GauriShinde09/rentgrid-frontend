
import { useEffect, useState } from "react";
import api from "../api/axiosConfig";

function MyProfile() {
  const [profile, setProfile] = useState({
    name: "",
    email: "",
    phone: "",
  });

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  // Load profile from backend
  async function loadProfile() {
    setLoading(true);
    setError("");

    try {
      const response = await api.get("/rentgrid/users/profile");
      const data = response.data || {};

      const savedProfile = {
        name: data.name || "",
        email: data.email || "",
        phone: data.phone || "",
      };

      setProfile(savedProfile);
      setFormData(savedProfile);
    } catch (err) {
      console.error("Could not load profile:", err);
      setError(
        err.response?.data?.message ||
          "Could not load your profile. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadProfile();
  }, []);

  // Open edit form
  function handleEdit() {
    setFormData({ ...profile });
    setError("");
    setMessage("");
    setIsEditing(true);
  }

  // Update form fields
  function handleChange(event) {
    const { name, value } = event.target;

    setFormData((current) => ({
      ...current,
      [name]: value,
    }));

    setError("");
    setMessage("");
  }

  // Cancel editing
  function handleCancel() {
    setFormData({ ...profile });
    setError("");
    setIsEditing(false);
  }

  // Save updated profile
  async function handleSubmit(event) {
    event.preventDefault();

    setSaving(true);
    setError("");
    setMessage("");

    try {
      // Update profile in backend
      const response = await api.put(
        "/rentgrid/users/profile",
        formData
      );

      const data = response.data || {};

      const updatedProfile = {
        name: data.name ?? formData.name,
        email: data.email ?? formData.email,
        phone: data.phone ?? formData.phone,
      };

      // Update displayed profile
      setProfile(updatedProfile);
      setFormData(updatedProfile);

      // Return to read-only mode
      setIsEditing(false);
      setMessage("Profile updated successfully!");

      // Hide success message after 3 seconds
      setTimeout(() => {
        setMessage("");
      }, 3000);
    } catch (err) {
      console.error("Could not update profile:", err);

      setError(
        err.response?.data?.message ||
          "Could not update your profile. Please try again."
      );
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <section className="rounded-2xl border border-slate-200 bg-white p-8">
        <p className="font-semibold text-slate-600">
          Loading your profile...
        </p>
      </section>
    );
  }

  return (
    <section>
      <div>
        <p className="text-xs font-bold tracking-widest text-blue-600">
          ACCOUNT SETTINGS
        </p>

        <p className="mt-2 text-sm text-slate-500">
          View and update your personal information.
        </p>
      </div>

      <div className="mt-6 max-w-3xl rounded-2xl border border-slate-200 bg-white p-6 sm:p-8">
        {/* Profile header */}
        <div className="mb-7 flex items-center gap-4">
          <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-blue-100 text-2xl font-extrabold text-blue-700">
            {profile.name
              ? profile.name.charAt(0).toUpperCase()
              : "U"}
          </div>

          <div>
            <h3 className="text-xl font-bold text-slate-900">
              {profile.name || "Your Profile"}
            </h3>

            <p className="mt-1 text-sm text-slate-500">
              RentGrid Customer
            </p>
          </div>
        </div>

        {/* Success message */}
        {message && (
          <div
            role="status"
            className="mb-5 rounded-xl border border-green-200 bg-green-50 p-4 text-sm font-semibold text-green-700"
          >
            ✓ {message}
          </div>
        )}

        {/* Error message */}
        {error && (
          <div
            role="alert"
            className="mb-5 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700"
          >
            {error}
          </div>
        )}

        {isEditing ? (
          /* Edit mode */
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label
                htmlFor="profile-name"
                className="text-sm font-semibold text-slate-700"
              >
                Full Name
              </label>

              <input
                id="profile-name"
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                maxLength={100}
                placeholder="Enter your full name"
                className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />
            </div>

            <div>
              <label
                htmlFor="profile-email"
                className="text-sm font-semibold text-slate-700"
              >
                Email Address
              </label>

              <input
                id="profile-email"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                maxLength={150}
                placeholder="Enter your email"
                className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />
            </div>

            <div>
              <label
                htmlFor="profile-phone"
                className="text-sm font-semibold text-slate-700"
              >
                Phone Number
              </label>

              <input
                id="profile-phone"
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                maxLength={15}
                placeholder="Enter your phone number"
                className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />
            </div>

            <div className="flex flex-wrap gap-3 border-t border-slate-100 pt-5">
              <button
                type="submit"
                disabled={saving}
                className="rounded-xl bg-blue-600 px-6 py-3 font-bold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {saving ? "Saving Changes..." : "Save Changes"}
              </button>

              <button
                type="button"
                onClick={handleCancel}
                disabled={saving}
                className="rounded-xl border border-slate-200 px-6 py-3 font-bold text-slate-700 transition hover:bg-slate-50 disabled:opacity-60"
              >
                Cancel
              </button>
            </div>
          </form>
        ) : (
          /* Read-only profile mode */
          <div>
            <div className="space-y-5">
              <div>
                <p className="text-sm font-semibold text-slate-500">
                  Full Name
                </p>
                <p className="mt-2 text-base font-medium text-slate-900">
                  {profile.name || "Not provided"}
                </p>
              </div>

              <div>
                <p className="text-sm font-semibold text-slate-500">
                  Email Address
                </p>
                <p className="mt-2 break-all text-base font-medium text-slate-900">
                  {profile.email || "Not provided"}
                </p>
              </div>

              <div>
                <p className="text-sm font-semibold text-slate-500">
                  Phone Number
                </p>
                <p className="mt-2 text-base font-medium text-slate-900">
                  {profile.phone || "Not provided"}
                </p>
              </div>
            </div>

            <div className="mt-7 border-t border-slate-100 pt-5">
              <button
                type="button"
                onClick={handleEdit}
                className="flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-3 font-bold text-white transition hover:bg-blue-700"
              >
                <span>✎</span>
                Edit Profile
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

export default MyProfile;
