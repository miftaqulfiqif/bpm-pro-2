import { useEffect, useState } from "react";
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
import { ConfirmDelete } from "@/components/ConfirmDelete.tsx";
import { useAuth } from "@/contexts/AuthContext.tsx";

export default function SettingsPage() {
  const { user, login, setUser } = useAuth();

  const [state, setState] = useState("Edit Profile");
  const [form, setForm] = useState(false);
  const [formDelete, setFormDelete] = useState(false);

  const [name, setName] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const [categories, setCategories] = useState<Category[]>([]);
  const [isDefaultCategory, setIsDefaultCategory] = useState(true);

  const [animationKey, setAnimationKey] = useState(0);

  useEffect(() => {
    user && setName(user.name);
  }, []);
  const handleMenuChange = (menu: string, callback?: () => void) => {
    setAnimationKey((prev) => prev + 1);
    setState(menu);
    if (menu === "Categories") fetchCategories();
    if (callback) callback();
  };

  const changePassword = (values: any) => {
    axios
      .patch(
        "http://localhost:3000/api/user/update-password",
        {
          password: values.currentPassword,
          new_password: values.newPassword,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      )
      .then((response) => {
        console.log(response.data);
      })
      .catch((error) => {
        console.log(error.response.data.errors);
      });
  };

  const changeProfil = async (id: string, values: any) => {
    try {
      // Update Profile
      const profileRes = await axios.patch(
        "http://localhost:3000/api/user/update",
        {
          name: values.name,
          username: values.username,
          password: values.password,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (profileRes.status === 200) {
        const { token, name, username } = profileRes.data.data;
        const updatedUser = { id, name, username };
        login(token, updatedUser);
        setFormDelete(false);
      }

      // Update Profile Picture
      if (selectedFile) {
        const formData = new FormData();
        formData.append("profile_picture", selectedFile);

        const photoRes = await axios.post(
          "http://localhost:3000/api/user/update-profile-picture",
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        if (photoRes.status === 200) {
          console.log("Profile picture updated:", photoRes.data);
          const updatedPath = photoRes.data.data;
          console.log(updatedPath);
        }
      }
    } catch (error: any) {
      console.error(error?.response?.data?.errors || error);
    }
  };

  const fetchCategories = async () => {
    try {
      const token = localStorage.getItem("token");
      const headers = { Authorization: `Bearer ${token}` };

      const res = await axios.get(
        "http://localhost:3000/api/all-category-results",
        { headers }
      );

      if (res.status === 200 && res.data.data.length > 0) {
        setIsDefaultCategory(false);
        setCategories(res.data.data);
      } else {
        setIsDefaultCategory(true);
        const defaultRes = await axios.get(
          "http://localhost:3000/api/default-category-results",
          { headers }
        );
        if (defaultRes.status === 200) {
          setCategories(defaultRes.data.data);
        }
      }
    } catch (error) {
      console.error("Failed to fetch categories:", error);
    }
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
              setFormDelete={setFormDelete}
              categories={categories}
              isDefaultCategory={isDefaultCategory}
              closeModal={() => setFormDelete(false)}
              name={name}
              setName={setName}
              setSelectedFile={setSelectedFile}
              changeProfil={changeProfil}
              changePassword={changePassword}
              currentPassword={currentPassword}
              setCurrentPassword={setCurrentPassword}
              newPassword={newPassword}
              setNewPassword={setNewPassword}
            />
          </div>
        </div>
      </div>
      <NewCategory
        closeModal={() => setForm(false)}
        form={form}
        fetchCategories={fetchCategories}
      />
      <ConfirmDelete
        closeModal={() => setFormDelete(false)}
        form={formDelete}
        state={state}
        name={name}
        changeProfil={changeProfil}
      />
    </MainLayout>
  );
}
