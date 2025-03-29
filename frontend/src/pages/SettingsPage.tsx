import { useEffect, useState } from "react";
import MainLayout from "@/components/layouts/main-layout.tsx";

import profileIcon from "@/assets/icons/profile-icon.png";
import passwordIcon from "@/assets/icons/password-icon.png";
import languageIcon from "@/assets/icons/language-icon.png";
import categoryIcon from "@/assets/icons/category-icon.png";
import deleteUserIcon from "@/assets/icons/delete-user-icon.png";

import person from "@/assets/icons/profile-icon.png";

import { MenuSettings } from "@/components/ui/MenuSettings";

export default function SettingsPage() {
  const [state, setState] = useState("Edit Profile");

  const handleEditProfile = () => {
    setState("Edit Profile");
  };

  const handlePassword = () => {
    setState("Password");
  };

  const handleLanguage = () => {
    setState("Language");
  };

  const handleCategory = () => {
    setState("Categories");
  };

  const handleDeleteUser = () => {
    setState("Delete Account");
  };

  useEffect(() => {}, [state]);

  return (
    <MainLayout title="Settings">
      <div className="flex flex-col gap-8">
        <div className="flex justify-between mx-8">
          <div className="">
            <p className="text-3xl font-bold">Settings</p>
          </div>
        </div>
        <div className="flex flex-row gap-10 bg-white rounded-xl w-full h-full shadow-[0px_4px_4px_rgba(0,0,0,0.3)] p-8">
          <div className="flex flex-col w-xs gap-4">
            <MenuSettings
              title="Edit Profile"
              icon={profileIcon}
              isActive={state === "Edit Profile"}
              onClick={handleEditProfile}
            />
            <MenuSettings
              title="Password"
              icon={passwordIcon}
              isActive={state === "Password"}
              onClick={handlePassword}
            />
            <MenuSettings
              title="Language"
              icon={languageIcon}
              isActive={state === "Language"}
              onClick={handleLanguage}
            />
            <MenuSettings
              title="Categories"
              icon={categoryIcon}
              isActive={state === "Categories"}
              onClick={handleCategory}
            />
            <hr className="border-t-2 border-[#ECECEC] my-4" />
            <MenuSettings
              title="Delete account"
              icon={deleteUserIcon}
              isActive={state === "Delete Account"}
              onClick={handleDeleteUser}
              className="text-red-500 font-semibold"
            />
          </div>
          <div className="w-4xl p-2">
            {/* Edit Profile */}
            {state === "Edit Profile" && (
              <div className="flex flex-col gap-8">
                <p className="text-2xl font-bold">Edit Profile</p>
                <div className="flex flex-col gap-2">
                  <p>Avatar</p>
                  <div className="flex flex-row gap-6">
                    <img
                      src="https://i.pravatar.cc/150?img=1"
                      className="w-26 h-26 rounded-full"
                      alt=""
                    />
                    <div className="flex flex-col gap-2">
                      <div className="border-2 border-[#ECECEC] rounded-xl px-6 py-2">
                        <p>Change new image</p>
                      </div>
                      <p className="text-gray-400">
                        At least 800 x 800 px recomended <br /> JPG, JPEG or PNG
                      </p>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  <p>Name</p>
                  <div className="flex bg-[#ECECEC] rounded-xl px-6 py-4 gap-4">
                    <img src={person} className="w-8 h-8" alt="" />
                    <input
                      type="text"
                      placeholder="Input your text name here"
                    />
                  </div>
                </div>
                <button className="border-2 bg-[#35AAFF] text-white rounded-xl px-6 py-2 mt-10">
                  Save Changes
                </button>
              </div>
            )}

            {/* Password */}
            {state === "Password" && (
              <div className="flex flex-col gap-8">
                <p className="text-2xl font-bold">Password</p>
                <div className="flex flex-col gap-4">
                  <p>Current Password</p>
                  <div className="flex bg-[#ECECEC] rounded-xl px-6 py-4 gap-4">
                    <input
                      type="password"
                      placeholder="Input your current password here"
                    />
                  </div>
                </div>
                <button className="border-2 bg-[#35AAFF] text-white rounded-xl px-6 py-2 mt-10">
                  Save Changes
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
