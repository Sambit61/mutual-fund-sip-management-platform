import { useState } from "react";
import ProfileSidebar from "../components/profile/ProfileSidebar";
import PersonalDetails from "../components/profile/PersonalDetails";
import EditProfile from "../components/profile/EditProfile";

import Reports from "../components/profile/Reports";

import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";
import api from "../api/api";

function Profile() {
  const navigate = useNavigate();

  const { user, token, logout } = useAuth();

  const [currentPassword, setCurrentPassword] = useState("");

  const [newPassword, setNewPassword] = useState("");

  const [confirmPassword, setConfirmPassword] = useState("");

  const [loading, setLoading] = useState(false);

  const [activeTab, setActiveTab] = useState("Personal Details");
  //handle for changing password
  const handleChangePassword = async () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      toast.error("Please fill all fields");

      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match");

      return;
    }

    try {
      setLoading(true);

      const res = await api.put(
        "/auth/change-password",
        {
          currentPassword,
          newPassword,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      toast.success(res.data.message);

      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err) {
      console.error(err);

      toast.error(err.response?.data?.message || "Failed to update password");
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="min-h-screen px-6 py-8 text-white">
      <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-[300px_1fr] gap-8">
          <ProfileSidebar
            user={user}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
          />

          <div>
            {activeTab === "Personal Details" && (
              <PersonalDetails user={user} setActiveTab={setActiveTab} />
            )}
            {activeTab === "Edit Profile" && <EditProfile />}

            {activeTab === "Reports" && <Reports />}

            {activeTab === "Change Password" && (
              <div className="bg-card-bg border border-gray-800 rounded-xl p-8">
                <h2 className="text-3xl font-bold mb-6">Change Password</h2>

                <div className="space-y-5">
                  <div>
                    <label className="block text-sm text-gray-400 mb-2">
                      Current Password
                    </label>

                    <input
                      type="password"
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      className="w-full px-4 py-3 rounded-lg bg-white text-black"
                    />
                  </div>

                  <div>
                    <label className="block text-sm text-gray-400 mb-2">
                      New Password
                    </label>

                    <input
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="w-full px-4 py-3 rounded-lg bg-white text-black"
                    />
                  </div>

                  <div>
                    <label className="block text-sm text-gray-400 mb-2">
                      Confirm Password
                    </label>

                    <input
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="w-full px-4 py-3 rounded-lg bg-white text-black"
                    />
                  </div>

                  <button
                    onClick={handleChangePassword}
                    disabled={loading}
                    className="px-5 py-3 rounded-lg bg-brand text-black font-semibold"
                  >
                    {loading ? "Updating..." : "Update Password"}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;
