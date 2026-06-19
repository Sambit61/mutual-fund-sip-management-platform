import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";
import api from "../api/api";

function Profile() {

  const navigate = useNavigate();

  const {
    user,
    token,
    logout,
    updateUser
  } = useAuth();

  const [currentPassword, setCurrentPassword] =
    useState("");

  const [newPassword, setNewPassword] =
    useState("");

  const [confirmPassword, setConfirmPassword] =
    useState("");

  const [loading, setLoading] =
    useState(false);

    const [image, setImage] =
    useState(null);

    const [uploading, setUploading] =
    useState(false);
  
  const handleLogout = () => {

    logout();

    navigate("/login");

  };

  const handleChangePassword =
    async () => {

      if (
        !currentPassword ||
        !newPassword ||
        !confirmPassword
      ) {

        toast.error(
          "Please fill all fields"
        );

        return;

      }

      if (
        newPassword !==
        confirmPassword
      ) {

        toast.error(
          "Passwords do not match"
        );

        return;

      }

      try {

        setLoading(true);

        const res =
          await api.put(
            "/auth/change-password",
            {
              currentPassword,
              newPassword
            },
            {
              headers: {
                Authorization:
                  `Bearer ${token}`
              }
            }
          );

        toast.success(
          res.data.message
        );

        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");

      } catch (err) {

        console.error(err);

        toast.error(
          err.response?.data?.message ||
          "Failed to update password"
        );

      } finally {

        setLoading(false);

      }

    };
    const handleProfilePictureUpload =
  async () => {

    if (!image) {

      toast.error(
        "Please select an image"
      );

      return;

    }

    try {

      setUploading(true);

      const formData =
        new FormData();

      formData.append(
        "image",
        image
      );

      const res =
        await api.post(
          "/auth/upload-profile-picture",
          formData,
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
        "Profile picture uploaded"
      );

    } catch (err) {

      console.error(err);

      toast.error(
        err.response?.data?.message ||
        "Upload failed"
      );

    } finally {

      setUploading(false);

    }

  };

  return (

    <div className="min-h-screen p-8 text-white max-w-4xl mx-auto">

      {/* PROFILE CARD */}

      <div className="bg-[var(--color-card-bg)] border border-gray-800 rounded-xl p-8 mb-8">

        <h1 className="text-3xl font-bold mb-8">
          My Profile
        </h1>
        <div className="flex flex-col items-center mb-8">

  <img
    src={
      user?.profilePicture ||
      "https://via.placeholder.com/150"
    }
    alt="Profile"
    className="w-32 h-32 rounded-full object-cover border-4 border-brand mb-4"
  />

  <input
    type="file"
    accept="image/*"
    onChange={(e) =>
      setImage(
        e.target.files[0]
      )
    }
    className="mb-4"
  />

  <button
    onClick={
      handleProfilePictureUpload
    }
    disabled={uploading}
    className="px-5 py-2 rounded bg-brand text-gray-900 font-semibold"
  >
    {
      uploading
        ? "Uploading..."
        : "Upload Picture"
    }
  </button>

</div>

        <div className="space-y-6">

          <div>

            <p className="text-gray-400 text-sm">
              Name
            </p>

            <p className="text-xl font-semibold">
              {user?.name}
            </p>

          </div>

          <div>

            <p className="text-gray-400 text-sm">
              Email
            </p>

            <p className="text-xl font-semibold">
              {user?.email}
            </p>

          </div>

          <div>

            <p className="text-gray-400 text-sm">
              Role
            </p>

            <p className="text-xl font-semibold capitalize">
              {user?.role}
            </p>

          </div>

          <div>

            <p className="text-gray-400 text-sm">
              Joined
            </p>

            <p className="text-xl font-semibold">
              {user?.createdAt
                ? new Date(
                    user.createdAt
                  ).toLocaleDateString()
                : "N/A"}
            </p>

          </div>

        </div>

        <div className="mt-8">

          <button
            onClick={handleLogout}
            className="px-5 py-2 rounded bg-red-500 text-white font-semibold hover:bg-red-600 transition"
          >
            Logout
          </button>

        </div>

      </div>

      {/* CHANGE PASSWORD */}

      <div className="bg-[var(--color-card-bg)] border border-gray-800 rounded-xl p-8">

        <h2 className="text-2xl font-bold mb-6">
          Change Password
        </h2>

        <div className="space-y-5">

          <div>

            <label className="block text-sm text-gray-400 mb-2">
              Current Password
            </label>

            <input
              type="password"
              value={currentPassword}
              onChange={(e) =>
                setCurrentPassword(
                  e.target.value
                )
              }
              className="w-full px-4 py-3 rounded-lg bg-white text-black outline-none"
            />

          </div>

          <div>

            <label className="block text-sm text-gray-400 mb-2">
              New Password
            </label>

            <input
              type="password"
              value={newPassword}
              onChange={(e) =>
                setNewPassword(
                  e.target.value
                )
              }
              className="w-full px-4 py-3 rounded-lg bg-white text-black outline-none"
            />

          </div>

          <div>

            <label className="block text-sm text-gray-400 mb-2">
              Confirm New Password
            </label>

            <input
              type="password"
              value={confirmPassword}
              onChange={(e) =>
                setConfirmPassword(
                  e.target.value
                )
              }
              className="w-full px-4 py-3 rounded-lg bg-white text-black outline-none"
            />

          </div>

          <button
            onClick={
              handleChangePassword
            }
            disabled={loading}
            className="w-full py-3 rounded-lg bg-brand text-gray-900 font-bold hover:bg-brand-dark hover:text-white transition disabled:opacity-70"
          >
            {loading
              ? "Updating..."
              : "Update Password"}
          </button>

        </div>

      </div>

    </div>

  );

}

export default Profile;