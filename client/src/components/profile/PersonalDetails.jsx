function PersonalDetails({
  user,
  setActiveTab
}) {

  return (

    <div className="bg-[var(--color-card-bg)] rounded-xl p-8 border border-gray-800">

      <div className="flex justify-between items-center mb-8">

        <h2 className="text-3xl font-bold">
          Personal Details
        </h2>

        <button
          onClick={() =>
            setActiveTab(
              "Edit Profile"
            )
          }
          className="px-5 py-2 bg-brand text-black rounded-lg font-semibold"
        >
          Edit Profile
        </button>

      </div>

      <div className="space-y-6">

        <div>
          <p className="text-gray-400">
            Full Name
          </p>

          <p className="text-xl font-semibold">
            {user?.name}
          </p>
        </div>

        <div>
          <p className="text-gray-400">
            Email
          </p>

          <p className="text-xl font-semibold">
            {user?.email}
          </p>
        </div>

        <div>
          <p className="text-gray-400">
            Role
          </p>

          <p className="text-xl font-semibold capitalize">
            {user?.role}
          </p>
        </div>

        <div>
          <p className="text-gray-400">
            Joined
          </p>

          <p className="text-xl font-semibold">
            {
              user?.createdAt
              ? new Date(
                  user.createdAt
                ).toLocaleDateString()
              : "N/A"
            }
          </p>
        </div>

      </div>

    </div>

  );

}

export default PersonalDetails;