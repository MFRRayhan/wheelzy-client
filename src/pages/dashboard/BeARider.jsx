import React, { useState } from "react";
import { useForm } from "react-hook-form";
import Swal from "sweetalert2";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import useAuth from "../../hooks/useAuth";

const divisionsData = {
  Dhaka: [
    "Dhaka",
    "Gazipur",
    "Narayanganj",
    "Narsingdi",
    "Munshiganj",
    "Manikganj",
    "Tangail",
    "Kishoreganj",
    "Faridpur",
    "Gopalganj",
    "Madaripur",
    "Rajbari",
    "Shariatpur",
  ],
  Chattogram: [
    "Chattogram",
    "Cox's Bazar",
    "Cumilla",
    "Feni",
    "Noakhali",
    "Lakshmipur",
    "Brahmanbaria",
    "Chandpur",
    "Rangamati",
    "Khagrachari",
    "Bandarban",
  ],
  Rajshahi: [
    "Rajshahi",
    "Natore",
    "Naogaon",
    "Chapainawabganj",
    "Joypurhat",
    "Bogura",
    "Pabna",
    "Sirajganj",
  ],
  Khulna: [
    "Khulna",
    "Jessore",
    "Satkhira",
    "Bagerhat",
    "Narail",
    "Jhenaidah",
    "Magura",
    "Kushtia",
    "Chuadanga",
    "Meherpur",
  ],
  Barishal: [
    "Barishal",
    "Bhola",
    "Patuakhali",
    "Pirojpur",
    "Barguna",
    "Jhalokathi",
  ],
  Sylhet: ["Sylhet", "Moulvibazar", "Habiganj", "Sunamganj"],
  Rangpur: [
    "Rangpur",
    "Dinajpur",
    "Kurigram",
    "Gaibandha",
    "Nilphamari",
    "Lalmonirhat",
    "Panchagarh",
    "Thakurgaon",
  ],
  Mymensingh: ["Mymensingh", "Jamalpur", "Netrokona", "Sherpur"],
};

const BeARider = () => {
  const axiosSecure = useAxiosSecure();
  const { user } = useAuth();
  const [selectedDivision, setSelectedDivision] = useState("");

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    const riderData = {
      ...data,
      status: "pending",
      roleRequest: "rider",
      appliedAt: new Date(),
    };

    try {
      const res = await axiosSecure.post("/club-riders", riderData);
      if (res.data.insertedId) {
        Swal.fire({
          icon: "success",
          title: "Application Submitted",
          text: "Your rider application has been sent for admin review.",
          timer: 2500,
          showConfirmButton: false,
        });
        reset();
        setSelectedDivision("");
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <section className="min-h-screen bg-base-100">
      <div className="grid grid-cols-1 lg:grid-cols-2 min-h-screen">
        {/* LEFT: FORM */}
        <div className="flex items-center justify-center px-6 py-12">
          <div className="w-full max-w-xl">
            <header className="mb-8">
              <h2 className="text-2xl font-bold text-primary mb-3">
                Apply to Become a Rider
              </h2>
              <p className="text-gray-500">
                Submit your application to become a verified rider. Our admin
                team will review your information and contact you if approved.
              </p>
            </header>

            <form
              onSubmit={handleSubmit(onSubmit)}
              className="bg-base-200 rounded-xl p-8 shadow-md"
            >
              <h3 className="text-lg font-semibold text-primary mb-6">
                Rider Information
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="label">Full Name</label>
                  <input
                    className="input w-full"
                    defaultValue={user?.displayName}
                    {...register("name", { required: true })}
                  />
                  {errors.name && (
                    <span className="text-red-500 text-sm">
                      Full name is required
                    </span>
                  )}
                </div>

                <div>
                  <label className="label">Email Address</label>
                  <input
                    className="input w-full"
                    defaultValue={user?.email}
                    readOnly
                    {...register("email", { required: true })}
                  />
                </div>

                <div>
                  <label className="label">Contact Number</label>
                  <input
                    className="input w-full"
                    placeholder="01XXXXXXXXX"
                    {...register("contact", { required: true })}
                  />
                </div>

                <div>
                  <label className="label">Division</label>
                  <select
                    className="select w-full"
                    value={selectedDivision}
                    {...register("division", { required: true })}
                    onChange={(e) => setSelectedDivision(e.target.value)}
                  >
                    <option value="">Select Division</option>
                    {Object.keys(divisionsData).map((div) => (
                      <option key={div} value={div}>
                        {div}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="label">District</label>
                  <select
                    className="select w-full"
                    {...register("district", { required: true })}
                    disabled={!selectedDivision}
                  >
                    <option value="">Select District</option>
                    {selectedDivision &&
                      divisionsData[selectedDivision].map((dist) => (
                        <option key={dist} value={dist}>
                          {dist}
                        </option>
                      ))}
                  </select>
                </div>

                <div className="md:col-span-2">
                  <label className="label">Short Description</label>
                  <textarea
                    rows="4"
                    className="textarea w-full"
                    placeholder="Briefly describe your riding experience and motivation"
                    {...register("description", { required: true })}
                  ></textarea>
                </div>

                <div className="md:col-span-2 pt-4">
                  <button type="submit" className="btn btn-primary w-full">
                    Submit Rider Application
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>

        {/* RIGHT: IMAGE / BG */}
        <div
          className="hidden lg:block bg-cover bg-center"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1503376780353-7e6692767b70')",
          }}
        >
          {/* overlay optional */}
          <div className="w-full h-full bg-black/30"></div>
        </div>
      </div>
    </section>
  );
};

export default BeARider;
