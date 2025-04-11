import { useState } from "react";
import MainLayout from "@/components/layouts/main-layout.tsx";

import profileIcon from "@/assets/icons/profile-icon.png";
import passwordIcon from "@/assets/icons/password-icon.png";
import languageIcon from "@/assets/icons/language-icon.png";
import categoryIcon from "@/assets/icons/category-icon.png";
import deleteUserIcon from "@/assets/icons/delete-user-icon.png";

import { MenuSettings } from "@/components/ui/MenuSettings";
import { MenuItems } from "@/components/MenuItems";

import { NewCategory } from "../components/new-category.tsx";
import axios from "axios";
import { Category } from "@/models/Categories.tsx";

export default function SettingsPage() {
  const [state, setState] = useState("Edit Profile");
  const [form, setForm] = useState(false);

  const [categories, setCategories] = useState<Category[]>([]);

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
        if (response.status === 200) {
          setCategories(response.data.data);
        }
      })
      .catch((error) => {
        console.log(error);
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
            <MenuItems
              fetchCategories={fetchCategories}
              state={state}
              animationKey={animationKey}
              setForm={setForm}
              categories={categories}
            />
          </div>
        </div>
      </div>
      <NewCategory closeModal={closeModal} form={form} />
    </MainLayout>
  );
}
