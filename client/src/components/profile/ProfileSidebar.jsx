import React from "react";

function ProfileSidebar({
  activeTab,
  setActiveTab,
  user
}) {

  const menuItems = [
    "Personal Details",
    "Edit Profile",
    "Reports",
    "Change Password"
  ];
  return (

    <div className="bg-[var(--color-card-bg)] rounded-xl p-6 w-full md:w-80 border border-gray-800">

      <div className="flex flex-col items-center">

        <img
          src={
            user?.profilePicture ||
            "https://via.placeholder.com/150"
          }
          alt="Profile"
          className="w-28 h-28 rounded-full object-cover border-4 border-brand"
        />

        <h2 className="text-white text-xl font-bold mt-4">
          {user?.name}
        </h2>

        <p className="text-gray-400 text-sm">
          {user?.email}
        </p>

      </div>

      <div className="mt-8">

        {menuItems.map((item) => (

          <button
            key={item}
            onClick={() =>
              setActiveTab(item)
            }
            className={`w-full text-left px-4 py-3 rounded-lg mb-2 transition
              ${
                activeTab === item
                  ? "bg-brand text-black font-bold"
                  : "text-gray-300 hover:bg-gray-800"
              }`}
          >
            {item}
          </button>

        ))}

      </div>

    </div>

  );

}

export default ProfileSidebar;