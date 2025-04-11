import person from "@/assets/icons/profile-icon.png";
import { useState } from "react";
import axios from "axios";
import { Category } from "@/models/Categories";
import { ListOfCategories } from "@/components/ui/list-of-categories";
import { useAuth } from "@/contexts/AuthContext";

type MenuItemsProps = {
  state: string;
  animationKey: number;
  setForm: React.Dispatch<React.SetStateAction<boolean>>;
  fetchCategories: () => void;
  categories: Category[];
};
export const MenuItems = ({
  state,
  animationKey,
  setForm,
  fetchCategories,
  categories,
}: MenuItemsProps) => {
  const { user, login } = useAuth();

  const [categoryOpen, setCategoryOpen] = useState<number[]>([]);

  const [name, setName] = useState(user?.name || "");

  const deleteCategory = (id: number) => {
    axios
      .delete(`http://localhost:3000/api/category-results/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then((response) => {
        console.log(response);
        if (response.status === 200) {
          console.log(response.data);
          fetchCategories();
        }
      });
  };

  const toggleCategory = (id: number) => {
    setCategoryOpen((prevOpen) =>
      prevOpen.includes(id)
        ? prevOpen.filter((openId) => openId !== id)
        : [...prevOpen, id]
    );
  };

  const handleSaveChanges = async () => {
    if (state == "Edit Profile") {
      const newName = "John Doe";
      try {
        const response = await axios.patch(
          "/api/user/update",
          {
            name: newName,
          },
          {
            headers: {},
          }
        );

        if (response.status === 200) {
          console.log(response.data);

          const { token, name, username } = response.data.data;

          const updatedUser = { name, username };
          login(token, updatedUser);
        }
      } catch (error) {
        console.log(error);
      }
    }
  };

  return (
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
              <div className="flex flex-col gap-2 cursor-pointer">
                <div className="border-2 border-[#ECECEC] rounded-xl px-6 py-2 w-fit">
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
                name="name"
                placeholder="Input your text name here"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full outline-none"
              />
            </div>
          </div>
          <button
            type="submit"
            className="border-2 bg-[#35AAFF] text-white rounded-xl px-6 py-2 mt-10"
          >
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
  );
};
