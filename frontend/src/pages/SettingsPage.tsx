import { useEffect, useState } from "react";
import MainLayout from "@/components/layouts/main-layout.tsx";

import profileIcon from "@/assets/icons/profile-icon.png";
import passwordIcon from "@/assets/icons/password-icon.png";
import languageIcon from "@/assets/icons/language-icon.png";
import categoryIcon from "@/assets/icons/category-icon.png";
import deleteUserIcon from "@/assets/icons/delete-user-icon.png";

import person from "@/assets/icons/profile-icon.png";

import { MenuSettings } from "@/components/ui/MenuSettings";
import { ListOfCategories } from "@/components/ui/list-of-categories";
import { NewCategory } from "@/components/new-category";
import axios from "axios";

type Category = {
  id: number;
  user_id: string;
  name: string;
  min_systolic: number;
  max_systolic: number;
  min_diastolic: number;
  max_diastolic: number;
  description: string;
};
export default function SettingsPage() {
  const [state, setState] = useState("Edit Profile");
  const [form, setForm] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [categoryOpen, setCategoryOpen] = useState<number[]>([]);

  const toggleCategory = (id: number) => {
    setCategoryOpen((prevOpen) =>
      prevOpen.includes(id)
        ? prevOpen.filter((openId) => openId !== id)
        : [...prevOpen, id]
    );
  };

  const [animationKey, setAnimationKey] = useState(0);

  const handleMenuChange = (menu: string, callback?: () => void) => {
    setAnimationKey((prev) => prev + 1);
    setState(menu);
    if (menu === "Categories") fetchCategories();
    if (callback) callback();
  };

  const fetchCategories = () => {
    axios
      .get("http://localhost:3000/api/category-results", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then((response) => {
        setCategories(response.data.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };
  const deleteCategory = (id: number) => {
    axios
      .delete(`http://localhost:3000/api/category-results/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then((response) => {
        if (response.status === 200) {
          console.log(response.data);
          fetchCategories();
        }
      });
  };
  const closeModal = () => {
    setForm(false);
  };

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
              onClick={() => handleMenuChange("Edit Profile")}
            />
            <MenuSettings
              title="Password"
              icon={passwordIcon}
              isActive={state === "Password"}
              onClick={() => handleMenuChange("Password")}
            />
            <MenuSettings
              title="Language"
              icon={languageIcon}
              isActive={state === "Language"}
              onClick={() => handleMenuChange("Language")}
            />
            <MenuSettings
              title="Categories"
              icon={categoryIcon}
              isActive={state === "Categories"}
              onClick={() => handleMenuChange("Categories")}
            />
            <hr className="border-t-2 border-[#ECECEC] my-4" />
            <MenuSettings
              title="Delete account"
              icon={deleteUserIcon}
              isActive={state === "Delete Account"}
              onClick={() => handleMenuChange("Delete account")}
              className="text-red-500 font-semibold"
            />
          </div>
          <div className="w-4xl p-2">
            <div
              key={animationKey}
              className="transition-all duration-500 ease-in-out animate-fade-slide"
            >
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
                      <a href="">
                        <div className="flex flex-col gap-2">
                          <div className="border-2 border-[#ECECEC] rounded-xl px-6 py-2 w-fit">
                            <p>Change new image</p>
                          </div>
                          <p className="text-gray-400">
                            At least 800 x 800 px recomended <br /> JPG, JPEG or
                            PNG
                          </p>
                        </div>
                      </a>
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
                        id="current-password"
                        type="password"
                        placeholder="Input your current password here"
                        className="w-full focus:outline-none"
                      />
                    </div>
                    <p>New Password</p>
                    <div className="flex bg-[#ECECEC] rounded-xl px-6 py-4 gap-4">
                      <input
                        id="new-password"
                        type="password"
                        placeholder="Input your new password here"
                        className="w-full focus:outline-none"
                      />
                    </div>
                    <p>Confirm Password</p>
                    <div className="flex bg-[#ECECEC] rounded-xl px-6 py-4 gap-4">
                      <input
                        id="confirm-password"
                        type="password"
                        placeholder="Input your new password here"
                        className="w-full focus:outline-none"
                      />
                    </div>
                  </div>
                  <button className="border-2 bg-[#35AAFF] text-white rounded-xl px-6 py-2 mt-10">
                    Save Changes
                  </button>
                </div>
              )}

              {/* Categories */}
              {state === "Categories" && (
                <div className="flex flex-col gap-8">
                  <div className="flex flex-row justify-between">
                    <p className="text-2xl font-bold">Categories</p>
                    <a href="#" onClick={() => setForm(true)}>
                      <div className="border-2 bg-[#35AAFF] text-white rounded-xl px-6 py-2 w-fit">
                        <p>Add category</p>
                      </div>
                    </a>
                  </div>
                  <div className="flex flex-col gap-4">
                    <p>List of categories</p>
                    <hr className="border-t-2 border-[#ECECEC]" />
                    <div className="flex flex-col gap-4">
                      {categories?.map((category) => (
                        <ListOfCategories
                          key={category.id}
                          id={category.id}
                          title={category.name}
                          values={{
                            minSystolic: category.min_systolic,
                            maxSystolic: category.max_systolic,
                            minDiastolic: category.min_diastolic,
                            maxDiastolic: category.max_diastolic,
                          }}
                          deleteCategory={deleteCategory}
                          categoryOpen={toggleCategory}
                          isOpen={categoryOpen.includes(category.id)}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <NewCategory
        closeModal={closeModal}
        form={form}
        fetchCategories={fetchCategories}
      />
    </MainLayout>
  );
}
