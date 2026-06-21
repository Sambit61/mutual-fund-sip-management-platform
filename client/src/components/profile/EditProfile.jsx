import { useState } from "react";
import toast from "react-hot-toast";
import api from "../../api/api";
import { useAuth } from "../../context/AuthContext";

function EditProfile() {

  const {
    user,
    token,
    updateUser
  } = useAuth();

  const [name, setName] =
    useState(user?.name || "");

  const [email, setEmail] =
    useState(user?.email || "");

  const [saving, setSaving] =
    useState(false);

  const handleSave =
    async () => {

      try {

        setSaving(true);

        const res =
          await api.put(
            "/auth/update-profile",
            {
              name,
              email
            },
            {
              headers: {
                Authorization:
                  `Bearer ${token}`
              }
            }
          );

        updateUser(
          res.data.user
        );

        toast.success(
          "Profile updated successfully"
        );

      } catch (err) {

        console.error(err);

        toast.error(
          err.response?.data?.message ||
          "Failed to update profile"
        );

      } finally {

        setSaving(false);

      }

    };

  return (

    <div className="bg-[var(--color-card-bg)] border border-gray-800 rounded-xl p-8">

      <h2 className="text-3xl font-bold mb-8">
        Edit Profile
      </h2>

      <div className="space-y-6">

        <div>

          <label className="block text-gray-400 mb-2">
            Full Name
          </label>

          <input
            type="text"
            value={name}
            onChange={(e) =>
              setName(
                e.target.value
              )
            }
            className="w-full px-4 py-3 rounded-lg bg-white text-black"
          />

        </div>

        <div>

          <label className="block text-gray-400 mb-2">
            Email
          </label>

          <input
            type="email"
            value={email}
            onChange={(e) =>
              setEmail(
                e.target.value
              )
            }
            className="w-full px-4 py-3 rounded-lg bg-white text-black"
          />

        </div>

        <button
          onClick={handleSave}
          disabled={saving}
          className="px-6 py-3 rounded-lg bg-brand text-black font-semibold"
        >
          {
            saving
            ? "Saving..."
            : "Save Changes"
          }
        </button>

      </div>

    </div>

  );

}

export default EditProfile;