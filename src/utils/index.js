import axios from "axios";
// import useAxiosSecure from "../hooks/useAxiosSecure";

// const axiosSecure = useAxiosSecure();

export const imgUpload = async (imgData) => {
  const formData = new FormData();
  formData.append("image", imgData);

  const IMG_API_URL = `https://api.imgbb.com/1/upload?key=${
    import.meta.env.VITE_image_host_key
  }`;
  const { data } = await axios.post(IMG_API_URL, formData);

  return data?.data?.display_url;
};

// save or update user data
// export const saveOrUpdateUser = async (userData) => {
//   const { data } = await axiosSecure.post("/user", userData);
//   return data;
// };
